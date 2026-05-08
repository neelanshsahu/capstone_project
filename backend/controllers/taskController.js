/**
 * taskController.js - Handles all task-related business logic
 * 
 * Each function receives (req, res) from Express and:
 *   1. Reads/validates the request
 *   2. Performs the operation on the data store
 *   3. Sends back a JSON response
 */

const { v4: uuidv4 } = require('uuid');
const { getCollection, saveCollection } = require('../data/dataStore');

const COLLECTION = 'tasks';

// GET /api/tasks — Fetch all tasks
const getAllTasks = (req, res) => {
  try {
    const tasks = getCollection(COLLECTION);
    res.json({ success: true, data: tasks, count: tasks.length });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch tasks' });
  }
};

// GET /api/tasks/:id — Fetch a single task
const getTaskById = (req, res) => {
  try {
    const tasks = getCollection(COLLECTION);
    const task = tasks.find(t => t.id === req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch task' });
  }
};

// POST /api/tasks — Create a new task
const createTask = (req, res) => {
  try {
    const { title, description, priority, category, dueDate } = req.body;

    // Validation
    if (!title || title.trim() === '') {
      return res.status(400).json({ success: false, message: 'Task title is required' });
    }

    const newTask = {
      id: uuidv4(),
      title: title.trim(),
      description: description?.trim() || '',
      priority: priority || 'medium',       // low, medium, high
      category: category || 'general',       // study, homework, project, general
      dueDate: dueDate || null,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const tasks = getCollection(COLLECTION);
    tasks.push(newTask);
    saveCollection(COLLECTION, tasks);

    res.status(201).json({ success: true, data: newTask, message: 'Task created' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create task' });
  }
};

// PUT /api/tasks/:id — Update an existing task
const updateTask = (req, res) => {
  try {
    const tasks = getCollection(COLLECTION);
    const index = tasks.findIndex(t => t.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Merge existing task with updates
    const updatedTask = {
      ...tasks[index],
      ...req.body,
      id: tasks[index].id,             // Prevent ID from being changed
      createdAt: tasks[index].createdAt, // Preserve original creation time
      updatedAt: new Date().toISOString(),
    };

    tasks[index] = updatedTask;
    saveCollection(COLLECTION, tasks);

    res.json({ success: true, data: updatedTask, message: 'Task updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update task' });
  }
};

// DELETE /api/tasks/:id — Delete a task
const deleteTask = (req, res) => {
  try {
    const tasks = getCollection(COLLECTION);
    const index = tasks.findIndex(t => t.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const deleted = tasks.splice(index, 1)[0];
    saveCollection(COLLECTION, tasks);

    res.json({ success: true, data: deleted, message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete task' });
  }
};

// PATCH /api/tasks/:id/toggle — Toggle task completion
const toggleTask = (req, res) => {
  try {
    const tasks = getCollection(COLLECTION);
    const index = tasks.findIndex(t => t.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    tasks[index].completed = !tasks[index].completed;
    tasks[index].updatedAt = new Date().toISOString();
    saveCollection(COLLECTION, tasks);

    res.json({ success: true, data: tasks[index], message: 'Task toggled' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to toggle task' });
  }
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  toggleTask,
};
