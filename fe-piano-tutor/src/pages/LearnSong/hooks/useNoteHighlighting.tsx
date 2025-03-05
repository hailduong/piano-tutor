// src/pages/LearnSong/hooks/useNoteHighlighting.tsx
import { useRef, useEffect } from 'react';

interface NotePosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface UseNoteHighlightingResult {
  highlightRef: React.RefObject<HTMLDivElement>;
  nextHighlightRef: React.RefObject<HTMLDivElement>;
  updateHighlightPosition: (
    currentNote: string | null,
    notePositions: Map<string, NotePosition>,
    scrollContainerRef: React.RefObject<HTMLDivElement>
  ) => void;
  updateNextHighlightPosition: (
    nextNote: string | null,
    notePositions: Map<string, NotePosition>
  ) => void;
}

export const useNoteHighlighting = (): UseNoteHighlightingResult => {
  const highlightRef = useRef<HTMLDivElement>(null);
  const nextHighlightRef = useRef<HTMLDivElement>(null);

  // Update the highlight position based on current note
  const updateHighlightPosition = (
    currentNote: string | null,
    notePositions: Map<string, NotePosition>,
    scrollContainerRef: React.RefObject<HTMLDivElement>
  ) => {
    if (!currentNote || !highlightRef.current || !notePositions.has(currentNote)) return;

    const position = notePositions.get(currentNote);
    if (position) {
      highlightRef.current.style.left = `${position.x - 5}px`;
      highlightRef.current.style.top = `${position.y - 5}px`;
      highlightRef.current.style.width = `${position.width + 10}px`;
      highlightRef.current.style.height = `${position.height + 10}px`;

      // Scroll to the current note if it's not fully visible
      if (scrollContainerRef.current) {
        const scrollLeft = scrollContainerRef.current.scrollLeft;
        const containerWidth = scrollContainerRef.current.clientWidth;

        if (position.x < scrollLeft || position.x + position.width > scrollLeft + containerWidth) {
          scrollContainerRef.current.scrollTo({
            left: position.x - 50,
            behavior: 'smooth'
          });
        }
      }
    }
  };

  // Update the next highlight position
  const updateNextHighlightPosition = (
    nextNote: string | null,
    notePositions: Map<string, NotePosition>
  ) => {
    if (!nextNote || !nextHighlightRef.current || !notePositions.has(nextNote)) return;

    const position = notePositions.get(nextNote);
    if (position) {
      nextHighlightRef.current.style.left = `${position.x - 5}px`;
      nextHighlightRef.current.style.top = `${position.y - 5}px`;
      nextHighlightRef.current.style.width = `${position.width + 10}px`;
      nextHighlightRef.current.style.height = `${position.height + 10}px`;
    }
  };

  return {
    highlightRef,
    nextHighlightRef,
    updateHighlightPosition,
    updateNextHighlightPosition
  };
};
