import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProjectById } from "../api/projectApi";
import { fetchTasksByProjectId, createTask } from "../api/taskApi";
import "./ProjectDetailsPage.css";

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "" });

  useEffect(() => {
    async function loadData() {
      try {
        const [projData, taskData] = await Promise.all([
          fetchProjectById(id),
          fetchTasksByProjectId(id),
        ]);
        setProject(projData);
        setTasks(taskData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  async function handleCreateTask(e) {
    e.preventDefault();
    if (!newTask.title.trim()) return alert("Le titre de la tâche est obligatoire.");

    try {
      const created = await createTask({
        title: newTask.title,
        description: newTask.description,
        status: "TODO", // Statut initial attendu par ton back
        projectId: id,
      });

      setTasks([...tasks, created]);
      setShowForm(false);
      setNewTask({ title: "", description: "" });
    } catch (err) {
      alert("Erreur lors de la création de la tâche : " + err.message);
    }
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
      <h1 style={{ color: "#333" }}>{project.name}</h1>
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
              ))
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
