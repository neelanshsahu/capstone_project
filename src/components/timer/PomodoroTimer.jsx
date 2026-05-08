import { useState, useEffect, useCallback, useRef } from 'react';
import { useAppContext, ACTIONS } from '../../context/AppContext';
import { FiPlay, FiPause, FiRotateCcw, FiSkipForward, FiCoffee, FiZap } from 'react-icons/fi';

const MODES = {
  focus: { label: 'Focus', minutes: 25, icon: FiZap, color: 'primary' },
  shortBreak: { label: 'Short Break', minutes: 5, icon: FiCoffee, color: 'emerald' },
  longBreak: { label: 'Long Break', minutes: 15, icon: FiCoffee, color: 'accent' },
};

export default function PomodoroTimer() {
  const { dispatch } = useAppContext();
  const [mode, setMode] = useState('focus');
  const [timeLeft, setTimeLeft] = useState(MODES.focus.minutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const startTimeRef = useRef(null);

  const currentMode = MODES[mode];

  const switchMode = useCallback(
    (newMode) => {
      setMode(newMode);
      setTimeLeft(MODES[newMode].minutes * 60);
      setIsRunning(false);
    },
    []
  );

  // Countdown
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsRunning(false);

          // Session completed
          if (mode === 'focus') {
            const newCount = sessions + 1;
            setSessions(newCount);
            dispatch({
              type: ACTIONS.ADD_POMODORO_SESSION,
              payload: {
                id: Date.now().toString(),
                duration: MODES.focus.minutes,
                completedAt: new Date().toISOString(),
              },
            });

            // After 4 focus sessions → long break, else short break
            if (newCount % 4 === 0) {
              switchMode('longBreak');
            } else {
              switchMode('shortBreak');
            }
          } else {
            switchMode('focus');
          }

          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, mode, sessions, dispatch, switchMode]);

  const toggleTimer = () => {
    if (!isRunning) {
      startTimeRef.current = Date.now();
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(currentMode.minutes * 60);
  };

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const progress = 1 - timeLeft / (currentMode.minutes * 60);
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference * (1 - progress);

  const colorClasses = {
    primary: { ring: 'stroke-primary-500', bg: 'from-primary-500/10 to-primary-600/5' },
    emerald: { ring: 'stroke-emerald-500', bg: 'from-emerald-500/10 to-emerald-600/5' },
    accent: { ring: 'stroke-accent-500', bg: 'from-accent-500/10 to-accent-600/5' },
  };

  const colors = colorClasses[currentMode.color];

  return (
    <div className="glass-card p-8" id="pomodoro-timer">
      {/* Mode selector */}
      <div className="flex gap-2 mb-8 justify-center">
        {Object.entries(MODES).map(([key, m]) => (
          <button
            key={key}
            onClick={() => switchMode(key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              mode === key
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md shadow-primary-500/25'
                : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700'
            }`}
            id={`mode-${key}`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Timer ring */}
      <div className="flex justify-center mb-8">
        <div className="relative w-64 h-64">
          {/* Background gradient */}
          <div className={`absolute inset-0 bg-gradient-to-b ${colors.bg} rounded-full`} />

          <svg className="w-full h-full -rotate-90" viewBox="0 0 256 256">
            {/* Background circle */}
            <circle
              cx="128"
              cy="128"
              r="120"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-surface-200 dark:text-surface-700"
            />
            {/* Progress circle */}
            <circle
              cx="128"
              cy="128"
              r="120"
              fill="none"
              strokeWidth="8"
              strokeLinecap="round"
              className={`${colors.ring} transition-all duration-1000 ease-linear`}
              style={{
                strokeDasharray: circumference,
                strokeDashoffset,
              }}
            />
          </svg>

          {/* Timer text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-5xl font-bold text-surface-900 dark:text-white tabular-nums tracking-tight">
              {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
            </p>
            <p className="text-sm text-surface-500 mt-1 font-medium">{currentMode.label}</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={resetTimer}
          className="btn-secondary !rounded-full !p-3"
          id="reset-timer"
        >
          <FiRotateCcw className="text-lg" />
        </button>

        <button
          onClick={toggleTimer}
          className="btn-primary !rounded-full !px-8 !py-3 text-lg flex items-center gap-2"
          id="toggle-timer"
        >
          {isRunning ? <FiPause /> : <FiPlay />}
          {isRunning ? 'Pause' : 'Start'}
        </button>

        <button
          onClick={() => {
            if (mode === 'focus') switchMode('shortBreak');
            else switchMode('focus');
          }}
          className="btn-secondary !rounded-full !p-3"
          id="skip-timer"
        >
          <FiSkipForward className="text-lg" />
        </button>
      </div>

      {/* Session counter */}
      <div className="mt-6 text-center">
        <p className="text-sm text-surface-500">
          Sessions today: <span className="font-bold text-primary-600 dark:text-primary-400">{sessions}</span>
        </p>
        <div className="flex justify-center gap-1.5 mt-2">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-colors ${
                i < sessions % 4
                  ? 'bg-primary-500'
                  : 'bg-surface-200 dark:bg-surface-700'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
