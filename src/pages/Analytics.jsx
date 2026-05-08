import { useAppContext } from '../context/AppContext';
import ProductivityCharts from '../components/dashboard/ProductivityCharts';
import StatCard from '../components/common/StatCard';
import { FiCheckSquare, FiClock, FiTrendingUp, FiTarget } from 'react-icons/fi';

export default function Analytics() {
  const { state } = useAppContext();

  const totalTasks = state.tasks.length;
  const completedTasks = state.tasks.filter((t) => t.completed).length;
  const highPriority = state.tasks.filter((t) => t.priority === 'high' && !t.completed).length;
  const totalSessions = state.pomodoroSessions.length;
  const totalMin = state.pomodoroSessions.reduce((sum, s) => sum + (s.duration || 25), 0);
  const avgSessionsPerDay = totalSessions > 0
    ? (totalSessions / 7).toFixed(1)
    : '0';

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gradient mb-1">Analytics</h1>
        <p className="text-surface-500 dark:text-surface-400">
          Track your productivity trends and insights.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard icon={FiCheckSquare} label="Tasks Done" value={completedTasks} color="emerald" />
        <StatCard icon={FiClock} label="Focus Minutes" value={`${totalMin}m`} color="primary" />
        <StatCard icon={FiTrendingUp} label="Avg Sessions/Day" value={avgSessionsPerDay} color="accent" />
        <StatCard icon={FiTarget} label="High Priority Pending" value={highPriority} color="amber" />
      </div>

      {/* Charts */}
      <ProductivityCharts />
    </div>
  );
}
