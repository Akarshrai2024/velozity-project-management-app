import React from 'react';
import { PresenceMap } from '../../types';
import { getActiveSimUsers } from '../../hooks/usePresence';
import { Avatar } from './Avatar';

interface PresenceBarProps {
  presenceMap: PresenceMap;
}

export const PresenceBar: React.FC<PresenceBarProps> = ({ presenceMap }) => {
  const active = getActiveSimUsers(presenceMap);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        marginLeft: 'auto',
      }}
    >
      {/* Stacked avatars */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {active.slice(0, 4).map((u, i) => (
          <Avatar
            key={u.id}
            initials={u.initials[0]}
            color={u.color}
            size={26}
            title={`${u.name} is viewing`}
            style={{
              marginLeft: i === 0 ? 0 : -8,
              border: `2px solid var(--bg2)`,
              zIndex: active.length - i,
              transition: 'transform .3s ease',
            }}
          />
        ))}
      </div>

      {/* Count label */}
      <span
        style={{
          fontSize: 12,
          color: 'var(--text2)',
          whiteSpace: 'nowrap',
        }}
      >
        {active.length} viewing
      </span>

      {/* Pulsing dot */}
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: '50%',
          background: 'var(--green)',
          flexShrink: 0,
          boxShadow: '0 0 0 0 rgba(34,211,160,.4)',
          animation: 'pulse 2s infinite',
        }}
      />
    </div>
  );
};