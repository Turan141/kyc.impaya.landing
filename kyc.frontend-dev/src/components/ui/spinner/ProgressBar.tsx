
import styled, { keyframes } from "styled-components"
import Spacer from "../spacer/Spacer"

const spinnerAnimation = keyframes`
    0% {
      transform: scaleX(0);
    }
    50% {
      transform: scaleX(1);
    }
    100% {
      transform: scaleX(0);
    }
`

const ProgressBarDiv = styled.div<{$color:string}>`
    position: relative;
    width: 100%;
    height: 2px;
    
    &>div{
        box-sizing: border-box;
        display: block;
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: ${props=>props.$color};
        animation: ${spinnerAnimation} 1.5s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    }
`

export const ProgressBar = ({busy}:{busy?:boolean}) =>{
    if(!busy)
        return <Spacer size="2px"/>
    return <ProgressBarDiv $color="#5500a9">
        <div></div>
    </ProgressBarDiv>
}