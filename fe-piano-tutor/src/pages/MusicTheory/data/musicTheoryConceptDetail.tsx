import React from 'react'
import {beginnerConcepts} from 'pages/MusicTheory/data/concepts/beginnerConcepts'
import {elementaryConcepts} from 'pages/MusicTheory/data/concepts/elementaryConcepts'
import {intermediateConcepts} from 'pages/MusicTheory/data/concepts/intermediateConcepts'
import {advancedConcepts} from 'pages/MusicTheory/data/concepts/advancedConcepts'
import {professionalConcepts} from 'pages/MusicTheory/data/concepts/proConcepts'

const musicTheoryConceptDetail: Record<string, React.ReactNode> = {
  ...beginnerConcepts,
  ...elementaryConcepts,
  ...intermediateConcepts,
  ...advancedConcepts,
  ...professionalConcepts
}

export default musicTheoryConceptDetail
