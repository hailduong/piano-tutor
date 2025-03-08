import React, {FC, useState, useEffect} from 'react'
import {useDispatch} from 'react-redux'
import {setTotalConcepts} from 'store/slices/performanceSlice'
import {useSelector} from 'react-redux'
import {RootState} from 'store'
import ConceptList from './ConceptList'
import ConceptDetail from 'pages/MusicTheory/ConceptDetail'

export const enum EView {
  CONCEPT_LIST = 'conceptList',
  CONCEPT_DETAIL = 'conceptDetail'
}

const MusicTheory: FC = () => {
  const dispatch = useDispatch()
  const {conceptList} = useSelector((state: RootState) => state.musicTheory)

  // Local states
  const [view, setView] = useState<EView>(EView.CONCEPT_LIST)

  // Dispatch setTotalConcepts when conceptList changes.
  useEffect(() => {
    dispatch(setTotalConcepts(conceptList.length))
  }, [dispatch, conceptList])

  return view === EView.CONCEPT_LIST ? (
    <ConceptList setView={setView}/>
  ) : (
    <ConceptDetail setView={setView}/>
  )
}

export default MusicTheory
