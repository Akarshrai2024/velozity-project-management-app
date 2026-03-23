import React from 'react';
import { Filters } from '../../types';
import { MultiSelect } from '../common/MultiSelect';
import { STATUSES, STATUS_LABELS, PRIORITIES, USERS } from '../../data/constants';

interface FilterBarProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  isActive: boolean;
  onClear: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  setFilters,
  isActive,
  onClear,
}) => {
  const statusOptions = STATUSES.map((s) => STATUS_LABELS[s]);
  const priorityOptions = PRIORITIES as string[];
  const assigneeOptions = USERS.map((u) => u.name);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '10px 20px',
        background: 'var(--bg2)',
        borderBottom: '1px solid var(--border)',
        flexWrap: 'wrap',
        flexShrink: 0,
      }}
    >
      <span
        style={{
          fontSize: 11,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--text3)',
        }}
      >
        Filter:
      </span>

      <MultiSelect
        label="Status"
        options={statusOptions}
        values={filters.status}
        onChange={(v) => setFilters((f) => ({ ...f, status: v }))}
      />

      <MultiSelect
        label="Priority"
        options={priorityOptions}
        values={filters.priority}
        onChange={(v) => setFilters((f) => ({ ...f, priority: v }))}
      />

      <MultiSelect
        label="Assignee"
        options={assigneeOptions}
        values={filters.assignee}
        onChange={(v) => setFilters((f) => ({ ...f, assignee: v }))}
      />

      {/* Date range */}
      <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text3)' }}>
        From:
        <input
          type="date"
          value={filters.dateFrom}
          onChange={(e) => setFilters((f) => ({ ...f, dateFrom: e.target.value }))}
          style={{
            background: 'var(--bg3)',
            border: '1px solid var(--border)',
            color: 'var(--text2)',
            padding: '5px 8px',
            borderRadius: 'var(--radius)',
            fontSize: 12,
            outline: 'none',
            colorScheme: 'dark',
            fontFamily: 'var(--font)',
          }}
        />
      </span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text3)' }}>
        To:
        <input
          type="date"
          value={filters.dateTo}
          onChange={(e) => setFilters((f) => ({ ...f, dateTo: e.target.value }))}
          style={{
            background: 'var(--bg3)',
            border: '1px solid var(--border)',
            color: 'var(--text2)',
            padding: '5px 8px',
            borderRadius: 'var(--radius)',
            fontSize: 12,
            outline: 'none',
            colorScheme: 'dark',
            fontFamily: 'var(--font)',
          }}
        />
      </span>

      {isActive && (
        <button
          onClick={onClear}
          style={{
            padding: '5px 12px',
            borderRadius: 'var(--radius)',
            background: 'rgba(244,63,94,.1)',
            color: 'var(--red)',
            border: '1px solid rgba(244,63,94,.3)',
            fontSize: 12,
            fontWeight: 500,
            cursor: 'pointer',
            fontFamily: 'var(--font)',
            transition: 'background .2s',
          }}
        >
          ✕ Clear all
        </button>
      )}
    </div>
  );
};