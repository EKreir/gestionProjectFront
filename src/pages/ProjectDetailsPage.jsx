import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { fetchProjectById } from "../api/projectApi";
import { fetchTasksByProjectId } from "../api/taskApi";
import "./ProjectDetailsPage.css";

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState({ TODO: [], IN_PROGRESS: [], DONE: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const projData = await fetchProjectById(id);
        const taskData = await fetchTasksByProjectId(id);

        const grouped = {
          TODO: taskData.filter((t) => t.status === "TODO"),
          IN_PROGRESS: taskData.filter((t) => t.status === "IN_PROGRESS"),
          DONE: taskData.filter((t) => t.status === "DONE"),
        };

        setProject(projData);
        setTasks(grouped);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  async function updateTaskStatus(taskId, newStatus) {
    try {
      await fetch(`/api/tasks/${taskId}/status?status=${newStatus}`, { method: "PATCH" });
    } catch (err) {
      console.error("Erreur lors de la mise à jour du statut :", err);
    }
  }

  function onDragEnd(result) {
    const { source, destination } = result;
    if (!destination) return;

    // Même colonne → juste réorganisation locale
    if (source.droppableId === destination.droppableId) {
      const newColumn = Array.from(tasks[source.droppableId]);
      const [moved] = newColumn.splice(source.index, 1);
      newColumn.splice(destination.index, 0, moved);
      setTasks({ ...tasks, [source.droppableId]: newColumn });
      return;
    }

    // Déplacement entre colonnes
    const sourceTasks = Array.from(tasks[source.droppableId]);
    const destTasks = Array.from(tasks[destination.droppableId]);
    const [moved] = sourceTasks.splice(source.index, 1);
    moved.status = destination.droppableId;

    destTasks.splice(destination.index, 0, moved);

    setTasks({
      ...tasks,
      [source.droppableId]: sourceTasks,
      [destination.droppableId]: destTasks,
    });

    updateTaskStatus(moved.id, destination.droppableId);
  }

  if (loading) return <p>Chargement du projet...</p>;
  if (error) return <p>Erreur : {error}</p>;
  if (!project) return <p>Projet introuvable.</p>; 
  
  // Regroupement des tâches par statut
  const groupedTasks = {
    TODO: tasks.filter(t => t.status === "TODO"),
    IN_PROGRESS: tasks.filter(t => t.status === "IN_PROGRESS"),
    DONE: tasks.filter(t => t.status === "DONE"),
  };

  return (
    <div className="project-details">
      <h1>{project.name}</h1>
      <p className="description">{project.description}</p>

      <button className="add-task-btn" onClick={() => setShowForm(!showForm)}>
        ➕ Ajouter une tâche
      </button>

      {showForm && (
        <form onSubmit={handleCreateTask} className="task-form">
          <input
            type="text"
            placeholder="Titre de la tâche"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            required
          />
          <textarea
            placeholder="Description"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          />
          <button type="submit">Créer</button>
        </form>
      )}
  <div className="kanban-board">
        {["TODO", "IN_PROGRESS", "DONE"].map((status) => (
          <div key={status} className="kanban-column">
            <h3>
              {status === "TODO" && "📝 À faire"}
              {status === "IN_PROGRESS" && "⚙️ En cours"}
              {status === "DONE" && "✅ Terminées"}
            </h3>

            {groupedTasks[status].length === 0 ? (
              <p className="empty-column">Aucune tâche</p>
            ) : (
              groupedTasks[status].map((t) => (
                <div key={t.id} className="task-card">
                  <h4>{t.title}</h4>
                  <p>{t.description}</p>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}