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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-2xl font-bold text-foreground">Confirm Ticket Information</DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            Please verify the information is correct before saving.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-muted/30 rounded-xl border border-border/40">
              <span className="text-sm font-medium text-muted-foreground block mb-1">Ticket(s)</span>
              <span className="text-base font-semibold text-foreground">{data.tickets}</span>
            </div>
            <div className="p-4 bg-muted/30 rounded-xl border border-border/40">
              <span className="text-sm font-medium text-muted-foreground block mb-1">Name</span>
              <span className="text-base font-semibold text-foreground">{data.name}</span>
            </div>
            <div className="p-4 bg-muted/30 rounded-xl border border-border/40 sm:col-span-2">
              <span className="text-sm font-medium text-muted-foreground block mb-1">Address</span>
              <span className="text-base font-semibold text-foreground">{data.address}</span>
            </div>
            <div className="p-4 bg-muted/30 rounded-xl border border-border/40">
              <span className="text-sm font-medium text-muted-foreground block mb-1">Contact</span>
              <span className="text-base font-semibold text-foreground">{data.contact}</span>
            </div>
            <div className="p-4 bg-muted/30 rounded-xl border border-border/40">
              <span className="text-sm font-medium text-muted-foreground block mb-1">Care Of</span>
              <span className="text-base font-semibold text-foreground">{data.careOf}</span>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="h-11 px-6"
          >
            Edit
          </Button>
          <Button 
            onClick={onConfirm} 
            disabled={isLoading}
            className="btn-primary h-11 px-6"
          >
            {isLoading ? "Saving..." : "Confirm & Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};