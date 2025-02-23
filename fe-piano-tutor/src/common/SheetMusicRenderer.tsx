import { useEffect, useRef, useState, FC } from 'react';
import Vex, { Voice, Formatter } from 'vexflow';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store';
import { setSuggestedNote, incrementScore } from 'slices/musicNotesSlice';

const MusicContainer = styled.div`
    background-color: white;
    padding: 10px;
    border: 1px solid #ccc;
    overflow: hidden;
    width: 100%;
    position: relative;
`;

const ScrollingContainer = styled.div<{ offset: number }>`
    display: inline-block;
    width: 3600px;
    transform: translateX(${({ offset }) => -offset}px);
    transition: transform 0.5s ease-out;
`;

interface SheetMusicRendererProps {
  notes: Vex.StaveNote[];
  onCorrectNote: () => void; // callback to remove the first note
}

const NUMBER_OF_NOTES = 100;

const SheetMusicRenderer: FC<SheetMusicRendererProps> = ({ notes, onCorrectNote }) => {
  const musicRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const { currentNote, suggestedNote } = useSelector((state: RootState) => state.musicNotes);
  const [scrollOffset, setScrollOffset] = useState(0);

  // Clear previous rendering
  const clearMusicSheet = () => {
    if (musicRef.current) {
      musicRef.current.innerHTML = '';
    }
  };

  // Render the sheet music using VexFlow
  const renderSheetMusic = (notes: Vex.StaveNote[], context: Vex.RenderContext, stave: Vex.Stave) => {
    // For each note, adjust style based on Redux state:
    // For the expected note (first note), if a wrong key was pressed (i.e. currentNote does not match)
    // then render it in red (#f44336). Otherwise, normal black.
    notes.forEach((note, index) => {
      if (index === 0 && currentNote) {
        // Expected note is the first note
        const expectedKey = note.getKeys()[0].toLowerCase();
        const playedKey = currentNote.note.toLowerCase() + '/' + currentNote.octave;
        if (expectedKey !== playedKey) {
          note.setStyle({ fillStyle: '#f44336' });
          // Set the suggestion (if not already set)
          if (!suggestedNote) {
            // Create a suggestion Note object from the expected note.
            // For simplicity, we extract the key as stored in the stave note.
            const key = note.getKeys()[0].split('/')[0].toUpperCase();
            const octave = parseInt(note.getKeys()[0].split('/')[1]);
            dispatch(setSuggestedNote({ note: key, length: 'q', timestamp: Date.now(), octave }));
          }
        } else {
          // Correct key pressed.
          note.setStyle({ fillStyle: '#4caf50' });
        }
      } else {
        // All other notes use default color.
        note.setStyle({ fillStyle: 'black' });
      }
    });
  };

  useEffect(() => {
    if (notes.length === 0) return; // nothing to render

    clearMusicSheet();
    const VF = Vex.Flow;
    const renderer = new VF.Renderer(musicRef.current!, VF.Renderer.Backends.SVG);
    renderer.resize(3600, 200);
    const context = renderer.getContext();

    const stave = new VF.Stave(10, 40, 3600);
    stave.addClef('treble');
    stave.setContext(context).draw();

    const voice = new Voice({ num_beats: NUMBER_OF_NOTES, beat_value: 4 });
    voice.addTickables(notes);
    new Formatter().joinVoices([voice]).format([voice], 3500);
    voice.draw(context, stave);

    renderSheetMusic(notes, context, stave);
    renderSheetMusic(notes, context, stave);
  }, [notes, currentNote, suggestedNote]);

  // Effect to check if the current note is correct.
  useEffect(() => {
    if (notes.length === 0 || !currentNote) return;

    const expectedNoteKey = notes[0].getKeys()[0].toLowerCase();
    const playedNoteKey = currentNote.note.toLowerCase() + '/' + currentNote.octave;
    if (expectedNoteKey === playedNoteKey) {
      // Correct key pressed.
      // If no suggestion was active, award a point.
      if (!suggestedNote) {
        dispatch(incrementScore());
      }
      // Clear any suggestion.
      dispatch(setSuggestedNote(null));
      // Remove the note from the sheet (by calling the provided callback)
      onCorrectNote();
      // Update scroll offset (assume each note roughly takes 40px)
      setScrollOffset((prev) => prev + 40);
    }
}, [currentNote, dispatch, suggestedNote, onCorrectNote]);

  return (
    <MusicContainer>
      {notes.length}
      <ScrollingContainer offset={scrollOffset} ref={musicRef} />
    </MusicContainer>
  );
};

export default SheetMusicRenderer;
