"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface GridPosition {
  row: number;
  col: number;
  rowSpan: number;
}

interface IntelligentGridLayoutProps {
  children: React.ReactNode[];
  className?: string;
}

interface ChildWithProps extends React.ReactElement {
  props: {
    forceRotate?: boolean;
    [key: string]: any;
  };
}

export function IntelligentGridLayout({ children, className }: IntelligentGridLayoutProps) {
  const [videoOrientations, setVideoOrientations] = useState<Map<number, boolean | null>>(new Map());
  const [gridPositions, setGridPositions] = useState<Map<number, GridPosition>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);

  // Collect video orientations
  useEffect(() => {
    const collectOrientations = () => {
      if (!containerRef.current) return;

      const videos = containerRef.current.querySelectorAll('video');
      const orientations = new Map<number, boolean | null>();

      videos.forEach((video, index) => {
        if (video.videoWidth && video.videoHeight) {
          orientations.set(index, video.videoHeight > video.videoWidth);
        } else {
          orientations.set(index, null);
        }
      });

      setVideoOrientations(new Map(orientations));
    };

    collectOrientations();

    const videos = containerRef.current?.querySelectorAll('video');
    const handlers: Array<() => void> = [];

    videos?.forEach((video) => {
      const handleMetadata = () => collectOrientations();
      video.addEventListener('loadedmetadata', handleMetadata);
      video.addEventListener('loadeddata', handleMetadata);
      handlers.push(() => {
        video.removeEventListener('loadedmetadata', handleMetadata);
        video.removeEventListener('loadeddata', handleMetadata);
      });
      
      if (video.readyState >= 1) {
        collectOrientations();
      } else if (video.readyState === 0) {
        video.load();
      }
    });

    const observer = new MutationObserver(collectOrientations);
    if (containerRef.current) {
      observer.observe(containerRef.current, {
        childList: true,
        subtree: true,
      });
    }

    return () => {
      observer.disconnect();
      handlers.forEach(cleanup => cleanup());
    };
  }, [children]);

  // Intelligent arrangement algorithm for responsive grid
  useEffect(() => {
    if (children.length === 0) return;

    // Responsive column count based on screen size
    const getColumnCount = () => {
      if (typeof window !== 'undefined') {
        if (window.innerWidth < 640) return 1; // mobile: 1 column
        if (window.innerWidth < 1024) return 2; // tablet: 2 columns
        return 3; // desktop: 3 columns
      }
      return 3; // default for SSR
    };

    const COLUMNS = getColumnCount();
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    const positions = new Map<number, GridPosition>();
    
    // Build array of items with their orientations
    const items: Array<{ index: number; isPortrait: boolean | null }> = [];
    for (let i = 0; i < children.length; i++) {
      const child = children[i] as ChildWithProps;
      const forceRotate = child?.props?.children?.props?.forceRotate || false;
      const detectedOrientation = videoOrientations.get(i) ?? null;
      
      // On mobile: if forceRotate is true, treat as landscape (not portrait)
      // On tablet/desktop: show natural orientation even if forceRotate is true
      const effectiveOrientation = (forceRotate && isMobile) ? false : detectedOrientation;
      
      items.push({
        index: i,
        isPortrait: effectiveOrientation,
      });
    }

    // Track which grid cells are occupied: [row][col] = occupied
    const occupied: Map<number, Set<number>> = new Map();
    
    const isCellOccupied = (row: number, col: number): boolean => {
      const rowSet = occupied.get(row);
      return rowSet ? rowSet.has(col) : false;
    };

    const markCellsOccupied = (row: number, col: number, rowSpan: number) => {
      for (let r = row; r < row + rowSpan; r++) {
        if (!occupied.has(r)) {
          occupied.set(r, new Set());
        }
        occupied.get(r)!.add(col);
      }
    };

    const findBestPosition = (isPortrait: boolean, startRow: number): { row: number; col: number } | null => {
      const rowSpan = isPortrait ? 2 : 1;
      
      // Strategy 1: If portrait and first item, prefer column 0
      // Strategy 2: Try to fill current row from left to right
      // Strategy 3: Find earliest available position
      
      // Search from startRow onwards
      for (let row = startRow; row < startRow + 200; row++) {
        // For portraits, prefer column 0 if available
        if (isPortrait) {
          let canPlace = true;
          for (let r = row; r < row + rowSpan; r++) {
            if (isCellOccupied(r, 0)) {
              canPlace = false;
              break;
            }
          }
          if (canPlace) {
            return { row, col: 0 };
          }
        }
        
        // Try all columns
        for (let col = 0; col < COLUMNS; col++) {
          let canPlace = true;
          for (let r = row; r < row + rowSpan; r++) {
            if (isCellOccupied(r, col)) {
              canPlace = false;
              break;
            }
          }
          if (canPlace) {
            return { row, col };
          }
        }
      }
      
      return null;
    };

    let currentRow = 0;

    // Process items one by one
    items.forEach((item, itemIndex) => {
      const isPortrait = item.isPortrait === true;
      const rowSpan = isPortrait ? 2 : 1;

      // Find best position
      const position = findBestPosition(isPortrait, currentRow);
      
      if (position) {
        positions.set(item.index, {
          row: position.row,
          col: position.col,
          rowSpan: rowSpan,
        });
        
        markCellsOccupied(position.row, position.col, rowSpan);
        
        // Update currentRow: check if we can advance
        // Advance to next row if current row is completely filled
        let canAdvance = true;
        while (canAdvance) {
          const rowOccupied = Array.from({ length: COLUMNS }, (_, col) => 
            isCellOccupied(currentRow, col)
          );
          
          if (rowOccupied.every(occ => occ)) {
            // Check next row too (for portrait spanning)
            const nextRowOccupied = Array.from({ length: COLUMNS }, (_, col) => 
              isCellOccupied(currentRow + 1, col)
            );
            
            if (nextRowOccupied.every(occ => occ)) {
              currentRow += 2;
            } else {
              // If next row not fully occupied, only advance if current row is done
              currentRow += 1;
            }
          } else {
            canAdvance = false;
          }
        }
      } else {
        // Fallback: place at current row, column 0
        positions.set(item.index, {
          row: currentRow,
          col: 0,
          rowSpan: rowSpan,
        });
        markCellsOccupied(currentRow, 0, rowSpan);
        currentRow += rowSpan;
      }
    });

    setGridPositions(positions);
  }, [videoOrientations, children.length]);

  // Handle window resize for responsive columns
  useEffect(() => {
    const handleResize = () => {
      // Trigger re-calculation on resize
      setGridPositions(new Map());
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "grid gap-3 sm:gap-5 lg:gap-6 max-w-[1500px] mx-auto px-6",
        "grid-cols-1",
        "sm:grid-cols-2",
        "lg:grid-cols-3",
        className
      )}
      style={{
        gridAutoRows: 'auto', // Changed from minmax(250px, auto) to auto for tighter spacing
      }}
    >
      {children.map((child, index) => {
        const position = gridPositions.get(index);
        const reactChild = child as ChildWithProps;
        const forceRotate = reactChild?.props?.children?.props?.forceRotate || false;
        const detectedIsPortrait = videoOrientations.get(index) === true;
        
        // On mobile: if forceRotate is true, treat as landscape
        // On tablet/desktop: show natural orientation (portrait spans 2 rows)
        const isMobileView = typeof window !== 'undefined' && window.innerWidth < 640;
        const effectiveIsPortrait = (forceRotate && isMobileView) ? false : detectedIsPortrait;
        const rowSpan = effectiveIsPortrait ? 2 : 1;
        
        return (
          <div
            key={index}
            style={{
              gridColumn: position ? `${position.col + 1}` : 'auto',
              gridRow: position 
                ? `${position.row + 1} / span ${position.rowSpan}` 
                : `span ${rowSpan}`,
            }}
            className="w-full"
          >
            {child}
          </div>
        );
      })}
    </div>
  );
}
