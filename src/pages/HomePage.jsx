import { useEffect, useState } from "react";
import { fetchProjects, createProject } from "../api/projectApi";
import { Link } from "react-router-dom";
import "./HomePage.css";

export default function HomePage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: "", description: "" });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const created = await createProject(newProject);
      setProjects([...projects, created]);
      setShowModal(false);
      setNewProject({ name: "", description: "" });
    } catch (err) {
      alert("Erreur lors de la création du projet : " + err.message);
    }
  };

  if (loading) return <p>Chargement des projets...</p>;
  if (error) return <p>Erreur : {error}</p>;

  return (
    <div>
      <h1>Liste des projets</h1>

      <button className="new-project-btn" onClick={() => setShowModal(true)}>
        + Nouveau projet
      </button>

      <div className="project-list">
        {projects.length === 0 ? (
          <p>Aucun projet trouvé.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {projects.map((p) => (
              <li key={p.id} style={{ marginBottom: "10px" }}>
                <Link
                  to={`/projects/${p.id}`}
                  className="project-item"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <strong style={{ color: "#262626" }} className="project-name">{p.name}</strong>
                  <p className="project-description">{p.description}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* POPUP / MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Créer un nouveau projet</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nom du projet :</label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) =>
                    setNewProject({ ...newProject, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Description :</label>
                <textarea
                  value={newProject.description}
                  onChange={(e) =>
                    setNewProject({ ...newProject, description: e.target.value })
                  }
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn-primary">
                  Créer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
