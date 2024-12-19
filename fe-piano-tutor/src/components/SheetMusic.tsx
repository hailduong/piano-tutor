import React, {useEffect, useRef, useState} from 'react'
import Vex from 'vexflow'

const SheetMusic: React.FC = () => {
  const musicRef = useRef<HTMLDivElement>(null)
  const [highlightedNote, setHighlightedNote] = useState<string | null>(null)

  useEffect(() => {
    // Initialize MIDI
    const initMidi = async () => {
      if (navigator.requestMIDIAccess) {
        const midiAccess = await navigator.requestMIDIAccess()
        midiAccess.inputs.forEach((input) => {
          input.onmidimessage = (message) => {
            const [command, note] = message.data
            if (command === 144) {
              // Note On
              const noteName = getNoteName(note)
              setHighlightedNote(noteName)
            }
          }
        })
      } else {
        console.error('Web MIDI API is not supported.')
      }
    }

    const getNoteName = (midiNumber: number): string => {
      const octave = Math.floor(midiNumber / 12) - 1
      const noteNames = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b']
      const note = noteNames[midiNumber % 12]
      return `${note}/${octave}`
    }

    initMidi()
  }, [])

  useEffect(() => {
    if (musicRef.current) {
      const VF = Vex.Flow
      const renderer = new VF.Renderer(musicRef.current, VF.Renderer.Backends.SVG)
      renderer.resize(500, 200)
      const context = renderer.getContext()
      context.setFont('Arial', 10, '').setBackgroundFillStyle('#fff')

      const stave = new VF.Stave(10, 40, 400)
      stave.addClef('treble').addTimeSignature('4/4')
      stave.setContext(context).draw()

      const notes = [
        new VF.StaveNote({
          keys: ['c/4'],
          duration: 'q',
          style: highlightedNote === 'c/4' ? {fillStyle: 'green'} : undefined
        }),
        new VF.StaveNote({
          keys: ['d/4'],
          duration: 'q',
          style: highlightedNote === 'd/4' ? {fillStyle: 'green'} : undefined
        }),
        new VF.StaveNote({
          keys: ['e/4'],
          duration: 'q',
          style: highlightedNote === 'e/4' ? {fillStyle: 'green'} : undefined
        }),
        new VF.StaveNote({
          keys: ['f/4'],
          duration: 'q',
          style: highlightedNote === 'f/4' ? {fillStyle: 'green'} : undefined
        })
      ]

      const voice = new VF.Voice({num_beats: 4, beat_value: 4})
      voice.addTickables(notes)

      const formatter = new VF.Formatter().joinVoices([voice]).format([voice], 400)
      voice.draw(context, stave)
    }
  }, [highlightedNote])

  return <div ref={musicRef}></div>
}

export default SheetMusic
