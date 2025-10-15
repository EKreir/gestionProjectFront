const API_BASE = '/api';

// 🔹 Récupérer les tâches d’un projet
export async function fetchTasksByProjectId(projectId) {
  const response = await fetch(`${API_BASE}/projects/${projectId}/tasks`);
  if (!response.ok) throw new Error(`Erreur ${response.status}`);
  return await response.json();
}

// 🔹 Créer une nouvelle tâche
export async function createTask(taskData) {
  const response = await fetch(`${API_BASE}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(taskData),
  });
  if (!response.ok) throw new Error(`Erreur ${response.status}`);
  return await response.json();
}

// 🔹 Mettre à jour une tâche (titre, description, statut)
export async function updateTask(id, updatedData) {
  const response = await fetch(`${API_BASE}/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedData),
  });
  if (!response.ok) throw new Error(`Erreur ${response.status}`);
  return await response.json();
}

// 🔹 Supprimer une tâche
export async function deleteTask(id) {
  const response = await fetch(`${API_BASE}/tasks/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error(`Erreur ${response.status} lors de la suppression`);
}
