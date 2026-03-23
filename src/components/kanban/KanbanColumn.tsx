import React from 'react';
import { Task, Status, SimUser, DragState } from '../../types';
import { STATUS_LABELS, COL_HEADER_COLORS } from '../../data/constants';
import { TaskCard } from './TaskCard';

interface KanbanColumnProps {
  status: Status;
  tasks: Task[];
  presenceMap: { [taskId: string]: SimUser[] };
  dragState: DragState;
  dragOverStatus: Status | null;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, task: Task) => void;
  onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>, status: Status) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, status: Status) => void;
  onTouchStart: (e: React.TouchEvent<HTMLDivElement>, task: Task) => void;
}

const EMPTY_ICONS: Record<Status, string> = {
  todo:       '○',
  inprogress: '◑',
  inreview:   '◕',
  done:       '●',
};

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  status,
  tasks,
  presenceMap,
  dragState,
  dragOverStatus,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
  onTouchStart,
}) => {
  const isDragOver = dragOverStatus === status;
  const draggingId = dragState.task?.id;

  return (
    <div
      data-col={status}
      onDragOver={(e) => onDragOver(e, status)}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, status)}
      style={{
        flex: '0 0 280px',
        background: isDragOver ? 'rgba(99,102,241,.07)' : 'var(--bg2)',
        border: `1px solid ${isDragOver ? 'var(--accent)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '100%',
        overflow: 'hidden',
        transition: 'border-color .15s, background .15s',
      }}
    >
      {/* Column header */}
      <div
        style={{
          padding: '14px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border)',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: COL_HEADER_COLORS[status],
              display: 'inline-block',
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontWeight: 600,
              fontSize: 13,
              color: COL_HEADER_COLORS[status],
            }}
          >
            {STATUS_LABELS[status]}
          </span>
        </div>
        <span
          style={{
            background: 'var(--bg4)',
            color: 'var(--text2)',
            padding: '2px 8px',
            borderRadius: 20,
            fontSize: 11,
            fontWeight: 600,
          }}
        >
          {tasks.length}
        </span>
      </div>

      {/* Cards */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: 12,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          minHeight: 60,
        }}
      >
        {tasks.length === 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '32px 16px',
              gap: 8,
              color: 'var(--text3)',
              textAlign: 'center',
            }}
          >
            <span style={{ fontSize: 28, opacity: 0.35 }}>{EMPTY_ICONS[status]}</span>
            <span style={{ fontSize: 13, fontWeight: 500 }}>No tasks here</span>
            <span style={{ fontSize: 11, opacity: 0.7 }}>Drag cards to update status</span>
          </div>
        ) : (
          tasks.map((task) =>
            draggingId === task.id ? (
              <TaskCard
                key={task.id}
                task={task}
                presenceUsers={[]}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                onTouchStart={onTouchStart}
                isPlaceholder
                placeholderHeight={dragState.ghostPos.h}
              />
            ) : (
              <TaskCard
                key={task.id}
                task={task}
                presenceUsers={presenceMap[task.id] ?? []}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                onTouchStart={onTouchStart}
              />
            )
          )
        )}
      </div>
    </div>
  );
};