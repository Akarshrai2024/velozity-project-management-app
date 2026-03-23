import { FormattedDue, Priority, User } from '../types';
import { USERS, PRIORITY_COLORS } from '../data/constants';
import { Filters } from '../types';

export function getUserById(id: string): User | undefined {
  return USERS.find(u => u.id === id);
}

export function formatDue(dateStr: string | null | undefined): FormattedDue | null {
  if (!dateStr) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dateStr);
  due.setHours(0, 0, 0, 0);
  const diffMs = today.getTime() - due.getTime();
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffDays === 0)  return { label: 'Due Today', cls: 'due-today' };
  if (diffDays > 7)   return { label: `${diffDays}d overdue`, cls: 'due-overdue' };
  if (diffDays > 0)   return { label: `${diffDays}d ago`, cls: 'due-overdue' };

  // Future
  const d = new Date(dateStr);
  return {
    label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    cls: '',
  };
}

export function getPriorityClass(p: Priority): string {
  return {
    Critical: 'prio-critical',
    High:     'prio-high',
    Medium:   'prio-medium',
    Low:      'prio-low',
  }[p] ?? '';
}

export function getPriorityColor(p: Priority): string {
  return PRIORITY_COLORS[p] ?? '#888';
}

// ── URL state helpers ────────────────────────────────────────────────────────


export function parseFiltersFromURL(): Filters {
  try {
    const p = new URLSearchParams(window.location.search);
    return {
      status:   p.get('status')   ? p.get('status')!.split(',')   : [],
      priority: p.get('priority') ? p.get('priority')!.split(',') : [],
      assignee: p.get('assignee') ? p.get('assignee')!.split(',') : [],
      dateFrom: p.get('dateFrom') ?? '',
      dateTo:   p.get('dateTo')   ?? '',
    };
  } catch {
    return { status: [], priority: [], assignee: [], dateFrom: '', dateTo: '' };
  }
}

export function filtersToURL(filters: Filters): void {
  const p = new URLSearchParams();
  if (filters.status.length)   p.set('status',   filters.status.join(','));
  if (filters.priority.length) p.set('priority', filters.priority.join(','));
  if (filters.assignee.length) p.set('assignee', filters.assignee.join(','));
  if (filters.dateFrom)        p.set('dateFrom', filters.dateFrom);
  if (filters.dateTo)          p.set('dateTo',   filters.dateTo);
  const qs = p.toString();
  window.history.replaceState(null, '', qs ? `?${qs}` : window.location.pathname);
}

export function hasActiveFilters(filters: Filters): boolean {
  return (
    filters.status.length > 0 ||
    filters.priority.length > 0 ||
    filters.assignee.length > 0 ||
    !!filters.dateFrom ||
    !!filters.dateTo
  );
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}