import React, { useMemo, useRef } from 'react';
import { Task } from '../../types';
import { getPriorityColor } from '../../utils';
import { DAY_WIDTH_PX } from '../../data/constants';

interface TimelineViewProps {
  tasks: Task[];
}

const ROW_H = 36;

export const TimelineView: React.FC<TimelineViewProps> = ({ tasks }) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const year        = now.getFullYear();
  const month       = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthStart  = new Date(year, month, 1);

  const bodyScrollRef = useRef<HTMLDivElement>(null);
  const headerScrollRef = useRef<HTMLDivElement>(null);

  // Sync horizontal scroll between header and body
  const handleBodyScroll = () => {
    if (headerScrollRef.current && bodyScrollRef.current) {
      headerScrollRef.current.scrollLeft = bodyScrollRef.current.scrollLeft;
    }
  };

  // Only show tasks due within the current month
  const visible = useMemo(() => {
    const monthEnd = new Date(year, month + 1, 0);
    return tasks
      .filter((t) => {
        if (!t.dueDate) return false;
        const due = new Date(t.dueDate);
        return due >= monthStart && due <= monthEnd;
      })
      .slice(0, 100);
  }, [tasks, monthStart]);

  const todayOffset = (now.getDate() - 1) * DAY_WIDTH_PX + DAY_WIDTH_PX / 2;
  const totalWidth  = daysInMonth * DAY_WIDTH_PX;

  const getBar = (task: Task) => {
    const due   = new Date(task.dueDate);
    due.setHours(0, 0, 0, 0);
    const start = task.startDate ? new Date(task.startDate) : due;
    start.setHours(0, 0, 0, 0);

    const startDay = Math.max(0, Math.floor((start.getTime() - monthStart.getTime()) / 86_400_000));
    const endDay   = Math.min(daysInMonth - 1, Math.floor((due.getTime() - monthStart.getTime()) / 86_400_000));

    const left  = startDay * DAY_WIDTH_PX + 2;
    const width = Math.max(DAY_WIDTH_PX - 4, (endDay - startDay + 1) * DAY_WIDTH_PX - 4);
    return { left, width };
  };

  const monthLabel = now.toLocaleString('default', { month: 'long', year: 'numeric' });
  const LABEL_W = 200;

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
        {/* ── Header row ── */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--border)',
            flexShrink: 0,
            height: 40,
          }}
        >
          {/* Month label cell */}
          <div
            style={{
              width: LABEL_W,
              flexShrink: 0,
              borderRight: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              padding: '0 14px',
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--text2)',
            }}
          >
            {monthLabel}
          </div>

          {/* Day numbers — synced scroll */}
          <div
            ref={headerScrollRef}
            style={{
              flex: 1,
              overflowX: 'hidden',
              overflowY: 'hidden',
            }}
          >
            <div
              style={{
                display: 'flex',
                width: totalWidth,
                height: 40,
                alignItems: 'center',
              }}
            >
              {Array.from({ length: daysInMonth }, (_, i) => {
                const dayNum  = i + 1;
                const isToday = dayNum === now.getDate();
                return (
                  <div
                    key={i}
                    style={{
                      flexShrink: 0,
                      width: DAY_WIDTH_PX,
                      textAlign: 'center',
                      fontSize: 10,
                      fontFamily: 'var(--mono)',
                      color: isToday ? 'var(--accent2)' : 'var(--text3)',
                      fontWeight: isToday ? 700 : 400,
                      borderRight: '1px solid var(--border)',
                    }}
                  >
                    {dayNum}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Body: labels + chart ── */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
          {/* Task name labels */}
          <div
            style={{
              width: LABEL_W,
              flexShrink: 0,
              borderRight: '1px solid var(--border)',
              overflowY: 'hidden',
            }}
          >
            {visible.map((task) => (
              <div
                key={task.id}
                style={{
                  height: ROW_H,
                  padding: '0 12px',
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: 12,
                  color: 'var(--text2)',
                  borderBottom: '1px solid var(--border)',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  flexShrink: 0,
                }}
                title={task.title}
              >
                {task.title}
              </div>
            ))}
          </div>

          {/* Chart area — horizontally scrollable */}
          <div
            ref={bodyScrollRef}
            onScroll={handleBodyScroll}
            style={{ flex: 1, overflowX: 'auto', overflowY: 'auto', position: 'relative' }}
          >
            <div style={{ position: 'relative', width: totalWidth, minHeight: '100%' }}>
              {/* Today vertical line */}
              <div
                style={{
                  position: 'absolute',
                  left: todayOffset,
                  top: 0,
                  bottom: 0,
                  width: 2,
                  background: 'var(--accent)',
                  opacity: 0.85,
                  zIndex: 10,
                  pointerEvents: 'none',
                }}
              />

              {/* Day grid lines */}
              {Array.from({ length: daysInMonth }, (_, i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: (i + 1) * DAY_WIDTH_PX - 1,
                    top: 0,
                    bottom: 0,
                    width: 1,
                    background: 'var(--border)',
                    opacity: 0.4,
                  }}
                />
              ))}

              {/* Task bars */}
              {visible.map((task, rowIndex) => {
                const { left, width } = getBar(task);
                const color = getPriorityColor(task.priority);
                const isAlt = rowIndex % 2 === 1;
                return (
                  <div
                    key={task.id}
                    style={{
                      position: 'relative',
                      height: ROW_H,
                      background: isAlt ? 'rgba(255,255,255,.012)' : 'transparent',
                      borderBottom: '1px solid var(--border)',
                    }}
                  >
                    <div
                      title={`${task.title} — ${task.priority}`}
                      style={{
                        position: 'absolute',
                        left,
                        width,
                        top: 7,
                        height: 22,
                        borderRadius: 4,
                        background: `${color}28`,
                        border: `1px solid ${color}60`,
                        color,
                        fontSize: 10,
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0 6px',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        cursor: 'pointer',
                        transition: 'opacity .15s',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLDivElement).style.opacity = '0.75';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLDivElement).style.opacity = '1';
                      }}
                    >
                      {width > 60 ? task.title.slice(0, 22) : ''}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Legend / stats */}
      <div
        style={{
          display: 'flex',
          gap: 20,
          alignItems: 'center',
          fontSize: 11,
          color: 'var(--text3)',
          fontFamily: 'var(--mono)',
        }}
      >
        <span>
          {visible.length} tasks in {monthLabel}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span
            style={{
              display: 'inline-block',
              width: 2,
              height: 12,
              background: 'var(--accent)',
              borderRadius: 1,
            }}
          />
          Today
        </span>
        {(['Critical', 'High', 'Medium', 'Low'] as const).map((p) => (
          <span key={p} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span
              style={{
                display: 'inline-block',
                width: 10,
                height: 10,
                borderRadius: 2,
                background: `${getPriorityColor(p)}30`,
                border: `1px solid ${getPriorityColor(p)}60`,
              }}
            />
            {p}
          </span>
        ))}
      </div>
    </div>
  );
};