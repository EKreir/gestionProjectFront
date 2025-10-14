const API_BASE = '/api';

export async function fetchTasksByProjectId(projectId) {
  const response = await fetch(`${API_BASE}/projects/${projectId}/tasks`);
  if (!response.ok) {
    throw new Error(`Erreur ${response.status}`);
  }
  return await response.json();
}
