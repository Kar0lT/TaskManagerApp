// Project: Advanced Task Manager App
// Description: A fully-featured task manager app with modern UI, task status, due date, priority, descriptions, edit functionality, and export capability using React for frontend and .NET Core for backend.

// ---- Frontend (React) ----

// src/components/TaskManager.jsx
import React, { useState, useEffect } from 'react';
import './TaskManager.css';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5009/api/tasks')
      .then((response) => response.json())
      .then((data) => {
        setTasks(data);
        setLoading(false);
      })
      .catch((error) => console.error('Fetching tasks failed:', error));
  }, []);

  const addTask = () => {
    if (!newTask.trim()) return;
    fetch('http://localhost:5009/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTask, description, dueDate, priority, completed: false })
    })
      .then((response) => response.json())
      .then((task) => setTasks([...tasks, task]))
      .catch((error) => console.error('Adding task failed:', error));
    setNewTask('');
    setDescription('');
    setDueDate('');
    setPriority('Medium');
  };

  const deleteTask = (id) => {
    fetch(`http://localhost:5009/api/tasks/${id}`, { method: 'DELETE' })
      .then(() => setTasks(tasks.filter((task) => task.id !== id)))
      .catch((error) => console.error('Deleting task failed:', error));
  };

  const toggleTaskCompletion = (id) => {
    setTasks(tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const startEditTask = (task) => {
    setEditingTask(task);
    setNewTask(task.title);
    setDescription(task.description);
    setDueDate(task.dueDate);
    setPriority(task.priority);
  };

  const updateTask = () => {
    if (!editingTask) return;
    fetch(`http://localhost:5009/api/tasks/${editingTask.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...editingTask, title: newTask, description, dueDate, priority })
    })
      .then((response) => response.json())
      .then((updatedTask) => {
        setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
        setEditingTask(null);
        setNewTask('');
        setDescription('');
        setDueDate('');
        setPriority('Medium');
      })
      .catch((error) => console.error('Updating task failed:', error));
  };

  return (
    <div className="task-manager">
      <h1>Task Manager</h1>
      <div className="task-input">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Task title"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task description"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        {editingTask ? (
          <button className="update-btn" onClick={updateTask}>Update Task</button>
        ) : (
          <button className="add-btn" onClick={addTask}>Add Task</button>
        )}
      </div>
      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id} className={`task-item ${task.priority.toLowerCase()}`}>
              <div className="task-details">
                <h3 className={task.completed ? 'completed' : ''}>{task.title}</h3>
                <p>{task.description}</p>
                <p>Due: {task.dueDate || 'No date'}</p>
                <p>Priority: {task.priority}</p>
              </div>
              <div className="task-actions">
                <button className="complete-btn" onClick={() => toggleTaskCompletion(task.id)}>
                  {task.completed ? 'Undo' : 'Complete'}
                </button>
                <button className="edit-btn" onClick={() => startEditTask(task)}>Edit</button>
                <button className="delete-btn" onClick={() => deleteTask(task.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskManager;