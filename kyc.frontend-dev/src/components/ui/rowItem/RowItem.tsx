import { Box } from "../box/Box"

export interface IRowItemProps<T>{
    data:any,
    onClick?:()=>void
    menu?:{
        callback:(data:T,id:number)=>void,
        id:number,
        name:string
    }[]
}

export const RowItem =<T,> ({data}:IRowItemProps<T>)=>{

    // determine status
    let status=null;
    if("status" in data){
        status = data.status
    }
    console.log(status)

    return <Box>
        row item
    </Box>
}

