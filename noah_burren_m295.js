const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const app = express();
const port = 3000;
const secretKey = "123456789";
const tasksFilePath = "tasks.json";
app.use(bodyParser.json());

let tasks = loadTasksFromFile();

function loadTasksFromFile() {
  try {
    const data = fs.readFileSync(tasksFilePath);
    return JSON.parse(data);
  } catch (error) {
    return [
      { id: 1, title: "cleaning", where: "kitchen" },
      { id: 2, title: "recycling", what: "glass" },
      // ... continuing tasks
    ];
  }
}

function saveTasksToFile() {
  const data = JSON.stringify(tasks, null, 2);
  fs.writeFileSync(tasksFilePath, data);
}

// user credentials for demonstration purposes
const validCredentials = { email: "noah.burren@bluewin.ch", password: "1234" };

// Middleware to check authentication
const authenticateToken = (req, res, next) => {
  const tokenHeader = req.header("Authorization");

  if (!tokenHeader) return res.status(403).json({ error: "Unauthorized" });

  const token = tokenHeader.split(" ")[1]; // Remove "Bearer " from the token

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      console.error("Token verification error:", err);
      return res.status(403).json({ error: "Unauthorized" });
    }

    req.user = user;
    next();
  });
};

// POST /login Endpoint
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (
    email === validCredentials.email &&
    password === validCredentials.password
  ) {
    const token = jwt.sign({ email }, secretKey);
    res.status(200).json({ token });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

// GET /verify Endpoint
app.get("/verify", authenticateToken, (req, res) => {
  res.status(200).json({ message: "Token is valid", user: req.user });
});

// DELETE /logout Endpoint
app.delete("/logout", authenticateToken, (req, res) => {
  // In a real application, you might want to implement token invalidation logic here
  res.status(204).end();
});

// Get a specific task by ID
app.get("/tasks/:id", authenticateToken, (req, res) => {
  const taskID = parseInt(req.params.id);
  const foundTask = tasks.find((task) => task.id === taskID);

  if (foundTask) {
    res.status(200).json(foundTask);
  } else {
    res.status(404).json({ error: "Task not found" });
  }
});

// Get all tasks
app.get("/tasks", authenticateToken, (req, res) => {
  res.status(200).json(tasks);
  saveTasksToFile(); // Save tasks to file after serving the tasks
});

// Post a new task
app.post("/tasks", authenticateToken, (req, res) => {
  const newTask = req.body;
  newTask.id = tasks.length + 1;
  tasks.push(newTask);
  saveTasksToFile(); // Save tasks to file after adding a new task
  res.status(201).json(newTask);
});

// Put update an existing task by ID
app.put("/tasks/:id", authenticateToken, (req, res) => {
  const taskID = parseInt(req.params.id);
  const updatedTaskIndex = tasks.findIndex((task) => task.id === taskID);

  if (updatedTaskIndex !== -1) {
    tasks[updatedTaskIndex] = { ...tasks[updatedTaskIndex], ...req.body };
    saveTasksToFile(); // Save tasks to file after updating a task
    res.status(200).json(tasks[updatedTaskIndex]);
  } else {
    res.status(404).json({ error: "Task not found" });
  }
});

// Delete the last task
app.delete("/tasks", authenticateToken, (req, res) => {
  if (tasks.length > 0) {
    const deletedTask = tasks.pop();
    saveTasksToFile(); // Save tasks to file after deleting a task
    res.status(200).json(deletedTask);
  } else {
    res.status(404).json({ error: "No tasks to delete" });
  }
});

// Output Port
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
