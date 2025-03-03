import React, { useEffect, useRef } from 'react'
import Vex from 'vexflow'

// Helper function converting duration strings to beat values in 4/4
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
const groupNotesByMeasure = (vexNotes: Vex.Flow.StaveNote[]): Vex.Flow.StaveNote[][] => {
  const measures: Vex.Flow.StaveNote[][] = []
  let currentMeasure: Vex.Flow.StaveNote[] = []
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

interface MusicSheetRendererProps {
  vexNotes: Vex.Flow.StaveNote[]
  onNoteElementsUpdate: (elements: Map<string, HTMLElement>) => void
}

const MusicSheetRenderer: React.FC<MusicSheetRendererProps> = ({ vexNotes, onNoteElementsUpdate }) => {
  const rendererRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!rendererRef.current || vexNotes.length === 0) return

    rendererRef.current.innerHTML = ''
    const VF = Vex.Flow
    const renderer = new VF.Renderer(rendererRef.current, VF.Renderer.Backends.SVG)

    // Group notes by measure
    const measures = groupNotesByMeasure(vexNotes)
    const measureCount = measures.length
    const extra = 60
    // Total width is extra plus the width per measure
    const totalWidth = Math.max(800, extra + measureCount * 150)
    // Common width for each measure except the first one gets the extra width
    const commonWidth = (totalWidth - extra) / measureCount

    renderer.resize(totalWidth, 200)
    const context = renderer.getContext()
    let offsetX = 0

    measures.forEach((measureNotes, i) => {
      // First stave gets additional extra space
      const currentWidth = i === 0 ? commonWidth + extra : commonWidth
      const stave = new VF.Stave(offsetX, 10, currentWidth)

      if (i === 0) {
        stave.addClef('treble').addTimeSignature('4/4')
        stave.setBegBarType(VF.Barline.type.SINGLE)
      }
      if (i === measureCount - 1) {
        stave.setEndBarType(VF.Barline.type.END)
      } else {
        stave.setEndBarType(VF.Barline.type.SINGLE)
      }
      stave.setContext(context).draw()

      const voice = new VF.Voice({ num_beats: 4, beat_value: 4 })
      voice.addTickables(measureNotes)
      try {
        new VF.Formatter().joinVoices([voice]).format([voice], currentWidth - 40)
        voice.draw(context, stave)
      } catch (e) {
        console.error('Error rendering voice for measure', e)
      }
      offsetX += currentWidth
    })

    // Optionally collect note element references if needed.
    /*
    const noteElements = new Map<string, HTMLElement>()
    vexNotes.forEach(note => {
      const noteId = note.getAttribute('id')
      if (noteId) {
        const element = rendererRef.current?.querySelector(`[id="vf-${noteId}"]`) as HTMLElement
        if (element) noteElements.set(noteId, element)
      }
    })
    onNoteElementsUpdate(noteElements)
    */
  }, [vexNotes, onNoteElementsUpdate])

  return <div ref={rendererRef} />
}

export default MusicSheetRenderer
