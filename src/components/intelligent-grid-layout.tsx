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
    ratio?: "landscape" | "portrait";
    [key: string]: any;
  };
}

// Helper functions to extract props from nested React elements
const extractRatio = (child: React.ReactElement): "landscape" | "portrait" | null => {
  if (!child || !child.props) return null;
  if (child.props.ratio) return child.props.ratio;
  if (child.props.children) {
    const nestedChild = child.props.children;
    if (nestedChild && nestedChild.props && nestedChild.props.ratio) {
      return nestedChild.props.ratio;
    }
  }
  return null;
};

const extractForceRotate = (child: React.ReactElement): boolean => {
  if (!child || !child.props) return false;
  if (child.props.forceRotate !== undefined) return child.props.forceRotate;
  if (child.props.children) {
    const nestedChild = child.props.children;
    if (nestedChild && nestedChild.props && nestedChild.props.forceRotate !== undefined) {
      return nestedChild.props.forceRotate;
    }
  }
  return false;
};

export function IntelligentGridLayout({ children, className }: IntelligentGridLayoutProps) {
  const [videoOrientations, setVideoOrientations] = useState<Map<number, boolean | null>>(new Map());
  const [gridPositions, setGridPositions] = useState<Map<number, GridPosition>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  // Track screen size for desktop detection
  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(typeof window !== 'undefined' && window.innerWidth >= 1024);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Collect video orientations (fallback for mobile/tablet)
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

  // Intelligent arrangement algorithm for desktop (3x3 grid)
  useEffect(() => {
    if (children.length === 0) return;

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
    const items: Array<{ index: number; isPortrait: boolean }> = [];
    for (let i = 0; i < children.length; i++) {
      const child = children[i] as React.ReactElement;
      const forceRotate = extractForceRotate(child);
      
      // On desktop: use ratio prop if available, otherwise fallback to detected orientation
      // On mobile/tablet: use detected orientation (or forceRotate logic)
      let isPortrait: boolean;
      
      if (isDesktop && COLUMNS === 3) {
        // Desktop: use ratio prop
        const ratio = extractRatio(child);
        if (ratio === "portrait") {
          isPortrait = true;
        } else if (ratio === "landscape") {
          isPortrait = false;
        } else {
          // Fallback to detected orientation
          const detectedOrientation = videoOrientations.get(i) ?? false;
          isPortrait = detectedOrientation;
        }
      } else {
        // Mobile/Tablet: use detected orientation with forceRotate logic
        const detectedOrientation = videoOrientations.get(i) ?? false;
        isPortrait = (forceRotate && isMobile) ? false : detectedOrientation;
      }
      
      items.push({
        index: i,
        isPortrait,
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

    // Optimized algorithm for desktop 3-column grid (strict 3x3 = 3 rows max)
    if (COLUMNS === 3 && isDesktop) {
      const MAX_ROWS = 3; // Strict 3-row limit for 3x3 grid
      
      // Always place the first item (Showreel) at position 0,0 first
      if (items.length > 0 && items[0].index === 0) {
        const firstItem = items[0];
        const isPortrait = firstItem.isPortrait;
        const rowSpan = isPortrait ? 2 : 1;
        
        // Place first item at row 0, col 0
        positions.set(0, {
          row: 0,
          col: 0,
          rowSpan: rowSpan,
        });
        markCellsOccupied(0, 0, rowSpan);
      }
      
      // Separate remaining items by type for better placement strategy
      const portraitItems: Array<{ index: number; isPortrait: boolean }> = [];
      const landscapeItems: Array<{ index: number; isPortrait: boolean }> = [];
      
      // Skip first item (already placed)
      items.slice(1).forEach((item) => {
        if (item.isPortrait) {
          portraitItems.push(item);
        } else {
          landscapeItems.push(item);
        }
      });
      
      // Strategy: Place portrait videos first (they're harder to place)
      // Portrait videos can share rows if in different columns
      // Then fill remaining spaces with landscape videos
      
      // Place portrait videos
      portraitItems.forEach((item) => {
        let placed = false;
        
        // Try to place portrait video in rows 0-1 first (fits within 3-row limit)
        for (let col = 0; col < COLUMNS && !placed; col++) {
          // Check if rows 0-1 are free in this column
          if (!isCellOccupied(0, col) && !isCellOccupied(1, col)) {
            positions.set(item.index, {
              row: 0,
              col: col,
              rowSpan: 2,
            });
            markCellsOccupied(0, col, 2);
            placed = true;
          }
        }
        
        // If rows 0-1 are full, try rows 1-2 (still within 3-row limit)
        if (!placed) {
          for (let col = 0; col < COLUMNS && !placed; col++) {
            // Check if rows 1-2 are free in this column
            if (!isCellOccupied(1, col) && !isCellOccupied(2, col)) {
              positions.set(item.index, {
                row: 1,
                col: col,
                rowSpan: 2,
              });
              markCellsOccupied(1, col, 2);
              placed = true;
            }
          }
        }
        
        // If still not placed, it exceeds 3-row limit - place anyway (will be hidden by show more)
        if (!placed) {
          // Find any available 2-row space
          for (let row = 0; row < MAX_ROWS - 1 && !placed; row++) {
            for (let col = 0; col < COLUMNS && !placed; col++) {
              if (!isCellOccupied(row, col) && !isCellOccupied(row + 1, col)) {
                positions.set(item.index, {
                  row: row,
                  col: col,
                  rowSpan: 2,
                });
                markCellsOccupied(row, col, 2);
                placed = true;
              }
            }
          }
        }
      });
      
      // Place landscape videos - fill remaining spaces row by row, left to right
      landscapeItems.forEach((item) => {
        let placed = false;
        
        // Fill rows 0, 1, 2 in order, left to right
        for (let row = 0; row < MAX_ROWS && !placed; row++) {
          for (let col = 0; col < COLUMNS && !placed; col++) {
            if (!isCellOccupied(row, col)) {
              positions.set(item.index, {
                row: row,
                col: col,
                rowSpan: 1,
              });
              markCellsOccupied(row, col, 1);
              placed = true;
            }
          }
        }
        
        // If not placed within 3 rows, place in next available row (will be hidden)
        if (!placed) {
          for (let row = MAX_ROWS; row < 100 && !placed; row++) {
            for (let col = 0; col < COLUMNS && !placed; col++) {
              if (!isCellOccupied(row, col)) {
                positions.set(item.index, {
                  row: row,
                  col: col,
                  rowSpan: 1,
                });
                markCellsOccupied(row, col, 1);
                placed = true;
              }
            }
          }
        }
      });
    } else {
      // Mobile/Tablet algorithm (simpler)
      let currentRow = 0;
      
      items.forEach((item) => {
        const isPortrait = item.isPortrait;
        const rowSpan = isPortrait ? 2 : 1;
        
        // Find best position
        let placed = false;
        for (let row = currentRow; row < currentRow + 200 && !placed; row++) {
          // For portraits on mobile/tablet, prefer column 0
          if (isPortrait && COLUMNS > 1) {
            let canPlace = true;
            for (let r = row; r < row + rowSpan; r++) {
              if (isCellOccupied(r, 0)) {
                canPlace = false;
                break;
              }
            }
            if (canPlace) {
              positions.set(item.index, {
                row: row,
                col: 0,
                rowSpan: rowSpan,
              });
              markCellsOccupied(row, 0, rowSpan);
              placed = true;
              currentRow = row + rowSpan;
            }
          }
          
          // Try all columns
          if (!placed) {
            for (let col = 0; col < COLUMNS; col++) {
              let canPlace = true;
              for (let r = row; r < row + rowSpan; r++) {
                if (isCellOccupied(r, col)) {
                  canPlace = false;
                  break;
                }
              }
              if (canPlace) {
                positions.set(item.index, {
                  row: row,
                  col: col,
                  rowSpan: rowSpan,
                });
                markCellsOccupied(row, col, rowSpan);
                placed = true;
                
                // Update currentRow
                let canAdvance = true;
                let checkRow = row;
                while (canAdvance) {
                  const rowOccupied = Array.from({ length: COLUMNS }, (_, c) => 
                    isCellOccupied(checkRow, c)
                  );
                  
                  if (rowOccupied.every(occ => occ)) {
                    checkRow += 1;
                  } else {
                    canAdvance = false;
                  }
                }
                currentRow = checkRow;
                break;
              }
            }
          }
        }
        
        // Fallback
        if (!placed) {
          positions.set(item.index, {
            row: currentRow,
            col: 0,
            rowSpan: rowSpan,
          });
          markCellsOccupied(currentRow, 0, rowSpan);
          currentRow += rowSpan;
        }
      });
    }

    setGridPositions(positions);
  }, [videoOrientations, children.length, isDesktop]);

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
        gridAutoRows: 'auto',
      }}
    >
      {children.map((child, index) => {
        const position = gridPositions.get(index);
        const reactChild = child as React.ReactElement;
        
        const ratio = extractRatio(reactChild);
        const forceRotate = extractForceRotate(reactChild);
        const detectedIsPortrait = videoOrientations.get(index) === true;
        
        // Determine row span based on ratio (desktop) or detected orientation (mobile/tablet)
        const isMobileView = typeof window !== 'undefined' && window.innerWidth < 640;
        let rowSpan: number;
        
        if (isDesktop && typeof window !== 'undefined' && window.innerWidth >= 1024) {
          // Desktop: use ratio prop
          rowSpan = ratio === "portrait" ? 2 : 1;
        } else {
          // Mobile/Tablet: use detected orientation
          const effectiveIsPortrait = (forceRotate && isMobileView) ? false : detectedIsPortrait;
          rowSpan = effectiveIsPortrait ? 2 : 1;
        }
        
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
