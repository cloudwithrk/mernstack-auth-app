// Dashboard.js
import React, { useState, useEffect } from "react";

const API = "http://localhost:5000/api";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  const fetchTasks = async () => {
    const res = await fetch(`${API}/tasks`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    const data = await res.json();
    setTasks(data);
  };

  const addTask = async () => {
    if (!newTask.trim()) return;
    await fetch(`${API}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ description: newTask })
    });
    setNewTask("");
    fetchTasks();
  };

  const updateTask = async (id, description) => {
    const newDesc = prompt("Edit Task:", description);
    if (newDesc) {
      await fetch(`${API}/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ description: newDesc })
      });
      fetchTasks();
    }
  };

  const deleteTask = async (id) => {
    await fetch(`${API}/tasks/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="container">
      <h2>My Tasks</h2>
      <div className="add-task">
        <input
          placeholder="New Task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button onClick={addTask}>Add</button>
      </div>
      <div className="tasks">
        {tasks.map((task) => (
          <div key={task.id} className="task-card">
            <span>{task.description}</span>
            <div>
              <button onClick={() => updateTask(task.id, task.description)}>
                Edit
              </button>
              <button onClick={() => deleteTask(task.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
