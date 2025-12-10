import { jsxs as _jsxs } from "react/jsx-runtime";
import { Box } from "../box/Box";
var Pre = function (_a) {
    var children = _a.children, data = _a.data;
    return _jsxs(Box, { sx: {
            whiteSpace: "pre",
            fontFamily: "monospace",
            padding: "10px",
            backgroundColor: "darkblue",
            color: "cyan",
            overflowX: "auto"
        }, children: [data && JSON.stringify(data, null, 2), children] });
};
export default Pre;
