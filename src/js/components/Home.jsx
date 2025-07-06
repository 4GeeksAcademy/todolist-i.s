import React, { useState, useEffect } from "react";

const USERNAME = "isabelsotomayor";
const API_USERS = "https://playground.4geeks.com/todo/users";
const API_TODOS = "https://playground.4geeks.com/todo/todos";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");

  // Crear usuario y manejar en caso de un usuario existente 
  const createUser = async () => {
    try {
      const res = await fetch(`${API_USERS}/${USERNAME}`, {
        method: "POST",
        headers: { accept: "application/json" },
      });
      if (res.ok) {
        console.log("Usuario creado con éxito");
      } else {
        const data = await res.json();
        if (data.detail === "User already exists.") {
          console.log("Usuario ya existe, seguimos normalmente");
        } else {
          console.error("Error creando usuario", data);
        }
      }
    } catch (error) {
      console.error("Error creando usuario:", error);
    }
  };

  // Obtener tareas
  const getTasks = async () => {
    try {
      const res = await fetch(`${API_USERS}/${USERNAME}`);
      if (res.ok) {
        const data = await res.json();
        setTasks(data.todos || []);
      } else {
        const errorData = await res.json();
        console.error("Error obteniendo tareas", errorData);
      }
    } catch (error) {
      console.error("Error obteniendo tareas", error);
    }
  };

  // Agregar tarea
  const addTask = async (label) => {
    if (!label) return;
    const newTask = { label, is_done: false };
    try {
      const res = await fetch(`${API_TODOS}/${USERNAME}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify(newTask),
      });
      if (res.ok) {
        await getTasks();
      } else {
        const errorData = await res.json();
        console.error("Error agregando tarea", errorData);
      }
    } catch (error) {
      console.error("Error agregando tarea", error);
    }
  };

  // Eliminar tarea
  const deleteTask = async (id) => {
    try {
      const res = await fetch(`${API_TODOS}/${id}`, { method: "DELETE" });
      if (res.ok) {
        await getTasks();
      } else {
        const errorData = await res.json();
        console.error("Error eliminando tarea", errorData);
      }
    } catch (error) {
      console.error("Error eliminando tarea", error);
    }
  };

  // Limpiar todas las tareas
  const clearAll = async () => {
    try {
      await Promise.all(
        tasks.map((task) => fetch(`${API_TODOS}/${task.id}`, { method: "DELETE" }))
      );
      setTasks([]);
    } catch (error) {
      console.error("Error limpiando tareas", error);
    }
  };

  useEffect(() => {
    // Crear usuario y luego obtener tareas
    createUser().then(() => getTasks());
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      addTask(input.trim());
      setInput("");
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">TODO List</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Nueva tarea"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </form>
      <ul className="list-group mb-3">
        {tasks.length === 0 && (
          <li className="list-group-item text-center">No hay tareas</li>
        )}
        {tasks.map(({ id, label }) => (
          <li
            key={id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            {label}
            <button
              className="btn btn-sm btn-danger"
              onClick={() => deleteTask(id)}
            >
              ❌
            </button>
          </li>
        ))}
      </ul>
      <button
        className="btn btn-warning"
        onClick={clearAll}
        disabled={tasks.length === 0}
      >
        Limpiar todo
      </button>
    </div>
  );
}
