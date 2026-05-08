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

// ===== Initial State =====
const initialState = {
  tasks: loadState('tasks', []),
  pomodoroSessions: loadState('pomodoroSessions', []),
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
