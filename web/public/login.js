document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const errEl = document.getElementById('login-error');
  errEl.textContent = '';
  errEl.style.display = 'none';
  
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      throw data;
    }
    
    // Redirect based on role
    if (data.user && data.user.role === 'admin') {
      window.location.href = '/admin.html';
    } else {
      window.location.href = '/student.html';
    }
  } catch (err) {
    errEl.textContent = err.error || 'Login failed. Please check your credentials.';
    errEl.style.display = 'block';
  }
});
