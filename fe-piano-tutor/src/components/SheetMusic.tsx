import React, {useEffect, useRef, useState} from 'react'
import Vex from 'vexflow'
import styled from 'styled-components'

const MusicContainer = styled.div`
    background-color: white;
    padding: 10px;
    border: 1px solid #ccc;
`

const SheetMusic: React.FC = () => {
  const musicRef = useRef<HTMLDivElement>(null)
  const [highlightedNote, setHighlightedNote] = useState<string | null>(null)

  useEffect(() => {
    const expectedTimings = { 'c/4': 1000, 'd/4': 2000, 'e/4': 3000, 'f/4': 4000 }; // Example
    let startTime = Date.now();

    // Initialize MIDI
    const initMidi = async () => {
      if (navigator.requestMIDIAccess) {
        const midiAccess = await navigator.requestMIDIAccess()
        midiAccess.inputs.forEach((input) => {
          input.onmidimessage = (message) => {
            const [command, note] = message.data
            if (command === 144) {
              // Note On - Highlight Note
              const noteName = getNoteName(note)
              console.log('Note name:', noteName)
              setHighlightedNote(noteName)


              // Check timing
              const playedAt = Date.now() - startTime;
              if (Math.abs(playedAt - expectedTimings[noteName]) < 100) {
                console.log(`${noteName} played on time`);
              } else if (playedAt < expectedTimings[noteName]) {
                console.log(`${noteName} played early`);
              } else {
                console.log(`${noteName} played late`);
              }
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

      // Clear the canvas
      context.clearRect(0, 0, 500, 200)

      const stave = new VF.Stave(10, 40, 400)
      stave.addClef('treble').addTimeSignature('4/4')
      stave.setContext(context).draw()

      const notes = [
        new VF.StaveNote({
          keys: ['c/4'],
          duration: 'q'
        }),
        new VF.StaveNote({
          keys: ['d/4'],
          duration: 'q'
        }),
        new VF.StaveNote({
          keys: ['e/4'],
          duration: 'q'
        }),
        new VF.StaveNote({
          keys: ['f/4'],
          duration: 'q'
        })
      ]

      notes.forEach((note) => {
        if (highlightedNote === note.getKeys()[0]) {
          note.setStyle({fillStyle: 'green'})
        } else {
          note.setStyle({fillStyle: 'black'})
        }
      })

      const voice = new VF.Voice({num_beats: 4, beat_value: 4})
      voice.addTickables(notes)

      const formatter = new VF.Formatter().joinVoices([voice]).format([voice], 400)
      voice.draw(context, stave)
    }
  }, [highlightedNote])

  return <MusicContainer ref={musicRef}></MusicContainer>
}

export default SheetMusic
