import { Box } from "../box/Box"

interface IPreProps{
    children?:any
    data:any
}

const Pre = ({children,data}:IPreProps) =>{
    
    return <Box sx={{
        whiteSpace:"pre",
        fontFamily:"monospace",
        padding:"10px",
        backgroundColor:"darkblue",
        color:"cyan",
        overflowX:"auto"
    }}>{data && JSON.stringify(data,null,2)}{children}</Box>
}

export default Pre