async function api(path, options = {}) {
  const res = await fetch(path, options);
  if (!res.ok) throw await res.json().catch(() => ({ error: 'Request failed' }));
  return res.json();
}

async function loadMe() {
  try {
    const me = await api('/api/me');
    const prof = me.profile || {};
    document.getElementById('profile').textContent = `Name: ${prof.name || ''} | Email: ${prof.email || ''} | DOB: ${prof.dob || ''}`;
  } catch (e) {
    window.location.href = '/login.html';
  }
}

async function loadMyEnrollments() {
  try {
    const list = await api('/api/my/enrollments');
    const body = document.getElementById('my-enrollments');
    body.innerHTML = '';
    list.forEach((r) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${r.code}</td><td>${r.title}</td><td>${new Date(r.created_at).toLocaleString()}</td>`;
      body.appendChild(tr);
    });
  } catch (e) {}
}

async function logout() {
  try { await api('/api/auth/logout', { method: 'POST' }); } catch (e) {}
  window.location.href = '/login.html';
}

document.getElementById('logout-btn').addEventListener('click', logout);

loadMe();
loadMyEnrollments();
