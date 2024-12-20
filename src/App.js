import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import Login from './components/Login';  // Adjust the path if needed


function App() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState('');
  const [priority, setPriority] = useState('Low');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('General');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [sortOption, setSortOption] = useState('None');
  const [isEditing, setIsEditing] = useState(null);
  const [editTask, setEditTask] = useState('');
  const [editPriority, setEditPriority] = useState('Low');
  const [editCategory, setEditCategory] = useState('General');
  const [editDueDate, setEditDueDate] = useState('');

  // Checking if the user is logged in (localStorage or state management)
  const isLoggedIn = localStorage.getItem('user') ? true : false;

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (savedTasks) {
      setTasks(savedTasks);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    if (!task.trim()) {
      alert("Task name cannot be empty!");
      return;
    }
    if (!dueDate) {
      alert("Please select a due date!");
      return;
    }
    setTasks([
      ...tasks,
      { text: task, priority, dueDate, category, completed: false },
    ]);
    setTask('');
    setPriority('Low');
    setDueDate('');
    setCategory('General');
  };

  const toggleCompletion = (indexToToggle) => {
    const updatedTasks = tasks.map((task, index) => {
      if (index === indexToToggle) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  const deleteTask = (indexToDelete) => {
    const updatedTasks = tasks.filter((_, index) => index !== indexToDelete);
    setTasks(updatedTasks);
  };

  const startEditing = (index) => {
    setIsEditing(index);
    setEditTask(tasks[index].text);
    setEditPriority(tasks[index].priority);
    setEditCategory(tasks[index].category);
    setEditDueDate(tasks[index].dueDate);
  };

  const updateTask = (index) => {
    const updatedTasks = tasks.map((task, i) => {
      if (i === index) {
        return {
          ...task,
          text: editTask,
          priority: editPriority,
          category: editCategory,
          dueDate: editDueDate,
        };
      }
      return task;
    });
    setTasks(updatedTasks);
    setIsEditing(null);
    setEditTask('');
    setEditPriority('Low');
    setEditCategory('General');
    setEditDueDate('');
  };

  const filteredTasks = tasks
    .filter((task) => {
      const matchesSearch = task.text.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'All' || task.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortOption === 'Priority') {
        const priorityOrder = { High: 1, Medium: 2, Low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      if (sortOption === 'Due Date') {
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      if (sortOption === 'Alphabetical') {
        return a.text.localeCompare(b.text);
      }
      return 0;
    });

  return (
    <Router>
      <div className="container">
        <h1>To-Do App</h1>
        <Routes>
          {/* If user is not logged in, show login page */}
          <Route path="/login" element={<Login />} />

          {/* If logged in, show the task list */}
          {isLoggedIn && (
            <Route
              path="/"
              element={
                <>
                  <form onSubmit={addTask}>
                    <input
                      type="text"
                      value={task}
                      onChange={(e) => setTask(e.target.value)}
                      placeholder="Enter a new task"
                      className="task-input"
                    />
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="priority-dropdown"
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="category-dropdown"
                    >
                      <option value="General">General</option>
                      <option value="Work">Work</option>
                      <option value="Personal">Personal</option>
                      <option value="Study">Study</option>
                    </select>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="due-date-input"
                    />
                    <button type="submit" className="add-task-button">Add Task</button>
                  </form>
                  <div className="filters">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search tasks"
                      className="search-input"
                    />
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="filter-dropdown"
                    >
                      <option value="All">All</option>
                      <option value="General">General</option>
                      <option value="Work">Work</option>
                      <option value="Personal">Personal</option>
                      <option value="Study">Study</option>
                    </select>
                    <select
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                      className="sort-dropdown"
                    >
                      <option value="None">Sort by</option>
                      <option value="Priority">Priority</option>
                      <option value="Due Date">Due Date</option>
                      <option value="Alphabetical">Alphabetical</option>
                    </select>
                  </div>
                  {filteredTasks.length === 0 ? (
                    <p className="no-tasks">No tasks found. Try a different search or filter.</p>
                  ) : (
                    <ul className="task-list">
                      {filteredTasks.map((task, index) => (
                        <li key={index} className={`task-item ${task.priority.toLowerCase()}`}>
                          {isEditing === index ? (
                            <>
                              <input
                                type="text"
                                value={editTask}
                                onChange={(e) => setEditTask(e.target.value)}
                                className="edit-task"
                              />
                              <select
                                value={editPriority}
                                onChange={(e) => setEditPriority(e.target.value)}
                                className="edit-priority-dropdown"
                              >
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                              </select>
                              <select
                                value={editCategory}
                                onChange={(e) => setEditCategory(e.target.value)}
                                className="edit-category-dropdown"
                              >
                                <option value="General">General</option>
                                <option value="Work">Work</option>
                                <option value="Personal">Personal</option>
                                <option value="Study">Study</option>
                              </select>
                              <input
                                type="date"
                                value={editDueDate}
                                onChange={(e) => setEditDueDate(e.target.value)}
                                className="edit-due-date-input"
                              />
                              <button onClick={() => updateTask(index)} className="save">Save</button>
                            </>
                          ) : (
                            <>
                              <span
                                onClick={() => toggleCompletion(index)}
                                className={`task-text ${task.completed ? 'completed' : 'uncompleted'}`}
                              >
                                {task.text} - <strong>{task.priority}</strong> - {task.dueDate}
                              </span>
                              <button onClick={() => startEditing(index)} className="edit">Edit</button>
                              <button onClick={() => deleteTask(index)} className="delete">Delete</button>
                            </>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              }
            />
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
