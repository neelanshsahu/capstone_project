import { useState, useEffect } from 'react';
import { FiRefreshCw } from 'react-icons/fi';

export default function QuoteCard() {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchQuote = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://dummyjson.com/quotes/random');
      const data = await res.json();
      setQuote(data);
    } catch {
      setQuote({ quote: 'The secret of getting ahead is getting started.', author: 'Mark Twain' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  return (
    <div className="glass-card p-6 relative overflow-hidden" id="quote-card">
      {/* Background decoration */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-primary-500/10 to-accent-500/10 rounded-full blur-2xl" />

      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className="text-sm font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wide">
          💡 Daily Motivation
        </h3>
        <button
          onClick={fetchQuote}
          className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
          id="refresh-quote"
        >
          <FiRefreshCw className={`text-surface-400 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="h-16 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="relative z-10">
          <p className="text-base text-surface-700 dark:text-surface-200 italic leading-relaxed">
            "{quote?.quote}"
          </p>
          <p className="mt-3 text-sm font-semibold text-primary-600 dark:text-primary-400">
            — {quote?.author}
          </p>
        </div>
      )}
    </div>
  );
}
