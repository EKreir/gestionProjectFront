import { useEffect, useState } from "react";
import { fetchProjects } from "../api/projectApi";
import { Link } from "react-router-dom";
import './HomePage.css';

export default function HomePage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProjects()
      .then(data => {
        setProjects(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Chargement des projets...</p>;
  if (error) return <p>Erreur : {error}</p>;

  return (
  <div>
    <h1>Liste des projets</h1>

    <div className="project-list">
      {projects.length === 0 ? (
        <p>Aucun projet trouvé.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {projects.map((p) => (
            <li key={p.id} style={{ marginBottom: "10px" }}>
              <Link
                to={`/projects/${p.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
                className="project-item"
              >
                <strong
                style={{ color: "#262626" }}
                className="project-name">{p.name}</strong>
                <p
                  className="project-description"
                >
                  {p.description}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
);
}