import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { useIsMobile } from "@/hooks/use-mobile";

interface EditTicketDialogProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: Tables<"tickets">;
  onTicketUpdated: (updatedTicket: Tables<"tickets">) => void;
}

export const EditTicketDialog = ({ isOpen, onClose, ticket, onTicketUpdated }: EditTicketDialogProps) => {
  const [formData, setFormData] = useState({
    name: ticket.name,
    contact: ticket.contact,
    careOf: ticket.careOf,
    address: ticket.address,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const isMobile = useIsMobile();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.contact.trim() || !formData.address.trim()) {
      toast({ 
        title: "Error", 
        description: "Please fill in all required fields", 
        variant: "destructive" 
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from("tickets")
        .update({
          name: formData.name.trim(),
          contact: formData.contact.trim(),
          careOf: formData.careOf.trim(),
          address: formData.address.trim(),
          created_at: new Date().toISOString(), // Update the created_at time
        })
        .eq("ticket_number", ticket.ticket_number)
        .select()
        .single();

      if (error) {
        toast({ 
          title: "Error", 
          description: error.message, 
          variant: "destructive" 
        });
      } else {
        toast({ 
          title: "Success", 
          description: "Ticket information updated successfully" 
        });
        onTicketUpdated(data);
        onClose();
        setShowConfirmation(false);
      }
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Failed to update ticket information", 
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmSave = () => {
    setShowConfirmation(true);
  };

  const handleCancelEdit = () => {
    setFormData({
      name: ticket.name,
      contact: ticket.contact,
      careOf: ticket.careOf,
      address: ticket.address,
    });
    setShowConfirmation(false);
    onClose();
  };

  return (
    <>
      {/* Edit Dialog */}
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className={`${
          isMobile 
            ? 'w-[92vw] max-w-none mx-auto p-4' 
            : 'max-w-2xl'
        }`}>
          <DialogHeader>
            <DialogTitle className={`font-bold ${
              isMobile ? 'text-xl' : 'text-2xl'
            }`}>Edit Ticket Information</DialogTitle>
          </DialogHeader>
          
          <div className={`space-y-4 sm:space-y-6 py-2 sm:py-4`}>
            <div className="text-center p-3 sm:p-4 bg-muted/30 rounded-lg border border-border/40">
              <div className={`font-medium text-muted-foreground mb-2 ${
                isMobile ? 'text-xs' : 'text-sm'
              }`}>Ticket Number</div>
              <div className={`font-bold text-primary font-mono ${
                isMobile ? 'text-xl' : 'text-2xl'
              }`}>{ticket.ticket_number}</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name" className={`font-semibold ${
                  isMobile ? 'text-xs' : 'text-sm'
                }`}>
                  Customer Name *
                </Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={`${
                    isMobile ? 'h-10 text-sm' : 'h-11 text-base'
                  }`}
                  placeholder="Enter customer name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-contact" className={`font-semibold ${
                  isMobile ? 'text-xs' : 'text-sm'
                }`}>
                  Contact Number *
                </Label>
                <Input
                  id="edit-contact"
                  value={formData.contact}
                  onChange={(e) => handleInputChange("contact", e.target.value)}
                  className={`${
                    isMobile ? 'h-10 text-sm' : 'h-11 text-base'
                  }`}
                  placeholder="Enter contact number"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-care-of" className={`font-semibold ${
                isMobile ? 'text-xs' : 'text-sm'
              }`}>
                Care Of
              </Label>
              <Input
                id="edit-care-of"
                value={formData.careOf}
                onChange={(e) => handleInputChange("careOf", e.target.value)}
                className={`${
                  isMobile ? 'h-10 text-sm' : 'h-11 text-base'
                }`}
                placeholder="Enter care of (optional)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-address" className={`font-semibold ${
                isMobile ? 'text-xs' : 'text-sm'
              }`}>
                Complete Address *
              </Label>
              <Input
                id="edit-address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className={`${
                  isMobile ? 'h-10 text-sm' : 'h-11 text-base'
                }`}
                placeholder="Enter complete address"
              />
            </div>

            <div className={`flex flex-col sm:flex-row gap-3 pt-2 sm:pt-4`}>
              <Button
                onClick={handleConfirmSave}
                disabled={isLoading}
                className={`flex-1 bg-primary hover:bg-primary/90 ${
                  isMobile ? 'h-10 text-sm' : 'h-11 text-base'
                }`}
              >
                Save Changes
              </Button>
              <Button
                onClick={handleCancelEdit}
                variant="outline"
                className={`flex-1 ${
                  isMobile ? 'h-10 text-sm' : 'h-11 text-base'
                }`}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className={`${
          isMobile 
            ? 'w-[92vw] max-w-none mx-auto p-4' 
            : 'max-w-md'
        }`}>
          <DialogHeader>
            <DialogTitle className={`font-bold ${
              isMobile ? 'text-lg' : 'text-xl'
            }`}>Confirm Changes</DialogTitle>
          </DialogHeader>
          
          <div className={`space-y-3 sm:space-y-4 py-2 sm:py-4`}>
            <div className="text-center p-3 sm:p-4 bg-muted/30 rounded-lg">
              <div className={`font-medium text-muted-foreground mb-2 ${
                isMobile ? 'text-xs' : 'text-sm'
              }`}>Ticket Number</div>
              <div className={`font-bold text-primary font-mono ${
                isMobile ? 'text-lg' : 'text-xl'
              }`}>{ticket.ticket_number}</div>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <div className="flex justify-between">
                <span className={`font-medium ${
                  isMobile ? 'text-xs' : 'text-sm'
                }`}>Name:</span>
                <span className={`text-muted-foreground ${
                  isMobile ? 'text-xs' : 'text-sm'
                }`}>{formData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className={`font-medium ${
                  isMobile ? 'text-xs' : 'text-sm'
                }`}>Contact:</span>
                <span className={`text-muted-foreground ${
                  isMobile ? 'text-xs' : 'text-sm'
                }`}>{formData.contact}</span>
              </div>
              <div className="flex justify-between">
                <span className={`font-medium ${
                  isMobile ? 'text-xs' : 'text-sm'
                }`}>Care Of:</span>
                <span className={`text-muted-foreground ${
                  isMobile ? 'text-xs' : 'text-sm'
                }`}>{formData.careOf || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className={`font-medium ${
                  isMobile ? 'text-xs' : 'text-sm'
                }`}>Address:</span>
                <span className={`text-muted-foreground truncate ${
                  isMobile ? 'text-xs max-w-[120px]' : 'text-sm max-w-[200px]'
                }`}>{formData.address}</span>
              </div>
            </div>

            <div className={`text-muted-foreground text-center ${
              isMobile ? 'text-xs' : 'text-sm'
            }`}>
              The registration date will be updated to the current time.
            </div>

            <div className={`flex gap-3 ${
              isMobile ? 'flex-col' : 'flex-row'
            }`}>
              <Button
                onClick={handleSave}
                disabled={isLoading}
                className={`flex-1 bg-primary hover:bg-primary/90 ${
                  isMobile ? 'h-10 text-sm' : 'h-11 text-base'
                }`}
              >
                {isLoading ? "Saving..." : "Confirm & Save"}
              </Button>
              <Button
                onClick={() => setShowConfirmation(false)}
                variant="outline"
                className={`flex-1 ${
                  isMobile ? 'h-10 text-sm' : 'h-11 text-base'
                }`}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}; 