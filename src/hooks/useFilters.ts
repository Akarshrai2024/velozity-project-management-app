import { useState, useEffect, useCallback } from 'react';
import { Filters, Task } from '../types';
import { parseFiltersFromURL, filtersToURL, hasActiveFilters } from '../utils';
import { STATUS_LABELS } from '../data/constants';
import { getUserById } from '../utils';

export function useFilters(tasks: Task[]) {
  const [filters, setFilters] = useState<Filters>(parseFiltersFromURL);

  // Sync to URL whenever filters change
  useEffect(() => {
    filtersToURL(filters);
  }, [filters]);

  // Restore from URL on browser back/forward
  useEffect(() => {
    const handler = () => setFilters(parseFiltersFromURL());
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({ status: [], priority: [], assignee: [], dateFrom: '', dateTo: '' });
  }, []);

  const filteredTasks = tasks.filter((t) => {
    // Status filter
    if (filters.status.length > 0) {
      const label = STATUS_LABELS[t.status];
      if (!filters.status.includes(label)) return false;
    }
    // Priority filter
    if (filters.priority.length > 0 && !filters.priority.includes(t.priority)) return false;
    // Assignee filter
    if (filters.assignee.length > 0) {
      const u = getUserById(t.assigneeId);
      if (!u || !filters.assignee.includes(u.name)) return false;
    }
    // Date range filter
    if (filters.dateFrom && t.dueDate < filters.dateFrom) return false;
    if (filters.dateTo   && t.dueDate > filters.dateTo)   return false;
    return true;
  });

  return {
    filters,
    setFilters,
    filteredTasks,
    clearFilters,
    isActive: hasActiveFilters(filters),
  };
}