// Styled Components
import styled from 'styled-components'

export const SheetMusicRendererStyled = styled.div`
    background-color: white;
    padding: 10px;
    border: 1px solid #ccc;
    overflow: hidden;
    width: 100%;
    position: relative;
`
export const ScrollingContainer = styled.div`
    display: inline-block;
    width: 3600px;
`
export const TempoDisplay = styled.div`
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: rgba(255, 255, 255, 0.8);
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 0.9em;
    font-weight: bold;
`
export const TheoryAnnotation = styled.div`
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(225, 245, 254, 0.9);
    padding: 5px 10px;
    border-radius: 4px;
    border: 1px solid #90caf9;
    font-size: 0.9em;
    color: #0277bd;
    max-width: 90%;
    text-align: center;
`
