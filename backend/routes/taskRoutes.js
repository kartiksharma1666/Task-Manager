const express = require('express');
const { createTask, getTasks, updateTask, deleteTask } = require('../controllers/taskController');
const router = express.Router();

// POST route to create a new task
router.post('/tasks', createTask);

// GET route to fetch all tasks
router.get('/tasks', getTasks);

// PUT route to update a task by its ID
router.put('/tasks/:id/status', updateTask);

// DELETE route to delete a task by its ID
router.delete('/tasks/:id', deleteTask);

module.exports = router;
