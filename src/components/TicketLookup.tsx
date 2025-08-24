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
    <Card className="w-full max-w-2xl card-modern">
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl font-bold text-center">🔍 Ticket Lookup</CardTitle>
        <p className="text-sm text-muted-foreground text-center">Find your ticket information quickly</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 space-y-3">
              <Label htmlFor="lookupNumber" className="text-lg font-semibold flex items-center gap-2">
                🎟️ Ticket Number
              </Label>
              <Input
                id="lookupNumber"
                type="text"
                placeholder="Enter ticket number (1-20000)"
                value={ticketNumber}
                onChange={(e) => handleTicketNumberChange(e.target.value)}
                className="text-lg font-mono h-12 bg-muted/30 border-border/50 focus:border-primary/50 transition-all duration-300"
              />
              {ticketNumber && (
                <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                  <p className="text-sm font-medium text-primary">
                    🔍 Searching for: {formatTicketNumber(ticketNumber)}
                  </p>
                </div>
              )}
            </div>
            <Button 
              onClick={lookupTicket} 
              disabled={isLoading || !ticketNumber}
              className="h-12 px-8 text-lg font-semibold btn-primary sm:mt-8"
            >
              {isLoading ? "🔄 Searching..." : "🔍 Lookup"}
            </Button>
          </div>

          {/* Results */}
          {ticketInfo && (
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 card-modern">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  ✅ Ticket Found
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 bg-background/50 rounded-lg">
                    <span className="text-sm font-medium text-muted-foreground block">Ticket Number</span>
                    <span className="text-lg font-bold font-mono text-primary">{ticketInfo.ticket_number}</span>
                  </div>
                  <div className="p-3 bg-background/50 rounded-lg">
                    <span className="text-sm font-medium text-muted-foreground block">Name</span>
                    <span className="text-lg font-semibold">{ticketInfo.name}</span>
                  </div>
                  <div className="p-3 bg-background/50 rounded-lg sm:col-span-2">
                    <span className="text-sm font-medium text-muted-foreground block">Address</span>
                    <span className="text-base">{ticketInfo.address}</span>
                  </div>
                  <div className="p-3 bg-background/50 rounded-lg">
                    <span className="text-sm font-medium text-muted-foreground block">Contact</span>
                    <span className="text-base">{ticketInfo.contact}</span>
                  </div>
                  <div className="p-3 bg-background/50 rounded-lg">
                    <span className="text-sm font-medium text-muted-foreground block">Care Of</span>
                    <span className="text-base">{ticketInfo.care_of}</span>
                  </div>
                  <div className="p-3 bg-background/50 rounded-lg sm:col-span-2">
                    <span className="text-sm font-medium text-muted-foreground block">Registered</span>
                    <span className="text-base font-medium">{formatDate(ticketInfo.created_at)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {notFound && (
            <Card className="bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/30 card-modern">
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <div className="text-4xl">❌</div>
                  <p className="text-lg font-semibold text-destructive">
                    Ticket Not Found
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Ticket number {formatTicketNumber(ticketNumber)} was not found in our database.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </CardContent>
    </Card>
  );
};