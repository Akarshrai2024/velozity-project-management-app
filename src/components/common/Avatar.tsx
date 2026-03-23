import React from 'react';

interface AvatarProps {
  initials: string;
  color: string;
  size?: number;
  border?: string;
  title?: string;
  style?: React.CSSProperties;
}

export const Avatar: React.FC<AvatarProps> = ({
  initials,
  color,
  size = 26,
  border,
  title,
  style,
}) => (
  <div
    title={title}
    style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: `${color}30`,
      border: border ?? `2px solid ${color}66`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: size * 0.36,
      fontWeight: 700,
      color,
      flexShrink: 0,
      userSelect: 'none',
      ...style,
    }}
  >
    {initials}
  </div>
);