import styled from 'styled-components'
import {SheetMusicRendererStyled} from 'common/SheetMusicRenderer/styles/SheetMusicRenderer.styled'

export const SongSheetContainer = styled(SheetMusicRendererStyled)`
    position: relative;
    overflow-x: auto;
    overflow-y: hidden;
    width: 100%;
    height: 300px;
    background: #fff;
    border-radius: 4px;
    border: 1px solid #f0f0f0;
    padding: 16px;
`
export const NoteHighlight = styled.div<{ isActive: boolean }>`
    position: absolute;
    background-color: ${props => props.isActive ? 'rgba(76, 175, 80, 0.3)' : 'rgba(33, 150, 243, 0.1)'};
    border-radius: 4px;
    transition: all 0.3s ease;
    pointer-events: none;
`
export const ProgressOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.05);
    pointer-events: none;
`
