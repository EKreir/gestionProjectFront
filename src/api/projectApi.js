const API_BASE = '/api';

export async function fetchProjects() {
  const response = await fetch(`${API_BASE}/projects`);
  if (!response.ok) {
    throw new Error(`Erreur ${response.status}`);
  }
  return await response.json();
}

export async function createProject(projectData) {
  const response = await fetch(`${API_BASE}/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(projectData)
  });
  if (!response.ok) throw new Error(`Erreur ${response.status}`);
  return await response.json();
}

export async function fetchProjectById(id) {
  const response = await fetch(`/api/projects/${id}`);
  if (!response.ok) throw new Error(`Erreur ${response.status}`);
  return await response.json();
}
