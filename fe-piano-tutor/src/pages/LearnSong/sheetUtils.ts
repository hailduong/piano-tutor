// Helper function converting duration strings to beat values in 4/4
import Vex from 'vexflow'

const durationToBeats = (duration: string): number => {
  switch (duration) {
    case 'w':
      return 4
    case 'h':
      return 2
    case 'q':
      return 1
    case '8':
      return 0.5
    case '16':
      return 0.25
    default:
      throw new Error(`Unknown duration: ${duration}`)
  }
}
// Group notes into measures dynamically based on their duration
export const groupNotesByMeasure = (vexNotes: Vex.StaveNote[]): Vex.StaveNote[][] => {
  const measures: Vex.StaveNote[][] = []
  let currentMeasure: Vex.StaveNote[] = []
  let currentBeats = 0
  const beatsPerMeasure = 4

  for (const note of vexNotes) {
    const noteDuration = (note as any).duration as string
    const noteBeats = durationToBeats(noteDuration)

    if (currentBeats + noteBeats === beatsPerMeasure) {
      currentMeasure.push(note)
      measures.push(currentMeasure)
      currentMeasure = []
      currentBeats = 0
    } else if (currentBeats + noteBeats > beatsPerMeasure) {
      if (currentMeasure.length > 0) measures.push(currentMeasure)
      currentMeasure = [note]
      currentBeats = noteBeats
    } else {
      currentMeasure.push(note)
      currentBeats += noteBeats
    }
  }

  if (currentMeasure.length > 0) measures.push(currentMeasure)
  return measures
}
