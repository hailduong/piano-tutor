import {useEffect, useRef, useState, FC} from 'react'
import Vex, {Voice, Formatter} from 'vexflow'
import styled from 'styled-components'

const MusicContainer = styled.div`
    background-color: white;
    padding: 10px;
    border: 1px solid #ccc;
    overflow-x: auto;
`

interface SheetMusicRendererProps {
  notes: Vex.StaveNote[]; // Accept an array of VexFlow StaveNotes
}

const NUMBER_OF_NOTES = 100

const SheetMusicRenderer: FC<SheetMusicRendererProps> = (props) => {
  const {notes} = props
  const musicRef = useRef<HTMLDivElement>(null)
  const [highlightedNote, setHighlightedNote] = useState<string | null>(null)

  // Initialize MIDI input
  const initMidi = async () => {
    if (navigator.requestMIDIAccess) {
      const midiAccess = await navigator.requestMIDIAccess()
      midiAccess.inputs.forEach((input) => {
        input.onmidimessage = (message) => handleMidiMessage(message)
      })
    } else {
      console.error('Web MIDI API is not supported.')
    }
  }


  // Handle MIDI message and highlight notes
  const handleMidiMessage = (message: any) => {
    const [command, note] = message.data
    if (command === 144) { // Note On
      const noteName = getNoteName(note)
      console.log('Note name:', noteName)
      setHighlightedNote(noteName)
    }
  }

  // Convert MIDI note number to note name
  const getNoteName = (midiNumber: number): string => {
    const octave = Math.floor(midiNumber / 12) - 1
    const noteNames = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b']
    const note = noteNames[midiNumber % 12]
    return `${note}/${octave}`
  }

  // Split notes into voices based on maximum ticks per voice
  const splitNotesIntoVoices = (notes: Vex.StaveNote[], maxTicksPerVoice: number): Vex.StaveNote[][] => {
    const voiceNotes: Vex.StaveNote[][] = []
    let currentVoiceNotes: Vex.StaveNote[] = []
    let currentTicks = 0

    notes.forEach((note) => {
      currentTicks++
      currentVoiceNotes.push(note)

      // If current voice exceeds maxTicksPerVoice, start a new voice
      if (currentTicks >= maxTicksPerVoice) {
        voiceNotes.push(currentVoiceNotes)
        currentVoiceNotes = []
        currentTicks = 0
      }
    })

    if (currentVoiceNotes.length > 0) {
      voiceNotes.push(currentVoiceNotes)
    }

    return voiceNotes
  }

  // Render the sheet music
  const renderSheetMusic = (notes: Vex.StaveNote[], context: Vex.RenderContext, stave: Vex.Stave) => {
    // const voiceNotes = splitNotesIntoVoices(notes, 4) // Each voice can handle 4 beats (quarter notes)
    //
    // // Render each voice separately
    // voiceNotes.forEach((voiceNotesSet) => {
    //   const voice = new Vex.Flow.Voice({num_beats: voiceNotesSet.length, beat_value: 4})
    //   voice.addTickables(voiceNotesSet)
    //
    //   // Format and draw the voice
    //   const formatter = new Vex.Flow.Formatter().joinVoices([voice]).format([voice], 400)
    //   voice.draw(context, stave)
    // })

    // Highlight the notes that match the MIDI input
    notes.forEach((note) => {
      if (highlightedNote === note.getKeys()[0]) {
        note.setStyle({fillStyle: 'green'})
      } else {
        note.setStyle({fillStyle: 'black'})
      }
    })
  }

  const clearMusicSheet = ()=>{
    if (musicRef.current) {
      musicRef.current.innerHTML = '' // Clear previous SVG content
    }
  }

  useEffect(() => {

    initMidi() // Initialize MIDI when the component mounts

    if (musicRef.current) {

      clearMusicSheet()

      const VF = Vex.Flow
      const renderer = new VF.Renderer(musicRef.current, VF.Renderer.Backends.SVG)
      renderer.resize(3600, 200)
      const context = renderer.getContext()

      // Clear the SVG container before rendering new content
      const stave: Vex.Stave = new VF.Stave(10, 40, 3600)
      stave.addClef('treble')
      stave.setContext(context).draw()
      console.log('draw')

      // Create a voice in 4/4 and add above notes
      const voice = new Voice({num_beats: NUMBER_OF_NOTES, beat_value: 4})
      voice.addTickables(notes)

      // Format and justify the notes to 400 pixels.
      new Formatter().joinVoices([voice]).format([voice], 3500)

      // Render voice
      voice.draw(context, stave)

      renderSheetMusic(notes, context, stave)
    }
  }, [notes, highlightedNote]) // Re-run on note changes or highlighted note


  return <MusicContainer ref={musicRef}></MusicContainer>
}

export default SheetMusicRenderer
