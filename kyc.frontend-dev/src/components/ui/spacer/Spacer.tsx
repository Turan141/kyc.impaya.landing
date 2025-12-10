import { forwardRef } from "react";
import { Box } from "../box/Box";

interface ISpacerProps {
  size?: string;
  grow?: boolean;
  minHeight?: string;
}
const Spacer = forwardRef(({ size, grow, minHeight }: ISpacerProps,ref)=>{
 
    return (
      <Box
        ref={ref}
        sx={{
          minWidth: size,
          minHeight: minHeight ? minHeight : size,
          flexShrink: minHeight ? "0" : "unset",
          maxWidth: size,
          maxHeight: size,
          width: size,
          height: !minHeight?minHeight:size,
          flexGrow: grow ? "1" : undefined,
        }}
      />
    );
  
});

export default Spacer;
