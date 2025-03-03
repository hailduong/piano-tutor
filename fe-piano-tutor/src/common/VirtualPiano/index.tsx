import React, {useRef, useEffect, useState} from 'react'
import styled from 'styled-components'
import {useDispatch, useSelector} from 'react-redux'
import {RootState} from 'store'
import {setCurrentNote} from 'store/slices/musicNotesSlice'
import {useMusicTheory} from 'contexts/MusicTheoryContext'
import {UpOutlined, DownOutlined} from '@ant-design/icons'
import {Button} from 'antd'
import {
  KeyLabel,
  BlackKey,
  WhiteKey,
  WhiteKeysContainer,
  OctaveContainer,
  PianoContainer
} from 'common/VirtualPiano/styles/VirtualPiano.style'
import { useMIDIHandler } from 'pages/LearnSong/hooks/useMIDIHandler'

// Added a toggle button styled component
const ToggleButton = styled(Button)<{ isVisible: boolean }>`
    position: fixed;
    bottom: ${props => props.isVisible ? '138px' : '20px'};
    right: 0;
    z-index: 1001;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`

// Frequency helpers (using A4 = 440Hz as reference)
const baseFrequencies: { [note: string]: number } = {
  C: 261.63,
  D: 293.66,
  E: 329.63,
  F: 349.23,
  G: 392.00,
  A: 440.00,
  B: 493.88,
  'C#': 277.18,
  'D#': 311.13,
  'F#': 369.99,
  'G#': 415.30,
  'A#': 466.16
}

// MIDI note conversion helper
const getNoteToMIDI = (note: string, octave: number): number => {
  const noteValues: { [key: string]: number } = {
    'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5,
    'F#': 6, 'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11
  }

  return (octave + 1) * 12 + noteValues[note]
}

// White keys for one octave (C, D, E, F, G, A, B)
interface WhiteKeyData {
  note: string;
  octave: number;
}

const createWhiteKeysForOctave = (octave: number): WhiteKeyData[] => {
  return [
    {note: 'C', octave},
    {note: 'D', octave},
    {note: 'E', octave},
    {note: 'F', octave},
    {note: 'G', octave},
    {note: 'A', octave},
    {note: 'B', octave}
  ]
}

// Black keys within one octave (positions relative to white keys)
interface BlackKeyData {
  note: string;
  octave: number;
  left: number;
}

const createBlackKeysForOctave = (octave: number): BlackKeyData[] => {
  return [
    {note: 'C#', octave, left: 28},
    {note: 'D#', octave, left: 68},
    // No black key between E and F
    {note: 'F#', octave, left: 148},
    {note: 'G#', octave, left: 188},
    {note: 'A#', octave, left: 228}
  ]
}

const VirtualPiano: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true)
  const { playNote, instrumentLoading } = useMIDIHandler()
  const dispatch = useDispatch()
  const {currentNote, suggestedNote} = useSelector((state: RootState) => state.musicNotes)
  const {showTheoryAnnotations, currentTheoryConcept} = useMusicTheory()

  const toggleVisibility = () => {
    setIsVisible(!isVisible)
  }

  // Add a function for getting theory hints for each key
  const getTheoryHint = (note: string, octave: number): string | null => {
  if (!showTheoryAnnotations) return null

    switch (currentTheoryConcept) {
      case 'scales-keys':
        if (note === 'C') return 'Root'
        if (note === 'G') return 'Fifth'
        if (note === 'E') return 'Third'
        break
      case 'chords':
        if (note === 'C' && octave === 4) return 'Root'
        if (note === 'E' && octave === 4) return 'Third'
        if (note === 'G' && octave === 4) return 'Fifth'
        break
      case 'intervals':
        if (note === 'C' && octave === 4) return 'Root'
        if (note === 'E' && octave === 4) return 'M3'
        if (note === 'G' && octave === 4) return 'P5'
        break
    }

  return null
  }

  const handlePlayNote = (note: string, octave: number) => {
    const noteData = {
      note,
      length: 'q', // default quarter note
      timestamp: Date.now(),
      octave
    }

    // Dispatch the note info to Redux
    dispatch(setCurrentNote(noteData))

    // Convert to MIDI note number and play using the MIDI handler
    const midiNote = getNoteToMIDI(note, octave)
    playNote(midiNote, 500, 100) // 500ms duration, medium velocity
  }

  // Render three octaves: lower (3), middle (4), upper (5)
  const octaves = [3, 4, 5]

  return (
    <>
      <ToggleButton
        type="primary"
        icon={isVisible ? <DownOutlined/> : <UpOutlined/>}
        onClick={toggleVisibility}
        isVisible={isVisible}
      />
      <PianoContainer className='shadow-lg' isVisible={isVisible}>
        {instrumentLoading && <div style={{color: 'white', padding: '10px'}}>Loading piano sounds...</div>}
        {octaves.map((octave) => (
          <OctaveContainer key={octave}>
            <WhiteKeysContainer>
              {createWhiteKeysForOctave(octave).map((keyData) => {
                const isActive =
                  currentNote &&
                  currentNote.note === keyData.note &&
                  currentNote.octave === keyData.octave
                const isSuggested =
                  suggestedNote &&
                  suggestedNote.note === keyData.note &&
                  suggestedNote.octave === keyData.octave
                return (
                  <WhiteKey
                    key={`${keyData.note}${octave}`}
                    onClick={() => handlePlayNote(keyData.note, octave)}
                    active={isActive}
                    suggested={isSuggested}
                  >
                    <KeyLabel>
                      {keyData.note}
                      {octave}
                    </KeyLabel>
                    {showTheoryAnnotations && (
                      <div style={{
                        fontSize: '8px',
                        position: 'absolute',
                        bottom: '20px',
                        color: '#1677ff'
                      }}>
                        {getTheoryHint(keyData.note, octave)}
                      </div>
                    )}

                  </WhiteKey>
                )
              })}
            </WhiteKeysContainer>
            {createBlackKeysForOctave(octave).map((bk) => {
              const isActive =
                currentNote &&
                currentNote.note === bk.note &&
                currentNote.octave === bk.octave
              const isSuggested =
                suggestedNote &&
                suggestedNote.note === bk.note &&
                suggestedNote.octave === bk.octave
              return (
                <BlackKey
                  key={`${bk.note}${octave}`}
                  leftOffset={bk.left}
                  onClick={(e) => {
                    e.stopPropagation()
                    handlePlayNote(bk.note, octave)
                  }}
                  active={isActive}
                  suggested={isSuggested}
                >
                  <KeyLabel style={{color: 'white'}}>
                    {bk.note}
                    {octave}
                  </KeyLabel>
                  {showTheoryAnnotations && (
                    <div style={{
                      fontSize: '8px',
                      position: 'absolute',
                      bottom: '15px',
                      color: '#2196F3'
                    }}>
                      {getTheoryHint(bk.note, octave)}
                    </div>
                  )}
                </BlackKey>
              )
            })}
          </OctaveContainer>
        ))}
      </PianoContainer>
    </>
  )
}

export default VirtualPiano
