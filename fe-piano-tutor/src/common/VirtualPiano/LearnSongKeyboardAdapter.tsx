import React, { FC, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectLearnSongState, setCurrentNote, selectCurrentNote, selectNextNote } from 'store/slices/learnSongSlice';

interface ILearnSongKeyboardAdapterProps {
  children: React.ReactNode;
}

/**
 * This component connects the VirtualPiano to the LearnSong feature
 * It doesn't render anything itself, but provides the connection logic
 */
const LearnSongKeyboardAdapter: FC<ILearnSongKeyboardAdapterProps> = ({ children }) => {
  /* Props & Store */
  const dispatch = useDispatch();
  const learnSongState = useSelector(selectLearnSongState);
  const currentNote = useSelector(selectCurrentNote);
  const nextNote = useSelector(selectNextNote);

  /* Effects */
  // Subscribe to MIDI events and map them to note playing
  useEffect(() => {
    // Only attach listeners when we're in a learning session
    if (!learnSongState.songId || !learnSongState.isPlaying) return;

    // Function to handle keyboard/MIDI input
    const handleNoteInput = (event: CustomEvent) => {
      const { note, octave } = event.detail;

      if (learnSongState.sheetMusic && learnSongState.isPlaying) {
        // Convert the played note to the format expected by our state
        const noteId = `${note.toLowerCase()}/${octave}`;

        // Update the current note in the learning state
        dispatch(setCurrentNote(noteId));
      }
    };

    // Add event listener for custom note events from the virtual piano
    window.addEventListener('pianoNotePressed' as any, handleNoteInput);

    // Cleanup
    return () => {
      window.removeEventListener('pianoNotePressed' as any, handleNoteInput);
    };
  }, [learnSongState.songId, learnSongState.isPlaying, dispatch]);

  // Pass data to the VirtualPiano via custom props
  const childrenWithProps = React.Children.map(children, child => {
    // Make sure it's a valid element
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        // Add suggested notes for highlighting on the piano
        suggestedLearnSongNote: learnSongState.isPlaying ? nextNote : null,
        learnSongMode: learnSongState.isPlaying ? learnSongState.mode : null,
      });
    }
    return child;
  });

  return <>{childrenWithProps}</>;
};

export default LearnSongKeyboardAdapter;
