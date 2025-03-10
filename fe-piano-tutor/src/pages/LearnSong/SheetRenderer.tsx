import React, {useEffect, useRef} from 'react'
import Vex from 'vexflow'
import {groupNotesByMeasure} from 'pages/LearnSong/sheetUtils'

/* Types */
interface IAdvancedMusicSheetRendererProps {
  // An array of VexFlow StaveNote objects representing the musical notes to be rendered
  vexNotes: Vex.StaveNote[];

  // A callback function that is invoked when the note elements are updated, providing a map of note identifiers to their corresponding HTMLElements
  onNoteElementsUpdate: (elements: Map<string, HTMLElement>) => void;

  // The identifier of the current note that should be highlighted or focused, or null if no note is current
  highlightNote: string | null;

  // An optional boolean flag indicating whether an incorrect attempt has been made, which can affect rendering (e.g., highlighting errors)
  incorrectAttempt?: boolean;
}

// CSS classes for note highlighting
const CSS_CLASSES = {
  CURRENT_NOTE: 'current-note',
  INCORRECT_ATTEMPT: 'incorrect-attempt'
}

const SheetRenderer: React.FC<IAdvancedMusicSheetRendererProps> = (props) => {
  const {vexNotes, onNoteElementsUpdate, highlightNote, incorrectAttempt} = props
  const rendererRef = useRef<HTMLDivElement>(null)
  const prevNoteRef = useRef<string | null>(null)

  /* Main rendering effect */
  useEffect(() => {
    // Skip rendering if container or notes aren't available
    if (!rendererRef.current || vexNotes.length === 0) return

    // Clear previous rendering
    rendererRef.current.innerHTML = ''

    // Initialize VexFlow renderer
    const VF = Vex.Flow
    const renderer = new VF.Renderer(rendererRef.current, VF.Renderer.Backends.SVG)

    /* Layout calculations */
    // Group notes by measure for proper rendering
    const measures = groupNotesByMeasure(vexNotes)
    const measureCount = measures.length
    const extraWidthForFirstMeasure = 60

    // Calculate total width and width per measure
    const totalWidth = Math.max(800, extraWidthForFirstMeasure + measureCount * 150)
    const commonWidth = (totalWidth - extraWidthForFirstMeasure) / measureCount

    renderer.resize(totalWidth, 200)
    const context = renderer.getContext()

    /* Draw music staves and notes */
    let offsetX = 0
    measures.forEach((measureNotes, i) => {
      // First stave gets additional space for clef and time signature
      const currentWidth = i === 0 ? commonWidth + extraWidthForFirstMeasure : commonWidth
      const stave = new VF.Stave(offsetX, 10, currentWidth)

      // Add notation elements to first stave
      if (i === 0) {
        stave.addClef('treble').addTimeSignature('4/4')
        stave.setBegBarType(VF.Barline.type.SINGLE)
      }

      // Set appropriate bar line type
      if (i === measureCount - 1) {
        stave.setEndBarType(VF.Barline.type.END)
      } else {
        stave.setEndBarType(VF.Barline.type.SINGLE)
      }

      // Draw the stave
      stave.setContext(context).draw()

      // Create and draw the voice containing the notes
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

    /* Note highlighting */
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

    // Notify parent component about available note elements
    onNoteElementsUpdate(noteElements)

    // Reset previous highlights
    document.querySelectorAll(`.${CSS_CLASSES.CURRENT_NOTE}, .${CSS_CLASSES.INCORRECT_ATTEMPT}`)
      .forEach(el => {
        el.classList.remove(
          CSS_CLASSES.CURRENT_NOTE,
          CSS_CLASSES.INCORRECT_ATTEMPT
        )
      })

    // Highlight current note
    if (highlightNote) {
      const currentElement = noteElements.get(highlightNote)
      if (currentElement) {
        currentElement.classList.add(CSS_CLASSES.CURRENT_NOTE)

        // Add incorrect attempt highlight if applicable
        if (incorrectAttempt) {
          currentElement.classList.add(CSS_CLASSES.INCORRECT_ATTEMPT)
        }
      }
    }

    /* CSS styling for notes */
    // Create or update CSS styles for highlighting
    const styleId = 'vexflow-highlight-styles'
    const styleElement = document.getElementById(styleId) || document.createElement('style')

    styleElement.id = styleId
    styleElement.textContent = `
      .${CSS_CLASSES.CURRENT_NOTE} {
        fill: #1890ff;
        stroke: #1890ff;
        filter: drop-shadow(0 0 3px rgba(24, 144, 255, 0.5));
      }
      .${CSS_CLASSES.INCORRECT_ATTEMPT} {
        fill: #ff4d4f !important;
        stroke: #ff4d4f !important;
        animation: pulse 0.3s infinite alternate;
      }
      @keyframes pulse {
        0% { opacity: 0.7; }
        100% { opacity: 1; }
      }
    `

    if (!document.getElementById(styleId)) {
      document.head.appendChild(styleElement)
    }

    // Remember current note for future renders
    prevNoteRef.current = highlightNote

  }, [highlightNote])

  return <div ref={rendererRef} className="sheet-music-container"/>
}

export default SheetRenderer
