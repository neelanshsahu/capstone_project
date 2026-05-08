import { useMemo } from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { useAppContext } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend, Filler);

export default function ProductivityCharts() {
  const { state } = useAppContext();
  const { darkMode } = useTheme();

  const textColor = darkMode ? '#e2e8f0' : '#334155';
  const gridColor = darkMode ? 'rgba(100,116,139,0.15)' : 'rgba(203,213,225,0.5)';

  // ── Task stats for Doughnut ──
  const taskStats = useMemo(() => {
    const completed = state.tasks.filter((t) => t.completed).length;
    const active = state.tasks.length - completed;
    return { completed, active };
  }, [state.tasks]);

  const doughnutData = {
    labels: ['Completed', 'Active'],
    datasets: [
      {
        data: [taskStats.completed, taskStats.active],
        backgroundColor: ['#6366f1', darkMode ? '#334155' : '#e2e8f0'],
        borderWidth: 0,
        borderRadius: 6,
      },
    ],
  };

  // ── Pomodoro sessions per day (last 7 days) ──
  const sessionsByDay = useMemo(() => {
    const days = [];
    const counts = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      days.push(d.toLocaleDateString('en', { weekday: 'short' }));
      counts.push(
        state.pomodoroSessions.filter((s) => s.completedAt?.startsWith(key)).length
      );
    }
    return { days, counts };
  }, [state.pomodoroSessions]);

  const barData = {
    labels: sessionsByDay.days,
    datasets: [
      {
        label: 'Focus Sessions',
        data: sessionsByDay.counts,
        backgroundColor: 'rgba(99,102,241,0.7)',
        borderRadius: 8,
        borderSkipped: false,
        maxBarThickness: 36,
      },
    ],
  };

  // ── Tasks by priority ──
  const priorityData = useMemo(() => {
    const low = state.tasks.filter((t) => t.priority === 'low').length;
    const med = state.tasks.filter((t) => t.priority === 'medium').length;
    const high = state.tasks.filter((t) => t.priority === 'high').length;
    return { low, med, high };
  }, [state.tasks]);

  const priorityBarData = {
    labels: ['Low', 'Medium', 'High'],
    datasets: [
      {
        label: 'Tasks',
        data: [priorityData.low, priorityData.med, priorityData.high],
        backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
        borderRadius: 8,
        borderSkipped: false,
        maxBarThickness: 48,
      },
    ],
  };

  // ── Cumulative tasks completed (line) ──
  const cumulativeData = useMemo(() => {
    const completed = state.tasks
      .filter((t) => t.completed)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    const labels = [];
    const data = [];
    completed.forEach((t, i) => {
      const d = new Date(t.createdAt);
      labels.push(d.toLocaleDateString('en', { month: 'short', day: 'numeric' }));
      data.push(i + 1);
    });
    // If no data, show placeholder
    if (data.length === 0) {
      return { labels: ['Start'], data: [0] };
    }
    return { labels, data };
  }, [state.tasks]);

  const lineData = {
    labels: cumulativeData.labels,
    datasets: [
      {
        label: 'Tasks Completed',
        data: cumulativeData.data,
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99,102,241,0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#6366f1',
        pointRadius: 4,
      },
    ],
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: darkMode ? '#1e293b' : '#fff',
        titleColor: textColor,
        bodyColor: textColor,
        borderColor: gridColor,
        borderWidth: 1,
        padding: 12,
        cornerRadius: 12,
      },
    },
    scales: {
      x: { ticks: { color: textColor }, grid: { display: false } },
      y: { ticks: { color: textColor }, grid: { color: gridColor } },
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="productivity-charts">
      {/* Bar: Focus Sessions */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-bold text-surface-900 dark:text-white mb-4">
          🎯 Focus Sessions (7 Days)
        </h3>
        <div className="h-56">
          <Bar data={barData} options={commonOptions} />
        </div>
      </div>

      {/* Doughnut: Task Completion */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-bold text-surface-900 dark:text-white mb-4">
          ✅ Task Completion
        </h3>
        <div className="h-56 flex items-center justify-center">
          <div className="w-48 h-48">
            <Doughnut
              data={doughnutData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: { legend: { display: true, position: 'bottom', labels: { color: textColor } } },
              }}
            />
          </div>
        </div>
      </div>

      {/* Line: Cumulative completed */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-bold text-surface-900 dark:text-white mb-4">
          📈 Progress Over Time
        </h3>
        <div className="h-56">
          <Line data={lineData} options={commonOptions} />
        </div>
      </div>

      {/* Bar: By Priority */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-bold text-surface-900 dark:text-white mb-4">
          ⚡ Tasks by Priority
        </h3>
        <div className="h-56">
          <Bar data={priorityBarData} options={commonOptions} />
        </div>
      </div>
    </div>
  );
}
