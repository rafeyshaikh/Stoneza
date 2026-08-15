'use client';

import React, { useState } from 'react';
import { RefreshCw, Database, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function RecacheButton() {
  const [loading, setLoading] = useState(false);
  const [lastRecached, setLastRecached] = useState(null);

  const handleRecache = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();

      if (res.ok && data.success) {
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setLastRecached(time);
        toast.success(data.message || 'Database cache successfully flushed and revalidated!');
      } else {
        toast.error(data.message || 'Failed to revalidate cache');
      }
    } catch (error) {
      console.error('Recache error:', error);
      toast.error('An error occurred while flushing database cache.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-200 dark:border-stone-700/60">
      <div className="flex items-start gap-3.5">
        <div className="p-2.5 bg-stone-200/70 dark:bg-stone-700 rounded-lg text-stone-700 dark:text-stone-200 shrink-0 mt-0.5">
          <Database className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
            Database & Cache Revalidation
          </h4>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 leading-relaxed">
            Flush server-side cache tags (`layout-categories`, `products`, `cms`) and force Next.js to re-fetch live data directly from MongoDB.
          </p>
          {lastRecached && (
            <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Last flushed today at {lastRecached}</span>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={handleRecache}
        disabled={loading}
        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1C1714] hover:bg-[#9A4A2E] dark:bg-stone-200 dark:hover:bg-white text-white dark:text-[#1C1714] text-xs font-bold uppercase tracking-wider rounded-lg transition-all shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
      >
        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        <span>{loading ? 'Flushing Cache...' : 'Purge & Recache DB'}</span>
      </button>
    </div>
  );
}
