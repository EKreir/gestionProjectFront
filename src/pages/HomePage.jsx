import { useEffect, useState } from "react";
import { fetchProjects } from "../api/projectApi";

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
      {projects.length === 0 ? (
        <p>Aucun projet trouvé.</p>
      ) : (
        <ul>
          {projects.map(p => (
            <li key={p.id}>
              <strong>{p.name}</strong> — {p.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}