const Task = require("../models/Task");

// GET TASKS
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.user._id,
    });
    res.json(tasks); // ✅ réponse manquante ajoutée
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// CREATE TASK
const createTask = async (req, res) => {
  console.log("BODY :", req.body);
  try {
    const { title, description, dueDate, priority } = req.body;
    const task = await Task.create({
      user: req.user._id,
      title,
      description,
      dueDate,
      priority,
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création" });
  }
};

// UPDATE TASK
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Tâche non trouvée" });
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Non autorisé" });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: "after" } // ✅ remplace { new: true }
    );

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la modification" });
  }
};

// DELETE TASK
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Tâche non trouvée" });
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Non autorisé" });
    }

    await task.deleteOne();
    res.json({ message: "Tâche supprimée" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression" });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};