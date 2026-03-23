import React from 'react';
import { Task, Status } from '../../types';
import { getUserById, formatDue } from '../../utils';
import { PriorityBadge } from '../common/PriorityBadge';
import { Avatar } from '../common/Avatar';
import { STATUSES, STATUS_LABELS, VIRTUAL_ROW_HEIGHT } from '../../data/constants';

const GRID = '2fr 1.2fr 1fr 1.4fr 1fr';

interface ListRowProps {
  task: Task;
  top: number;
  onStatusChange: (taskId: string, status: Status) => void;
}

export const ListRow: React.FC<ListRowProps> = ({ task, top, onStatusChange }) => {
  const user = getUserById(task.assigneeId);
  const due  = formatDue(task.dueDate);

  const dueColor: Record<string, string> = {
    'due-today':   'var(--yellow)',
    'due-overdue': 'var(--red)',
    '':            'var(--text3)',
    'due-normal':  'var(--text3)',
  };

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top,
        height: VIRTUAL_ROW_HEIGHT,
        display: 'grid',
        gridTemplateColumns: GRID,
        alignItems: 'center',
        padding: '0 16px',
        borderBottom: '1px solid var(--border)',
        transition: 'background .12s',
        gap: 8,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.background = 'var(--bg3)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.background = 'transparent';
      }}
    >
      {/* Title */}
      <div
        style={{
          fontSize: 13,
          fontWeight: 500,
          color: 'var(--text)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {task.title}
      </div>

      {/* Status inline dropdown */}
      <div>
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value as Status)}
          style={{
            background: 'var(--bg4)',
            border: '1px solid var(--border)',
            color: 'var(--text)',
            padding: '3px 8px',
            borderRadius: 'var(--radius)',
            fontSize: 12,
            outline: 'none',
            fontFamily: 'var(--font)',
            cursor: 'pointer',
            width: '100%',
          }}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>

      {/* Priority */}
      <div>
        <PriorityBadge priority={task.priority} />
      </div>

      {/* Assignee */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, overflow: 'hidden' }}>
        {user && (
          <Avatar initials={user.initials} color={user.color} size={20} title={user.name} />
        )}
        <span
          style={{
            fontSize: 12,
            color: 'var(--text2)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {user?.name ?? '—'}
        </span>
      </div>

      {/* Due date */}
      <div
        style={{
          fontSize: 12,
          fontFamily: 'var(--mono)',
          color: due ? dueColor[due.cls] : 'var(--text3)',
          fontWeight: due?.cls === 'due-today' ? 600 : 400,
        }}
      >
        {due?.label ?? '—'}
      </div>
    </div>
  );
};

export { GRID as LIST_GRID };