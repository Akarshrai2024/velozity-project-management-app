import { useState, useCallback, useEffect, useRef } from 'react';
import { Task, Status, DragState } from '../types';

interface UseDragDropReturn {
  dragState: DragState;
  dragOverStatus: Status | null;
  handleDragStart: (e: React.DragEvent<HTMLDivElement>, task: Task) => void;
  handleDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>, status: Status) => void;
  handleDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>, status: Status) => void;
  handleTouchStart: (e: React.TouchEvent<HTMLDivElement>, task: Task) => void;
  onMoveTask: (taskId: string, newStatus: Status) => void;
}

export function useDragDrop(
  onMove: (taskId: string, newStatus: Status) => void
): UseDragDropReturn {
  const [dragState, setDragState] = useState<DragState>({
    task: null,
    sourceStatus: null,
    ghostPos: { x: 0, y: 0, w: 280, h: 80 },
    snapBack: false,
  });
  const [dragOverStatus, setDragOverStatus] = useState<Status | null>(null);
  const touchRef = useRef<{ task: Task; offX: number; offY: number } | null>(null);

  // ── Mouse drag ──────────────────────────────────────────────────────────
  const handleDragStart = useCallback(
    (e: React.DragEvent<HTMLDivElement>, task: Task) => {
      e.dataTransfer.effectAllowed = 'move';
      const rect = e.currentTarget.getBoundingClientRect();
      // Invisible drag image to suppress browser ghost
      const img = new Image();
      img.src =
        'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
      e.dataTransfer.setDragImage(img, 0, 0);

      setDragState({
        task,
        sourceStatus: task.status,
        ghostPos: {
          x: e.clientX - rect.width / 2,
          y: e.clientY - rect.height / 2,
          w: rect.width,
          h: rect.height,
        },
        snapBack: false,
      });
    },
    []
  );

  const handleDragEnd = useCallback(
    (_e: React.DragEvent<HTMLDivElement>) => {
      setDragState((prev) => {
        if (!prev.task) return prev;
        if (dragOverStatus && dragOverStatus !== prev.task.status) {
          onMove(prev.task.id, dragOverStatus);
          setDragOverStatus(null);
          return { task: null, sourceStatus: null, ghostPos: prev.ghostPos, snapBack: false };
        }
        // No valid drop zone → snap back
        return { ...prev, snapBack: true };
      });

      setTimeout(() => {
        setDragState((prev) => ({
          ...prev,
          task: null,
          sourceStatus: null,
          snapBack: false,
        }));
        setDragOverStatus(null);
      }, 380);
    },
    [dragOverStatus, onMove]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>, status: Status) => {
      e.preventDefault();
      setDragOverStatus(status);
    },
    []
  );

  const handleDragLeave = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      if (!e.currentTarget.contains(e.relatedTarget as Node)) {
        setDragOverStatus(null);
      }
    },
    []
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>, _status: Status) => {
      e.preventDefault();
    },
    []
  );

  // ── Ghost follows cursor ────────────────────────────────────────────────
  useEffect(() => {
    const move = (e: DragEvent) => {
      setDragState((prev) => {
        if (!prev.task) return prev;
        return {
          ...prev,
          ghostPos: {
            ...prev.ghostPos,
            x: e.clientX - prev.ghostPos.w / 2,
            y: e.clientY - prev.ghostPos.h / 2,
          },
        };
      });
    };
    document.addEventListener('dragover', move);
    return () => document.removeEventListener('dragover', move);
  }, []);

  // ── Touch drag ─────────────────────────────────────────────────────────
  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>, task: Task) => {
      const touch = e.touches[0];
      const rect = e.currentTarget.getBoundingClientRect();
      touchRef.current = {
        task,
        offX: touch.clientX - rect.left,
        offY: touch.clientY - rect.top,
      };
      setDragState({
        task,
        sourceStatus: task.status,
        ghostPos: {
          x: touch.clientX - rect.width / 2,
          y: touch.clientY - rect.height / 2,
          w: rect.width,
          h: rect.height,
        },
        snapBack: false,
      });
    },
    []
  );

  useEffect(() => {
    const move = (e: TouchEvent) => {
      if (!touchRef.current) return;
      e.preventDefault();
      const touch = e.touches[0];
      setDragState((prev) => ({
        ...prev,
        ghostPos: {
          ...prev.ghostPos,
          x: touch.clientX - prev.ghostPos.w / 2,
          y: touch.clientY - prev.ghostPos.h / 2,
        },
      }));
      const el = document.elementFromPoint(touch.clientX, touch.clientY);
      const col = el?.closest('[data-col]') as HTMLElement | null;
      if (col?.dataset.col) {
        setDragOverStatus(col.dataset.col as Status);
      }
    };

    const end = () => {
      if (!touchRef.current) return;
      const { task } = touchRef.current;
      if (dragOverStatus && dragOverStatus !== task.status) {
        onMove(task.id, dragOverStatus);
      }
      touchRef.current = null;
      setDragState({ task: null, sourceStatus: null, ghostPos: { x: 0, y: 0, w: 280, h: 80 }, snapBack: false });
      setDragOverStatus(null);
    };

    document.addEventListener('touchmove', move, { passive: false });
    document.addEventListener('touchend', end);
    return () => {
      document.removeEventListener('touchmove', move);
      document.removeEventListener('touchend', end);
    };
  }, [dragOverStatus, onMove]);

  return {
    dragState,
    dragOverStatus,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleTouchStart,
    onMoveTask: onMove,
  };
}