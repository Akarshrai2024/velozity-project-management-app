import { Priority, Status, User, SimUser } from '../types';

export const USERS: User[] = [
  { id: 'u1', name: 'Alex Kim',     initials: 'AK', color: '#6366f1' },
  { id: 'u2', name: 'Sam Rivera',   initials: 'SR', color: '#22d3a0' },
  { id: 'u3', name: 'Jordan Lee',   initials: 'JL', color: '#fbbf24' },
  { id: 'u4', name: 'Morgan Chen',  initials: 'MC', color: '#f43f5e' },
  { id: 'u5', name: 'Taylor Zhao',  initials: 'TZ', color: '#fb923c' },
  { id: 'u6', name: 'Casey Park',   initials: 'CP', color: '#38bdf8' },
];

export const SIM_USERS: SimUser[] = [
  { id: 'sim1', name: 'Priya S', initials: 'PS', color: '#c084fc' },
  { id: 'sim2', name: 'Noah W',  initials: 'NW', color: '#34d399' },
  { id: 'sim3', name: 'Leila M', initials: 'LM', color: '#f97316' },
  { id: 'sim4', name: 'Eli T',   initials: 'ET', color: '#60a5fa' },
];

export const PRIORITIES: Priority[] = ['Critical', 'High', 'Medium', 'Low'];

export const STATUSES: Status[] = ['todo', 'inprogress', 'inreview', 'done'];

export const STATUS_LABELS: Record<Status, string> = {
  todo:       'To Do',
  inprogress: 'In Progress',
  inreview:   'In Review',
  done:       'Done',
};

export const PRIORITY_ORDER: Record<Priority, number> = {
  Critical: 0,
  High:     1,
  Medium:   2,
  Low:      3,
};

export const PRIORITY_COLORS: Record<Priority, string> = {
  Critical: '#f43f5e',
  High:     '#fb923c',
  Medium:   '#fbbf24',
  Low:      '#22d3a0',
};

export const COL_HEADER_COLORS: Record<Status, string> = {
  todo:       'var(--text3)',
  inprogress: 'var(--blue)',
  inreview:   'var(--yellow)',
  done:       'var(--green)',
};

export const PRESENCE_INTERVAL_MS = 3500;
export const VIRTUAL_ROW_HEIGHT = 40;
export const VIRTUAL_BUFFER_ROWS = 5;
export const DAY_WIDTH_PX = 36;
export const TASK_GENERATE_COUNT = 500;