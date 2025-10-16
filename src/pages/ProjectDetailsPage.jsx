import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { fetchProjectById, updateProject } from "../api/projectApi";
import {
  fetchTasksByProjectId,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
} from "../api/taskApi";
import TaskEditModal from "../components/TaskEditModal";
import "./ProjectDetailsPage.css";

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [selectedTask, setSelectedTask] = useState(null);

  // 📝 États pour édition inline du projet
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const [tempTitle, setTempTitle] = useState("");
  const [tempDescription, setTempDescription] = useState("");

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

  // ✅ Sauvegarder modification projet
  async function handleSaveProject(updates) {
    try {
      const updated = await updateProject(id, { ...project, ...updates });
      setProject(updated);
    } catch (err) {
      alert("Erreur lors de la mise à jour du projet : " + err.message);
      // rollback si nécessaire
    }
  }

  // --- Gestion inline du titre ---
  const handleTitleClick = () => {
    setTempTitle(project.name);
    setEditingTitle(true);
  };

  const handleTitleKey = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmed = tempTitle.trim();
      if (!trimmed) {
        setTempTitle(project.name);
      } else if (trimmed !== project.name) {
        await handleSaveProject({ name: trimmed });
      }
      setEditingTitle(false);
    }
    if (e.key === "Escape") {
      setTempTitle(project.name);
      setEditingTitle(false);
    }
  };

  const handleTitleBlur = async () => {
    const trimmed = tempTitle.trim();
    if (!trimmed) setTempTitle(project.name);
    else if (trimmed !== project.name) await handleSaveProject({ name: trimmed });
    setEditingTitle(false);
  };

  // --- Gestion inline de la description ---
  const handleDescriptionClick = () => {
    setTempDescription(project.description || "");
    setEditingDescription(true);
  };

  const handleDescriptionKey = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmed = tempDescription.trim();
      if (!trimmed) setTempDescription(project.description || "");
      else if (trimmed !== project.description)
        await handleSaveProject({ description: trimmed });
      setEditingDescription(false);
    }
    if (e.key === "Escape") {
      setTempDescription(project.description || "");
      setEditingDescription(false);
    }
  };

  const handleDescriptionBlur = async () => {
    const trimmed = tempDescription.trim();
    if (!trimmed) setTempDescription(project.description || "");
    else if (trimmed !== project.description)
      await handleSaveProject({ description: trimmed });
    setEditingDescription(false);
  };

  // --- CRUD des tâches ---
  async function handleCreateTask(e) {
    e.preventDefault();
    if (!newTask.title.trim()) return alert("Le titre est obligatoire.");
    try {
      const created = await createTask({
        title: newTask.title,
        description: newTask.description,
        status: "TODO",
        projectId: id,
      });
      setTasks([...tasks, created]);
      setShowForm(false);
      setNewTask({ title: "", description: "" });
    } catch (err) {
      alert("Erreur lors de la création : " + err.message);
    }
  }

  async function handleSaveTask(updatedTask) {
    try {
      const saved = await updateTask(updatedTask.id, updatedTask);
      setTasks((prev) => prev.map((t) => (t.id === saved.id ? saved : t)));
      setSelectedTask(null);
    } catch (err) {
      alert("Erreur lors de la mise à jour : " + err.message);
    }
  }

  async function handleDeleteTask(taskId) {
    try {
      await deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      setSelectedTask(null);
    } catch (err) {
      alert("Erreur lors de la suppression : " + err.message);
    }
  }

  async function onDragEnd(result) {
  const { destination, source, draggableId } = result;
  if (!destination) return;
  if (destination.droppableId === source.droppableId && destination.index === source.index)
    return;

  const taskId = Number(draggableId);
  const newStatus = destination.droppableId;
  const movedTask = tasks.find((t) => t.id === taskId);
  if (!movedTask) return;

  const prevTasks = [...tasks];
  const updatedTask = { ...movedTask, status: newStatus };
  setTasks((prev) => prev.map((t) => (t.id === taskId ? updatedTask : t)));

  try {
    await updateTaskStatus(taskId, newStatus); // ✅ appelle la fonction corrigée
  } catch (err) {
    console.error("Échec de mise à jour du statut :", err);
    alert("Impossible de mettre à jour le statut, rollback.");
    setTasks(prevTasks);
  }
}


  if (loading) return <p>Chargement du projet...</p>;
  if (error) return <p>Erreur : {error}</p>;
  if (!project) return <p>Projet introuvable.</p>;

  const groupedTasks = {
    TODO: tasks.filter((t) => t.status === "TODO"),
    IN_PROGRESS: tasks.filter((t) => t.status === "IN_PROGRESS"),
    DONE: tasks.filter((t) => t.status === "DONE"),
  };

  return (
    <div className="project-details">
      {/* 🏷️ Édition du titre */}
      {editingTitle ? (
        <input
          className="edit-project-title"
          value={tempTitle}
          onChange={(e) => setTempTitle(e.target.value)}
          onKeyDown={handleTitleKey}
          onBlur={handleTitleBlur}
          autoFocus
        />
      ) : (
        <h1
          style={{ color: "#333", cursor: "pointer" }}
          onClick={handleTitleClick}
          title="Cliquez pour modifier le titre"
        >
          {project.name}
        </h1>
      )}

      {/* 📝 Édition de la description */}
      {editingDescription ? (
        <textarea
          className="edit-project-description"
          value={tempDescription}
          onChange={(e) => setTempDescription(e.target.value)}
          onKeyDown={handleDescriptionKey}
          onBlur={handleDescriptionBlur}
          autoFocus
        />
      ) : (
        <p
          className="description"
          onClick={handleDescriptionClick}
          style={{ cursor: "pointer" }}
          title="Cliquez pour modifier la description"
        >
          {project.description || "Aucune description"}
        </p>
      )}

      {/* --- Formulaire de création d’une tâche --- */}
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
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
          />
          <button type="submit">Créer</button>
        </form>
      )}

      {/* --- Kanban board --- */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="kanban-board">
          {["TODO", "IN_PROGRESS", "DONE"].map((status) => (
            <Droppable droppableId={status} key={status}>
              {(provided) => (
                <div
                  className="kanban-column"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <h3>
                    {status === "TODO" && "📝 À faire"}
                    {status === "IN_PROGRESS" && "⚙️ En cours"}
                    {status === "DONE" && "✅ Terminées"}
                  </h3>

                  <div className="task-list">
                    {groupedTasks[status].length === 0 ? (
                      <p className="empty-column">Aucune tâche</p>
                    ) : (
                      groupedTasks[status].map((t, index) => (
                        <Draggable
                          key={t.id}
                          draggableId={t.id.toString()}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              className="task-card"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              onDoubleClick={() => setSelectedTask(t)}
                            >
                              <h4>{t.title}</h4>
                              <p>{t.description}</p>
                            </div>
                          )}
                        </Draggable>
                      ))
                    )}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {/* --- Popup édition tâche --- */}
      {selectedTask && (
        <TaskEditModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onSave={handleSaveTask}
          onDelete={handleDeleteTask}
        />
      )}
    </div>
  );
}
