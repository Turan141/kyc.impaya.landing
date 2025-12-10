import { useEffect, useState } from "react"
export const useWindowSize = () => {
    const [size, setSize] = useState<{ width: number, height: number }>({
        width: window.innerWidth,
        height: window.innerHeight
    })

    useEffect(() => {
        // Added deboucne
        let timeoutId: number;

        const resize = () => {
            clearTimeout(timeoutId);
            timeoutId = window.setTimeout(() => {
                // If size change less then 5px we ignore it
                const newWidth = window.innerWidth;
                const newHeight = window.innerHeight;

                if (Math.abs(newHeight - size.height) > 5 ||
                    Math.abs(newWidth - size.width) > 5) {
                    setSize({ width: newWidth, height: newHeight });
                }
            }, 100);
        };

        window.addEventListener("resize", resize);
        return () => {
            window.removeEventListener("resize", resize);
            clearTimeout(timeoutId);
        };
    }, [size]);

    return size;
}