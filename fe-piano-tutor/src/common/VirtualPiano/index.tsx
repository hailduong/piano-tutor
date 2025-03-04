import React, {useState} from 'react'
import styled from 'styled-components'
import {useDispatch, useSelector} from 'react-redux'
import {RootState} from 'store'
import {setCurrentNote} from 'store/slices/musicNotesSlice'
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
import {useMIDIHandler} from 'pages/SongLibrary/LearnSong/hooks/useMIDIHandler'
import pianoUtils from 'common/VirtualPiano/pianoUtils'

/* Styled Components */
const ToggleButton = styled(Button)<{ isVisible: boolean }>`
    position: fixed;
    bottom: ${props => props.isVisible ? '138px' : '0'};
    right: 0;
    z-index: 1001;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`


const VirtualPiano: React.FC = () => {
  /* Props & Store */
  const dispatch = useDispatch()

  /// Get current and suggested notes from Redux
  const musicNotesState = useSelector((state: RootState) => state.musicNotes)
  const currentNote = musicNotesState?.currentNote
  const suggestedNote = musicNotesState?.suggestedNote

  // Get music theory state from Redux
  const musicTheoryState = useSelector((state: RootState) => state.musicTheory)
  const showTheoryAnnotations = musicTheoryState?.showTheoryAnnotations
  const currentTheoryConcept = musicTheoryState?.currentTheoryConcept

  /* State */
  // Control piano visibility on screen
  const [isVisible, setIsVisible] = useState(true)

  /* Hooks */
  // MIDI sound handler
  const {playNote, instrumentLoading} = useMIDIHandler()

  /* Handlers */
  // Toggle piano visibility
  const toggleVisibility = () => {
    setIsVisible(!isVisible)
  }

  // Handle note playing and state update
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
    const midiNote = pianoUtils.getNoteToMIDI(note, octave)
    playNote(midiNote, 500, 100) // 500ms duration, medium velocity
  }

  /* Render */
  // Define octave range to display (3 octaves: lower, middle, upper)
  const octaves = [3, 4, 5]

  return (
    <>
      <ToggleButton
        type="primary"
        icon={isVisible ? <DownOutlined/> : <UpOutlined/>}
        onClick={toggleVisibility}
        isVisible={isVisible}
      />
      <PianoContainer className="shadow-lg" isVisible={isVisible}>
        {instrumentLoading && <div style={{color: 'white', padding: '10px'}}>Loading piano sounds...</div>}

        {/* Render octaves */}
        {octaves.map((octave) => (
          <OctaveContainer key={octave}>
            {/* Render white keys */}
            <WhiteKeysContainer>
              {pianoUtils.createWhiteKeysForOctave(octave).map((keyData) => {
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
                        {pianoUtils.getTheoryHint(currentTheoryConcept, keyData.note, octave)}
                      </div>
                    )}
                  </WhiteKey>
                )
              })}
            </WhiteKeysContainer>

            {/* Render black keys */}
            {pianoUtils.createBlackKeysForOctave(octave).map((bk) => {
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
                      {pianoUtils.getTheoryHint(currentTheoryConcept, bk.note, octave)}
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
