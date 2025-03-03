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
} from 'common/VirtualPiano/VirtualPiano.style'

// Added a toggle button styled component
const ToggleButton = styled(Button)<{ isVisible: boolean }>`
    position: fixed;
    bottom: ${props => props.isVisible ? '160px' : '20px'};
    right: 20px;
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

const getFrequency = (note: string, octave: number): number => {
  const base = baseFrequencies[note]
  if (!base) return 0
  return base * Math.pow(2, octave - 4)
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
  const audioContextRef = useRef<AudioContext | null>(null)
  const dispatch = useDispatch()
  const {currentNote, suggestedNote} = useSelector((state: RootState) => state.musicNotes)
  const {showTheoryAnnotations, currentTheoryConcept} = useMusicTheory()

  const toggleVisibility = () => {
    setIsVisible(!isVisible)
  }

  useEffect(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
  }, [])

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

  const playNote = (note: string, octave: number) => {
    const noteData = {
      note,
      length: 'q', // default quarter note
      timestamp: Date.now(),
      octave
    }

    // Dispatch the note info to Redux
    dispatch(setCurrentNote(noteData))

    const frequency = getFrequency(note, octave)
    if (!frequency || !audioContextRef.current) return

    const oscillator = audioContextRef.current.createOscillator()
    const gainNode = audioContextRef.current.createGain()

    oscillator.frequency.value = frequency
    oscillator.type = 'sine'
    oscillator.connect(gainNode)
    gainNode.connect(audioContextRef.current.destination)

    oscillator.start()
    gainNode.gain.setValueAtTime(1, audioContextRef.current.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current.currentTime + 0.5)
    oscillator.stop(audioContextRef.current.currentTime + 0.5)
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
      <PianoContainer isVisible={isVisible}>
        {octaves.map((octave) => (
          <OctaveContainer key={octave}>
            <WhiteKeysContainer>
              {createWhiteKeysForOctave(octave).map((keyData) => {
                // Determine if this key should be highlighted as active or suggested
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
                    onClick={() => playNote(keyData.note, octave)}
                    active={isActive}
                    suggested={isSuggested}
                  >
                    <KeyLabel>
                      {keyData.note}
                      {octave}
                    </KeyLabel>

                    {/* Add theory hint if available */}
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
                    playNote(bk.note, octave)
                  }}
                  active={isActive}
                  suggested={isSuggested}
                >
                  <KeyLabel style={{color: 'white'}}>
                    {bk.note}
                    {octave}
                  </KeyLabel>
                  {/* Add theory hint if available */}
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
