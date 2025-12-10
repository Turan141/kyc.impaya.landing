import React, { useState } from "react"
import { ReactElement } from "react"
import { Box, HBox } from "../box/Box"
import { Typo } from "../text/Typo"


export interface ITabsProps {
    children?:ReactElement<ITabItemProps>[]|ReactElement<ITabItemProps>
    selected?:number
    sx?:React.CSSProperties
    scrollable?:boolean
    background?:string
}

export interface ITabItemProps {
    title:string,
    children?:any
}

export const Tabs = ({children,scrollable,background,selected,sx}:ITabsProps) => {
    
    if(selected === undefined || isNaN(selected))
        selected = 0;

    const [currentSelection,setCurrentSelection] = useState(selected);

    if(!children)
        return null;

    if(!Array.isArray(children) && React.isValidElement(children))
        children = [children]

    let tabs = children?.map((val,index)=>{
        return <HBox key={index} sx={{
            padding:"15px 20px",
            cursor:"pointer",
            borderBottom:currentSelection===index?"2px solid textPrimary":"2px solid rgba(0,0,0,.1)",
            color:currentSelection===index?"textPrimary":"textSecondary",
            transition:"border-bottom .3s,color .3s",
            overflow:"hidden",
        }} onClick={()=>{
            setCurrentSelection(index)
        }}>
            <Typo block sx={{
                whiteSpace:"nowrap",
                textOverflow:"ellipsis",
                overflow:"hidden",
            }}>{val.props.title}</Typo>
        </HBox>
    })

    let current = children[currentSelection].props.children;
    if(scrollable){
        current = <Box sx={{
            overflow:"auto",
            flexGrow:1,
            ...sx
        }}>
            {current}
        </Box>
    }else if(sx){
        current = <Box sx={{
            ...sx
        }}>
            {current}
        </Box>
    }

    

    
    return <>
        <HBox sx={{
            background:background?background:"transparent",
        }}>
            {tabs}
            <Box sx={{borderBottom:"2px solid rgba(0,0,0,.1)",flexGrow:"1"}}></Box>
        </HBox>
        
        {current}
    </>
}

export const TabItem:React.FC<ITabItemProps>  = ({children}) => {
    return <>{children}</>
}