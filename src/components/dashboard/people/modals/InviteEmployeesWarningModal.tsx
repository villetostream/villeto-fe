
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface InviteEmployeesWarningModalProps {
    isOpen: boolean;
    onClose: () => void;
    onInviteLeaders: () => void;
    onContinue: () => void;
}

export function InviteEmployeesWarningModal({
    isOpen,
    onClose,
    onInviteLeaders,
    onContinue,
}: InviteEmployeesWarningModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[480px] flex flex-col items-center text-center p-8 bg-white max-h-[95vh] overflow-y-auto w-full md:w-auto p-4 md:p-6 lg:p-8 rounded-lg">
                <div className="h-14 w-14 bg-red-50 rounded-full flex items-center justify-center mb-5 mt-2">
                    <AlertCircle className="h-8 w-8 text-red-500" />
                </div>
                
                <DialogHeader className="mb-6 space-y-3">
                    <DialogTitle className="text-xl font-bold text-center text-gray-900">
                        Managers & Leadership
                    </DialogTitle>
                    <DialogDescription className="text-center text-gray-500 text-sm leading-relaxed max-w-sm mx-auto">
                        Inviting Admins and other leadership before inviting employees helps the system easily assign managers to each employee.
                    </DialogDescription>
                </DialogHeader>
                
                <div className="flex gap-3 w-full mt-2">
                    <Button 
                        onClick={onInviteLeaders} 
                        className="w-1/2 bg-primary hover:bg-primary/90 text-white font-medium h-11"
                    >
                        Invite Leaders
                    </Button>
                    <Button 
                        variant="outline" 
                        onClick={onContinue}
                        className="w-1/2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-medium h-11"
                    >
                        Continue
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
