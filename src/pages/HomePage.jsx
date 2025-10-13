import { useEffect, useState } from "react";
import { fetchProjects } from "../api/projectApi";
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
                <ul>
                {projects.map(p => (
                    <div key={p.id} className="project-item">
                    <span className="project-name">{p.name}</span>
                    <span className="project-description">{p.description}</span>
                    </div>
                ))}
                </ul>
            )}
      </div>
    </div>
  );
}