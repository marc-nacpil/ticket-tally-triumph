import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmationData {
  tickets: string;
  name: string;
  address: string;
  contact: string;
  careOf: string;
}

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: ConfirmationData;
  onConfirm: () => void;
  isLoading: boolean;
}

export const ConfirmationDialog = ({
  open,
  onOpenChange,
  data,
  onConfirm,
  isLoading,
}: ConfirmationDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Ticket Information</DialogTitle>
          <DialogDescription>
            Please verify the information is correct before saving.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <span className="font-semibold">Ticket(s):</span>
            <span>{data.tickets}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <span className="font-semibold">Name:</span>
            <span>{data.name}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <span className="font-semibold">Address:</span>
            <span>{data.address}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <span className="font-semibold">Contact:</span>
            <span>{data.contact}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <span className="font-semibold">Care Of:</span>
            <span>{data.careOf}</span>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Edit
          </Button>
          <Button onClick={onConfirm} disabled={isLoading}>
            {isLoading ? "Saving..." : "Done"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};