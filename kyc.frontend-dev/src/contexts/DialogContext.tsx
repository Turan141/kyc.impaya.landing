import { createContext, useContext, useState, ReactNode } from "react";
import { TButtonVariant } from "@ui/button/Button";
import { Dialog } from "src/components/Dialog";

export interface IDialogRequest {
    title: string | JSX.Element;
    subtitle?: string | JSX.Element;
    content: string | JSX.Element;
    buttons?: {
        title?: string;
        variant?: TButtonVariant;
        icon?: JSX.Element;
    }[];
}

interface DialogContextValue {
    showDialog: (config: IDialogRequest) => Promise<number>;
}

const DialogContext = createContext<DialogContextValue | undefined>(undefined);

export function DialogProvider({ children }: { children: ReactNode }) {
    const [dialogConfig, setDialogConfig] = useState<IDialogRequest | null>(null);
    const [resolveRef, setResolveRef] = useState<((value: number) => void) | null>(null);

    const showDialog = async (config: IDialogRequest): Promise<number> => {
        return new Promise((resolve) => {
            setDialogConfig(config);
            setResolveRef(() => resolve);
        });
    };

    const handleButtonClick = (index: number) => {
        if (resolveRef) {
            resolveRef(index);
            setResolveRef(null);
            setDialogConfig(null);
        }
    };

    return (
        <DialogContext.Provider value={{ showDialog }}>
            {children}
            {dialogConfig && <Dialog request={dialogConfig} onButtonClick={handleButtonClick} />}
        </DialogContext.Provider>
    );
}

export function useDialog() {
    const context = useContext(DialogContext);
    if (context === undefined) {
        throw new Error("useDialog must be used inside DialogProvider");
    }
    return context;
}