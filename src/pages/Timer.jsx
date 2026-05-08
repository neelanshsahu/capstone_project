import PomodoroTimer from '../components/timer/PomodoroTimer';
import { useAppContext } from '../context/AppContext';

export default function Timer() {
  const { state } = useAppContext();
  const totalMin = state.pomodoroSessions.reduce((sum, s) => sum + (s.duration || 25), 0);
  const hours = Math.floor(totalMin / 60);
  const mins = totalMin % 60;

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gradient mb-1">Focus Timer</h1>
        <p className="text-surface-500 dark:text-surface-400">
          Stay focused with the Pomodoro technique.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timer */}
        <div className="lg:col-span-2">
          <PomodoroTimer />
        </div>

        {/* Stats sidebar */}
        <div className="space-y-4">
          <div className="glass-card p-5">
            <p className="text-sm font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wide mb-3">
              Total Focus Time
            </p>
            <p className="text-3xl font-bold text-surface-900 dark:text-white">
              {hours > 0 && `${hours}h `}{mins}m
            </p>
            <p className="text-sm text-surface-500 mt-1">
              Across {state.pomodoroSessions.length} sessions
            </p>
          </div>

          <div className="glass-card p-5">
            <p className="text-sm font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wide mb-3">
              🧠 Tips
            </p>
            <ul className="space-y-2 text-sm text-surface-600 dark:text-surface-300">
              <li className="flex items-start gap-2">
                <span className="text-primary-500 mt-0.5">•</span>
                Work for 25 minutes, then take a 5-minute break
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-500 mt-0.5">•</span>
                After 4 sessions, take a longer 15-minute break
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-500 mt-0.5">•</span>
                Remove distractions and silence notifications
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-500 mt-0.5">•</span>
                Stay hydrated and stretch during breaks
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
