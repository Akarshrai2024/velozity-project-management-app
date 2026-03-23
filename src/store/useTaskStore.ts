import { create } from 'zustand';
import { Task, Status } from '../types';
import { generateTasks } from '../data/generator';

interface TaskStore {
  tasks: Task[];
  moveTask: (taskId: string, newStatus: Status) => void;
  updateStatus: (taskId: string, status: Status) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: generateTasks(),

  moveTask: (taskId, newStatus) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, status: newStatus } : t
      ),
    })),

  updateStatus: (taskId, status) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, status } : t
      ),
    })),
}));