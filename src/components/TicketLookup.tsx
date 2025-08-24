import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TicketInfo {
  ticket_number: string;
  name: string;
  address: string;
  contact: string;
  care_of: string;
  created_at: string;
}

export const TicketLookup = () => {
  const [ticketNumber, setTicketNumber] = useState("");
  const [ticketInfo, setTicketInfo] = useState<TicketInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const formatTicketNumber = (num: string): string => {
    const number = parseInt(num) || 0;
    return number.toString().padStart(5, "0");
  };

  const handleTicketNumberChange = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    if (parseInt(numericValue) > 20000) return;
    setTicketNumber(numericValue);
    setTicketInfo(null);
    setNotFound(false);
  };

  const lookupTicket = async () => {
    if (!ticketNumber) {
      toast({ title: "Error", description: "Please enter a ticket number", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    setNotFound(false);
    
    try {
      const formattedNumber = formatTicketNumber(ticketNumber);
      const { data, error } = await supabase
        .from("tickets")
        .select("*")
        .eq("ticket_number", formattedNumber)
        .maybeSingle();

      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else if (data) {
        setTicketInfo(data);
      } else {
        setNotFound(true);
        setTicketInfo(null);
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to lookup ticket", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Ticket Lookup</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1 space-y-2">
              <Label htmlFor="lookupNumber">Ticket Number (1-20000)</Label>
              <Input
                id="lookupNumber"
                type="text"
                placeholder="Enter ticket number"
                value={ticketNumber}
                onChange={(e) => handleTicketNumberChange(e.target.value)}
              />
              {ticketNumber && (
                <p className="text-sm text-muted-foreground">
                  Searching for: {formatTicketNumber(ticketNumber)}
                </p>
              )}
            </div>
            <Button 
              onClick={lookupTicket} 
              disabled={isLoading || !ticketNumber}
              className="mt-8"
            >
              {isLoading ? "Searching..." : "Lookup"}
            </Button>
          </div>

          {/* Results */}
          {ticketInfo && (
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="text-lg">Ticket Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <span className="font-semibold">Ticket Number:</span>
                    <span>{ticketInfo.ticket_number}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="font-semibold">Name:</span>
                    <span>{ticketInfo.name}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="font-semibold">Address:</span>
                    <span>{ticketInfo.address}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="font-semibold">Contact:</span>
                    <span>{ticketInfo.contact}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="font-semibold">Care Of:</span>
                    <span>{ticketInfo.care_of}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="font-semibold">Registered:</span>
                    <span>{formatDate(ticketInfo.created_at)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {notFound && (
            <Card className="bg-destructive/10 border-destructive/20">
              <CardContent className="pt-6">
                <p className="text-center text-destructive">
                  Ticket number {formatTicketNumber(ticketNumber)} not found.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </CardContent>
    </Card>
  );
};