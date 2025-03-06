import styled from 'styled-components'
import {Card} from 'antd'

export const ConceptCard = styled(Card)<{ completed: boolean }>`
    cursor: pointer;
    transition: all 0.3s;
    border: ${({completed}) => (completed ? '2px solid #52c41a' : '1px solid #d9d9d9')};

    &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transform: translateY(-5px);
    }
`
export const ConceptImage = styled.div<{ imgSrc?: string }>`
    width: 100%;
    height: 50px;
    border-radius: 4px;
    margin-bottom: 16px;
    background: ${props => props.imgSrc ? `url(${props.imgSrc}) center/cover no-repeat` : '#f0f2f5'};
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999;
    font-size: 18px;
`
export const QuizContainer = styled.div`
    background-color: #f5f5f5;
    border-radius: 8px;
    margin-top: 20px;
`
export const ConceptList = styled.div`
  
`
export const ConceptDetail = styled.div`
    .ant-tabs-nav-list .ant-icon {
        margin-right: 8px;
    }
`
