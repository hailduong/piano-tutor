import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store';
import { setCurrentNote } from 'slices/musicNotesSlice';

// Styled components for the piano layout
const PianoContainer = styled.div`
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 10px 0;
    background-color: #333;
    display: flex;
    justify-content: center;
    z-index: 1000;
`;

const OctaveContainer = styled.div`
    position: relative;
    margin: 0 5px;
    display: inline-block;
`;

const WhiteKeysContainer = styled.div`
    display: flex;
`;

interface KeyProps {
  active?: boolean;
  suggested?: boolean;
}

const WhiteKey = styled.div<KeyProps>`
    width: 40px;
    height: 150px;
    background: ${({ active, suggested }) =>
            active ? '#4caf50' : suggested ? '#2196F3' : 'white'};
    border: 1px solid
    ${({ active, suggested }) =>
            active ? '#4caf50' : suggested ? '#2196F3' : '#000'};
    position: relative;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    user-select: none;
    transition: background 0.2s, border 0.2s;
`;

const BlackKey = styled.div<{ leftOffset: number } & KeyProps>`
    width: 25px;
    height: 90px;
    background: ${({ active, suggested }) =>
            active ? '#4caf50' : suggested ? '#2196F3' : 'black'};
    border: 1px solid
    ${({ active, suggested }) =>
            active ? '#4caf50' : suggested ? '#2196F3' : '#333'};
    position: absolute;
    left: ${({ leftOffset }) => leftOffset}px;
    top: 0;
    border-radius: 0 0 3px 3px;
    cursor: pointer;
    z-index: 2;
    user-select: none;
    transition: background 0.2s, border 0.2s;
`;

const KeyLabel = styled.span`
    font-size: 10px;
    margin-bottom: 5px;
    pointer-events: none;
`;

// Frequency helpers (using A4 = 440Hz as reference)
const baseFrequencies: { [note: string]: number } = {
  C: 261.63,
  D: 293.66,
  E: 329.63,
  F: 349.23,
  G: 392.00,
  A: 440.00,
  B: 493.88,
  'C#': 277.18,
  'D#': 311.13,
  'F#': 369.99,
  'G#': 415.30,
  'A#': 466.16,
};

const getFrequency = (note: string, octave: number): number => {
  const base = baseFrequencies[note];
  if (!base) return 0;
  return base * Math.pow(2, octave - 4);
};

// White keys for one octave (C, D, E, F, G, A, B)
interface WhiteKeyData {
  note: string;
  octave: number;
}
const createWhiteKeysForOctave = (octave: number): WhiteKeyData[] => {
  return [
    { note: 'C', octave },
    { note: 'D', octave },
    { note: 'E', octave },
    { note: 'F', octave },
    { note: 'G', octave },
    { note: 'A', octave },
    { note: 'B', octave },
  ];
};

// Black keys within one octave (positions relative to white keys)
interface BlackKeyData {
  note: string;
  octave: number;
  left: number;
}
const createBlackKeysForOctave = (octave: number): BlackKeyData[] => {
  return [
    { note: 'C#', octave, left: 28 },
    { note: 'D#', octave, left: 68 },
    // No black key between E and F
    { note: 'F#', octave, left: 148 },
    { note: 'G#', octave, left: 188 },
    { note: 'A#', octave, left: 228 },
  ];
};

const VirtualPiano: React.FC = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const dispatch = useDispatch();
  const { currentNote, suggestedNote } = useSelector((state: RootState) => state.musicNotes);

  useEffect(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }, []);

  const playNote = (note: string, octave: number) => {
    const noteData = {
      note,
      length: 'q', // default quarter note
      timestamp: Date.now(),
      octave,
    };

    // Dispatch the note info to Redux
    dispatch(setCurrentNote(noteData));

    const frequency = getFrequency(note, octave);
    if (!frequency || !audioContextRef.current) return;

    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);

    oscillator.start();
    gainNode.gain.setValueAtTime(1, audioContextRef.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current.currentTime + 0.5);
    oscillator.stop(audioContextRef.current.currentTime + 0.5);
  };

  // Render three octaves: lower (3), middle (4), upper (5)
  const octaves = [3, 4, 5];

  return (
    <PianoContainer>
      {octaves.map((octave) => (
        <OctaveContainer key={octave}>
          <WhiteKeysContainer>
            {createWhiteKeysForOctave(octave).map((keyData) => {
              // Determine if this key should be highlighted as active or suggested
              const isActive =
                currentNote &&
                currentNote.note === keyData.note &&
                currentNote.octave === keyData.octave;
              const isSuggested =
                suggestedNote &&
                suggestedNote.note === keyData.note &&
                suggestedNote.octave === keyData.octave;
              return (
                <WhiteKey
                  key={`${keyData.note}${octave}`}
                  onClick={() => playNote(keyData.note, octave)}
                  active={isActive}
                  suggested={isSuggested}
                >
                  <KeyLabel>
                    {keyData.note}
                    {octave}
                  </KeyLabel>
                </WhiteKey>
              );
            })}
          </WhiteKeysContainer>
          {createBlackKeysForOctave(octave).map((bk) => {
            const isActive =
              currentNote &&
              currentNote.note === bk.note &&
              currentNote.octave === bk.octave;
            const isSuggested =
              suggestedNote &&
              suggestedNote.note === bk.note &&
              suggestedNote.octave === bk.octave;
            return (
              <BlackKey
                key={`${bk.note}${octave}`}
                leftOffset={bk.left}
                onClick={(e) => {
                  e.stopPropagation();
                  playNote(bk.note, octave);
                }}
                active={isActive}
                suggested={isSuggested}
              >
                <KeyLabel style={{ color: 'white' }}>
                  {bk.note}
                  {octave}
                </KeyLabel>
              </BlackKey>
            );
          })}
        </OctaveContainer>
      ))}
    </PianoContainer>
  );
};

export default VirtualPiano;
