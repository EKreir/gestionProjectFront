const API_BASE = '/api'; // grâce au proxy, inutile de mettre localhost:8080

export async function fetchUsers(token) {
  const response = await fetch(`${API_BASE}/users`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) {
    throw new Error(`Erreur ${response.status}`);
  }
  return await response.json();
}
