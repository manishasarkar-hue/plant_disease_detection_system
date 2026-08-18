import React, { useState, useEffect } from 'react';
import { CalendarClock, Check, Clock, Calendar as CalendarIcon, Plus, Trash2 } from 'lucide-react';
import '../styles/scheduler.css';

const Scheduler = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('plantCareTasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('plantCareTasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim() || !newDate || !newTime) return;

    const task = {
      id: Date.now().toString(),
      text: newTask,
      date: newDate,
      time: newTime,
      completed: false,
      createdAt: new Date().toISOString()
    };

    setTasks([...tasks, task]);
    setNewTask('');
    setNewDate('');
    setNewTime('');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (e, id) => {
    e.stopPropagation(); // Prevent toggling the task when deleting
    setTasks(tasks.filter(task => task.id !== id));
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    // Sort by date and time
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateA - dateB;
  });

  return (
    <div className="scheduler-container">
      <div className="content-header">
        <h1>Farm Schedule</h1>
        <p>Plan and track your plant care tasks</p>
      </div>

      <div className="scheduler-content">
        <div className="scheduler-add-task card-panel">
          <h3>Add New Task</h3>
          <form onSubmit={addTask} className="scheduler-form">
            <div className="form-group">
              <label>Task Description</label>
              <input 
                type="text" 
                placeholder="e.g., Water the tomatoes, Apply fertilizer..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Date</label>
                <div className="input-with-icon">
                  <CalendarIcon size={18} />
                  <input 
                    type="date" 
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Time</label>
                <div className="input-with-icon">
                  <Clock size={18} />
                  <input 
                    type="time" 
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
            
            <button type="submit" className="primary-btn add-task-btn">
              <Plus size={18} />
              Add Task
            </button>
          </form>
        </div>

        <div className="scheduler-task-list card-panel">
          <h3>Upcoming Tasks</h3>
          
          {sortedTasks.length === 0 ? (
            <div className="empty-state">
              <CalendarClock size={48} className="empty-icon" />
              <p>No tasks scheduled yet. Add your first plant care task above!</p>
            </div>
          ) : (
            <div className="tasks-wrapper">
              {sortedTasks.map(task => {
                const taskDate = new Date(`${task.date}T${task.time}`);
                const isPast = taskDate < new Date() && !task.completed;
                
                return (
                  <div 
                    key={task.id} 
                    className={`task-item ${task.completed ? 'completed' : ''} ${isPast ? 'overdue' : ''}`}
                    onClick={() => toggleTask(task.id)}
                  >
                    <div className="task-checkbox">
                      {task.completed && <Check size={16} />}
                    </div>
                    
                    <div className="task-details">
                      <span className="task-text">{task.text}</span>
                      <div className="task-meta">
                        <span className="task-date">
                          <CalendarIcon size={14} /> 
                          {new Date(task.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                        </span>
                        <span className="task-time">
                          <Clock size={14} />
                          {new Date(`2000-01-01T${task.time}`).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
                        </span>
                        {isPast && <span className="overdue-badge">Overdue</span>}
                      </div>
                    </div>
                    
                    <button className="delete-task-btn" onClick={(e) => deleteTask(e, task.id)}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Scheduler;

