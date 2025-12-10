import { Typo } from "../text/Typo"
import { Box, HBox, VBox } from "../box/Box"
import Spacer from "../spacer/Spacer"
import React from "react"

export const Informer = ({title,content,subcontent,icon}:{title:any,content:any,subcontent?:any,icon?:any}) =>{

    if(typeof content!=="string" && typeof content !=="number" && typeof content!=="boolean" && !React.isValidElement(content))
         try{content =JSON.stringify(content,null,2)}catch(e){content = content+""}

    return <VBox sx={{
        backgroundColor:"panelBackgroundPrimary",
        padding:"20px",
        borderRadius:"4px",
        cursor:"pointer",
        minHeight:"150px",
        boxShadow:"0px 2px 3px rgba(0,0,0,0.25)",
        gap:"10px",
    }}>
        <HBox>
            <Typo variant="headMedium" block>{title}</Typo>
            <Spacer grow/>
            <Box>{icon}</Box>
        </HBox>
        <Spacer grow/>
        {(typeof content==="string" || typeof content==="number")?<Typo variant="head">{content}</Typo>:content}
        {(typeof subcontent==="string" || typeof subcontent==="number")?<Typo variant="text">{subcontent}</Typo>:content}
    </VBox>
}