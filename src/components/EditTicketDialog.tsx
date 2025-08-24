import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Edit Ticket Information</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="text-center p-4 bg-muted/30 rounded-lg border border-border/40">
              <div className="text-sm font-medium text-muted-foreground mb-2">Ticket Number</div>
              <div className="text-2xl font-bold text-primary font-mono">{ticket.ticket_number}</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name" className="text-sm font-semibold">
                  Customer Name *
                </Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="h-11"
                  placeholder="Enter customer name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-contact" className="text-sm font-semibold">
                  Contact Number *
                </Label>
                <Input
                  id="edit-contact"
                  value={formData.contact}
                  onChange={(e) => handleInputChange("contact", e.target.value)}
                  className="h-11"
                  placeholder="Enter contact number"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-care-of" className="text-sm font-semibold">
                Care Of
              </Label>
              <Input
                id="edit-care-of"
                value={formData.careOf}
                onChange={(e) => handleInputChange("careOf", e.target.value)}
                className="h-11"
                placeholder="Enter care of (optional)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-address" className="text-sm font-semibold">
                Complete Address *
              </Label>
              <Input
                id="edit-address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className="h-11"
                placeholder="Enter complete address"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={handleConfirmSave}
                disabled={isLoading}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                Save Changes
              </Button>
              <Button
                onClick={handleCancelEdit}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Confirm Changes</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-sm font-medium text-muted-foreground mb-2">Ticket Number</div>
              <div className="text-xl font-bold text-primary font-mono">{ticket.ticket_number}</div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">Name:</span>
                <span className="text-muted-foreground">{formData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Contact:</span>
                <span className="text-muted-foreground">{formData.contact}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Care Of:</span>
                <span className="text-muted-foreground">{formData.careOf || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Address:</span>
                <span className="text-muted-foreground max-w-[200px] truncate">{formData.address}</span>
              </div>
            </div>

            <div className="text-sm text-muted-foreground text-center">
              The registration date will be updated to the current time.
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleSave}
                disabled={isLoading}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                {isLoading ? "Saving..." : "Confirm & Save"}
              </Button>
              <Button
                onClick={() => setShowConfirmation(false)}
                variant="outline"
                className="flex-1"
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