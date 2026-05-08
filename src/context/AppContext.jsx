import { createContext, useContext, useReducer, useEffect } from 'react';

const AppContext = createContext();

// ===== Helper: Load from localStorage =====
function loadState(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

// ===== Seed Data =====
function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

const SEED_TASKS = [
  { id: 's1', title: 'Complete React Hooks assignment', priority: 'high', category: 'assignment', completed: true, createdAt: daysAgo(6) },
  { id: 's2', title: 'Read Chapter 5 — Data Structures', priority: 'medium', category: 'study', completed: true, createdAt: daysAgo(5) },
  { id: 's3', title: 'Build REST API for capstone backend', priority: 'high', category: 'project', completed: true, createdAt: daysAgo(4) },
  { id: 's4', title: 'Revise CSS Flexbox & Grid notes', priority: 'low', category: 'revision', completed: true, createdAt: daysAgo(3) },
  { id: 's5', title: 'Practice MongoDB aggregation queries', priority: 'medium', category: 'study', completed: false, createdAt: daysAgo(2) },
  { id: 's6', title: 'Write unit tests for auth module', priority: 'high', category: 'project', completed: false, createdAt: daysAgo(1) },
  { id: 's7', title: 'Submit OS lab report', priority: 'medium', category: 'assignment', completed: false, createdAt: daysAgo(0) },
  { id: 's8', title: 'Review pull request #42', priority: 'low', category: 'project', completed: false, createdAt: daysAgo(0) },
];

const SEED_SESSIONS = [
  { id: 'p1', duration: 25, completedAt: daysAgo(5) },
  { id: 'p2', duration: 25, completedAt: daysAgo(4) },
  { id: 'p3', duration: 25, completedAt: daysAgo(4) },
  { id: 'p4', duration: 25, completedAt: daysAgo(3) },
  { id: 'p5', duration: 25, completedAt: daysAgo(2) },
  { id: 'p6', duration: 25, completedAt: daysAgo(1) },
  { id: 'p7', duration: 25, completedAt: daysAgo(1) },
  { id: 'p8', duration: 25, completedAt: daysAgo(1) },
  { id: 'p9', duration: 25, completedAt: daysAgo(0) },
];

// ===== Initial State =====
const initialState = {
  tasks: loadState('tasks', SEED_TASKS),
  pomodoroSessions: loadState('pomodoroSessions', SEED_SESSIONS),
  productivityScores: loadState('productivityScores', []),
  quoteOfDay: null,
  quoteLoading: false,
  quoteError: null,
};

// ===== Action Types =====
export const ACTIONS = {
  // Tasks
  ADD_TASK: 'ADD_TASK',
  UPDATE_TASK: 'UPDATE_TASK',
  DELETE_TASK: 'DELETE_TASK',
  TOGGLE_TASK: 'TOGGLE_TASK',

  // Pomodoro
  ADD_POMODORO_SESSION: 'ADD_POMODORO_SESSION',

  // Productivity
  ADD_PRODUCTIVITY_SCORE: 'ADD_PRODUCTIVITY_SCORE',

  // API / Quote
  SET_QUOTE_LOADING: 'SET_QUOTE_LOADING',
  SET_QUOTE: 'SET_QUOTE',
  SET_QUOTE_ERROR: 'SET_QUOTE_ERROR',
};

// ===== Reducer =====
function appReducer(state, action) {
  switch (action.type) {
    // --- Tasks ---
    case ACTIONS.ADD_TASK:
      return { ...state, tasks: [...state.tasks, action.payload] };

    case ACTIONS.UPDATE_TASK:
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? { ...task, ...action.payload } : task
        ),
      };

    case ACTIONS.DELETE_TASK:
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
      };

    case ACTIONS.TOGGLE_TASK:
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload
            ? { ...task, completed: !task.completed }
            : task
        ),
      };

    // --- Pomodoro ---
    case ACTIONS.ADD_POMODORO_SESSION:
      return {
        ...state,
        pomodoroSessions: [...state.pomodoroSessions, action.payload],
      };

    // --- Productivity ---
    case ACTIONS.ADD_PRODUCTIVITY_SCORE:
      return {
        ...state,
        productivityScores: [...state.productivityScores, action.payload],
      };

    // --- Quote API ---
    case ACTIONS.SET_QUOTE_LOADING:
      return { ...state, quoteLoading: true, quoteError: null };

    case ACTIONS.SET_QUOTE:
      return { ...state, quoteOfDay: action.payload, quoteLoading: false };

    case ACTIONS.SET_QUOTE_ERROR:
      return { ...state, quoteError: action.payload, quoteLoading: false };

    default:
      return state;
  }
}

// ===== Provider =====
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Persist to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(state.tasks));
  }, [state.tasks]);

  useEffect(() => {
    localStorage.setItem('pomodoroSessions', JSON.stringify(state.pomodoroSessions));
  }, [state.pomodoroSessions]);

  useEffect(() => {
    localStorage.setItem('productivityScores', JSON.stringify(state.productivityScores));
  }, [state.productivityScores]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
