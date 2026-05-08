import { useAppContext, ACTIONS } from '../../context/AppContext';
import { FiTrash2, FiCheck } from 'react-icons/fi';

const priorityBadge = {
  low: 'badge-success',
  medium: 'badge-warning',
  high: 'badge-danger',
};

const categoryEmoji = {
  study: '📚',
  project: '💻',
  revision: '🔄',
  assignment: '📝',
};

export default function TaskList({ filter = 'all' }) {
  const { state, dispatch } = useAppContext();

  let tasks = [...state.tasks];

  if (filter === 'active') tasks = tasks.filter((t) => !t.completed);
  else if (filter === 'completed') tasks = tasks.filter((t) => t.completed);

  // Sort: incomplete first, then by creation date (newest first)
  tasks.sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  if (tasks.length === 0) {
    return (
      <div className="glass-card p-8 text-center" id="empty-tasks">
        <p className="text-4xl mb-3">📋</p>
        <p className="text-surface-500 dark:text-surface-400">
          {filter === 'completed' ? 'No completed tasks yet.' : 'No tasks yet. Add one above!'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2" id="task-list">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`glass-card p-4 flex items-center gap-4 group transition-all duration-300
                      ${task.completed ? 'opacity-60' : ''}`}
        >
          {/* Checkbox */}
          <button
            onClick={() => dispatch({ type: ACTIONS.TOGGLE_TASK, payload: task.id })}
            className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all flex-shrink-0
                        ${task.completed
                ? 'bg-primary-500 border-primary-500 text-white'
                : 'border-surface-300 dark:border-surface-600 hover:border-primary-500'
              }`}
            id={`toggle-task-${task.id}`}
          >
            {task.completed && <FiCheck className="text-sm" />}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p
              className={`font-medium text-surface-900 dark:text-white truncate ${
                task.completed ? 'line-through text-surface-400 dark:text-surface-500' : ''
              }`}
            >
              {task.title}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-surface-400">
                {categoryEmoji[task.category] || '📌'} {task.category}
              </span>
            </div>
          </div>

          {/* Priority badge */}
          <span className={priorityBadge[task.priority]}>
            {task.priority}
          </span>

          {/* Delete */}
          <button
            onClick={() => dispatch({ type: ACTIONS.DELETE_TASK, payload: task.id })}
            className="p-2 rounded-lg text-surface-400 hover:text-red-500 hover:bg-red-50
                       dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-all"
            id={`delete-task-${task.id}`}
          >
            <FiTrash2 />
          </button>
        </div>
      ))}
    </div>
  );
}
