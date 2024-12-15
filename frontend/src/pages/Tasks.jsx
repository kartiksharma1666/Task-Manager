import React, { useState, useEffect } from "react";
import axios from "axios";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const res = await axios.get("/api/tasks", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTasks(res.data);
    };
    fetchTasks();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold">Your Tasks</h1>
      {tasks.map((task) => (
        <div key={task._id} className="p-4 border">
          <h2>{task.title}</h2>
          <p>Status: {task.status}</p>
        </div>
      ))}
    </div>
  );
};

export default Tasks;
