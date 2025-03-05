// Styled Components
import styled from 'styled-components'
import {Slider} from 'antd'

export const ControlsContainer = styled.div`
    background: #f9f9f9;
    padding: 16px;
    border-radius: 8px;
    border: 1px solid #f0f0f0;
    margin-bottom: 16px;
`
export const SectionTitle = styled.h4`
    margin: 0 8px 0 32px;
    color: #555;
    font-size: 14px;
`
export const ControlSection = styled.div`
    display:flex;
    align-items: center;
`
export const TempoSlider = styled(Slider)`
    width: 200px;
    margin-right: 16px;
`
