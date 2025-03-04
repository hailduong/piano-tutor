// hooks/useMusicTheoryHint.ts
import { useState, useMemo } from 'react';
import Vex from 'vexflow';
import { INote } from 'store/slices/musicNotesSlice';
import musicTheoryUtil from 'utils/musicTheoryUtil';

/**
 * Hook to generate music theory hints, e.g. "This is a C Major chord"
 * @param notes
 * @param showTheoryHints
 * @param musicTheoryContext
 * @param selectedConcept
 */
export const useMusicTheoryHint = (
  notes: Vex.StaveNote[],
  showTheoryHints: boolean,
  musicTheoryContext: any,
  selectedConcept?: string
) => {
  const [theoryHint, setTheoryHint] = useState<string>('');

  const generateTheoryHint = () => {
    if ((showTheoryHints || musicTheoryContext.showTheoryAnnotations) && notes.length > 0) {
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
        } as INote;
      });

      const theoryConcept = musicTheoryContext.currentTheoryConcept || selectedConcept || '';
      const hint = musicTheoryUtil.generateTheoryHint(appNotes, theoryConcept);
      setTheoryHint(hint);
    }
  };

  return {
    theoryHint,
    generateTheoryHint
  };
};
