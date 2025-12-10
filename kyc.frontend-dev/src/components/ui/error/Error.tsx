import { Box } from "../box/Box";
import { TypoError, TypoMedium } from "../text/Typo";

export const Error = ({error,sx}:{error?:any,sx?:React.CSSProperties}) =>{

    let displayError=null;
    
    if(error){
        if(typeof error==="object" && "code" in error && "message" in error)
            displayError = error;
        else{
            if(typeof error==="string" || typeof error==="number" || typeof error==="boolean")
                displayError={code:0,message:error}
            else{

                if(typeof error==="object" && ("code" in error || "message" in error)){
                    displayError=error.error
                }else{
                    try{
                        const content = JSON.stringify(error)
                        displayError={code:1,message:content}
                    }catch(e){
                        displayError={code:2,message:"unknown error"}
                    }
                }
            }
        }
    }

    if(!displayError)
        return null;

    if(displayError.code<=-100)
        return null;

    return <Box sx={{
        border:"1px dashed red",
        padding:"10px",
        borderRadius:"6px",
        backgroundColor:"rgba(255,0,0,0.1)",
        ...sx
    }}>
        <TypoError>
            {displayError.message}    
        </TypoError>
        {displayError.details && <TypoMedium block>{displayError.details}</TypoMedium>}
    </Box>
}