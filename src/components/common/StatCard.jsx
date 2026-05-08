export default function StatCard({ icon: Icon, label, value, trend, color = 'primary' }) {
  const colorMap = {
    primary: 'from-primary-500 to-primary-600 shadow-primary-500/20',
    accent: 'from-accent-500 to-accent-600 shadow-accent-500/20',
    emerald: 'from-emerald-500 to-emerald-600 shadow-emerald-500/20',
    amber: 'from-amber-500 to-amber-600 shadow-amber-500/20',
  };

  return (
    <div className="stat-card group" id={`stat-${label?.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex items-center justify-between">
        <div
          className={`w-11 h-11 rounded-xl bg-gradient-to-br ${colorMap[color]}
                      flex items-center justify-center shadow-lg transition-transform
                      duration-300 group-hover:scale-110`}
        >
          {Icon && <Icon className="text-white text-xl" />}
        </div>
        {trend !== undefined && (
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              trend >= 0
                ? 'text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/40'
                : 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/40'
            }`}
          >
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-surface-900 dark:text-white mt-2">{value}</p>
      <p className="text-sm text-surface-500">{label}</p>
    </div>
  );
}
