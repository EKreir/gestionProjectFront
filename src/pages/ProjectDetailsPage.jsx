import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
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

  // 🧠 On trie les tâches selon leur statut
  const todoTasks = tasks.filter((t) => t.status === "A_FAIRE" || t.status === "TODO");
  const inProgressTasks = tasks.filter((t) => t.status === "EN_COURS" || t.status === "IN_PROGRESS");
  const doneTasks = tasks.filter((t) => t.status === "TERMINEE" || t.status === "DONE");

  return (
    <div className="project-details">
      <Link to="/home" className="back-link">← Retour</Link>
      <h1 style={{ color: "#000000" }}>{project.name}</h1>
      <p className="description">{project.description}</p>

      <div className="kanban-board">
        <div className="kanban-column">
          <h3 className="column-title todo">À faire</h3>
          {todoTasks.length === 0 ? (
            <p className="empty">Aucune tâche</p>
          ) : (
            todoTasks.map((t) => (
              <div key={t.id} className="task-card">
                <h4>{t.name}</h4>
                <p>{t.description}</p>
              </div>
            ))
          )}
        </div>

        <div className="kanban-column">
          <h3 className="column-title in-progress">En cours</h3>
          {inProgressTasks.length === 0 ? (
            <p className="empty">Aucune tâche</p>
          ) : (
            inProgressTasks.map((t) => (
              <div key={t.id} className="task-card">
                <h4>{t.name}</h4>
                <p>{t.description}</p>
              </div>
            ))
          )}
        </div>

        <div className="kanban-column">
          <h3 className="column-title done">Terminée</h3>
          {doneTasks.length === 0 ? (
            <p className="empty">Aucune tâche</p>
          ) : (
            doneTasks.map((t) => (
              <div key={t.id} className="task-card">
                <h4>{t.name}</h4>
                <p>{t.description}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
