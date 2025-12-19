async function api(path, options = {}) {
  const res = await fetch(path, options);
  if (!res.ok) throw await res.json().catch(() => ({ error: 'Request failed' }));
  return res.json();
}

async function ensureAdmin() {
  try {
    const me = await api('/api/auth/me');
    if (!me.user || me.user.role !== 'admin') {
      window.location.href = '/login.html';
    }
  } catch (e) {
    window.location.href = '/login.html';
  }
}

async function loadStats() {
  try {
    const s = await api('/api/admin/stats');
    document.getElementById('stat-students').textContent = s.students || 0;
    document.getElementById('stat-courses').textContent = s.courses || 0;
    document.getElementById('stat-enrollments').textContent = s.enrollments || 0;
  } catch (e) {
    document.getElementById('stat-students').textContent = '?';
    document.getElementById('stat-courses').textContent = '?';
    document.getElementById('stat-enrollments').textContent = '?';
  }
}

async function loadStudents() {
  try {
    const list = await api('/api/admin/students');
    const body = document.getElementById('students-body');
    body.innerHTML = '';
    list.forEach((s) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${s.id}</td>
        <td>${s.name}</td>
        <td>${s.email || ''}</td>
        <td>${s.dob || ''}</td>
        <td>
          <div class="table-actions">
            <button onclick="editStudent(${s.id}, '${encodeURIComponent(s.name)}', '${encodeURIComponent(s.email || '')}', '${s.dob || ''}')">Edit</button>
            <button class="secondary" onclick="deleteStudent(${s.id})">Delete</button>
          </div>
        </td>`;
      body.appendChild(tr);
    });
    // populate enroll dropdown
    const sel = document.getElementById('enroll-student');
    sel.innerHTML = list.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
  } catch (e) {}
}

async function loadCourses() {
  try {
    const list = await api('/api/admin/courses');
    const body = document.getElementById('courses-body');
    body.innerHTML = '';
    list.forEach((c) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${c.id}</td>
        <td>${c.code}</td>
        <td>${c.title}</td>
        <td>
          <div class="table-actions">
            <button onclick="editCourse(${c.id}, '${encodeURIComponent(c.code)}', '${encodeURIComponent(c.title)}', '${encodeURIComponent(c.description || '')}')">Edit</button>
            <button class="secondary" onclick="deleteCourse(${c.id})">Delete</button>
          </div>
        </td>`;
      body.appendChild(tr);
    });
    // populate enroll dropdown
    const sel = document.getElementById('enroll-course');
    sel.innerHTML = list.map(c => `<option value="${c.id}">${c.code} - ${c.title}</option>`).join('');
  } catch (e) {}
}

async function loadEnrollments() {
  try {
    const list = await api('/api/admin/enrollments');
    const body = document.getElementById('enrollments-body');
    body.innerHTML = '';
    list.forEach((r) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${r.id}</td>
        <td>${r.student_name}</td>
        <td>${r.course_code} - ${r.course_title}</td>
        <td>
          <div class="table-actions">
            <button class="secondary" onclick="deleteEnrollment(${r.id})">Remove</button>
          </div>
        </td>`;
      body.appendChild(tr);
    });
  } catch (e) {}
}

// Student handlers
window.editStudent = function(id, encName, encEmail, dob) {
  const name = decodeURIComponent(encName);
  const email = decodeURIComponent(encEmail);
  document.getElementById('student-id').value = id;
  document.getElementById('student-name').value = name;
  document.getElementById('student-email').value = email;
  document.getElementById('student-dob').value = dob || '';
  document.getElementById('student-submit-btn').textContent = 'Update Student';
  document.getElementById('student-cancel-btn').style.display = 'inline-block';
}

window.deleteStudent = async function(id) {
  if (!confirm('Delete this student? This will also remove enrollments.')) return;
  try {
    await fetch(`/api/admin/students/${id}`, { method: 'DELETE' });
    await Promise.all([loadStudents(), loadEnrollments(), loadStats()]);
  } catch (e) {}
}

// Course handlers
window.editCourse = function(id, encCode, encTitle, encDesc) {
  const code = decodeURIComponent(encCode);
  const title = decodeURIComponent(encTitle);
  const description = decodeURIComponent(encDesc);
  document.getElementById('course-id').value = id;
  document.getElementById('course-code').value = code;
  document.getElementById('course-title').value = title;
  document.getElementById('course-desc').value = description;
  document.getElementById('course-submit-btn').textContent = 'Update Course';
  document.getElementById('course-cancel-btn').style.display = 'inline-block';
}

window.deleteCourse = async function(id) {
  if (!confirm('Delete this course?')) return;
  try {
    await fetch(`/api/admin/courses/${id}`, { method: 'DELETE' });
    await Promise.all([loadCourses(), loadEnrollments(), loadStats()]);
  } catch (e) {}
}

window.deleteEnrollment = async function(id) {
  if (!confirm('Remove this enrollment?')) return;
  try {
    await fetch(`/api/admin/enrollments/${id}`, { method: 'DELETE' });
    await loadEnrollments();
    await loadStats();
  } catch (e) {}
}

// Forms

document.getElementById('student-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('student-id').value;
  const name = document.getElementById('student-name').value.trim();
  const email = document.getElementById('student-email').value.trim();
  const dob = document.getElementById('student-dob').value;
  const password = document.getElementById('student-password').value;
  if (!name) return alert('Name is required');
  try {
    if (id) {
      await api(`/api/admin/students/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, dob })
      });
    } else {
      await api('/api/admin/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, dob, password: password || undefined })
      });
    }
    e.target.reset();
    document.getElementById('student-id').value = '';
    document.getElementById('student-submit-btn').textContent = 'Add Student';
    document.getElementById('student-cancel-btn').style.display = 'none';
    await Promise.all([loadStudents(), loadStats()]);
  } catch (err) {
    alert(err.error || 'Failed to save student');
  }
});

window.cancelStudentEdit = function() {
  document.getElementById('student-form').reset();
  document.getElementById('student-id').value = '';
  document.getElementById('student-submit-btn').textContent = 'Add Student';
  document.getElementById('student-cancel-btn').style.display = 'none';
};

document.getElementById('course-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('course-id').value;
  const code = document.getElementById('course-code').value.trim();
  const title = document.getElementById('course-title').value.trim();
  const description = document.getElementById('course-desc').value.trim();
  if (!code || !title) return alert('Code and title are required');
  try {
    if (id) {
      await api(`/api/admin/courses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, title, description })
      });
    } else {
      await api('/api/admin/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, title, description })
      });
    }
    e.target.reset();
    document.getElementById('course-id').value = '';
    document.getElementById('course-submit-btn').textContent = 'Add Course';
    document.getElementById('course-cancel-btn').style.display = 'none';
    await Promise.all([loadCourses(), loadStats()]);
  } catch (err) {
    alert(err.error || 'Failed to save course');
  }
});

window.cancelCourseEdit = function() {
  document.getElementById('course-form').reset();
  document.getElementById('course-id').value = '';
  document.getElementById('course-submit-btn').textContent = 'Add Course';
  document.getElementById('course-cancel-btn').style.display = 'none';
};

// Enrollment form

document.getElementById('enrollment-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const student_id = document.getElementById('enroll-student').value;
  const course_id = document.getElementById('enroll-course').value;
  if (!student_id || !course_id) return alert('Select student and course');
  try {
    await api('/api/admin/enrollments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ student_id, course_id })
    });
    await Promise.all([loadEnrollments(), loadStats()]);
  } catch (err) {
    alert(err.error || 'Failed to enroll');
  }
});

// Logout

document.getElementById('logout-btn').addEventListener('click', async () => {
  try { await api('/api/auth/logout', { method: 'POST' }); } catch (e) {}
  window.location.href = '/login.html';
});

// Init
(async function init() {
  await ensureAdmin();
  await Promise.all([loadStats(), loadStudents(), loadCourses(), loadEnrollments()]);
})();
