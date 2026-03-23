import React from 'react';
import { DragState } from '../../types';
import { TaskCard } from './TaskCard';

interface DragGhostProps {
  dragState: DragState;
}

export const DragGhost: React.FC<DragGhostProps> = ({ dragState }) => {
  const { task, ghostPos, snapBack } = dragState;
  if (!task) return null;

  return (
    <div
      style={{
        position: 'fixed',
        left: ghostPos.x,
        top: ghostPos.y,
        width: ghostPos.w,
        zIndex: 9999,
        pointerEvents: 'none',
        opacity: snapBack ? 0 : 0.88,
        transform: snapBack
          ? 'scale(0.94) rotate(0deg)'
          : 'scale(1.03) rotate(1.2deg)',
        boxShadow: '0 20px 60px rgba(0,0,0,.75)',
        borderRadius: 'var(--radius)',
        transition: snapBack ? 'all .38s cubic-bezier(.4,0,.2,1)' : 'none',
      }}
    >
      <TaskCard
        task={task}
        presenceUsers={[]}
        onDragStart={() => {}}
        onDragEnd={() => {}}
        onTouchStart={() => {}}
      />
    </div>
  );
};