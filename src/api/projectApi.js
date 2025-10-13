const API_BASE = '/api';

export async function fetchProjects() {
  const response = await fetch(`${API_BASE}/projects`);
  if (!response.ok) {
    throw new Error(`Erreur ${response.status}`);
  }
  return await response.json();
}