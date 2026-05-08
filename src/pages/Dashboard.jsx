import { useAppContext } from '../context/AppContext';
import StatCard from '../components/common/StatCard';
import QuoteCard from '../components/common/QuoteCard';
import ProductivityCharts from '../components/dashboard/ProductivityCharts';
import { FiCheckSquare, FiClock, FiTrendingUp, FiAward } from 'react-icons/fi';

export default function Dashboard() {
  const { state } = useAppContext();

  const totalTasks = state.tasks.length;
  const completedTasks = state.tasks.filter((t) => t.completed).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const totalSessions = state.pomodoroSessions.length;
  const totalFocusMinutes = state.pomodoroSessions.reduce((sum, s) => sum + (s.duration || 25), 0);

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gradient mb-1">Dashboard</h1>
        <p className="text-surface-500 dark:text-surface-400">
          Your productivity overview at a glance.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          icon={FiCheckSquare}
          label="Total Tasks"
          value={totalTasks}
          trend={totalTasks > 0 ? 12 : 0}
          color="primary"
        />
        <StatCard
          icon={FiAward}
          label="Completed"
          value={completedTasks}
          trend={completedTasks > 0 ? 8 : 0}
          color="emerald"
        />
        <StatCard
          icon={FiClock}
          label="Focus Sessions"
          value={totalSessions}
          color="accent"
        />
        <StatCard
          icon={FiTrendingUp}
          label="Completion Rate"
          value={`${completionRate}%`}
          trend={completionRate > 50 ? 5 : -3}
          color="amber"
        />
      </div>

      {/* Quote */}
      <QuoteCard />

      {/* Charts */}
      <div>
        <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-4">
          📊 Analytics Overview
        </h2>
        <ProductivityCharts />
      </div>
    </div>
  );
}
