import { NavLink } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import {
  FiHome,
  FiCheckSquare,
  FiClock,
  FiCalendar,
  FiBarChart2,
  FiSun,
  FiMoon,
  FiZap,
} from 'react-icons/fi';

const links = [
  { to: '/', label: 'Dashboard', icon: FiHome },
  { to: '/tasks', label: 'Tasks', icon: FiCheckSquare },
  { to: '/timer', label: 'Focus Timer', icon: FiClock },
  { to: '/planner', label: 'Study Planner', icon: FiCalendar },
  { to: '/analytics', label: 'Analytics', icon: FiBarChart2 },
];

export default function Sidebar() {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 flex flex-col glass-card rounded-none border-r border-l-0 border-t-0 border-b-0 z-50">
      {/* Logo */}
      <div className="px-6 py-6 flex items-center gap-3 border-b border-surface-200 dark:border-surface-700/50">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/25">
          <FiZap className="text-white text-xl" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-surface-900 dark:text-white leading-tight">
            AI Coach
          </h1>
          <p className="text-[11px] text-surface-400 font-medium tracking-wide uppercase">
            Productivity
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `nav-link ${isActive ? 'active' : ''}`
            }
          >
            <Icon className="text-lg" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Theme toggle */}
      <div className="px-4 py-4 border-t border-surface-200 dark:border-surface-700/50">
        <button
          onClick={toggleDarkMode}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl
                     bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700
                     text-surface-600 dark:text-surface-300 transition-all duration-200 text-sm font-medium"
          id="theme-toggle"
        >
          {darkMode ? (
            <>
              <FiSun className="text-amber-400" />
              Light Mode
            </>
          ) : (
            <>
              <FiMoon className="text-primary-500" />
              Dark Mode
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
