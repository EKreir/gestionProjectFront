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
          fetchTasksByProjectId(id)
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

  return (
    <div style={{ padding: "20px" }}>
      <h1>{project.name}</h1>
      <p>{project.description}</p>

      <h2>Liste des tâches</h2>
      {tasks.length === 0 ? (
        <p>Aucune tâche pour ce projet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {tasks.map((t) => (
            <li
              key={t.id}
              style={{
                padding: "10px",
                borderBottom: "1px solid #ddd",
                display: "flex",
                justifyContent: "space-between"
              }}
            >
              <span>
                <strong>{t.name}</strong> — {t.description}
              </span>
              <span
                style={{
                  backgroundColor:
                    t.status === "TERMINEE"
                      ? "#b9f6ca"
                      : t.status === "EN_COURS"
                      ? "#fff59d"
                      : "#ffccbc",
                  padding: "4px 8px",
                  borderRadius: "6px"
                }}
              >
                {t.status}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}