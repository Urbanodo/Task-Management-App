import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import "../pages/Dashboard.css";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("moyenne");
  const [editingId, setEditingId] = useState(null);
  const [editTask, setEditTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "moyenne",
    status: "en cours",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("toutes");
  const [sortBy, setSortBy] = useState("none");

  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    let isMounted = true;

    const loadTasks = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.token) {
          navigate("/");
          return;
        }
        const response = await API.get("/tasks", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        if (isMounted) {
          setTasks(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    loadTasks();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const createTask = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.token) {
        navigate("/");
        return;
      }
      const response = await API.post(
        "/tasks",
        { title, description, dueDate, priority },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setTasks([...tasks, response.data]);
      setTitle("");
      setDescription("");
      setDueDate("");
      setPriority("moyenne");
    } catch (error) {
      console.log(error);
      alert("Erreur lors de la création");
    }
  };

  const updateTask = async (id) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.token) {
        navigate("/");
        return;
      }
      const response = await API.put(`/tasks/${id}`, editTask, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setTasks(tasks.map((task) => (task._id === id ? response.data : task)));
      setEditingId(null);
      setEditTask({
        title: "",
        description: "",
        dueDate: "",
        priority: "moyenne",
        status: "en cours",
      });
    } catch (error) {
      console.log(error);
      alert("Erreur lors de la modification");
    }
  };

  const deleteTask = async (id) => {
    const confirmDelete = window.confirm(
      "Voulez-vous vraiment supprimer cette tâche ?"
    );
    if (!confirmDelete) return;
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.token) {
        navigate("/");
        return;
      }
      await API.delete(`/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
      console.log(error);
      alert("Erreur lors de la suppression");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // STATISTIQUES
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === "terminée").length;
  const pendingTasks = tasks.filter((task) => task.status === "en cours").length;
  const progressPercentage =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const filteredTasks = tasks
    .filter((task) => {
      const search = searchTerm.toLowerCase();
      const matchSearch =
        task.title.toLowerCase().includes(search) ||
        (task.description || "").toLowerCase().includes(search);
      const matchStatus =
        filterStatus === "toutes" ? true : task.status === filterStatus;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      if (sortBy === "dateAsc") return new Date(a.dueDate) - new Date(b.dueDate);
      if (sortBy === "dateDesc") return new Date(b.dueDate) - new Date(a.dueDate);
      if (sortBy === "priority") {
        const order = { haute: 3, moyenne: 2, faible: 1 };
        return order[b.priority] - order[a.priority];
      }
      return 0;
    });

  return (
    <div className="dashboard">

      {/* TOP BAR */}
      <div className="top-bar">
        <h1>Mes Tâches</h1>
        <button onClick={handleLogout}>Déconnexion</button>
      </div>

      {/* STATISTIQUES */}
      <div className="stats-container">
        <div className="stat-card">
          <h3>Total</h3>
          <p>{totalTasks}</p>
        </div>
        <div className="stat-card">
          <h3>En cours</h3>
          <p>{pendingTasks}</p>
        </div>
        <div className="stat-card">
          <h3>Terminées</h3>
          <p>{completedTasks}</p>
        </div>
      </div>

      {/* BARRE DE PROGRESSION */}
      <div className="progress-section">
        <h3>Progression : {progressPercentage}%</h3>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      <hr />

      {/* RECHERCHE & FILTRES */}
      <input
        type="text"
        placeholder="Rechercher une tâche..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <br />
      <br />

      <select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
      >
        <option value="toutes">Toutes</option>
        <option value="en cours">En cours</option>
        <option value="terminée">Terminées</option>
      </select>

      <br />
      <br />

      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value="none">Aucun tri</option>
        <option value="dateAsc">Échéance proche → lointaine</option>
        <option value="dateDesc">Échéance lointaine → proche</option>
        <option value="priority">Priorité haute → faible</option>
      </select>

      <hr />

      {/* FORMULAIRE DE CRÉATION */}
      <div className="form-container">
        <form onSubmit={createTask}>
          <input
            type="text"
            placeholder="Titre"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <br />
          <br />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <br />
          <br />

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

          <br />
          <br />

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="faible">Faible</option>
            <option value="moyenne">Moyenne</option>
            <option value="haute">Haute</option>
          </select>

          <br />
          <br />

          <button type="submit">Ajouter une tâche</button>
        </form>
      </div>

      <hr />

      {/* LISTE DES TÂCHES */}
      <h3>{filteredTasks.length} tâche(s) trouvée(s)</h3>

      {filteredTasks.length === 0 ? (
        <p>Aucune tâche</p>
      ) : (
        filteredTasks.map((task) => (
          <div key={task._id} className="task-card">
            {editingId === task._id ? (
              <>
                <input
                  type="text"
                  value={editTask.title}
                  onChange={(e) =>
                    setEditTask({ ...editTask, title: e.target.value })
                  }
                />

                <br />
                <br />

                <textarea
                  value={editTask.description}
                  onChange={(e) =>
                    setEditTask({ ...editTask, description: e.target.value })
                  }
                />

                <br />
                <br />

                <input
                  type="date"
                  value={editTask.dueDate}
                  onChange={(e) =>
                    setEditTask({ ...editTask, dueDate: e.target.value })
                  }
                />

                <br />
                <br />

                <select
                  value={editTask.priority}
                  onChange={(e) =>
                    setEditTask({ ...editTask, priority: e.target.value })
                  }
                >
                  <option value="faible">Faible</option>
                  <option value="moyenne">Moyenne</option>
                  <option value="haute">Haute</option>
                </select>

                <br />
                <br />

                <select
                  value={editTask.status}
                  onChange={(e) =>
                    setEditTask({ ...editTask, status: e.target.value })
                  }
                >
                  <option value="en cours">En cours</option>
                  <option value="terminée">Terminée</option>
                </select>

                <br />
                <br />

                <button onClick={() => updateTask(task._id)}>
                  Enregistrer
                </button>
              </>
            ) : (
              <>
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <p>
                  Échéance :{" "}
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString()
                    : "Non définie"}
                </p>
                <p>
                  Priorité :
                  <span className={`priority-${task.priority}`}>
                    {" "}{task.priority}
                  </span>
                </p>
                <p>
                  Statut :
                  <span
                    className={
                      task.status === "terminée"
                        ? "status-terminee"
                        : "status-en-cours"
                    }
                  >
                    {" "}{task.status}
                  </span>
                </p>

                <button onClick={() => deleteTask(task._id)}>
                  Supprimer
                </button>

                {" "}

                <button
                  onClick={() => {
                    setEditingId(task._id);
                    setEditTask({
                      title: task.title,
                      description: task.description || "",
                      dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
                      priority: task.priority,
                      status: task.status,
                    });
                  }}
                >
                  Modifier
                </button>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default Dashboard;