const asyncHandler = require("express-async-handler");
const Task = require("../models/taskModel");


const isValidStatus = (status) =>
  ["todo", "in_progress", "done"].includes(status?.toLowerCase());

// @desc Get all tasks for logged in user
// @route GET /api/tasks
// @access Private
const getTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json(tasks);
});

// @desc Create new task
// @route POST /api/tasks
// @access Private
const createTask = asyncHandler(async (req, res) => {
  const { title, description, status, dueDate } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Please add a title for the task" });
  }

  if (status && !isValidStatus(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  const task = await Task.create({
    user: req.user._id,     
    title,
    description,
    status: status || "todo",
    dueDate,
  });

  res.status(201).json(task);
});

// @desc Update task
// @route PUT /api/tasks/:id
// @access Private
const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  if (task.user.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: "User not authorized to update this task" });
  }

  if (req.body.status && !isValidStatus(req.body.status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  const updatedTask = await Task.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.status(200).json(updatedTask);
});

// @desc Delete task
// @route DELETE /api/tasks/:id
// @access Private
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  if (task.user.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: "User not authorized" });
  }

  await task.deleteOne();
  res.status(200).json({ id: req.params.id, message: "Task removed" });
});

// @desc Get single task details
// @route GET /api/tasks/:id
// @access Private
const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task || task.user.toString() !== req.user._id.toString()) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.status(200).json(task);
});


module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getTaskById,
};