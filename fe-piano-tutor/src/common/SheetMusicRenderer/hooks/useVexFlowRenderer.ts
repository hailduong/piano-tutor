// hooks/useVexFlowRenderer.ts
import {useRef, useEffect} from 'react'
import Vex from 'vexflow'
import {USER_CONFIG} from 'config'

export const useVexFlowRenderer = (notes: Vex.StaveNote[], currentNote: any, suggestedNote: any, tempo: number) => {
  const musicRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<Vex.Renderer | null>(null)

  const clearMusicSheet = () => {
    if (musicRef.current) {
      while (musicRef.current.firstChild) {
        musicRef.current.removeChild(musicRef.current.firstChild)
      }
    }
  }

  const renderSheetMusic = (
    notes: Vex.StaveNote[],
    context: Vex.RenderContext,
    stave: Vex.Stave,
    currentNote: any,
    setLastKeyPressIncorrect: (value: boolean) => void
  ) => {
    notes.forEach((note, index) => {
      if (index === 0 && currentNote) {
        const expectedKey = note.getKeys()[0].toLowerCase()
        const playedKey = currentNote.note.toLowerCase() + '/' + currentNote.octave
        if ((expectedKey !== playedKey)) {
          note.setStyle({fillStyle: '#f44336'})
          setLastKeyPressIncorrect(true)
        } else {
          note.setStyle({fillStyle: '#4caf50'})
          setLastKeyPressIncorrect(false)
        }
      } else {
        note.setStyle({fillStyle: 'black'})
      }

      const keys = note.getKeys()
      keys.forEach((key, keyIndex) => {
        const accidental = key.match(/[#b]/)
        if (accidental) {
          note.addModifier(new Vex.Flow.Accidental(accidental[0]), keyIndex)
        }
      })
    })
  }

  return {
    musicRef,
    rendererRef,
    clearMusicSheet,
    renderSheetMusic
  }
}
