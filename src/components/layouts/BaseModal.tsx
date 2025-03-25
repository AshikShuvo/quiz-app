import {ReactNode, useEffect, useState} from "react"
import {Dialog, DialogContent} from "@/components/ui/dialog"

interface BaseModalProps {
    open?: boolean;
    onClose?: () => void;
    children: ReactNode;
}

const BaseModal = ({children, open, onClose}: BaseModalProps) => {
    const [isOpen, setIsOpen] = useState(true);
    useEffect(() => {
        setIsOpen(!!open);
    }, [open]);
    return (
        <Dialog modal={true} open={isOpen} onOpenChange={(state) => {
            setIsOpen(state);
            if (!state && onClose) onClose();
        }}>
            <DialogContent>
                {children}
            </DialogContent>
        </Dialog>
    );
}

export default BaseModal
