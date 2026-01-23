const mongoose = require("mongoose");

const taskSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: [true, "Please add a task title"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["todo", "in_progress", "done"],
      default: "todo",
      lowercase: true,
    },
    dueDate: {
      type: Date,
    },
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model("Task", taskSchema);