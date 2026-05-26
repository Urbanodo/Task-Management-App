const mongoose = require("mongoose");

const taskSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    title: {
      type: String,
      required: true
    },

    description: {
      type: String
    },

    dueDate: {
      type: Date
    },

    status: {
      type: String,
      enum: ["en cours", "terminée"],
      default: "en cours"
    },

    priority: {
      type: String,
      enum: ["faible", "moyenne", "haute"],
      default: "moyenne"
    }
  },

  {
    timestamps: true
  }
);

module.exports = mongoose.model("Task", taskSchema);