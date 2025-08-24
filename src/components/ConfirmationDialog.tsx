import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${
        isMobile 
          ? 'w-[90vw] max-w-none mx-auto p-3 !top-[50%] !left-[50%] !-translate-x-[50%] !-translate-y-[50%] max-h-[75vh]' 
          : 'max-w-md'
      }`}>
        <DialogHeader className={`pb-2 ${isMobile ? 'pb-2' : 'pb-6'}`}>
          <DialogTitle className={`font-bold text-foreground ${
            isMobile ? 'text-base' : 'text-2xl'
          }`}>
            Confirm Ticket Information
          </DialogTitle>
          <DialogDescription className={`text-muted-foreground ${
            isMobile ? 'text-xs' : 'text-base'
          }`}>
            Please verify the information is correct before saving.
          </DialogDescription>
        </DialogHeader>
        
        <div className={`space-y-1.5 ${isMobile ? 'mb-2' : 'mb-6'}`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-4">
            <div className={`bg-muted/30 rounded-md border border-border/40 ${
              isMobile ? 'p-1.5' : 'p-4'
            }`}>
              <span className={`font-medium text-muted-foreground block mb-0.5 ${
                isMobile ? 'text-xs' : 'text-sm'
              }`}>Ticket(s)</span>
              <span className={`font-semibold text-foreground ${
                isMobile ? 'text-sm' : 'text-base'
              }`}>{data.tickets}</span>
            </div>
            <div className={`bg-muted/30 rounded-md border border-border/40 ${
              isMobile ? 'p-1.5' : 'p-4'
            }`}>
              <span className={`font-medium text-muted-foreground block mb-0.5 ${
                isMobile ? 'text-xs' : 'text-sm'
              }`}>Name</span>
              <span className={`font-semibold text-foreground ${
                isMobile ? 'text-sm' : 'text-base'
              }`}>{data.name}</span>
            </div>
            <div className={`bg-muted/30 rounded-md border border-border/40 sm:col-span-2 ${
              isMobile ? 'p-1.5' : 'p-4'
            }`}>
              <span className={`font-medium text-muted-foreground block mb-0.5 ${
                isMobile ? 'text-xs' : 'text-sm'
              }`}>Address</span>
              <span className={`font-semibold text-foreground ${
                isMobile ? 'text-sm' : 'text-base'
              }`}>{data.address}</span>
            </div>
            <div className={`bg-muted/30 rounded-md border border-border/40 ${
              isMobile ? 'p-1.5' : 'p-4'
            }`}>
              <span className={`font-medium text-muted-foreground block mb-0.5 ${
                isMobile ? 'text-xs' : 'text-sm'
              }`}>Contact</span>
              <span className={`font-semibold text-foreground ${
                isMobile ? 'text-sm' : 'text-base'
              }`}>{data.contact}</span>
            </div>
            <div className={`bg-muted/30 rounded-md border border-border/40 ${
              isMobile ? 'p-1.5' : 'p-4'
            }`}>
              <span className={`font-medium text-muted-foreground block mb-0.5 ${
                isMobile ? 'text-xs' : 'text-sm'
              }`}>Care Of</span>
              <span className={`font-semibold text-foreground ${
                isMobile ? 'text-sm' : 'text-base'
              }`}>{data.careOf}</span>
            </div>
          </div>
        </div>

        <DialogFooter className={`flex gap-2 sm:gap-3 ${
          isMobile ? 'flex-col' : 'flex-row'
        }`}>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className={`${
              isMobile ? 'h-8 px-3 w-full text-xs' : 'h-11 px-6'
            }`}
          >
            Edit
          </Button>
          <Button 
            onClick={onConfirm} 
            disabled={isLoading}
            className={`btn-primary ${
              isMobile ? 'h-8 px-3 w-full text-xs' : 'h-11 px-6'
            }`}
          >
            {isLoading ? "Saving..." : "Confirm & Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};