import { Task, Priority, Status } from '../types';
import { USERS, PRIORITIES, STATUSES, TASK_GENERATE_COUNT } from './constants';

const TITLE_VERBS = [
  'Implement', 'Refactor', 'Fix', 'Update', 'Design', 'Review', 'Deploy',
  'Test', 'Migrate', 'Optimize', 'Build', 'Document', 'Integrate', 'Configure',
  'Debug', 'Analyze', 'Create', 'Remove', 'Add', 'Improve', 'Audit', 'Scaffold',
  'Validate', 'Monitor', 'Extend',
];

const TITLE_NOUNS = [
  'authentication flow', 'main dashboard', 'REST API endpoint', 'database schema',
  'UI component library', 'notification system', 'payment gateway', 'user profile page',
  'full-text search', 'caching layer', 'logging service', 'email templates',
  'routing middleware', 'data pipeline', 'form validation', 'error boundary',
  'performance metrics', 'access control', 'file upload handler', 'batch processor',
  'WebSocket integration', 'dark mode support', 'onboarding flow', 'admin panel',
  'analytics tracker', 'rate limiter', 'CI/CD pipeline', 'unit test suite',
  'API documentation', 'mobile responsiveness', 'i18n translations', 'SEO metadata',
  'image optimization', 'token refresh logic', 'CSV export feature',
];

function rnd<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function rndInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function toISODate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function generateTasks(count: number = TASK_GENERATE_COUNT): Task[] {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const tasks: Task[] = [];

  for (let i = 0; i < count; i++) {
    const hasStartDate = Math.random() > 0.15; // 85% have a start date
    const dueOffset = rndInt(-14, 60);          // some overdue, most future
    const dueDate = addDays(now, dueOffset);
    const startDate = hasStartDate ? addDays(dueDate, -rndInt(1, 18)) : null;

    tasks.push({
      id:         `task-${i}`,
      title:      `${rnd(TITLE_VERBS)} ${rnd(TITLE_NOUNS)}`,
      status:     rnd(STATUSES) as Status,
      priority:   rnd(PRIORITIES) as Priority,
      assigneeId: rnd(USERS).id,
      dueDate:    toISODate(dueDate),
      startDate:  startDate ? toISODate(startDate) : null,
    });
  }

  // Guarantee some edge cases
  // - A few tasks due exactly today
  for (let i = 0; i < 5; i++) {
    tasks[i].dueDate = toISODate(now);
  }
  // - A few tasks overdue by more than 7 days
  for (let i = 5; i < 10; i++) {
    tasks[i].dueDate = toISODate(addDays(now, -rndInt(8, 30)));
  }
  // - A few with no start date
  for (let i = 10; i < 15; i++) {
    tasks[i].startDate = null;
  }

  return tasks;
}