import { keyframes, styled } from "styled-components";


const spinnerAnimation = keyframes`
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
`

const SpinnerDiv = styled.div<{$color:string,$size:number}>`
    display: inline-block;
    position: relative;
    width: ${props=>props.$size}px;
    height: ${props=>props.$size}px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &>div{
        box-sizing: border-box;
        display: block;
        position: absolute;
        width: 90%;
        height: 90%;
        border: ${props=>Math.round(props.$size*.1)}px solid ${props=>props.$color} ;
        border-radius: 50%;
        animation: ${spinnerAnimation} 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
        border-color: ${props=>props.$color} transparent transparent transparent;
    }

    &>div:nth-child(1) {
        animation-delay: -0.45s;
    }
    &>div:nth-child(2) {
        animation-delay: -0.3s;
    }
    &div:nth-child(3) {
        animation-delay: -0.15s;
    }
`

export const Spinner=({color,size=40}:{color?:string,size?:number})=>{
    return <SpinnerDiv $size={size} $color={color?color:"#665374"}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </SpinnerDiv>
}