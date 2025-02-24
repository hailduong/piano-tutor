// musicNoteGeneratorService.ts

import Vex from 'vexflow';
import {USER_CONFIG} from 'config'

export class MusicNoteGeneratorService {
  private levels: { [key: number]: string[] };

  constructor() {
    this.levels = {
      1: ["C", "D", "E", "F", "G", "A", "B"],
      2: ["G", "A", "B", "C", "D", "E", "F#", "F", "Bb"],
      3: ["D", "E", "F#", "G", "A", "B", "C#", "Bb", "Eb"],
      4: ["A", "B", "C#", "D", "E", "F#", "G#", "Eb", "Ab"],
      5: ["E", "F#", "G#", "A", "B", "C#", "D#", "Ab", "Db"],
      6: ["B", "C#", "D#", "E", "F#", "G#", "A#", "Db", "Eb"],
      7: ["F#", "G#", "A#", "B", "C#", "D#", "E#", "Gb", "Ab"],
    };
  }

  generateNotes(level: number): Vex.StaveNote[] {
    if (level < 1 || level > 7) {
      throw new Error("Level must be between 1 and 7.");
    }

    const notePool = this.levels[level];
    const notes: Vex.StaveNote[] = [];

    // Generate 100 random notes from the pool
    for (let i = 0; i < USER_CONFIG.NUMBER_OF_NOTES; i++) {
      const randomNote = notePool[Math.floor(Math.random() * notePool.length)];
      notes.push(
        new Vex.Flow.StaveNote({
          keys: [`${randomNote}/4`], // Use 4th octave (e.g., c/4)
          duration: "q", // Quarter note
        })
      );
    }

    return notes;
  }
}
