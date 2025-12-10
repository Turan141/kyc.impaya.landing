import { JSX, useEffect, useState } from "react";
import { Box } from "../box/Box";
import React from "react";
import Button from "../button/Button";
import Spacer from "../spacer/Spacer";
import Input from "../input/Input";
import { Select } from "../select/Select";
import { Checkbox } from "../checkbox/Checkbox";
import { Error } from "../error/Error";
import { CountriesData } from "../utils/CountriesData"
import { TypoMedium, TypoMid } from "../text/Typo";



export interface IDecoratorField{
    name:string,
    label?:string,
    postfix?:string|JSX.Element,
    sx?:React.CSSProperties,
    type?:"select"|"text"|"number"|"password"|"checkbox"|"date"|"phone"|"email",
    options?:{}[],
    min?:number,
    max?:number,
    regex?:RegExp,
    optional?:boolean,
    placeholder?:string,
    disabled?:boolean,
}

export interface IFieldFactoryProps{
    field:IField
    onChange:(field:IField)=>void,
    index:number,
}

export interface IFormDecorator{
    label?:string,
    direction?:string,
    sx?:React.CSSProperties,
    fields?:(IDecoratorField|string|JSX.Element|IField)[]
    object?:string
    ignoreChilds?:boolean
}

/*export interface IFormItemData{
    label?:string;
    placeholder?:string
    value:any;
    type?:string;
    name:string;
    disabled?:boolean
    multiline?:boolean
    onChange?:(field:IField)=>void;
    sx?:React.CSSProperties;
    options?:any[];
    data:any
}*/

export interface IFormProp{
    onSubmit?:(data:any)=>void;
    onChange?:(data:any)=>void;
    onCancel?:()=>void;
    cancelTitle?:string
    submitTitle?:string
    data:any;
    error?:any
    sx?:React.CSSProperties;
    noLabels?:boolean;
    noPlaceholder?:boolean;
    decorator?:(IFormDecorator|string)[];
    fieldsFactory?:(props:IFieldFactoryProps)=>JSX.Element|IField|null
}

interface IField{
    name:string,
    value:any,
    object?:any
    label?:string
    postifx?:string|JSX.Element
    sx?:React.CSSProperties
    type?:string
    options?:any[]
    multiline?:boolean,
    placeholder?:string,
    onChange?:(field:IField)=>void
    disabled?:boolean
}


const collectFields = (data:any,ignoreChilds?:boolean):IField[] =>{
    let fields = [];
    if(typeof data==="object"){
        for(let i in data){
            if(typeof data[i]!=="object"){
                fields.push({name:i,value:data[i],object:data})
                continue;
            }
            if(ignoreChilds)
               continue;
            const tempFields = collectFields(data[i]);
            for(let j of tempFields)
                fields.push({name:i+"."+j.name,value:j.value,object:data[i]})
        }
    }else
        fields=[{name:"",value:data}]

    return fields;
}


const findObjectByName=(name:string,data:any):any=>{

    const path = name.split(".");
    let target = data;

    if(path.length>1){
        name = path.pop()!;
        for(let i of path){
            if(typeof target==="object")
                target = target[i];
        }
    }

    return target;
}


const findFieldByName=(name:string,data:any):IField|null=>{
    const path = name.split(".");
    let target = data;
    if(path.length>1){
        name = path.pop()!;
        for(let i of path){
            if(typeof target==="object" && target.hasOwnProperty(i) && target[i]!==null && typeof target[i]==="object")
                target = target[i];
        }
        
    }


    if(typeof target==="object"){
        for(let i in target){
            if(i===name){
                return {name:i,value:target[i],object:target};
            }
        }
    }

    return null;
}



export const Form = (req:IFormProp) => {

    const [data,setData] = useState<any>(null);
    useEffect(()=>{
        setData(req.data)
},[req.data])

    if(!data)
        return null;


    const onFieldChange=(field:IField)=>{

        if(field.name.indexOf(".")!==-1){
            const object = findObjectByName(field.name,data);
            object[field.name.split(".").pop()!] = field.value;
        }else{
            if(!field.object){
                console.error("No object found for field",field)
                return;
            }
            field.object[field.name] = field.value;
        }

        const newdata = {...data}

        
        setData(newdata)
        req.onChange?.(newdata)
    }

    let content = null;
    if(req.decorator){

        content=req.decorator.map((d,index)=>{

            // Simple field
            if(typeof d==="string"){
                const field = findFieldByName(d,req.data);
                if(!field)
                    return "no field found";
                return createField(req,field,onFieldChange,index)
            }


            const decorator = d as IFormDecorator;
            
            // FIND FIELD
            let decoratorFields = decorator.fields;
            let formObject = req.data
            let content =[];

            if(d.object){
                formObject = findObjectByName(d.object+".",req.data);
                if(typeof formObject!=="object")
                    return "wrong object type";
            }
            
            if(decorator && decorator.label)
                content.push(<Box sx={decorator.sx} key={index}><Spacer size="20px"/><TypoMid bold>{decorator.label}</TypoMid></Box>)

            
            if(!decoratorFields){
                if(!decorator.object){
                    if(!decorator.label)
                        return "NO DECORATOR FIELDS";
                }
                decoratorFields = collectFields(formObject,d.ignoreChilds);
            }

            

            
            for(let i in decoratorFields){
                if(typeof decoratorFields[i]==="string")
                    decoratorFields[i] = {name:decoratorFields[i]}
                if(React.isValidElement(decoratorFields[i])){
                    decoratorFields[i].key=index+"_"+i;
                    content.push(decoratorFields[i]);
                }
                const decoratorField = decoratorFields[i] as IDecoratorField;
             
                // find formField
                let field = findFieldByName(decoratorField.name,formObject);
           
                if(!field){
                    content.push(<Box sx={decorator.sx} key={index+"_"+i}><TypoMid bold color="red">NO FIELD FOUND: {decoratorField.name}</TypoMid></Box>)
                    continue;
                }

                if(decoratorField.postfix)
                    field.postifx=decoratorField.postfix;

                if(decoratorField.label)
                    field.label=decoratorField.label;

                if(decoratorField.type)
                    field.type=decoratorField.type;
                
                content.push(createField(req,field,onFieldChange,index+"_"+i,decoratorField))
            }

            
            let sx:React.CSSProperties & any={
                gap:"20px",
            }

            if(!decorator.fields && !decorator.object){
                if(decorator.label){
                    return <Box sx={decorator.sx} key={index}><Spacer size="20px"/><TypoMid bold>{decorator.label}</TypoMid></Box>
                }
                return null;
            }

            if(!decorator.direction)
                decorator.direction="row"

            if( decorator.direction==="row" || decorator.direction==="column"){
                sx.display="flex";
                sx.flexDirection=decorator.direction==="row"?"row":"column";
                sx["&>div"]={
                    flexGrow:1,
                }
            }else if(decorator.direction==="grid")
                sx.display="grid";

            sx={...sx,...decorator.sx}
                
            return <Box sx={sx} key={index}>{content}</Box>;
           

        })
    }else{
        // Content based on form
        let fields=collectFields(req.data);
        content = fields.map((field,index)=>{
            return createField(req,field,onFieldChange,index)
        })
    }
    

    return <Box sx={{
        display:"flex",
        flexDirection:"column",
        gap:"20px",
        ...req.sx
    }}>

        <Error sx={{marginTop:"20px"}} error={req?.error} />

        {content}

        {(req.onSubmit  || req.onCancel) && <><Spacer size="20px"/><Box sx={{
            display:"flex",
            gap:"10px"
        }}>
            <Spacer grow />
            {req.onCancel && <Button variant="secondary" onClick={()=>req.onCancel?.()}>{req.cancelTitle?req.cancelTitle:"CANCEL"}</Button>}
            {req.onSubmit && <Button onClick={()=>req.onSubmit?.(data)}>{req.submitTitle?req.submitTitle:"SUBMIT"}</Button>}
        </Box></> }
    </Box>
}


const createField=(req:IFormProp,field:IField,onFieldChange:(field:IField) => void,index:any,decor?:IDecoratorField)=>{
   
        if(req.fieldsFactory){
            const element = req.fieldsFactory({
                field:field,
                onChange:onFieldChange,
                index:index,
            });
            if(React.isValidElement(element))
                return element;
            if(element===null)
                return null;
            
            field = {...field,...element}
        }


        let parseLabel=false;
        if(!field.label && !req.noLabels){
            field.label=field.name;
            parseLabel=true;
        }
     
        
        if(field.label && parseLabel){
            let label = field.label.replaceAll("_"," ");
            field.label=label.charAt(0).toUpperCase()+label.slice(1)
        }

        

        if(decor){
            if(decor.type==="select"){
                field.type="select"
                if(!field.value || field.value==="")
                    field.value="---"
            }
            if(decor.options)
                field.options=decor.options;
        }
        

        if(!field.type){

            if(field.name && field.name.toLowerCase().indexOf("passw")!==-1)
                field.type="password"
            else if(field.name && field.name.toLowerCase()==="url"){
                //capitalize url
                field.label = "URL"
            }else if(field.name && field.name.toLowerCase().indexOf("country")!==-1){
                field.type="select"
                if(!field.value || field.value==="")
                    field.value="---"
                field.options=CountriesData.countries.map((country)=>{
                    return {label:country.name,value:country.code}
                })
            }else if(field.name && field.name.toLowerCase().indexOf("currency")!==-1){
                field.type="select"
                if(!field.value || field.value==="")
                    field.value="---"
                field.options=["EUR","USD"]
            }else if(field.name && field.name.toLowerCase().indexOf("phone")!==-1){
                field.type="phone"
            }else if(field.name==="street"){
                field.multiline=true   
            }else if(field.name.toLowerCase().indexOf("date")!==-1){
                if(field.name.indexOf("Date")!==-1
                    || field.name.indexOf("_date")!==-1
                    || field.name.indexOf("date_")!==-1
                    || field.name.indexOf("date")===0){
                        field.type="date"
                    }
            }else{
                if(!field.type){
                    switch (typeof field.value){
                        case "number":
                            field.type="number"
                        break;
                        case "boolean":
                            field.type="checkbox"
                        break;
                        case "object":
                            if(field.value instanceof Date){
                                field.type="date"
                                field.value = field.value.toISOString().split("T")[0]
                            }
                        break;
                        default:
                            field.type="text"
                        break;
                    }
                }
            }
        }else if(field.type==="select"){
            if(!field.value || field.value==="")
                field.value="---"
        }

        if(req.noLabels){
            
            if(!req.noPlaceholder)
                field.placeholder=field.label+"...";

            field.label=""
        }else{
            if(field.object && field.label && field.label.indexOf("@")!==-1){
                field.label=field.label.split("@").pop();
            }
        }

        return <FormItem {...field} key={index} onChange={onFieldChange}/>
}


const FormItem=(data:IField)=>{


    let input = null;
    if(data.type==="select"){
        // select field
        input = <Select label={data.label} value={data.value} values={data.options} onChange={(e)=>{
            if(typeof e==="object"){
                if("value" in e)
                    e=e.value;
                else
                    e=e+"";
            }

            data.onChange?.({...data,value:e})
        }}/>
    }else{

        if(typeof data.value==="boolean" || data.type==="checkbox"){
            input = <Checkbox name={data.name} label={data.label} onChange={(e)=>{
                data.onChange?.({...data,value:e})
            }}/>
        }else{
 
            // input field
            input = <Input placeholder={data.placeholder} multiline={data.multiline} disable={data.disabled} label={data.label} type={data.type as any} name={data.name} onChange={(e)=>{
                if(data.type==="date"){
                    data.onChange?.({...data,value:new Date(e).toISOString()})
                    return;
                }
                data.onChange?.({...data,value:e})
            }} data={{[data.name]:data.value}} />
        }
        
    }

    let postfix = null;
    if(data.postifx){
        if(typeof data.postifx==="string")
            postfix = <TypoMedium>{data.postifx}</TypoMedium>
        else
            postfix = data.postifx;
    }

    // check if data is 
    return <Box sx={{
        ...data.sx
    }}>
        {postfix ? <Box sx={{
            display:"flex",
            gap:"10px",
            alignItems:"center",
            "&>*:nth-child(1)":{
                flexGrow:1
            }
        }}>{input}{postfix}</Box> : <>{input}</>}
        
    </Box>
}