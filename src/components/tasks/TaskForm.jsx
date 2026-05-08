import { useState } from 'react';
import { useAppContext, ACTIONS } from '../../context/AppContext';
import { FiPlus } from 'react-icons/fi';

export default function TaskForm() {
  const { dispatch } = useAppContext();
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('study');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    dispatch({
      type: ACTIONS.ADD_TASK,
      payload: {
        id: Date.now().toString(),
        title: title.trim(),
        priority,
        category,
        completed: false,
        createdAt: new Date().toISOString(),
      },
    });

    setTitle('');
    setPriority('medium');
    setCategory('study');
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card p-5" id="task-form">
      <h3 className="text-lg font-bold text-surface-900 dark:text-white mb-4">Add New Task</h3>
      <div className="space-y-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What do you need to do?"
          className="input-field"
          id="task-title-input"
        />
        <div className="flex gap-3">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="input-field flex-1"
            id="task-priority-select"
          >
            <option value="low">🟢 Low Priority</option>
            <option value="medium">🟡 Medium Priority</option>
            <option value="high">🔴 High Priority</option>
          </select>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input-field flex-1"
            id="task-category-select"
          >
            <option value="study">📚 Study</option>
            <option value="project">💻 Project</option>
            <option value="revision">🔄 Revision</option>
            <option value="assignment">📝 Assignment</option>
          </select>
        </div>
        <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2" id="add-task-btn">
          <FiPlus /> Add Task
        </button>
      </div>
    </form>
  );
}
