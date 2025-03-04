import React, {useEffect, useRef} from 'react'
import Vex from 'vexflow'
import {groupNotesByMeasure} from 'pages/SongLibrary/LearnSong/sheetUtils'

interface MusicSheetRendererProps {
  vexNotes: Vex.StaveNote[]
  onNoteElementsUpdate: (elements: Map<string, HTMLElement>) => void
}

const MusicSheetRenderer: React.FC<MusicSheetRendererProps> = ({vexNotes, onNoteElementsUpdate}) => {
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
        // TODO: Add key signature and time signature for multiple staves
        // TODO: Dynamically get key/time signature from notes
        stave.addClef('treble').addTimeSignature('4/4')
        stave.setBegBarType(VF.Barline.type.SINGLE)
      }
      if (i === measureCount - 1) {
        stave.setEndBarType(VF.Barline.type.END)
      } else {
        stave.setEndBarType(VF.Barline.type.SINGLE)
      }
      stave.setContext(context).draw()

      const voice = new VF.Voice({num_beats: 4, beat_value: 4})
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

  return <div ref={rendererRef}/>
}

export default MusicSheetRenderer
