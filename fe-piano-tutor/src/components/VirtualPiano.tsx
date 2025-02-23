import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';

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

const WhiteKey = styled.div`
    width: 40px;
    height: 150px;
    background: white;
    border: 1px solid #000;
    position: relative;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    user-select: none;
`;

const BlackKey = styled.div<{ leftOffset: number }>`
    width: 25px;
    height: 90px;
    background: black;
    position: absolute;
    left: ${({ leftOffset }) => leftOffset}px;
    top: 0;
    border: 1px solid #333;
    border-radius: 0 0 3px 3px;
    cursor: pointer;
    z-index: 2;
    user-select: none;
`;

const KeyLabel = styled.span`
    font-size: 10px;
    margin-bottom: 5px;
    pointer-events: none;
`;

// Base frequencies for the 4th octave.
const baseFrequencies: { [note: string]: number } = {
  C: 261.63,
  D: 293.66,
  E: 329.63,
  F: 349.23,
  G: 392.00,
  A: 440.00,
  B: 493.88,
  "C#": 277.18,
  "D#": 311.13,
  "F#": 369.99,
  "G#": 415.30,
  "A#": 466.16,
};

// Compute frequency for a given note and octave using A4 = 440Hz as reference.
const getFrequency = (note: string, octave: number): number => {
  const base = baseFrequencies[note];
  if (!base) return 0;
  return base * Math.pow(2, octave - 4);
};

// Define white keys for one octave (in order: C, D, E, F, G, A, B)
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

// Black key mappings within one octave, with a left offset (in pixels) relative to the octave container.
// White key width = 40px. Black keys are positioned roughly between white keys.
interface BlackKeyData {
  note: string;
  octave: number;
  left: number; // pixel offset relative to the octave container
}
const createBlackKeysForOctave = (octave: number): BlackKeyData[] => {
  return [
    { note: 'C#', octave, left: 28 }, // between C (0) and D (40)
    { note: 'D#', octave, left: 68 }, // between D (40) and E (80)
    // No black key between E and F
    { note: 'F#', octave, left: 148 }, // between F (120) and G (160)
    { note: 'G#', octave, left: 188 }, // between G (160) and A (200)
    { note: 'A#', octave, left: 228 }, // between A (200) and B (240)
  ];
};

const VirtualPiano: React.FC = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }, []);

  const playNote = (note: string, octave: number) => {
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

  // We will render three octaves: lower (3), middle (4), upper (5).
  const octaves = [3, 4, 5];

  return (
    <PianoContainer>
      {octaves.map((octave) => (
        <OctaveContainer key={octave}>
          <WhiteKeysContainer>
            {createWhiteKeysForOctave(octave).map((keyData, index) => (
              <WhiteKey
                key={`${keyData.note}${octave}`}
                onClick={() => playNote(keyData.note, octave)}
              >
                <KeyLabel>
                  {keyData.note}{octave}
                </KeyLabel>
              </WhiteKey>
            ))}
          </WhiteKeysContainer>
          {/* Render black keys */}
          {createBlackKeysForOctave(octave).map((bk) => (
            <BlackKey
              key={`${bk.note}${octave}`}
              leftOffset={bk.left}
              onClick={(e) => {
                e.stopPropagation();
                playNote(bk.note, octave);
              }}
            >
              <KeyLabel style={{ color: 'white' }}>
                {bk.note}{octave}
              </KeyLabel>
            </BlackKey>
          ))}
        </OctaveContainer>
      ))}
    </PianoContainer>
  );
};

export default VirtualPiano;
