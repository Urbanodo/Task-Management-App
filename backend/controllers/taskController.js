const Task = require("../models/Task");


// GET TASKS

const getTasks = async (req, res) => {

  const tasks = await Task.find({
  user: req.user._id
}).populate("user", "name");
};


// CREATE TASK

const createTask = async (req, res) => {
    console.log("BODY :", req.body);

  const {
    title,
    description,
    dueDate,
    priority
  } = req.body;

  const task = await Task.create({
  user: req.user._id,
  title,
  description,
  dueDate,
  priority
});

const populatedTask =
  await Task.findById(task._id)
    .populate("user", "name");

res.status(201).json(populatedTask);
};


// UPDATE TASK

const updateTask = async (req, res) => {

  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({
      message: "Tâche non trouvée"
    });
  }

  if (
    task.user.toString() !== req.user._id.toString()
  ) {
    return res.status(401).json({
      message: "Non autorisé"
    });
  }

  const updatedTask = await Task.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(updatedTask);
};


// DELETE TASK

const deleteTask = async (req, res) => {

  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({
      message: "Tâche non trouvée"
    });
  }

  if (
    task.user.toString() !== req.user._id.toString()
  ) {
    return res.status(401).json({
      message: "Non autorisé"
    });
  }

  await task.deleteOne();

  res.json({
    message: "Tâche supprimée"
  });
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask
};
