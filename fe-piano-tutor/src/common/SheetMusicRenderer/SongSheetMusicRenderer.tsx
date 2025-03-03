import React, { useEffect, useRef, useState, FC } from 'react';
import Vex, { Voice, Formatter } from 'vexflow';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { RootState } from 'store/store';
import { USER_CONFIG } from 'config';
import {
  TheoryAnnotation,
  TempoDisplay,
  ScrollingContainer,
  SheetMusicRendererStyled
} from 'common/SheetMusicRenderer/SheetMusicRenderer.styled';
import {
  recordNoteTiming,
  selectCurrentNote,
  selectLearnSongState,
  selectNextNote,
  setCurrentNote
} from 'store/slices/learnSongSlice';
import { INoteTiming } from 'models/LearnSong';

// Additional styled components for song sheet music
const SongSheetContainer = styled(SheetMusicRendererStyled)`
  position: relative;
  overflow-x: auto;
  overflow-y: hidden;
  width: 100%;
  height: 300px;
  background: #fff;
  border-radius: 4px;
  border: 1px solid #f0f0f0;
  padding: 16px;
`;

const NoteHighlight = styled.div<{ isActive: boolean }>`
  position: absolute;
  background-color: ${props => props.isActive ? 'rgba(76, 175, 80, 0.3)' : 'rgba(33, 150, 243, 0.1)'};
  border-radius: 4px;
  transition: all 0.3s ease;
  pointer-events: none;
`;

const ProgressOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.05);
  pointer-events: none;
`;

// Interface for SongSheetMusicRenderer props
interface ISongSheetMusicRendererProps {
  songId: string | null;
  sheetMusic: any; // This would be the parsed sheet music data
  tempo: number;
  isPlaying: boolean;
  currentPosition: number;
  onNotePlay: (noteId: string, timingDeviation: number) => void;
  highlightEnabled: boolean;
}

const SongSheetMusicRenderer: FC<ISongSheetMusicRendererProps> = ({
                                                                    songId,
                                                                    sheetMusic,
                                                                    tempo,
                                                                    isPlaying,
                                                                    currentPosition,
                                                                    onNotePlay,
                                                                    highlightEnabled
                                                                  }) => {
  /* Refs */
  const musicRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<Vex.Renderer | null>(null);
  const staveRef = useRef<Vex.Stave | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const noteElementsRef = useRef<Map<string, HTMLElement>>(new Map());
  const highlightRef = useRef<HTMLDivElement>(null);
  const nextHighlightRef = useRef<HTMLDivElement>(null);

  /* Props & Store */
  const dispatch = useDispatch();
  const learnSongState = useSelector(selectLearnSongState);
  const currentNote = useSelector(selectCurrentNote);
  const nextNote = useSelector(selectNextNote);

  /* States */
  const [vexNotes, setVexNotes] = useState<Vex.StaveNote[]>([]);
  const [notePositions, setNotePositions] = useState<Map<string, { x: number, y: number, width: number, height: number }>>(new Map());
  const [expectedNoteTime, setExpectedNoteTime] = useState<number | null>(null);
  const [lastNoteTimestamp, setLastNoteTimestamp] = useState<number | null>(null);

  /* Handlers */
  // Convert sheet music data to VexFlow notes
  const parseSheetMusic = (sheetMusicData: any): Vex.StaveNote[] => {
    // This is a placeholder implementation
    // In a real app, you'd parse MusicXML or other format to VexFlow notes
    if (!sheetMusicData || !sheetMusicData.notes) return [];

    const VF = Vex.Flow;

    return sheetMusicData.notes.map((note: any, index: number) => {
      const staveNote = new VF.StaveNote({
        keys: [`${note.pitch.step.toLowerCase()}/${note.pitch.octave}`],
        duration: note.duration || 'q',
        auto_stem: true
      });

      // Add accidentals if needed
      if (note.pitch.alter === 1) {
        staveNote.addModifier(new VF.Accidental('#'), 0);
      } else if (note.pitch.alter === -1) {
        staveNote.addModifier(new VF.Accidental('b'), 0);
      }

      // Add note ID for tracking
      staveNote.setAttribute('id', `note-${index}`);

      return staveNote;
    });
  };

  // Calculate the positions of notes for highlighting
  const calculateNotePositions = () => {
    const positions = new Map();
    noteElementsRef.current.forEach((element, noteId) => {
      const rect = element.getBoundingClientRect();
      const containerRect = scrollContainerRef.current?.getBoundingClientRect() || { left: 0, top: 0 };

      positions.set(noteId, {
        x: rect.left - containerRect.left + scrollContainerRef.current?.scrollLeft || 0,
        y: rect.top - containerRect.top,
        width: rect.width,
        height: rect.height
      });
    });
    setNotePositions(positions);
  };

  // Update the highlight position based on current note
  const updateHighlightPosition = () => {
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
  const updateNextHighlightPosition = () => {
    if (!nextNote || !nextHighlightRef.current || !notePositions.has(nextNote)) return;

    const position = notePositions.get(nextNote);
    if (position) {
      nextHighlightRef.current.style.left = `${position.x - 5}px`;
      nextHighlightRef.current.style.top = `${position.y - 5}px`;
      nextHighlightRef.current.style.width = `${position.width + 10}px`;
      nextHighlightRef.current.style.height = `${position.height + 10}px`;
    }
  };

  /* Effects */
  // Parse sheet music data when it changes
  useEffect(() => {
    if (sheetMusic) {
      const notes = parseSheetMusic(sheetMusic);
      setVexNotes(notes);
    }
  }, [sheetMusic]);

  // Initialize timing when starting to play
  useEffect(() => {
    if (isPlaying && expectedNoteTime === null) {
      setExpectedNoteTime(Date.now());
    }
  }, [isPlaying]);

  // Render sheet music with VexFlow
  useEffect(() => {
    if (!vexNotes.length || !musicRef.current) return;

    const VF = Vex.Flow;
    const staffWidth = Math.max(800, vexNotes.length * USER_CONFIG.NOTE_WIDTH);

    // Clear previous content
    while (musicRef.current.firstChild) {
      musicRef.current.removeChild(musicRef.current.firstChild);
    }

    // Create renderer
    rendererRef.current = new VF.Renderer(musicRef.current, VF.Renderer.Backends.SVG);
    rendererRef.current.resize(staffWidth, 200);

    const context = rendererRef.current.getContext();
    context.clear();

    // Create stave
    staveRef.current = new VF.Stave(10, 40, staffWidth);
    staveRef.current.addClef('treble');
    staveRef.current.setTempo({ bpm: tempo, duration: 'q' }, 0);
    staveRef.current.setContext(context).draw();

    // Add voice with notes
    if (vexNotes.length > 0) {
      const voice = new Voice({
        num_beats: vexNotes.length,
        beat_value: 4
      });

      voice.addTickables(vexNotes);
      new Formatter().joinVoices([voice]).format([voice], staffWidth - 100);
      voice.draw(context, staveRef.current);

      // Store references to note elements for highlighting
      vexNotes.forEach((note, index) => {
        const noteId = note.getAttribute('id');
        if (noteId) {
          // Find the SVG element for this note
          const noteElement = musicRef.current?.querySelector(`[id="${noteId}"]`) as HTMLElement;
          if (noteElement) {
            noteElementsRef.current.set(noteId, noteElement);
          }
        }
      });

      // Calculate note positions after rendering
      setTimeout(calculateNotePositions, 0);
    }

    // Setup for highlighting
    if (highlightEnabled) {
      updateHighlightPosition();
      updateNextHighlightPosition();
    }
  }, [vexNotes]);

  // Update highlights when current or next note changes
  useEffect(() => {
    if (highlightEnabled) {
      updateHighlightPosition();
      updateNextHighlightPosition();
    }
  }, [currentNote, nextNote, notePositions]);

  // Handle note played event through VirtualPiano
  useEffect(() => {
    if (!isPlaying || !currentNote || !expectedNoteTime) return;

    // Calculate timing
    const now = Date.now();
    const timingDeviation = now - expectedNoteTime;

    // Record note timing in Redux store
    const noteTiming: INoteTiming = {
      noteId: currentNote,
      expectedTime: expectedNoteTime,
      actualTime: now,
      isCorrect: true, // We'll assume it's correct here, but would check in a real implementation
      duration: 0 // This would be calculated based on note type
    };

    dispatch(recordNoteTiming(noteTiming));

    // Notify parent component
    onNotePlay(currentNote, timingDeviation);

    // Update expected time for next note based on tempo
    const beatDuration = 60000 / tempo;
    setExpectedNoteTime(expectedNoteTime + beatDuration);
    setLastNoteTimestamp(now);

  }, [currentNote, expectedNoteTime]);

  // Update when the position changes
  useEffect(() => {
    if (currentPosition >= 0 && currentPosition < vexNotes.length) {
      const noteId = vexNotes[currentPosition].getAttribute('id');
      if (noteId) {
        dispatch(setCurrentNote(noteId));
      }
    }
  }, [currentPosition, vexNotes]);

  /* Render */
  return (
    <SongSheetContainer>
      <TempoDisplay>♩ = {tempo}</TempoDisplay>

      <ScrollingContainer ref={scrollContainerRef}>
        <div ref={musicRef} style={{ position: 'relative' }}></div>

        {/* Current note highlight */}
        {highlightEnabled && (
          <NoteHighlight
            ref={highlightRef}
            isActive={true}
            style={{ position: 'absolute' }}
          />
        )}

        {/* Next note highlight */}
        {highlightEnabled && (
          <NoteHighlight
            ref={nextHighlightRef}
            isActive={false}
            style={{ position: 'absolute' }}
          />
        )}

        {/* Progress overlay */}
        <ProgressOverlay
          style={{
            width: `${(currentPosition / (vexNotes.length || 1)) * 100}%`
          }}
        />
      </ScrollingContainer>
    </SongSheetContainer>
  );
};

export default SongSheetMusicRenderer;
