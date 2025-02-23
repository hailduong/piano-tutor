import { useEffect, useRef, useState, FC } from 'react';
import Vex, { Voice, Formatter } from 'vexflow';
import styled, { keyframes } from 'styled-components';

// Keyframes for scrolling animation
const scrollAnimation = keyframes`
    from {
        transform: translateX(0);
    }
    to {
        transform: translateX(-100%);
    }
`;

// Container for the overall music sheet (with overflow hidden)
const MusicContainer = styled.div`
  background-color: white;
  padding: 10px;
  border: 1px solid #ccc;
  overflow: hidden;
  width: 100%; /* Fixed viewport width */
  position: relative;
`;

// Inner container that holds the rendered SVG and scrolls continuously
const ScrollingContainer = styled.div`
  display: inline-block;
  /* The width should match or exceed the rendered SVG width */
  width: 3600px;
  animation: ${scrollAnimation} 30s linear infinite;
`;

interface SheetMusicRendererProps {
  notes: Vex.StaveNote[];
  onNotePlayed: (noteName: string) => void;
}

const NUMBER_OF_NOTES = 100;

const SheetMusicRenderer: FC<SheetMusicRendererProps> = (props) => {
  const { notes, onNotePlayed } = props;
  const musicRef = useRef<HTMLDivElement>(null);
  const [highlightedNote, setHighlightedNote] = useState<string | null>(null);

  // Initialize MIDI input
  const initMidi = async () => {
    if (navigator.requestMIDIAccess) {
      const midiAccess = await navigator.requestMIDIAccess();
      midiAccess.inputs.forEach((input) => {
        input.onmidimessage = (message) => handleMidiMessage(message);
      });
    } else {
      console.error('Web MIDI API is not supported.');
    }
  };

  // Handle MIDI messages and highlight notes
  const handleMidiMessage = (message: any) => {
    const [command, note] = message.data;
    if (command === 144) { // Note On
      const noteName = getNoteName(note);
      console.log('Note name:', noteName);
      setHighlightedNote(noteName);
      onNotePlayed(noteName);
    }
  };

  // Convert MIDI note number to note name (e.g., "c/4")
  const getNoteName = (midiNumber: number): string => {
    const octave = Math.floor(midiNumber / 12) - 1;
    const noteNames = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'];
    const note = noteNames[midiNumber % 12];
    return `${note}/${octave}`;
  };

  // Highlight the notes that match the MIDI input
  const renderSheetMusic = (notes: Vex.StaveNote[], context: Vex.RenderContext, stave: Vex.Stave) => {
    notes.forEach((note) => {
      if (highlightedNote === note.getKeys()[0].toLowerCase()) {
        note.setStyle({ fillStyle: 'green' });
      } else {
        note.setStyle({ fillStyle: 'black' });
      }
    });
  };

  const clearMusicSheet = () => {
    if (musicRef.current) {
      musicRef.current.innerHTML = ''; // Clear previous SVG content
    }
  };

  useEffect(() => {
    initMidi();

    if (musicRef.current) {
      clearMusicSheet();
      const VF = Vex.Flow;
      // Render inside our scrolling container
      const renderer = new VF.Renderer(musicRef.current, VF.Renderer.Backends.SVG);
      renderer.resize(3600, 200);
      const context = renderer.getContext();

      const stave: Vex.Stave = new VF.Stave(10, 40, 3600);
      stave.addClef('treble');
      stave.setContext(context).draw();

      const voice = new Voice({ num_beats: NUMBER_OF_NOTES, beat_value: 4 });
      voice.addTickables(notes);
      new Formatter().joinVoices([voice]).format([voice], 3500);
      voice.draw(context, stave);
      renderSheetMusic(notes, context, stave);
    }
  }, [notes, highlightedNote]);

  return (
    <MusicContainer>
      <ScrollingContainer ref={musicRef} />
    </MusicContainer>
  );
};

export default SheetMusicRenderer;
