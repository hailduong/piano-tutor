import {useState, useEffect, useRef} from 'react'
import Soundfont from 'soundfont-player'

interface UseMIDIHandlerResult {
  midiAccess: WebMidi.MIDIAccess | null;
  playNote: (midiNote: number, duration?: number, velocity?: number) => void;
  hasSupport: boolean;
  instrumentLoading: boolean;
}

export const useMIDIHandler = (): UseMIDIHandlerResult => {
  const [midiAccess, setMidiAccess] = useState<WebMidi.MIDIAccess | null>(null)
  const [hasSupport, setHasSupport] = useState<boolean>(true)
  const [instrumentLoading, setInstrumentLoading] = useState<boolean>(true)
  const audioContext = useRef<AudioContext | null>(null)
  const instrument = useRef<Soundfont.Player | null>(null)

  // Initialize Audio and load instrument
  useEffect(() => {
    // Initialize Web Audio API
    try {
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      const ac = audioContext.current

      // Load piano soundfont
      setInstrumentLoading(true)
      Soundfont.instrument(ac, 'acoustic_grand_piano', {soundfont: '/soundfonts/roland_gm.sf2'})
        .then(piano => {
          instrument.current = piano
          console.log('Piano soundfont loaded successfully')
          setInstrumentLoading(false)
        })
        .catch(err => {
          console.error('Error loading piano soundfont:', err)
          setInstrumentLoading(false)
        })
    } catch (e) {
      console.error('Web Audio API is not supported in this browser:', e)
      setHasSupport(false)
      setInstrumentLoading(false)
    }

    // Also try to initialize MIDI access for external devices
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess()
        .then((access) => {
          console.log('MIDI Access initialized:', access)
          setMidiAccess(access)
        })
        .catch((err) => console.error('Error requesting MIDI access:', err))
    } else {
      console.log('Web MIDI API is not supported in this browser.')
    }
  }, [])

  // Function to play a note using Soundfont or fallback to oscillator
  const playNote = (midiNote: number, duration = 500, velocity = 0x7f) => {
    // First try to play using Soundfont instrument
    console.log('Playing note:', midiNote, instrument.current)
    if (instrument.current) {
      const options = {
        duration: duration / 1000,
        gain: velocity / 127
      }
      instrument.current.play(midiNote, audioContext.current?.currentTime, options)
      return
    }
  }

  return {
    midiAccess,
    playNote,
    hasSupport,
    instrumentLoading
  }
}
