import React from 'react';
import { Task, SimUser } from '../../types';
import { getUserById, formatDue } from '../../utils';
import { PriorityBadge } from '../common/PriorityBadge';
import { Avatar } from '../common/Avatar';

interface TaskCardProps {
  task: Task;
  presenceUsers: SimUser[];
  onDragStart: (e: React.DragEvent<HTMLDivElement>, task: Task) => void;
  onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
  onTouchStart: (e: React.TouchEvent<HTMLDivElement>, task: Task) => void;
  isPlaceholder?: boolean;
  placeholderHeight?: number;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  presenceUsers,
  onDragStart,
  onDragEnd,
  onTouchStart,
  isPlaceholder,
  placeholderHeight,
}) => {
  const user = getUserById(task.assigneeId);
  const due  = formatDue(task.dueDate);

  if (isPlaceholder) {
    return (
      <div
        style={{
          height: placeholderHeight ?? 80,
          border: '2px dashed var(--border2)',
          borderRadius: 'var(--radius)',
          opacity: 0.45,
          flexShrink: 0,
          transition: 'height .15s',
        }}
      />
    );
  }

  const dueColor: Record<string, string> = {
    'due-today':    'var(--yellow)',
    'due-overdue':  'var(--red)',
    '':             'var(--text3)',
    'due-normal':   'var(--text3)',
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task)}
      onDragEnd={onDragEnd}
      onTouchStart={(e) => onTouchStart(e, task)}
      style={{
        background: 'var(--bg3)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: 12,
        cursor: 'grab',
        userSelect: 'none',
        flexShrink: 0,
        transition: 'border-color .15s, background .15s',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border2)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)';
      }}
    >
      {/* Title + priority */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: 'var(--text)',
            lineHeight: 1.4,
            flex: 1,
          }}
        >
          {task.title}
        </div>
        <PriorityBadge priority={task.priority} />
      </div>

      {/* Assignee + due date */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        {user && (
          <Avatar
            initials={user.initials}
            color={user.color}
            size={22}
            title={user.name}
          />
        )}
        {due && (
          <span
            style={{
              fontSize: 11,
              fontFamily: 'var(--mono)',
              color: dueColor[due.cls] ?? 'var(--text3)',
              fontWeight: due.cls === 'due-today' ? 600 : 400,
            }}
          >
            {due.label}
          </span>
        )}
      </div>

      {/* Presence avatars */}
      {presenceUsers.length > 0 && (
        <div style={{ display: 'flex', marginTop: 8 }}>
          {presenceUsers.slice(0, 2).map((pu) => (
            <Avatar
              key={pu.id}
              initials={pu.initials[0]}
              color={pu.color}
              size={18}
              title={`${pu.name} is viewing`}
              style={{
                marginLeft: presenceUsers.indexOf(pu) === 0 ? 0 : -4,
                border: `1.5px solid ${pu.color}`,
                transition: 'transform .3s ease, opacity .3s ease',
              }}
            />
          ))}
          {presenceUsers.length > 2 && (
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: '50%',
                background: 'var(--bg4)',
                color: 'var(--text2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 8,
                fontWeight: 700,
                border: '1.5px solid var(--border2)',
                marginLeft: -4,
              }}
            >
              +{presenceUsers.length - 2}
            </div>
          )}
        </div>
      )}
    </div>
  );
};