export type Priority = 'Critical' | 'High' | 'Medium' | 'Low';
export type Status = 'todo' | 'inprogress' | 'inreview' | 'done';
export type ViewType = 'kanban' | 'list' | 'timeline';
export type SortDirection = 'asc' | 'desc';
export type SortColumn = 'title' | 'priority' | 'dueDate' | 'status' | 'assignee';

export interface User {
  id: string;
  name: string;
  initials: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  status: Status;
  priority: Priority;
  assigneeId: string;
  dueDate: string;        // ISO date string YYYY-MM-DD
  startDate: string | null;
}

export interface SimUser {
  id: string;
  name: string;
  initials: string;
  color: string;
}

export interface PresenceMap {
  [taskId: string]: SimUser[];
}

export interface Filters {
  status: string[];
  priority: string[];
  assignee: string[];
  dateFrom: string;
  dateTo: string;
}

export interface SortState {
  col: SortColumn;
  dir: SortDirection;
}

export interface DragState {
  task: Task | null;
  sourceStatus: Status | null;
  ghostPos: { x: number; y: number; w: number; h: number };
  snapBack: boolean;
}

export interface FormattedDue {
  label: string;
  cls: 'due-today' | 'due-overdue' | 'due-normal' | '';
}