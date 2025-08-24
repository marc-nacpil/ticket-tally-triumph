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
    <Card className="w-full max-w-3xl card-modern">
      <CardHeader className="pb-8 text-center">
        <CardTitle className="text-3xl font-bold text-foreground mb-2">
          Ticket Lookup
        </CardTitle>
        <p className="text-muted-foreground">Find your ticket information quickly</p>
      </CardHeader>
      
      <CardContent className="p-8">
        <div className="form-layout">
          <div className="form-group">
            <Label className="form-label text-base">Ticket Number</Label>
            <div className="flex flex-col sm:flex-row gap-4 mt-3">
              <div className="flex-1">
                <Input
                  id="lookupNumber"
                  type="text"
                  placeholder="Enter ticket number (1-20000)"
                  value={ticketNumber}
                  onChange={(e) => handleTicketNumberChange(e.target.value)}
                  className="input-modern text-lg font-mono h-14"
                />
                {ticketNumber && (
                  <div className="status-info border-primary/20 bg-primary/5 mt-3">
                    <p className="text-sm font-medium text-primary">
                      Searching for: {formatTicketNumber(ticketNumber)}
                    </p>
                  </div>
                )}
              </div>
              <Button 
                onClick={lookupTicket} 
                disabled={isLoading || !ticketNumber}
                className="btn-primary h-14 px-8 text-lg font-semibold sm:mt-0"
              >
                {isLoading ? "Searching..." : "Lookup"}
              </Button>
            </div>
          </div>

          {/* Results - Redesigned for better readability */}
          {ticketInfo && (
            <Card className="card-modern border-2 border-primary/20">
              <CardHeader className="pb-6 border-b border-border/40">
                <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-3">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  Ticket Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {/* Ticket Number - Highlighted */}
                  <div className="text-center p-6 bg-muted/30 rounded-xl border border-border/40">
                    <div className="text-sm font-medium text-muted-foreground mb-2">Ticket Number</div>
                    <div className="text-4xl font-bold text-primary font-mono">{ticketInfo.ticket_number}</div>
                  </div>
                  
                  {/* Customer Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Customer Name</div>
                        <div className="text-xl font-semibold text-foreground p-3 bg-background rounded-lg border border-border/40">
                          {ticketInfo.name}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Contact Number</div>
                        <div className="text-lg text-foreground p-3 bg-background rounded-lg border border-border/40">
                          {ticketInfo.contact}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Care Of</div>
                        <div className="text-lg text-foreground p-3 bg-background rounded-lg border border-border/40">
                          {ticketInfo.care_of || "—"}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Registration Date</div>
                        <div className="text-lg text-foreground p-3 bg-background rounded-lg border border-border/40">
                          {formatDate(ticketInfo.created_at)}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Address - Full Width */}
                  <div>
                    <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Complete Address</div>
                    <div className="text-lg text-foreground p-4 bg-background rounded-lg border border-border/40">
                      {ticketInfo.address}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {notFound && (
            <Card className="bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/30 card-modern">
              <CardContent className="pt-8 pb-8">
                <div className="text-center space-y-4">
                  <div className="text-6xl text-destructive">×</div>
                  <div>
                    <p className="text-xl font-semibold text-destructive mb-2">
                      Ticket Not Found
                    </p>
                    <p className="text-muted-foreground">
                      Ticket number {formatTicketNumber(ticketNumber)} was not found in our database.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </CardContent>
    </Card>
  );
};