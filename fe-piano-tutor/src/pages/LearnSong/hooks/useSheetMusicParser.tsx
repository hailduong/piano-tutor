// src/hooks/useSheetMusicParser.ts
import Vex from 'vexflow'

interface NotePosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface UseSheetMusicParserResult {
  /**
   * Parses the given sheet music XML data and converts it to VexFlow StaveNotes.
   * @param xmlData - The sheet music XML data as a string or Document.
   * @returns An array of VexFlow StaveNotes.
   */
  parseSheetMusic: (xmlData: string | Document) => Vex.StaveNote[];
  /**
   * Calculates the positions of notes in the rendered sheet music.
   * @param noteElements - A map of note IDs to their corresponding HTML elements.
   * @param scrollContainer - The scroll container element for calculating positions.
   * @returns A map of note IDs to their positions.
   */
  calculateNotePositions: (
    noteElements: Map<string, HTMLElement>,
    scrollContainer: HTMLDivElement | null
  ) => Map<string, NotePosition>;
  /**
   * Converts a key string (e.g., 'C/4') to a MIDI note number.
   * @param key - The key string to convert.
   * @returns The corresponding MIDI note number.
   */
  convertKeyToMIDINote: (key: string) => number;
}

export const useSheetMusicParser = (): UseSheetMusicParserResult => {

  // Helper to convert a key string (e.g. `c/4`) to a MIDI note number.
  const convertKeyToMIDINote = (key: string): number => {
    const noteMap: { [key: string]: number } = {
      C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11
    }
    const parts = key.split('/')
    const step = parts[0].toUpperCase()
    const octave = parseInt(parts[1])
    const midiNote = 12 * (octave + 1) + (noteMap[step] || 0)
    console.log(`Converting key: ${key} to MIDI note: ${midiNote}`)
    return midiNote
  }

  // Convert sheet music data to VexFlow notes
  const parseSheetMusic = (sheetMusicXMLData: string | Document): Vex.StaveNote[] => {
    let xml: Document
    if (typeof sheetMusicXMLData === 'string') {
      xml = new DOMParser().parseFromString(sheetMusicXMLData, 'application/xml')
    } else {
      xml = sheetMusicXMLData
    }

    // Get all <note> elements that contain a pitch (to skip backup/barline/rests)
    const noteElements = xml.querySelectorAll('note')

    const VF = Vex.Flow

    const parsedNotes = Array.from(noteElements)
      .filter(noteEl => noteEl.querySelector('pitch'))
      .map((noteEl, index) => {
        // Extract pitch information
        const step = noteEl.querySelector('pitch > step')?.textContent?.trim()
        const octave = noteEl.querySelector('pitch > octave')?.textContent?.trim()
        const alter = noteEl.querySelector('pitch > alter')?.textContent?.trim()

        // Extract note type; map MusicXML type strings to VexFlow durations
        const typeText = noteEl.querySelector('type')?.textContent?.trim() ?? 'quarter'
        let duration = 'q' // default to quarter
        if (typeText === 'half') duration = 'h'
        else if (typeText === 'whole') duration = 'w'
        else if (typeText === 'eighth') duration = '8'
        else if (typeText === '16th') duration = '16'

        // Build the key string; convert step to lowercase
        const keys = [`${step?.toLowerCase()}/${octave}`]

        const staveNote = new VF.StaveNote({
          keys,
          duration: duration,
          auto_stem: true
        })

        // Add accidentals if needed
        if (alter && parseInt(alter, 10) === 1) {
          staveNote.addModifier(new VF.Accidental('#'), 0)
        } else if (alter && parseInt(alter, 10) === -1) {
          staveNote.addModifier(new VF.Accidental('b'), 0)
        }

        // Include an attribute for tracking the note
        staveNote.setAttribute('id', `note-${index}`)

        return staveNote
      })

    // Update state with parsed notes
    return parsedNotes
  }

  // Calculate the positions of notes for highlighting
  const calculateNotePositions = (
    noteElements: Map<string, HTMLElement>,
    scrollContainer: HTMLDivElement | null
  ): Map<string, NotePosition> => {
    const positions = new Map<string, NotePosition>()

    noteElements.forEach((element, noteId) => {
      const rect = element.getBoundingClientRect()
      const containerRect = scrollContainer?.getBoundingClientRect() || {left: 0, top: 0}

      positions.set(noteId, {
        x: rect.left - containerRect.left + (scrollContainer?.scrollLeft || 0),
        y: rect.top - containerRect.top,
        width: rect.width,
        height: rect.height
      })
    })

    return positions
  }

  return {
    parseSheetMusic,
    calculateNotePositions,
    convertKeyToMIDINote
  }
}
