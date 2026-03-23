import React from 'react';
import { ViewType } from '../../types';
import { PresenceBar } from './PresenceBar';
import { PresenceMap } from '../../types';

interface TopBarProps {
  view: ViewType;
  setView: (v: ViewType) => void;
  presenceMap: PresenceMap;
}

const VIEWS: { id: ViewType; label: string }[] = [
  { id: 'kanban',   label: '⊞  Kanban' },
  { id: 'list',     label: '≡  List' },
  { id: 'timeline', label: '▬  Timeline' },
];

export const TopBar: React.FC<TopBarProps> = ({ view, setView, presenceMap }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 0,
      padding: '0 20px',
      background: 'var(--bg2)',
      borderBottom: '1px solid var(--border)',
      flexShrink: 0,
      height: 52,
    }}
  >
    {/* Logo */}
    <div
      style={{
        fontWeight: 800,
        fontSize: 16,
        letterSpacing: '0.06em',
        color: 'var(--accent2)',
        marginRight: 24,
        fontFamily: 'var(--font)',
      }}
    >
      ◈ VELOZITY
    </div>

    {/* View tabs */}
    <div style={{ display: 'flex', gap: 2 }}>
      {VIEWS.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => setView(id)}
          style={{
            padding: '6px 14px',
            fontSize: 13,
            fontWeight: 500,
            color: view === id ? 'var(--accent2)' : 'var(--text3)',
            background: view === id ? 'rgba(99,102,241,.12)' : 'transparent',
            border: 'none',
            borderRadius: 'var(--radius)',
            cursor: 'pointer',
            fontFamily: 'var(--font)',
            transition: 'all .15s',
          }}
        >
          {label}
        </button>
      ))}
    </div>

    {/* Separator */}
    <div
      style={{
        width: 1,
        height: 20,
        background: 'var(--border)',
        margin: '0 16px',
      }}
    />

    {/* Task count */}
    <span style={{ fontSize: 12, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>
      500 tasks
    </span>

    <PresenceBar presenceMap={presenceMap} />
  </div>
);