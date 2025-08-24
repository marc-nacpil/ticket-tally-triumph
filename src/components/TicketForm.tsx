import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ConfirmationDialog } from "./ConfirmationDialog";

interface TicketData {
  name: string;
  address: string;
  contact: string;
  careOf: string;
}

export const TicketForm = () => {
  const [option, setOption] = useState<"single" | "range">("single");
  const [singleTicket, setSingleTicket] = useState("");
  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");
  const [ticketData, setTicketData] = useState<TicketData>({
    name: "",
    address: "",
    contact: "",
    careOf: "",
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const formatTicketNumber = (num: string): string => {
    const number = parseInt(num) || 0;
    return number.toString().padStart(5, "0");
  };

  const handleTicketNumberChange = (value: string, field: "single" | "start" | "end") => {
    const numericValue = value.replace(/\D/g, "");
    if (parseInt(numericValue) > 20000) return;
    
    if (field === "single") {
      setSingleTicket(numericValue);
    } else if (field === "start") {
      setRangeStart(numericValue);
    } else {
      setRangeEnd(numericValue);
    }
  };

  const validateForm = (): boolean => {
    if (option === "single" && !singleTicket) {
      toast({ title: "Error", description: "Please enter a ticket number", variant: "destructive" });
      return false;
    }
    
    if (option === "range" && (!rangeStart || !rangeEnd)) {
      toast({ title: "Error", description: "Please enter both start and end ticket numbers", variant: "destructive" });
      return false;
    }
    
    if (option === "range" && parseInt(rangeStart) >= parseInt(rangeEnd)) {
      toast({ title: "Error", description: "Start number must be less than end number", variant: "destructive" });
      return false;
    }
    
    if (!ticketData.name || !ticketData.address || !ticketData.contact || !ticketData.careOf) {
      toast({ title: "Error", description: "Please fill in all fields", variant: "destructive" });
      return false;
    }
    
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setShowConfirmation(true);
    }
  };

  const saveToDatabase = async () => {
    setIsLoading(true);
    try {
      const tickets = [];
      
      if (option === "single") {
        tickets.push({
          ticket_number: formatTicketNumber(singleTicket),
          ...ticketData,
        });
      } else {
        const start = parseInt(rangeStart);
        const end = parseInt(rangeEnd);
        for (let i = start; i <= end; i++) {
          tickets.push({
            ticket_number: formatTicketNumber(i.toString()),
            ...ticketData,
          });
        }
      }

      const { error } = await supabase.from("tickets").insert(tickets);
      
      if (error) {
        if (error.code === "23505") {
          toast({ 
            title: "Error", 
            description: "Some ticket numbers already exist. Please choose different numbers.", 
            variant: "destructive" 
          });
        } else {
          toast({ title: "Error", description: error.message, variant: "destructive" });
        }
      } else {
        toast({ title: "Success", description: `${tickets.length} ticket(s) saved successfully!` });
        // Reset form
        setSingleTicket("");
        setRangeStart("");
        setRangeEnd("");
        setTicketData({ name: "", address: "", contact: "", careOf: "" });
        setShowConfirmation(false);
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to save tickets", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const getConfirmationData = () => {
    if (option === "single") {
      return {
        tickets: formatTicketNumber(singleTicket),
        ...ticketData,
      };
    }
    return {
      tickets: `${formatTicketNumber(rangeStart)} - ${formatTicketNumber(rangeEnd)}`,
      ...ticketData,
    };
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Raffle Ticket Registration</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Ticket Option Selection */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Select Ticket Option</Label>
            <RadioGroup value={option} onValueChange={(value: "single" | "range") => setOption(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="single" id="single" />
                <Label htmlFor="single">Single Ticket</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="range" id="range" />
                <Label htmlFor="range">Range of Tickets</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Ticket Number Input */}
          {option === "single" ? (
            <div className="space-y-2">
              <Label htmlFor="singleTicket">Ticket Number (1-20000)</Label>
              <Input
                id="singleTicket"
                type="text"
                placeholder="Enter ticket number"
                value={singleTicket}
                onChange={(e) => handleTicketNumberChange(e.target.value, "single")}
              />
              {singleTicket && (
                <p className="text-sm text-muted-foreground">
                  Formatted: {formatTicketNumber(singleTicket)}
                </p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rangeStart">Start Number</Label>
                <Input
                  id="rangeStart"
                  type="text"
                  placeholder="Start"
                  value={rangeStart}
                  onChange={(e) => handleTicketNumberChange(e.target.value, "start")}
                />
                {rangeStart && (
                  <p className="text-sm text-muted-foreground">
                    Formatted: {formatTicketNumber(rangeStart)}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="rangeEnd">End Number</Label>
                <Input
                  id="rangeEnd"
                  type="text"
                  placeholder="End"
                  value={rangeEnd}
                  onChange={(e) => handleTicketNumberChange(e.target.value, "end")}
                />
                {rangeEnd && (
                  <p className="text-sm text-muted-foreground">
                    Formatted: {formatTicketNumber(rangeEnd)}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Customer Information */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Customer Information</Label>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter name"
                  value={ticketData.name}
                  onChange={(e) => setTicketData({ ...ticketData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  type="text"
                  placeholder="Enter address"
                  value={ticketData.address}
                  onChange={(e) => setTicketData({ ...ticketData, address: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact">Contact Number</Label>
                <Input
                  id="contact"
                  type="text"
                  placeholder="Enter contact number"
                  value={ticketData.contact}
                  onChange={(e) => setTicketData({ ...ticketData, contact: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="careOf">Care Of</Label>
                <Input
                  id="careOf"
                  type="text"
                  placeholder="Enter care of"
                  value={ticketData.careOf}
                  onChange={(e) => setTicketData({ ...ticketData, careOf: e.target.value })}
                />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full">
            Submit Ticket Information
          </Button>
        </form>

        <ConfirmationDialog
          open={showConfirmation}
          onOpenChange={setShowConfirmation}
          data={getConfirmationData()}
          onConfirm={saveToDatabase}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
};