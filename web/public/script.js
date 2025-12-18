async function fetchItems() {
  let items = [];
  try {
    const res = await fetch('/api/items');
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error('Error loading items', err);
      alert('Error loading items from server. Check backend logs.');
      return;
    }
    items = await res.json();
  } catch (e) {
    console.error('Network error while loading items', e);
    alert('Cannot reach server. Make sure containers are running.');
    return;
  }
  const tbody = document.getElementById('items-body');
  tbody.innerHTML = '';
  items.forEach((item) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.id}</td>
      <td>${item.name}</td>
      <td>${item.description || ''}</td>
      <td>${new Date(item.created_at).toLocaleString()}</td>
      <td>
        <div class="table-actions">
          <button onclick="editItem(${item.id}, '${encodeURIComponent(
            item.name
          )}', '${encodeURIComponent(item.description || '')}')">Edit</button>
          <button class="secondary" onclick="deleteItem(${item.id})">Delete</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

async function createItem(name, description) {
  const res = await fetch('/api/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, description }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error('Error creating item', err);
    alert('Error creating item. Check backend logs.');
  }
}

async function updateItem(id, name, description) {
  const res = await fetch(`/api/items/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, description }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error('Error updating item', err);
    alert('Error updating item. Check backend logs.');
  }
}

async function deleteItem(id) {
  if (!confirm('Delete this item?')) return;
  const res = await fetch(`/api/items/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error('Error deleting item', err);
    alert('Error deleting item. Check backend logs.');
  }
  fetchItems();
}

function editItem(id, encodedName, encodedDescription) {
  const name = decodeURIComponent(encodedName);
  const description = decodeURIComponent(encodedDescription);
  document.getElementById('item-id').value = id;
  document.getElementById('name').value = name;
  document.getElementById('description').value = description;
  document.getElementById('save-btn').textContent = 'Update';
}

document.getElementById('item-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('item-id').value;
  const name = document.getElementById('name').value.trim();
  const description = document.getElementById('description').value.trim();
  if (!name) {
    alert('Name is required');
    return;
  }
  if (id) {
    await updateItem(id, name, description);
  } else {
    await createItem(name, description);
  }
  e.target.reset();
  document.getElementById('item-id').value = '';
  document.getElementById('save-btn').textContent = 'Save';
  fetchItems();
});

document.getElementById('cancel-btn').addEventListener('click', () => {
  document.getElementById('item-form').reset();
  document.getElementById('item-id').value = '';
  document.getElementById('save-btn').textContent = 'Save';
});

fetchItems();


