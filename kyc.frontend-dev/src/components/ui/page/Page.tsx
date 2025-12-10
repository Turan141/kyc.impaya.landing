import { Box } from "../box/Box"
import Button from "../button/Button"

interface IPageProps{
    children?:React.ReactNode,
    leftSection?:React.ReactNode,
    onBack?:()=>void
}

export const Page = (props: IPageProps) => {
    
    return <Box sx={{
        display:"grid",
        //gridTemplateColumns:"minmax(600px,1fr) minmax(250px, 400px)",
        gap:"20px",
    }}>
        <Box>
            {props.onBack && <>
                <Box sx={{display:"flex"}} >
                    <Button variant="empty" onClick={props.onBack}>Back</Button>
                </Box></>
            }
            {props.children}
        </Box>
       
    </Box>
}