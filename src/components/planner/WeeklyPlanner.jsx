import { useState } from 'react';
import { FiPlus, FiTrash2, FiClock, FiBookOpen } from 'react-icons/fi';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function loadPlanner() {
  try {
    const saved = localStorage.getItem('studyPlanner');
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

function savePlanner(data) {
  localStorage.setItem('studyPlanner', JSON.stringify(data));
}

export default function WeeklyPlanner() {
  const [planner, setPlanner] = useState(loadPlanner);
  const [activeDay, setActiveDay] = useState(DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]);
  const [newSubject, setNewSubject] = useState('');
  const [newTime, setNewTime] = useState('09:00');

  const addSlot = (e) => {
    e.preventDefault();
    if (!newSubject.trim()) return;

    const updated = {
      ...planner,
      [activeDay]: [
        ...(planner[activeDay] || []),
        { id: Date.now().toString(), subject: newSubject.trim(), time: newTime },
      ],
    };

    // Sort by time
    updated[activeDay].sort((a, b) => a.time.localeCompare(b.time));

    setPlanner(updated);
    savePlanner(updated);
    setNewSubject('');
  };

  const removeSlot = (day, id) => {
    const updated = {
      ...planner,
      [day]: (planner[day] || []).filter((s) => s.id !== id),
    };
    setPlanner(updated);
    savePlanner(updated);
  };

  const daySlots = planner[activeDay] || [];

  return (
    <div className="space-y-6" id="weekly-planner">
      {/* Day tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {DAYS.map((day) => {
          const count = (planner[day] || []).length;
          return (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                activeDay === day
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md shadow-primary-500/25'
                  : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700'
              }`}
              id={`day-tab-${day.toLowerCase()}`}
            >
              {day.slice(0, 3)}
              {count > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/20 text-[10px]">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Add slot form */}
      <form onSubmit={addSlot} className="glass-card p-5">
        <h3 className="text-sm font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wide mb-3">
          Add Study Slot — {activeDay}
        </h3>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <FiBookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
            <input
              type="text"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              placeholder="Subject name"
              className="input-field !pl-10"
              id="planner-subject-input"
            />
          </div>
          <div className="relative w-32">
            <FiClock className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
            <input
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="input-field !pl-10"
              id="planner-time-input"
            />
          </div>
          <button type="submit" className="btn-primary flex items-center gap-2" id="add-slot-btn">
            <FiPlus /> Add
          </button>
        </div>
      </form>

      {/* Schedule list */}
      {daySlots.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <p className="text-4xl mb-3">📅</p>
          <p className="text-surface-500 dark:text-surface-400">
            No study slots for {activeDay}. Add one above!
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {daySlots.map((slot) => (
            <div
              key={slot.id}
              className="glass-card p-4 flex items-center gap-4 group hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/10 to-accent-500/10 flex items-center justify-center">
                <FiClock className="text-primary-500 text-lg" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-surface-900 dark:text-white">{slot.subject}</p>
                <p className="text-sm text-surface-500">{slot.time}</p>
              </div>
              <button
                onClick={() => removeSlot(activeDay, slot.id)}
                className="p-2 rounded-lg text-surface-400 hover:text-red-500 hover:bg-red-50
                           dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-all"
              >
                <FiTrash2 />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
