const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mysql = require('mysql2');
const session = require('express-session');
const bcrypt = require('bcryptjs');

const app = express();
const port = 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev_secret_change_me',
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true }
  })
);
app.use(express.static(path.join(__dirname, 'public')));

const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'appdb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

function dbQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}

// Seed default admin on startup using env vars if not exists
async function ensureDefaultAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  try {
    // Ensure tables exist (in case init.sql hasn't run yet, this will fail silently and seed later)
    await dbQuery('CREATE TABLE IF NOT EXISTS users (id INT PRIMARY KEY AUTO_INCREMENT, email VARCHAR(255) UNIQUE, password_hash VARCHAR(255), role ENUM(\'admin\',\'student\'), student_id INT NULL)');
  } catch (e) {}
  try {
    const rows = await dbQuery('SELECT id FROM users WHERE email = ?', [adminEmail]);
    if (rows.length === 0) {
      const hash = await bcrypt.hash(adminPassword, 10);
      await dbQuery(
        'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)',
        [adminEmail, hash, 'admin']
      );
      console.log(`Seeded default admin: ${adminEmail}`);
    }
  } catch (e) {
    console.error('Error ensuring default admin:', e.message);
  }
}
ensureDefaultAdmin();

function requireAuth(req, res, next) {
  if (!req.session.user) return res.status(401).json({ error: 'Unauthorized' });
  next();
}
function requireRole(role) {
  return (req, res, next) => {
    if (!req.session.user || req.session.user.role !== role)
      return res.status(403).json({ error: 'Forbidden' });
    next();
  };
}

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  try {
    const users = await dbQuery('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
    const user = users[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    req.session.user = {
      id: user.id,
      role: user.role,
      student_id: user.student_id || null,
      email: user.email
    };
    res.json({ message: 'Logged in', role: user.role });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/auth/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ message: 'Logged out' });
  });
});

app.get('/api/auth/me', (req, res) => {
  res.json({ user: req.session.user || null });
});

// Admin endpoints
app.get('/api/admin/stats', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const s = await dbQuery('SELECT COUNT(*) AS count FROM students');
    const c = await dbQuery('SELECT COUNT(*) AS count FROM courses');
    const e = await dbQuery('SELECT COUNT(*) AS count FROM enrollments');
    res.json({
      students: (s[0] && s[0].count) || 0,
      courses: (c[0] && c[0].count) || 0,
      enrollments: (e[0] && e[0].count) || 0,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Students CRUD
app.get('/api/admin/students', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const list = await dbQuery('SELECT * FROM students ORDER BY id DESC');
    res.json(list);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
app.post('/api/admin/students', requireAuth, requireRole('admin'), async (req, res) => {
  const { name, email, dob, password } = req.body;
  if (!name) return res.status(400).json({ error: 'Name required' });
  try {
    const result = await dbQuery(
      'INSERT INTO students (name, email, dob) VALUES (?, ?, ?)',
      [name, email || null, dob || null]
    );
    const studentId = result.insertId;
    if (email && password) {
      const hash = await bcrypt.hash(password, 10);
      await dbQuery(
        'INSERT INTO users (email, password_hash, role, student_id) VALUES (?, ?, ?, ?)',
        [email, hash, 'student', studentId]
      );
    }
    res.status(201).json({ id: studentId, name, email, dob });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
app.put('/api/admin/students/:id', requireAuth, requireRole('admin'), async (req, res) => {
  const { id } = req.params;
  const { name, email, dob } = req.body;
  if (!name) return res.status(400).json({ error: 'Name required' });
  try {
    await dbQuery('UPDATE students SET name = ?, email = ?, dob = ? WHERE id = ?', [name, email || null, dob || null, id]);
    res.json({ id, name, email, dob });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
app.delete('/api/admin/students/:id', requireAuth, requireRole('admin'), async (req, res) => {
  const { id } = req.params;
  try {
    await dbQuery('DELETE FROM students WHERE id = ?', [id]);
    res.status(204).send();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Courses CRUD
app.get('/api/admin/courses', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const list = await dbQuery('SELECT * FROM courses ORDER BY id DESC');
    res.json(list);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
app.post('/api/admin/courses', requireAuth, requireRole('admin'), async (req, res) => {
  const { code, title, description } = req.body;
  if (!code || !title) return res.status(400).json({ error: 'Code and title required' });
  try {
    const result = await dbQuery('INSERT INTO courses (code, title, description) VALUES (?, ?, ?)', [code, title, description || null]);
    res.status(201).json({ id: result.insertId, code, title, description });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
app.put('/api/admin/courses/:id', requireAuth, requireRole('admin'), async (req, res) => {
  const { id } = req.params;
  const { code, title, description } = req.body;
  if (!code || !title) return res.status(400).json({ error: 'Code and title required' });
  try {
    await dbQuery('UPDATE courses SET code = ?, title = ?, description = ? WHERE id = ?', [code, title, description || null, id]);
    res.json({ id, code, title, description });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
app.delete('/api/admin/courses/:id', requireAuth, requireRole('admin'), async (req, res) => {
  const { id } = req.params;
  try {
    await dbQuery('DELETE FROM courses WHERE id = ?', [id]);
    res.status(204).send();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Enrollments
app.get('/api/admin/enrollments', requireAuth, requireRole('admin'), async (req, res) => {
  const { student_id } = req.query;
  try {
    let sql = `SELECT e.id, s.name as student_name, c.title as course_title, c.code as course_code, e.student_id, e.course_id, e.created_at
               FROM enrollments e
               JOIN students s ON e.student_id = s.id
               JOIN courses c ON e.course_id = c.id`;
    const params = [];
    if (student_id) {
      sql += ' WHERE e.student_id = ?';
      params.push(student_id);
    }
    sql += ' ORDER BY e.id DESC';
    const list = await dbQuery(sql, params);
    res.json(list);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
app.post('/api/admin/enrollments', requireAuth, requireRole('admin'), async (req, res) => {
  const { student_id, course_id } = req.body;
  if (!student_id || !course_id) return res.status(400).json({ error: 'student_id and course_id required' });
  try {
    const result = await dbQuery('INSERT INTO enrollments (student_id, course_id) VALUES (?, ?)', [student_id, course_id]);
    res.status(201).json({ id: result.insertId, student_id, course_id });
  } catch (e) {
    if (e && e.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Already enrolled' });
    res.status(500).json({ error: e.message });
  }
});
app.delete('/api/admin/enrollments/:id', requireAuth, requireRole('admin'), async (req, res) => {
  const { id } = req.params;
  try {
    await dbQuery('DELETE FROM enrollments WHERE id = ?', [id]);
    res.status(204).send();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Student endpoints
app.get('/api/me', requireAuth, async (req, res) => {
  const { user } = req.session;
  try {
    if (user.role === 'student' && user.student_id) {
      const rows = await dbQuery('SELECT * FROM students WHERE id = ?', [user.student_id]);
      return res.json({ profile: rows[0] || null, role: 'student' });
    }
    res.json({ profile: { email: user.email }, role: user.role });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
app.get('/api/my/enrollments', requireAuth, async (req, res) => {
  const { user } = req.session;
  if (user.role !== 'student' || !user.student_id) return res.status(403).json({ error: 'Forbidden' });
  try {
    const list = await dbQuery(
      `SELECT e.id, c.title, c.code, c.description, e.created_at
       FROM enrollments e
       JOIN courses c ON e.course_id = c.id
       WHERE e.student_id = ?
       ORDER BY e.id DESC`,
      [user.student_id]
    );
    res.json(list);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Routes for dashboards
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
