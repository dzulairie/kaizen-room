import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseUser";

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [editDescriptions, setEditDescriptions] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching tasks:", error.message);
    } else {
      setTasks(data);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim() && !newTask.description.trim()) {
      alert("Task title or description must not be empty.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("tasks").insert(newTask);
    if (error) {
      console.error("Error adding task:", error.message);
    } else {
      setNewTask({ title: "", description: "" });
      fetchTasks();
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) {
      console.error("Error deleting task:", error.message);
    } else {
      fetchTasks();
    }
  };

  const handleUpdate = async (id) => {
    const newDesc = editDescriptions[id];
    if (!newDesc || newDesc.trim() === "") {
      alert("New description cannot be empty.");
      return;
    }

    const { error } = await supabase
      .from("tasks")
      .update({ description: newDesc })
      .eq("id", id);

    if (error) {
      console.error("Error updating task:", error.message);
    } else {
      setEditDescriptions((prev) => ({ ...prev, [id]: "" }));
      fetchTasks();
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Add Task Section */}
        <div className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-gray-800 text-center">📝 Add New Task</h2>
          <form onSubmit={handleAddTask} className="space-y-4">
            <div>
              <label className="block text-gray-700">Title</label>
              <input
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask((prev) => ({ ...prev, title: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 bg-white/80"
                placeholder="Task title"
              />
            </div>
            <div>
              <label className="block text-gray-700">Description</label>
              <textarea
                value={newTask.description}
                onChange={(e) => setNewTask((prev) => ({ ...prev, description: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 bg-white/80"
                placeholder="Task description"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold transition"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Task"}
            </button>
          </form>
        </div>

        {/* Task List Section */}
        <div className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-gray-800 text-center">📋 Task List</h2>
          <ul className="space-y-4">
            {tasks.map((task) => (
              <li key={task.id} className="bg-gray-50 p-4 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-700">{task.title}</h3>
                <p className="text-gray-600 mb-2">{task.description}</p>

                <textarea
                  value={editDescriptions[task.id] || ""}
                  onChange={(e) =>
                    setEditDescriptions((prev) => ({
                      ...prev,
                      [task.id]: e.target.value,
                    }))
                  }
                  className="w-full p-2 border border-gray-300 rounded mb-2 text-gray-800"
                  placeholder="Edit description..."
                />

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleUpdate(task.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TaskManager;
