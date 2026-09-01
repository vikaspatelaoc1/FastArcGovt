import React, { useState, useEffect, useRef, useCallback, useLayoutEffect, RefObject } from 'react';

export interface VirtualItem {
  index: number;
  start: number;
  size: number;
}

export interface UseVirtualListOptions {
  itemCount: number;
  estimatedItemHeight?: number;
  overscan?: number;
  containerHeightFallback?: number;
}

export interface UseVirtualListReturn {
  containerRef: RefObject<HTMLDivElement | null>;
  virtualItems: VirtualItem[];
  totalHeight: number;
  startIndex: number;
  endIndex: number;
  scrollTop: number;
  containerHeight: number;
  setItemHeight: (index: number, size: number) => void;
  scrollToTop: (smooth?: boolean) => void;
  scrollToIndex: (index: number, smooth?: boolean) => void;
}

export function useVirtualList({
  itemCount,
  estimatedItemHeight = 48,
  overscan = 4,
  containerHeightFallback = 460
}: UseVirtualListOptions): UseVirtualListReturn {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(containerHeightFallback);
  const sizeMapRef = useRef<Map<number, number>>(new Map());

  // Reset or prune size map if itemCount changes significantly
  useEffect(() => {
    const map = sizeMapRef.current;
    if (map.size > itemCount + 50) {
      for (const key of map.keys()) {
        if (key >= itemCount) {
          map.delete(key);
        }
      }
    }
  }, [itemCount]);

  // Monitor container height with ResizeObserver
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateHeight = () => {
      if (el) {
        setContainerHeight(el.clientHeight || containerHeightFallback);
      }
    };

    updateHeight();

    if (typeof ResizeObserver !== 'undefined') {
      const resizeObserver = new ResizeObserver(() => {
        updateHeight();
      });
      resizeObserver.observe(el);
      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [containerHeightFallback]);

  // Track scroll with requestAnimationFrame for silky 60fps rendering
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (el) {
            setScrollTop(el.scrollTop);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', onScroll);
    };
  }, []);

  const getItemHeight = useCallback((index: number) => {
    return sizeMapRef.current.get(index) ?? estimatedItemHeight;
  }, [estimatedItemHeight]);

  const setItemHeight = useCallback((index: number, size: number) => {
    if (size > 10 && sizeMapRef.current.get(index) !== size) {
      sizeMapRef.current.set(index, size);
    }
  }, []);

  // Compute offsets and total height
  let totalHeight = 0;
  const offsets: number[] = new Array(itemCount);
  for (let i = 0; i < itemCount; i++) {
    offsets[i] = totalHeight;
    totalHeight += getItemHeight(i);
  }

  // Calculate visible range
  let startIndex = 0;
  let endIndex = itemCount;

  if (itemCount > 0) {
    // Binary search for first visible item
    let low = 0;
    let high = itemCount - 1;
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const top = offsets[mid];
      const height = getItemHeight(mid);
      if (top + height < scrollTop) {
        low = mid + 1;
      } else {
        startIndex = mid;
        high = mid - 1;
      }
    }

    startIndex = Math.max(0, startIndex - overscan);

    // Binary search for last visible item
    low = startIndex;
    high = itemCount - 1;
    endIndex = itemCount;
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const top = offsets[mid];
      if (top > scrollTop + containerHeight) {
        endIndex = mid;
        high = mid - 1;
      } else {
        low = mid + 1;
      }
    }

    endIndex = Math.min(itemCount, endIndex + overscan);
  }

  const virtualItems: VirtualItem[] = [];
  for (let i = startIndex; i < endIndex; i++) {
    virtualItems.push({
      index: i,
      start: offsets[i] !== undefined ? offsets[i] : i * estimatedItemHeight,
      size: getItemHeight(i)
    });
  }

  const scrollToTop = useCallback((smooth = true) => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: 0,
        behavior: smooth ? 'smooth' : 'auto'
      });
    }
  }, []);

  const scrollToIndex = useCallback((index: number, smooth = true) => {
    if (containerRef.current && offsets[index] !== undefined) {
      containerRef.current.scrollTo({
        top: offsets[index],
        behavior: smooth ? 'smooth' : 'auto'
      });
    }
  }, [offsets]);

  return {
    containerRef,
    virtualItems,
    totalHeight,
    startIndex,
    endIndex,
    scrollTop,
    containerHeight,
    setItemHeight,
    scrollToTop,
    scrollToIndex
  };
}
