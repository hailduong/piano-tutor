import Vex from 'vexflow';
import { Note } from 'store/slices/musicNotesSlice';
import musicTheoryUtil from 'utils/musicTheoryUtil';

/**
 * Generates music theory hints based on notes
 * @param notes The VexFlow notes to generate hints from
 * @param theoryConcept The theory concept to generate hints for
 * @returns A string with the generated music theory hint
 */
export const generateMusicTheoryHint = (
  notes: Vex.StaveNote[],
  theoryConcept: string = ''
): string => {
  if (!notes || notes.length === 0) return '';

  // Convert VexFlow notes to application Note format
  const appNotes = notes.map(vexNote => {
    const keyParts = vexNote.getKeys()[0].split('/');
    const noteName = keyParts[0].toUpperCase();
    const octave = parseInt(keyParts[1]);
    const length = vexNote.getDuration();
    return {
      note: noteName,
      octave,
      length,
      timestamp: Date.now()
    } as Note;
  });

  // Use the existing musicTheoryUtil to generate the hint
  return musicTheoryUtil.generateTheoryHint(appNotes, theoryConcept);
};
