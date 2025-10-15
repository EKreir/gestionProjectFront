import React, { useEffect, useState } from "react";
import "./TaskEditModal.css";

export default function TaskEditModal({ task, onClose, onSave, onDelete }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "TODO",
  });

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || "",
        description: task.description || "",
        status: task.status || "TODO",
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...task, ...form });
  };

  const handleDelete = () => {
    if (window.confirm("Voulez-vous vraiment supprimer cette tâche ?")) {
      onDelete(task.id);
    }
  };

  if (!task) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h2>Modifier la tâche</h2>

        <form onSubmit={handleSubmit} className="modal-form">
          <label>Titre :</label>
          <input
            name="title"
            type="text"
            value={form.title}
            onChange={handleChange}
            required
          />

          <label>Description :</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
          />

          <label>Statut :</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            required
          >
            <option value="TODO">À faire</option>
            <option value="IN_PROGRESS">En cours</option>
            <option value="DONE">Terminée</option>
          </select>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              ❌ Annuler
            </button>
            <button type="submit" className="btn-save">
              💾 Enregistrer
            </button>
          </div>
        </form>

        <button type="button" className="btn-delete" onClick={handleDelete}>
          🗑️ Supprimer
        </button>
      </div>
    </div>
  );
}
