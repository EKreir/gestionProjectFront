import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProjectById } from "../api/projectApi";
import { fetchTasksByProjectId } from "../api/taskApi";
import "./ProjectDetailsPage.css";

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <p>Chargement du projet...</p>;
  if (error) return <p>Erreur : {error}</p>;
  if (!project) return <p>Projet introuvable.</p>;

  // Groupement des tâches par statut
  const groupedTasks = {
    A_FAIRE: tasks.filter((t) => t.status === "A_FAIRE" || t.status === "TODO"),
    EN_COURS: tasks.filter((t) => t.status === "EN_COURS" || t.status === "IN_PROGRESS"),
    TERMINEE: tasks.filter((t) => t.status === "TERMINEE" || t.status === "DONE"),
  };

  return (
    <div className="project-detail-container">
      <header className="project-header">
        <div className="logo">tempo.</div>
        <div className="actions">
          <button className="btn-primary">Nouvelle tâche</button>
          <button className="btn-secondary">Gérer</button>
        </div>
      </header>

      <h1 className="project-title">{project.name}</h1>

      <div className="kanban-board">
        {[
          { title: "À faire", key: "A_FAIRE" },
          { title: "En cours", key: "EN_COURS" },
          { title: "Terminée", key: "TERMINEE" },
        ].map((col) => (
          <div key={col.key} className="kanban-column">
            <h3>{col.title}</h3>
            <div className="task-column">
              {groupedTasks[col.key].length > 0 ? (
                groupedTasks[col.key].map((t) => (
                  <div key={t.id} className="task-card">
                    <strong>{t.name}</strong>
                    <p>{t.description}</p>
                  </div>
                ))
              ) : (
                <p className="empty-column">Aucune tâche</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
