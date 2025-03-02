// Modified piano container to accept visibility prop
import styled from 'styled-components'

export const PianoContainer = styled.div<{ isVisible: boolean }>`
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 10px 0;
    background-color: #333;
    display: flex;
    justify-content: center;
    z-index: 1000;
    height: ${props => props.isVisible ? 'auto' : '0'};
    overflow: hidden;
    transition: height 0.3s ease-in-out;
    visibility: ${props => props.isVisible ? 'visible' : 'hidden'};
`
export const OctaveContainer = styled.div`
    position: relative;
    margin: 0 5px;
    display: inline-block;
`
export const WhiteKeysContainer = styled.div`
    display: flex;
`

export interface KeyProps {
  active?: boolean | null;
  suggested?: boolean | null;
}

export const WhiteKey = styled.div<KeyProps>`
    width: 40px;
    height: 150px;
    background: ${({active, suggested}) =>
            active ? '#4caf50' : suggested ? '#2196F3' : 'white'};
    border: 1px solid ${({active, suggested}) =>
            active ? '#4caf50' : suggested ? '#2196F3' : '#000'};
    position: relative;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    user-select: none;
    transition: background 0.2s, border 0.2s;
`
export const BlackKey = styled.div<{ leftOffset: number } & KeyProps>`
    width: 25px;
    height: 90px;
    background: ${({active, suggested}) =>
            active ? '#4caf50' : suggested ? '#2196F3' : 'black'};
    border: 1px solid ${({active, suggested}) =>
            active ? '#4caf50' : suggested ? '#2196F3' : '#333'};
    position: absolute;
    left: ${({leftOffset}) => leftOffset}px;
    top: 0;
    border-radius: 0 0 3px 3px;
    cursor: pointer;
    z-index: 2;
    user-select: none;
    transition: background 0.2s, border 0.2s;
`
export const KeyLabel = styled.span`
    font-size: 10px;
    margin-bottom: 5px;
    pointer-events: none;
`
