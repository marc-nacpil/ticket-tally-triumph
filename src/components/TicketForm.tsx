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
    <Card className="w-full max-w-2xl card-modern">
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl font-bold text-center">🎟️ Raffle Ticket Registration</CardTitle>
        <p className="text-sm text-muted-foreground text-center">Register your tickets securely</p>
      </CardHeader>
      <CardContent className="space-y-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Ticket Option Selection */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold flex items-center gap-2">
              📋 Select Ticket Option
            </Label>
            <RadioGroup 
              value={option} 
              onValueChange={(value: "single" | "range") => setOption(value)}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <div className="flex items-center space-x-3 p-4 rounded-lg border border-border/50 hover:border-primary/50 transition-all duration-300 cursor-pointer">
                <RadioGroupItem value="single" id="single" className="text-primary" />
                <Label htmlFor="single" className="cursor-pointer font-medium">🎫 Single Ticket</Label>
              </div>
              <div className="flex items-center space-x-3 p-4 rounded-lg border border-border/50 hover:border-primary/50 transition-all duration-300 cursor-pointer">
                <RadioGroupItem value="range" id="range" className="text-primary" />
                <Label htmlFor="range" className="cursor-pointer font-medium">📊 Range of Tickets</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Ticket Number Input */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold flex items-center gap-2">
              🔢 Ticket Numbers
            </Label>
            {option === "single" ? (
              <div className="space-y-3">
                <Label htmlFor="singleTicket" className="text-sm font-medium text-muted-foreground">
                  Enter ticket number (1-20000)
                </Label>
                <Input
                  id="singleTicket"
                  type="text"
                  placeholder="Enter ticket number"
                  value={singleTicket}
                  onChange={(e) => handleTicketNumberChange(e.target.value, "single")}
                  className="text-lg font-mono h-12 bg-muted/30 border-border/50 focus:border-primary/50 transition-all duration-300"
                />
                {singleTicket && (
                  <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                    <p className="text-sm font-medium text-primary">
                      ✅ Formatted: {formatTicketNumber(singleTicket)}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="rangeStart" className="text-sm font-medium text-muted-foreground">
                    Start Number
                  </Label>
                  <Input
                    id="rangeStart"
                    type="text"
                    placeholder="Start"
                    value={rangeStart}
                    onChange={(e) => handleTicketNumberChange(e.target.value, "start")}
                    className="text-lg font-mono h-12 bg-muted/30 border-border/50 focus:border-primary/50 transition-all duration-300"
                  />
                  {rangeStart && (
                    <div className="p-2 bg-primary/10 rounded border border-primary/20">
                      <p className="text-xs font-medium text-primary">
                        Formatted: {formatTicketNumber(rangeStart)}
                      </p>
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  <Label htmlFor="rangeEnd" className="text-sm font-medium text-muted-foreground">
                    End Number
                  </Label>
                  <Input
                    id="rangeEnd"
                    type="text"
                    placeholder="End"
                    value={rangeEnd}
                    onChange={(e) => handleTicketNumberChange(e.target.value, "end")}
                    className="text-lg font-mono h-12 bg-muted/30 border-border/50 focus:border-primary/50 transition-all duration-300"
                  />
                  {rangeEnd && (
                    <div className="p-2 bg-primary/10 rounded border border-primary/20">
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
          <div className="space-y-6">
            <Label className="text-lg font-semibold flex items-center gap-2">
              👤 Customer Information
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-muted-foreground">
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter full name"
                  value={ticketData.name}
                  onChange={(e) => setTicketData({ ...ticketData, name: e.target.value })}
                  className="h-11 bg-muted/30 border-border/50 focus:border-primary/50 transition-all duration-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact" className="text-sm font-medium text-muted-foreground">
                  Contact Number
                </Label>
                <Input
                  id="contact"
                  type="text"
                  placeholder="Enter contact number"
                  value={ticketData.contact}
                  onChange={(e) => setTicketData({ ...ticketData, contact: e.target.value })}
                  className="h-11 bg-muted/30 border-border/50 focus:border-primary/50 transition-all duration-300"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="address" className="text-sm font-medium text-muted-foreground">
                  Address
                </Label>
                <Input
                  id="address"
                  type="text"
                  placeholder="Enter complete address"
                  value={ticketData.address}
                  onChange={(e) => setTicketData({ ...ticketData, address: e.target.value })}
                  className="h-11 bg-muted/30 border-border/50 focus:border-primary/50 transition-all duration-300"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="careOf" className="text-sm font-medium text-muted-foreground">
                  Care Of
                </Label>
                <Input
                  id="careOf"
                  type="text"
                  placeholder="Enter care of information"
                  value={ticketData.careOf}
                  onChange={(e) => setTicketData({ ...ticketData, careOf: e.target.value })}
                  className="h-11 bg-muted/30 border-border/50 focus:border-primary/50 transition-all duration-300"
                />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full h-12 text-lg font-semibold btn-primary">
            ✨ Submit Ticket Information
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