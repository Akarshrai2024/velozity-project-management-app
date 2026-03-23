import React, { useMemo, useState } from 'react';
import { Task, Status, SortColumn, SortDirection } from '../../types';
import { PRIORITY_ORDER, VIRTUAL_ROW_HEIGHT } from '../../data/constants';
import { useVirtualScroll } from '../../hooks/useVirtualScroll';
import { useTaskStore } from '../../store/useTaskStore';
import { ListRow, LIST_GRID } from './ListRow';

interface ListViewProps {
  tasks: Task[];
  clearFilters: () => void;
  isFilterActive: boolean;
}

interface SortState {
  col: SortColumn;
  dir: SortDirection;
}

const COLUMNS: { key: SortColumn; label: string }[] = [
  { key: 'title',    label: 'Title' },
  { key: 'status',   label: 'Status' },
  { key: 'priority', label: 'Priority' },
  { key: 'assignee', label: 'Assignee' },
  { key: 'dueDate',  label: 'Due Date' },
];

export const ListView: React.FC<ListViewProps> = ({
  tasks,
  clearFilters,
  isFilterActive,
}) => {
  const updateStatus = useTaskStore((s) => s.updateStatus);
  const [sort, setSort] = useState<SortState>({ col: 'title', dir: 'asc' });

  const toggleSort = (col: SortColumn) => {
    setSort((prev) =>
      prev.col === col
        ? { col, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
        : { col, dir: 'asc' }
    );
  };

  const sorted = useMemo(() => {
    const multiplier = sort.dir === 'asc' ? 1 : -1;
    return [...tasks].sort((a, b) => {
      let cmp = 0;
      switch (sort.col) {
        case 'title':
          cmp = a.title.localeCompare(b.title);
          break;
        case 'priority':
          cmp = (PRIORITY_ORDER[a.priority] ?? 99) - (PRIORITY_ORDER[b.priority] ?? 99);
          break;
        case 'dueDate':
          cmp = (a.dueDate ?? '').localeCompare(b.dueDate ?? '');
          break;
        case 'status':
          cmp = a.status.localeCompare(b.status);
          break;
        case 'assignee':
          cmp = a.assigneeId.localeCompare(b.assigneeId);
          break;
      }
      return cmp * multiplier;
    });
  }, [tasks, sort]);

  const { containerRef, totalHeight, startIndex, endIndex } =
    useVirtualScroll(sorted.length);

  const visibleRows = sorted.slice(startIndex, endIndex);

  return (
    <div
      style={{
        flex: 1,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        padding: 20,
        gap: 12,
      }}
    >
      <div
        style={{
          flex: 1,
          overflow: 'hidden',
          background: 'var(--bg2)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Sticky header */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: LIST_GRID,
            padding: '0 16px',
            height: 38,
            alignItems: 'center',
            borderBottom: '1px solid var(--border)',
            background: 'var(--bg2)',
            flexShrink: 0,
            gap: 8,
          }}
        >
          {COLUMNS.map(({ key, label }) => {
            const isActive = sort.col === key;
            return (
              <div
                key={key}
                onClick={() => toggleSort(key)}
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: isActive ? 'var(--accent2)' : 'var(--text3)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  userSelect: 'none',
                  whiteSpace: 'nowrap',
                  transition: 'color .15s',
                }}
              >
                {label}
                <span style={{ fontSize: 10, opacity: isActive ? 1 : 0.3 }}>
                  {isActive ? (sort.dir === 'asc' ? '↑' : '↓') : '↕'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Virtual scroll body */}
        <div
          ref={containerRef}
          style={{ flex: 1, overflowY: 'auto', position: 'relative' }}
        >
          {sorted.length === 0 ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: 220,
                gap: 14,
                color: 'var(--text3)',
              }}
            >
              <span style={{ fontSize: 36, opacity: 0.25 }}>⬚</span>
              <span style={{ fontSize: 14, color: 'var(--text2)' }}>
                No tasks match your filters
              </span>
              {isFilterActive && (
                <button
                  onClick={clearFilters}
                  style={{
                    padding: '8px 18px',
                    background: 'var(--accent)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 'var(--radius)',
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: 'pointer',
                    fontFamily: 'var(--font)',
                    transition: 'opacity .15s',
                  }}
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <div style={{ position: 'relative', height: totalHeight }}>
              {visibleRows.map((task, i) => (
                <ListRow
                  key={task.id}
                  task={task}
                  top={(startIndex + i) * VIRTUAL_ROW_HEIGHT}
                  onStatusChange={updateStatus}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>
        Showing {sorted.length} of {tasks.length} tasks ·{' '}
        Virtual scroll: {endIndex - startIndex} rows rendered of {sorted.length}
      </div>
    </div>
  );
};