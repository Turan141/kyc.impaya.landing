import Signal, { Req } from "badmfck-signal";
import Panel from "../panel/Panel";
import ReactDOM from "react-dom";
import { useEffect, useState } from "react";
import { Box } from "../box/Box";

export interface IDialogRequest{
    content:any,
    title?:string
}
export interface IDialogResponse{

}

const S_DIALOG = new Signal<any>("S_DIALOG");
export const REQ_DIALOG = new Req<IDialogRequest,IDialogResponse|null>(async data=>{
    return new Promise((resolve)=>{
        S_DIALOG.invoke({data,resolve:resolve});
    })
},"REQ_DIALOG");


let placeholder = document.getElementById("ui-portal-dialog");
if(!placeholder){
    placeholder = document.createElement("div")
    placeholder.id="ui-portal-dialog"
    document.body.appendChild(placeholder)
}


export const Digalog = () =>{
    
    const [dialogData,setDialogData]=useState<{data:IDialogRequest,resolve:any}|null>(null)
    useEffect(()=>{
        S_DIALOG.subscribe(data=>{
            setDialogData(data)
        })
    },[])
    
    if(!dialogData)
        return null;

    const content = dialogData.data.content;
    let innerContent = null;
    let label=dialogData.data.title ?? "Information";
    if(typeof content ==="object" && "code" in content && "message" in content){
        innerContent = <Box>{content.code} - {content.message}
        {content.details && <Box>{content.details}</Box>}
        </Box>
    }

    //TODO: ATTACH BUTTONS

    const component = <Panel label={label} decorator="absolute" onClose={()=>{
        if(dialogData.resolve && typeof dialogData.resolve === "function")
            dialogData.resolve()
        setDialogData(null)
    }}>
        {innerContent}
        
    </Panel>

    return ReactDOM.createPortal(component,placeholder)
}