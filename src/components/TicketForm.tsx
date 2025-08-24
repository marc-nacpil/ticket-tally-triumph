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
    <Card className="w-full max-w-3xl card-modern">
      <CardHeader className="pb-8 text-center">
        <CardTitle className="text-3xl font-bold text-foreground mb-2">
          Ticket Registration
        </CardTitle>
        <p className="text-muted-foreground">Register your raffle tickets securely</p>
      </CardHeader>
      
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="form-layout">
          {/* Ticket Option Selection */}
          <div className="form-group">
            <Label className="form-label text-base">Ticket Selection</Label>
            <RadioGroup 
              value={option} 
              onValueChange={(value: "single" | "range") => setOption(value)}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3"
            >
              <div className="flex items-center space-x-3 p-4 rounded-xl border border-border/60 hover:border-primary/40 transition-all duration-200 cursor-pointer bg-muted/20">
                <RadioGroupItem value="single" id="single" className="text-primary" />
                <Label htmlFor="single" className="cursor-pointer font-medium">Single Ticket</Label>
              </div>
              <div className="flex items-center space-x-3 p-4 rounded-xl border border-border/60 hover:border-primary/40 transition-all duration-200 cursor-pointer bg-muted/20">
                <RadioGroupItem value="range" id="range" className="text-primary" />
                <Label htmlFor="range" className="cursor-pointer font-medium">Range of Tickets</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Ticket Number Input */}
          <div className="form-group">
            <Label className="form-label text-base">Ticket Numbers</Label>
            {option === "single" ? (
              <div className="space-y-3 mt-3">
                <Input
                  id="singleTicket"
                  type="text"
                  placeholder="Enter ticket number (1-20000)"
                  value={singleTicket}
                  onChange={(e) => handleTicketNumberChange(e.target.value, "single")}
                  className="input-modern text-lg font-mono h-14"
                />
                {singleTicket && (
                  <div className="status-info border-primary/20 bg-primary/5">
                    <p className="text-sm font-medium text-primary">
                      Formatted: {formatTicketNumber(singleTicket)}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-3">
                <div className="space-y-3">
                  <Input
                    id="rangeStart"
                    type="text"
                    placeholder="Start number"
                    value={rangeStart}
                    onChange={(e) => handleTicketNumberChange(e.target.value, "start")}
                    className="input-modern text-lg font-mono h-14"
                  />
                  {rangeStart && (
                    <div className="status-info border-primary/20 bg-primary/5">
                      <p className="text-xs font-medium text-primary">
                        Formatted: {formatTicketNumber(rangeStart)}
                      </p>
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  <Input
                    id="rangeEnd"
                    type="text"
                    placeholder="End number"
                    value={rangeEnd}
                    onChange={(e) => handleTicketNumberChange(e.target.value, "end")}
                    className="input-modern text-lg font-mono h-14"
                  />
                  {rangeEnd && (
                    <div className="status-info border-primary/20 bg-primary/5">
                      <p className="text-xs font-medium text-primary">
                        Formatted: {formatTicketNumber(rangeEnd)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Customer Information */}
          <div className="form-group">
            <Label className="form-label text-base">Customer Information</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-3">
              <div className="form-group">
                <Label htmlFor="name" className="form-label">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter full name"
                  value={ticketData.name}
                  onChange={(e) => setTicketData({ ...ticketData, name: e.target.value })}
                  className="input-modern h-12"
                />
              </div>
              <div className="form-group">
                <Label htmlFor="contact" className="form-label">Contact Number</Label>
                <Input
                  id="contact"
                  type="text"
                  placeholder="Enter contact number"
                  value={ticketData.contact}
                  onChange={(e) => setTicketData({ ...ticketData, contact: e.target.value })}
                  className="input-modern h-12"
                />
              </div>
              <div className="form-group sm:col-span-2">
                <Label htmlFor="address" className="form-label">Address</Label>
                <Input
                  id="address"
                  type="text"
                  placeholder="Enter complete address"
                  value={ticketData.address}
                  onChange={(e) => setTicketData({ ...ticketData, address: e.target.value })}
                  className="input-modern h-12"
                />
              </div>
              <div className="form-group sm:col-span-2">
                <Label htmlFor="careOf" className="form-label">Care Of</Label>
                <Input
                  id="careOf"
                  type="text"
                  placeholder="Enter care of information"
                  value={ticketData.careOf}
                  onChange={(e) => setTicketData({ ...ticketData, careOf: e.target.value })}
                  className="input-modern h-12"
                />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full h-14 text-lg font-semibold btn-primary mt-8">
            Submit Registration
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