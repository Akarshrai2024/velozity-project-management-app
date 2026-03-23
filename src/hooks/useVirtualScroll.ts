import { useState, useEffect, useRef, useCallback } from 'react';
import { VIRTUAL_ROW_HEIGHT, VIRTUAL_BUFFER_ROWS } from '../data/constants';

interface VirtualScrollReturn {
  containerRef: React.RefObject<HTMLDivElement>;
  totalHeight: number;
  startIndex: number;
  endIndex: number;
  offsetY: number;
}

export function useVirtualScroll(totalItems: number): VirtualScrollReturn {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop]     = useState(0);
  const [viewHeight, setViewHeight]   = useState(600);

  // Observe container height changes
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    setViewHeight(el.clientHeight);
    const ro = new ResizeObserver(() => setViewHeight(el.clientHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Scroll listener
  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      setScrollTop(containerRef.current.scrollTop);
    }
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const totalHeight = totalItems * VIRTUAL_ROW_HEIGHT;
  const startIndex  = Math.max(0, Math.floor(scrollTop / VIRTUAL_ROW_HEIGHT) - VIRTUAL_BUFFER_ROWS);
  const endIndex    = Math.min(
    totalItems,
    Math.ceil((scrollTop + viewHeight) / VIRTUAL_ROW_HEIGHT) + VIRTUAL_BUFFER_ROWS
  );
  const offsetY = startIndex * VIRTUAL_ROW_HEIGHT;

  return { containerRef, totalHeight, startIndex, endIndex, offsetY };
}