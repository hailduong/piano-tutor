// src/pages/LearnSong/hooks/useNoteTimingTracking.tsx
import { useState, useEffect } from 'react';
import { INoteTiming } from 'pages/LearnSong/types/LearnSong';
import { useDispatch } from 'react-redux';
import { recordNoteTiming } from 'store/slices/learnSongSlice';
import Vex from 'vexflow';

interface UseNoteTimingTrackingResult {
  expectedNoteTime: number | null;
  lastNoteTimestamp: number | null;
  handleNotePlay: (
    currentNote: string | null,
    vexNotes: Vex.StaveNote[],
    isPlaying: boolean,
    tempo: number,
    onNotePlay: (noteId: string, timingDeviation: number) => void,
    playNote: (midiNote: number, duration?: number, velocity?: number) => void,
    convertKeyToMIDINote: (key: string) => number
  ) => void;
  initializeTiming: (isPlaying: boolean) => void;
}

export const useNoteTimingTracking = (): UseNoteTimingTrackingResult => {
  const [expectedNoteTime, setExpectedNoteTime] = useState<number | null>(null);
  const [lastNoteTimestamp, setLastNoteTimestamp] = useState<number | null>(null);
  const dispatch = useDispatch();

  // Initialize timing when starting to play
  const initializeTiming = (isPlaying: boolean) => {
    if (isPlaying && expectedNoteTime === null) {
      setExpectedNoteTime(Date.now());
    }
  };

  // Handle note played event
  const handleNotePlay = (
    currentNote: string | null,
    vexNotes: Vex.StaveNote[],
    isPlaying: boolean,
    tempo: number,
    onNotePlay: (noteId: string, timingDeviation: number) => void,
    playNote: (midiNote: number, duration?: number, velocity?: number) => void,
    convertKeyToMIDINote: (key: string) => number
  ) => {
    if (!isPlaying || !currentNote || !expectedNoteTime) return;

    // Calculate timing
    const now = Date.now();
    const timingDeviation = now - expectedNoteTime;

    // Record note timing in Redux store
    const noteTiming: INoteTiming = {
      noteId: currentNote,
      expectedTime: expectedNoteTime,
      actualTime: now,
      isCorrect: true, // We'll assume it's correct here
      duration: 0 // This would be calculated based on note type
    };

    // dispatch(recordNoteTiming(noteTiming));

    // Notify parent component
    onNotePlay(currentNote, timingDeviation);

    // Send MIDI message
    const noteIndex = vexNotes.findIndex(note => note.getAttribute('id') === currentNote);
    if (noteIndex !== -1) {
      const key = vexNotes[noteIndex].getKeys()[0];
      const midiNote = convertKeyToMIDINote(key);
      playNote(midiNote, 500, 0x7f);
    }

    // Update expected time for next note based on tempo
    const beatDuration = 60000 / tempo;
    setExpectedNoteTime(expectedNoteTime + beatDuration);
    setLastNoteTimestamp(now);
  };

  return {
    expectedNoteTime,
    lastNoteTimestamp,
    handleNotePlay,
    initializeTiming
  };
};
