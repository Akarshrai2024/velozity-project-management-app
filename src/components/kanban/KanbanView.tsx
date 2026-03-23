import React, { useMemo } from 'react';
import { Task, Status, PresenceMap } from '../../types';
import { STATUSES } from '../../data/constants';
import { useDragDrop } from '../../hooks/useDragDrop';
import { useTaskStore } from '../../store/useTaskStore';
import { KanbanColumn } from './KanbanColumn';
import { DragGhost } from './DragGhost';

interface KanbanViewProps {
  tasks: Task[];
  presenceMap: PresenceMap;
}

export const KanbanView: React.FC<KanbanViewProps> = ({ tasks, presenceMap }) => {
  const moveTask = useTaskStore((s) => s.moveTask);

  const {
    dragState,
    dragOverStatus,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleTouchStart,
  } = useDragDrop(moveTask);

  const columns = useMemo(() => {
    const map: Record<Status, Task[]> = {
      todo: [], inprogress: [], inreview: [], done: [],
    };
    tasks.forEach((t) => {
      if (map[t.status]) map[t.status].push(t);
    });
    return map;
  }, [tasks]);

  return (
    <div
      style={{
        display: 'flex',
        gap: 16,
        padding: 20,
        overflowX: 'auto',
        flex: 1,
        alignItems: 'flex-start',
      }}
    >
      {STATUSES.map((status) => (
        <KanbanColumn
          key={status}
          status={status}
          tasks={columns[status]}
          presenceMap={presenceMap}
          dragState={dragState}
          dragOverStatus={dragOverStatus}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onTouchStart={handleTouchStart}
        />
      ))}
      <DragGhost dragState={dragState} />
    </div>
  );
};