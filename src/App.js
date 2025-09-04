import React, { useState, useEffect } from "react";
import { FaStar, FaRegStar, FaTrash } from "react-icons/fa";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("All");
  const [error, setError] = useState("");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    const trimmedInput = input.trim();

    if (!trimmedInput) {
      setError("Task cannot be empty!");
      setTimeout(() => setError(""), 2000);
      return;
    }

    if (
      tasks.some((t) => t.text.toLowerCase() === trimmedInput.toLowerCase())
    ) {
      setError("Task already exists!");
      setTimeout(() => setError(""), 2000);
      return;
    }

    setTasks([
      ...tasks,
      { text: trimmedInput, completed: false, favorite: false },
    ]);
    setInput("");
  };

  const toggleComplete = (index) => {
    const updated = [...tasks];
    updated[index].completed = !updated[index].completed;
    setTasks(updated);
  };

  const toggleFavorite = (index) => {
    const updated = [...tasks];
    updated[index].favorite = !updated[index].favorite;
    setTasks(updated);
  };

  const deleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const editTask = (index, newText, oldText) => {
    const trimmedText = newText.trim();

    if (!trimmedText) {
      const updated = [...tasks];
      updated[index].text = oldText;
      setTasks(updated);
      return;
    }

    if (
      tasks.some(
        (t, i) =>
          i !== index && t.text.toLowerCase() === trimmedText.toLowerCase()
      )
    ) {
      alert("Task already exists!");
      return;
    }

    const updated = [...tasks];
    updated[index].text = trimmedText;
    setTasks(updated);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "Upcoming") return !task.completed;
    if (filter === "Completed") return task.completed;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (!a.completed && b.completed) return -1;
    if (a.completed && !b.completed) return 1;

    if (a.favorite && !b.favorite) return -1;
    if (!a.favorite && b.favorite) return 1;

    return 0;
  });

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <h1>Elvin Kontol</h1>
      </div>

      {/* Input Section */}
      <div className="input-section">
        <input
          type="text"
          placeholder="What do you want to do?"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />
        <button onClick={addTask}>Add Task</button>
      </div>

      {/* Error Message */}
      {error && <p className="error-message">{error}</p>}

      {/* Filter Buttons */}
      <div className="filter-buttons">
        {["All", "Upcoming", "Completed"].map((f) => (
          <button
            key={f}
            className={filter === f ? "active" : ""}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Task List */}
      <ul className="task-list">
        {sortedTasks.length === 0 ? (
          <p className="empty-message">There are no tasks... yet.</p>
        ) : (
          sortedTasks.map((task, index) => (
            <li key={index} className={task.completed ? "completed" : ""}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleComplete(tasks.indexOf(task))}
              />
              <span
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) =>
                  editTask(tasks.indexOf(task), e.target.textContent, task.text)
                }
              >
                {task.text}
              </span>
              <div className="task-icons">
                <span
                  className="icon star"
                  onClick={() => toggleFavorite(tasks.indexOf(task))}
                >
                  {task.favorite ? <FaStar color="gold" /> : <FaRegStar />}
                </span>
                <span
                  className="icon delete"
                  onClick={() => deleteTask(tasks.indexOf(task))}
                >
                  <FaTrash color="#c40e0eff" />
                </span>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default App;
