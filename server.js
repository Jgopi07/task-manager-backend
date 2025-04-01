const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let tasks = []; // In-memory storage for tasks

// Task data schema
// { id, title, priority, createdAt, updatedAt }

// Default route
app.get("/", (req, res) => {
    res.send("Task Manager Backend is Running!");
});

// Fetch all tasks
app.get("/tasks", (req, res) => {
    // Sort tasks by priority before sending them
    tasks.sort((a, b) => {
        const priorityOrder = { High: 1, Medium: 2, Low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    res.json(tasks);
});

// Add a new task
app.post("/tasks", (req, res) => {
    const { title, priority } = req.body;

    // Check if task title is provided
    if (!title) {
        return res.status(400).json({ error: "Task title is required" });
    }

    // Create a new task object
    const newTask = {
        id: tasks.length + 1,
        title,
        priority: priority || 'Low', // Default priority is 'Low'
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    tasks.push(newTask); // Add to the tasks array
    res.status(201).json(newTask); // Respond with the newly added task
});

// Edit a task
app.put("/tasks/:id", (req, res) => {
    const { id } = req.params;
    const { title, priority } = req.body;

    // Find the task by id
    const task = tasks.find((task) => task.id === parseInt(id));
    if (!task) return res.status(404).json({ error: "Task not found" });

    // Update task details
    task.title = title || task.title;
    task.priority = priority || task.priority;
    task.updatedAt = new Date().toISOString(); // Update the updatedAt timestamp

    res.json(task); // Respond with updated task
});

// Delete a task
app.delete("/tasks/:id", (req, res) => {
    const { id } = req.params;

    // Filter out the task to delete
    tasks = tasks.filter((task) => task.id !== parseInt(id));
    res.json({ message: "Task deleted successfully" });
});

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
