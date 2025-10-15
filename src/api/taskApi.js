const API_BASE = '/api';

export async function fetchTasksByProjectId(projectId) {
  const response = await fetch(`${API_BASE}/projects/${projectId}/tasks`);
  if (!response.ok) {
    throw new Error(`Erreur ${response.status}`);
  }
  return await response.json();
}

export async function createTask(taskData) {
  const response = await fetch(`${API_BASE}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(taskData),
  });

  if (!response.ok) {
    throw new Error(`Erreur ${response.status}`);
  }

  return await response.json();
}

/* ✅ NOUVELLE MÉTHODE PUT POUR LA MISE À JOUR */
export async function updateTask(id, updatedData) {
  const response = await fetch(`${API_BASE}/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedData),
  });
  if (!response.ok) throw new Error(`Erreur ${response.status}`);
  return await response.json();
}
