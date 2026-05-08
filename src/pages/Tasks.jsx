import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import TaskForm from '../components/tasks/TaskForm';
import TaskList from '../components/tasks/TaskList';

const FILTERS = ['all', 'active', 'completed'];

export default function Tasks() {
  const { state } = useAppContext();
  const [filter, setFilter] = useState('all');

  const total = state.tasks.length;
  const done = state.tasks.filter((t) => t.completed).length;

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gradient mb-1">Tasks</h1>
          <p className="text-surface-500 dark:text-surface-400">
            {done}/{total} completed
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all duration-200 ${
                filter === f
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md shadow-primary-500/25'
                  : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700'
              }`}
              id={`filter-${f}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Form + List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <TaskForm />
        </div>
        <div className="lg:col-span-2">
          <TaskList filter={filter} />
        </div>
      </div>
    </div>
  );
}
