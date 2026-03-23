import React from 'react';
import { Priority } from '../../types';
import { getPriorityColor } from '../../utils';

interface Props {
  priority: Priority;
}

export const PriorityBadge: React.FC<Props> = ({ priority }) => {
  const color = getPriorityColor(priority);
  return (
    <span
      style={{
        padding: '2px 8px',
        borderRadius: 20,
        fontSize: 10,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        background: `${color}18`,
        color,
        border: `1px solid ${color}40`,
        flexShrink: 0,
        whiteSpace: 'nowrap',
      }}
    >
      {priority}
    </span>
  );
};