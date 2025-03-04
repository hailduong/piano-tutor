import React, {useEffect, useRef} from 'react'
import Vex from 'vexflow'
import {groupNotesByMeasure} from 'pages/SongLibrary/LearnSong/sheetUtils'

interface AdvancedMusicSheetRendererProps {
  vexNotes: Vex.StaveNote[];
  onNoteElementsUpdate: (elements: Map<string, HTMLElement>) => void;
  currentNote: string | null;
  nextNote: string | null;
  incorrectAttempt?: boolean;
}

const AdvancedMusicSheetRenderer: React.FC<AdvancedMusicSheetRendererProps> = (props) => {
  const {vexNotes, onNoteElementsUpdate, currentNote, nextNote, incorrectAttempt} = props
  const rendererRef = useRef<HTMLDivElement>(null)
  const prevNoteRef = useRef<string | null>(null)

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

    // Collect note element references for highlighting
    const noteElements = new Map<string, HTMLElement>()
    vexNotes.forEach(note => {
      const noteId = note.getAttribute('id')
      if (noteId) {
        // VexFlow prefixes element ids with 'vf-'
        const element = rendererRef.current?.querySelector(`[id="vf-${noteId}"]`) as HTMLElement
        if (element) {
          noteElements.set(noteId, element)
        }
      }
    })
    onNoteElementsUpdate(noteElements)

    // Apply highlighting after rendering

    // Reset any previous highlights
    document.querySelectorAll('.current-note, .next-note, .incorrect-attempt').forEach(el => {
      el.classList.remove('current-note', 'next-note', 'incorrect-attempt')
    })

    // Apply highlight to current note
    if (currentNote) {
      const currentElement = noteElements.get(currentNote)
      if (currentElement) {
        currentElement.classList.add('current-note')

        // Add incorrect attempt highlight if applicable
        if (incorrectAttempt) {
          currentElement.classList.add('incorrect-attempt')
        }
      }
    }

    // Apply highlight to next note
    if (nextNote) {
      const nextElement = noteElements.get(nextNote)
      if (nextElement) {
        nextElement.classList.add('next-note')
      }
    }


    // Add CSS styles for highlighting
    const styleElement = document.getElementById('vexflow-highlight-styles') ||
      document.createElement('style')
    styleElement.id = 'vexflow-highlight-styles'
    styleElement.textContent = `
      .current-note {
        fill: #1890ff;
        stroke: #1890ff;
        filter: drop-shadow(0 0 3px rgba(24, 144, 255, 0.5));
      }
      .next-note {
        fill: #52c41a;
        stroke: #52c41a;
        opacity: 0.7;
      }
      .incorrect-attempt {
        fill: #ff4d4f !important;
        stroke: #ff4d4f !important;
        animation: pulse 0.3s infinite alternate;
      }
      @keyframes pulse {
        0% { opacity: 0.7; }
        100% { opacity: 1; }
      }
    `
    if (!document.getElementById('vexflow-highlight-styles')) {
      document.head.appendChild(styleElement)
    }

    // Remember the current note for future renders
    prevNoteRef.current = currentNote

  }, [vexNotes, onNoteElementsUpdate, currentNote, nextNote, incorrectAttempt])

  return <div ref={rendererRef} className="sheet-music-container"/>
}

export default AdvancedMusicSheetRenderer
