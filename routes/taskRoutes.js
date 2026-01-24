const express = require("express");
const router = express.Router();

const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getTaskById,
} = require("../controllers/TasksController");
const { protect } = require("../middleware/authMiddleware");

//  /api/tasks
router.route("/")
  .get(protect, getTasks)      
  .post(protect, createTask);    

  // /api/tasks/:id
router.route("/:id")
  .get(protect, getTaskById) 
  .put(protect, updateTask)    
  .delete(protect, deleteTask);    

module.exports = router;