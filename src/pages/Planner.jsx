import WeeklyPlanner from '../components/planner/WeeklyPlanner';

export default function Planner() {
  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gradient mb-1">Study Planner</h1>
        <p className="text-surface-500 dark:text-surface-400">
          Plan your daily and weekly study schedule.
        </p>
      </div>

      <WeeklyPlanner />
    </div>
  );
}
