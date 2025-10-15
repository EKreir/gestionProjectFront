import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { fetchProjectById } from "../api/projectApi";
import { fetchTasksByProjectId, createTask, updateTask } from "../api/taskApi";
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

  async function onDragEnd(result) {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const taskId = Number(draggableId);
    const newStatus = destination.droppableId;
    const movedTask = tasks.find((t) => t.id === taskId);
    if (!movedTask) return;
    const prevTasks = tasks;
    const updatedTask = { ...movedTask, status: newStatus };
    setTasks((prev) => prev.map((t) => (t.id === taskId ? updatedTask : t)));

    try {
      await updateTask(taskId, { status: newStatus });
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
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
          />
          <button type="submit">Créer</button>
        </form>
      )}

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
                              <small className="edit-hint">
                                (Double-cliquez pour modifier)
                              </small>
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

      {selectedTask && (
        <TaskEditModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onSave={handleSaveTask}
        />
      )}
    </div>
  );
}
