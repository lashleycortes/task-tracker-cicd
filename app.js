const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

let tasks = [];

function addTask(title) {
    if (!title || title.trim() === "") {
        throw new Error("Task title is required");
    }

    const task = {
        id: tasks.length + 1,
        title: title.trim(),
        completed: false
    };

    tasks.push(task);
    return task;
}

function completeTask(id) {
    const task = tasks.find(task => task.id === id);

    if (!task) {
        throw new Error("Task not found");
    }

    task.completed = true;
    return task;
}

function getPendingTasks() {
    return tasks.filter(task => !task.completed);
}

app.get("/api/tasks", (req, res) => {
    res.json(tasks);
});

app.post("/api/tasks", (req, res) => {
    try {
        const task = addTask(req.body.title);
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
});

app.patch("/api/tasks/:id/complete", (req, res) => {
    try {
        const task = completeTask(Number(req.params.id));
        res.json(task);
    } catch (error) {
        res.status(404).json({
            error: error.message
        });
    }
});

if (require.main === module) {
    app.listen(PORT, "0.0.0.0", () => {
        console.log(`Task Tracker running on port ${PORT}`);
    });
}

module.exports = {
    app,
    addTask,
    completeTask,
    getPendingTasks,
    tasks
};