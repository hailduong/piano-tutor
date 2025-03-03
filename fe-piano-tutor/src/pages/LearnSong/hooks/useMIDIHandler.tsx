// src/hooks/useMIDIHandler.ts
import { useState, useEffect, useRef } from 'react';

interface UseMIDIHandlerResult {
  midiAccess: WebMidi.MIDIAccess | null;
  playNote: (midiNote: number, duration?: number, velocity?: number) => void;
  hasSupport: boolean;
}

export const useMIDIHandler = (): UseMIDIHandlerResult => {
  const [midiAccess, setMidiAccess] = useState<WebMidi.MIDIAccess | null>(null);
  const [hasSupport, setHasSupport] = useState<boolean>(false);

  // Initialize MIDI access
  useEffect(() => {
    if (navigator.requestMIDIAccess) {
      setHasSupport(true);
      navigator.requestMIDIAccess()
        .then((access) => {
          console.log("MIDI Access initialized:", access);
          setMidiAccess(access);
        })
        .catch((err) => console.error("Error requesting MIDI access:", err));
    } else {
      console.error("Web MIDI API is not supported in this browser.");
      setHasSupport(false);
    }
  }, []);

  // Function to play a note via MIDI
  const playNote = (midiNote: number, duration = 500, velocity = 0x7f) => {
    if (!midiAccess) return;

    midiAccess.outputs.forEach((output) => {
      // Note on message (0x90 = note on, note number, velocity)
      output.send([0x90, midiNote, velocity]);

      // Schedule note off message
      setTimeout(() => {
        output.send([0x80, midiNote, 0x00]); // Note off
      }, duration);
    });
  };

  return {
    midiAccess,
    playNote,
    hasSupport
  };
};
