import React, {useEffect, useRef, useState, FC} from 'react'
import Vex from 'vexflow'
import {useDispatch, useSelector} from 'react-redux'
import {USER_CONFIG} from 'config'
import {TempoDisplay, ScrollingContainer} from 'common/SheetMusicRenderer/styles/SheetMusicRenderer.styled'
import {
  recordNoteTiming,
  selectCurrentNote,
  selectLearnSongState,
  selectNextNote,
  setCurrentNote
} from 'store/slices/learnSongSlice'
import {INoteTiming} from 'models/LearnSong'
import {
  ProgressOverlay,
  NoteHighlight,
  SongSheetContainer
} from 'pages/LearnSong/styles/AdvancedMusicSheet.styled'

// Interface for SongSheetMusicRenderer props
interface ISongSheetMusicRendererProps {
  songId: string | null;
  sheetMusicXMLString: string;
  tempo: number;
  isPlaying: boolean;
  currentPosition: number;
  onNotePlay: (noteId: string, timingDeviation: number) => void;
  highlightEnabled: boolean;
}

const AdvancedMusicSheet: FC<ISongSheetMusicRendererProps> = (props) => {
  /* Refs */
  const musicRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<Vex.Renderer | null>(null)
  const staveRef = useRef<Vex.Stave | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const noteElementsRef = useRef<Map<string, HTMLElement>>(new Map())
  const highlightRef = useRef<HTMLDivElement>(null)
  const nextHighlightRef = useRef<HTMLDivElement>(null)
  const midiAccessRef = useRef<WebMidi.MIDIAccess | null>(null)

  /* Props & Store */
  const {sheetMusicXMLString, tempo, isPlaying, currentPosition, onNotePlay, highlightEnabled} = props
  const dispatch = useDispatch()
  const learnSongState = useSelector(selectLearnSongState)
  const currentNote = useSelector(selectCurrentNote)
  const nextNote = useSelector(selectNextNote)

  /* States */
  const [vexNotes, setVexNotes] = useState<Vex.StaveNote[]>([])
  const [notePositions, setNotePositions] = useState<Map<string, {
    x: number,
    y: number,
    width: number,
    height: number
  }>>(new Map())
  const [expectedNoteTime, setExpectedNoteTime] = useState<number | null>(null)
  const [lastNoteTimestamp, setLastNoteTimestamp] = useState<number | null>(null)

  /* Handlers */
  // Helper to convert a key string (e.g. \`c/4\`) to a MIDI note number.
  const convertKeyToMIDINote = (key: string): number => {
    const noteMap: {[key: string]: number} = {
      c: 0,
      d: 2,
      e: 4,
      f: 5,
      g: 7,
      a: 9,
      b: 11
    }
    const parts = key.split('/')
    const step = parts[0]
    const octave = parseInt(parts[1])
    return 12 * (octave + 1) + (noteMap[step] || 0)
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

    return Array.from(noteElements)
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
  }

  // Calculate the positions of notes for highlighting
  const calculateNotePositions = () => {
    const positions = new Map()
    noteElementsRef.current.forEach((element, noteId) => {
      const rect = element.getBoundingClientRect()
      const containerRect = scrollContainerRef.current?.getBoundingClientRect() || {left: 0, top: 0}

      positions.set(noteId, {
        x: rect.left - containerRect.left + (scrollContainerRef.current?.scrollLeft || 0),
        y: rect.top - containerRect.top,
        width: rect.width,
        height: rect.height
      })
    })
    setNotePositions(positions)
  }

  // Update the highlight position based on current note
  const updateHighlightPosition = () => {
    if (!currentNote || !highlightRef.current || !notePositions.has(currentNote)) return

    const position = notePositions.get(currentNote)
    if (position) {
      highlightRef.current.style.left = `${position.x - 5}px`
      highlightRef.current.style.top = `${position.y - 5}px`
      highlightRef.current.style.width = `${position.width + 10}px`
      highlightRef.current.style.height = `${position.height + 10}px`

      // Scroll to the current note if it's not fully visible
      if (scrollContainerRef.current) {
        const scrollLeft = scrollContainerRef.current.scrollLeft
        const containerWidth = scrollContainerRef.current.clientWidth

        if (position.x < scrollLeft || position.x + position.width > scrollLeft + containerWidth) {
          scrollContainerRef.current.scrollTo({
            left: position.x - 50,
            behavior: 'smooth'
          })
        }
      }
    }
  }

  // Update the next highlight position
  const updateNextHighlightPosition = () => {
    if (!nextNote || !nextHighlightRef.current || !notePositions.has(nextNote)) return

    const position = notePositions.get(nextNote)
    if (position) {
      nextHighlightRef.current.style.left = `${position.x - 5}px`
      nextHighlightRef.current.style.top = `${position.y - 5}px`
      nextHighlightRef.current.style.width = `${position.width + 10}px`
      nextHighlightRef.current.style.height = `${position.height + 10}px`
    }
  }

  /* Effects */
  // Request MIDI access on component mount.
  useEffect(() => {
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess()
        .then((access) => {
          midiAccessRef.current = access
          console.log("MIDI Access initialized:", access)
        })
        .catch((err) => console.error("Error requesting MIDI access:", err))
    } else {
      console.error("Web MIDI API is not supported in this browser.")
    }
  }, [])


  // Parse sheet music data when it changes
  useEffect(() => {
    if (sheetMusicXMLString) {
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(sheetMusicXMLString, 'application/xml')
      const notes = parseSheetMusic(xmlDoc)
      setVexNotes(notes)
    }
  }, [sheetMusicXMLString])

  // Initialize timing when starting to play
  useEffect(() => {
    if (isPlaying && expectedNoteTime === null) {
      setExpectedNoteTime(Date.now())
    }
  }, [isPlaying])

  // Render sheet music with VexFlow
  useEffect(() => {
    if (!vexNotes.length || !musicRef.current) return

    const VF = Vex.Flow
    const staffWidth = Math.max(800, vexNotes.length * USER_CONFIG.NOTE_WIDTH)

    // Clear previous content
    while (musicRef.current.firstChild) {
      musicRef.current.removeChild(musicRef.current.firstChild)
    }

    // Create renderer
    rendererRef.current = new VF.Renderer(musicRef.current, VF.Renderer.Backends.SVG)
    rendererRef.current.resize(staffWidth, 200)

    const context = rendererRef.current.getContext()
    context.clear()

    // Create stave
    staveRef.current = new VF.Stave(10, 40, staffWidth)
    staveRef.current.addClef('treble')
    staveRef.current.setTempo({bpm: tempo, duration: 'q'}, 0)
    staveRef.current.setContext(context).draw()

    // Mapping for note durations (beats)
    const durationMapping: { [key: string]: number } = {
      w: 4,
      h: 2,
      q: 1,
      '8': 0.5,
      '16': 0.25
    }

    // Compute total beats from vexNotes using note duration
    const totalBeats = vexNotes.reduce((sum, note) => {
      const d = note.getDuration() // returns a string like 'q', 'h', etc.
      return sum + (durationMapping[d] || 1)
    }, 0)

    // Create voice with the total beats computed
    const voice = new VF.Voice({
      num_beats: totalBeats,
      beat_value: 4
    })

    voice.addTickables(vexNotes)
    new VF.Formatter().joinVoices([voice]).format([voice], staffWidth - 100)
    voice.draw(context, staveRef.current)

    // Store references to note elements for highlighting
    vexNotes.forEach((note, index) => {
      const noteId = note.getAttribute('id')
      if (noteId) {
        const noteElement = musicRef.current?.querySelector(`[id="${noteId}"]`) as HTMLElement
        if (noteElement) {
          noteElementsRef.current.set(noteId, noteElement)
        }
      }
    })

    // Calculate note positions after rendering
    setTimeout(calculateNotePositions, 0)

    // Setup for highlighting
    if (highlightEnabled) {
      updateHighlightPosition()
      updateNextHighlightPosition()
    }
  }, [vexNotes, tempo, highlightEnabled])

  // Update highlights when current or next note changes
  useEffect(() => {
    if (highlightEnabled) {
      updateHighlightPosition()
      updateNextHighlightPosition()
    }
  }, [currentNote, nextNote, notePositions, highlightEnabled])

  // Handle note played event through VirtualPiano
  useEffect(() => {
    if (!isPlaying || !currentNote || !expectedNoteTime) return

    // Calculate timing
    const now = Date.now()
    const timingDeviation = now - expectedNoteTime

    // Record note timing in Redux store
    const noteTiming: INoteTiming = {
      noteId: currentNote,
      expectedTime: expectedNoteTime,
      actualTime: now,
      isCorrect: true, // We'll assume it's correct here, but would check in a real implementation
      duration: 0 // This would be calculated based on note type
    }

    dispatch(recordNoteTiming(noteTiming))

    // Notify parent component
    onNotePlay(currentNote, timingDeviation)

    // Send MIDI message if MIDI access is available.
    const noteIndex = vexNotes.findIndex(note => note.getAttribute('id') === currentNote)
    if (noteIndex !== -1) {
      // Get the key from the note; assuming the first key represents the note.
      const key = vexNotes[noteIndex].getKeys()[0]
      const midiNote = convertKeyToMIDINote(key)
      const midiAccess = midiAccessRef.current
      if (midiAccess) {
        midiAccess.outputs.forEach((output) => {
          output.send([0x90, midiNote, 0x7f])  // note on, velocity 127
          setTimeout(() => {
            output.send([0x80, midiNote, 0x00])  // note off
          }, 500)
        })
      }
    }

    // Update expected time for next note based on tempo
    const beatDuration = 60000 / tempo
    setExpectedNoteTime(expectedNoteTime + beatDuration)
    setLastNoteTimestamp(now)
  }, [currentNote, expectedNoteTime, isPlaying, tempo, vexNotes, dispatch, onNotePlay])

  // Update when the position changes
  useEffect(() => {
    if (currentPosition >= 0 && currentPosition < vexNotes.length) {
      const noteId = vexNotes[currentPosition].getAttribute('id')
      if (noteId) {
        dispatch(setCurrentNote(noteId))
      }
    }
  }, [currentPosition, vexNotes])

  /* Render */
  return (
    <SongSheetContainer>
      <TempoDisplay>♩ = {tempo}</TempoDisplay>
      <ScrollingContainer ref={scrollContainerRef}>
        <div ref={musicRef} style={{position: 'relative'}}></div>

        {/* Current note highlight */}
        {highlightEnabled && (
          <NoteHighlight
            ref={highlightRef}
            isActive={true}
            style={{position: 'absolute'}}
          />
        )}

        {/* Next note highlight */}
        {highlightEnabled && (
          <NoteHighlight
            ref={nextHighlightRef}
            isActive={false}
            style={{position: 'absolute'}}
          />
        )}

        {/* Progress overlay */}
        <ProgressOverlay
          style={{
            width: `${(currentPosition / (vexNotes.length || 1)) * 100}%`
          }}
        />
      </ScrollingContainer>
    </SongSheetContainer>
  )
}

export default AdvancedMusicSheet
