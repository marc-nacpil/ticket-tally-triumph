import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { EditTicketDialog } from "./EditTicketDialog";
import { Tables } from "@/integrations/supabase/types";
import { useIsMobile } from "@/hooks/use-mobile";

interface TicketInfo extends Tables<"tickets"> {}

export const EditTickets = () => {
  const [ticketNumber, setTicketNumber] = useState("");
  const [ticketInfo, setTicketInfo] = useState<TicketInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const isMobile = useIsMobile();

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

  const handleTicketUpdated = (updatedTicket: TicketInfo) => {
    setTicketInfo(updatedTicket);
  };

  return (
    <div>
      <Card className="w-full max-w-3xl card-modern">
        <CardHeader className="pb-6 sm:pb-8 text-center">
          <CardTitle className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Edit Ticket Information
          </CardTitle>
          <p className="text-sm sm:text-base text-muted-foreground">Search for a ticket to edit its information</p>
        </CardHeader>
        
        <CardContent className="p-4 sm:p-8">
          <div className="form-layout">
            <div className="form-group">
              <Label className="form-label text-sm sm:text-base">Ticket Number</Label>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-3">
                <div className="flex-1">
                  <Input
                    id="editNumber"
                    type="text"
                    placeholder="Enter ticket number (1-20000)"
                    value={ticketNumber}
                    onChange={(e) => handleTicketNumberChange(e.target.value)}
                    className={`input-modern font-mono ${
                      isMobile 
                        ? 'text-xs h-12' 
                        : 'text-lg h-14'
                    }`}
                  />
                  {ticketNumber && (
                    <div className="status-info border-primary/20 bg-primary/5 mt-3">
                      <p className="text-xs sm:text-sm font-medium text-primary">
                        Searching for: {formatTicketNumber(ticketNumber)}
                      </p>
                    </div>
                  )}
                </div>
                <Button 
                  onClick={lookupTicket} 
                  disabled={isLoading || !ticketNumber}
                  className={`btn-primary px-6 sm:px-8 font-semibold sm:mt-0 ${
                    isMobile ? 'h-12 text-sm' : 'h-14 text-lg'
                  }`}
                >
                  {isLoading ? "Searching..." : "Search"}
                </Button>
              </div>
            </div>

            {/* Results - Redesigned for better readability */}
            {ticketInfo && (
              <Card className="card-modern border-2 border-primary/20">
                <CardHeader className="pb-4 sm:pb-6 border-b border-border/40">
                  <CardTitle className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-3">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    Ticket Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 sm:pt-6">
                  <div className="space-y-4 sm:space-y-6">
                    {/* Ticket Number - Highlighted */}
                    <div className="text-center p-4 sm:p-6 bg-muted/30 rounded-xl border border-border/40">
                      <div className="text-xs sm:text-sm font-medium text-muted-foreground mb-2">Ticket Number</div>
                      <div className="text-2xl sm:text-4xl font-bold text-primary font-mono">{ticketInfo.ticket_number}</div>
                    </div>
                    
                    {/* Customer Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-3 sm:space-y-4">
                        <div>
                          <div className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Customer Name</div>
                          <div className="text-lg sm:text-xl font-semibold text-foreground p-3 bg-background rounded-lg border border-border/40">
                            {ticketInfo.name}
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Contact Number</div>
                          <div className="text-base sm:text-lg text-foreground p-3 bg-background rounded-lg border border-border/40">
                            {ticketInfo.contact}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3 sm:space-y-4">
                        <div>
                          <div className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Care Of</div>
                          <div className="text-base sm:text-lg text-foreground p-3 bg-background rounded-lg border border-border/40">
                            {ticketInfo.careOf || "—"}
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Registration Date</div>
                          <div className="text-base sm:text-lg text-foreground p-3 bg-background rounded-lg border border-border/40">
                            {formatDate(ticketInfo.created_at)}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Address - Full Width */}
                    <div>
                      <div className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Complete Address</div>
                      <div className="text-base sm:text-lg text-foreground p-3 sm:p-4 bg-background rounded-lg border border-border/40">
                        {ticketInfo.address}
                      </div>
                    </div>

                    {/* Edit Button */}
                    <div className="flex justify-center pt-4">
                      <Button
                        onClick={() => setShowEditDialog(true)}
                        className={`bg-primary hover:bg-primary/90 text-primary-foreground px-6 sm:px-8 py-3 font-semibold ${
                          isMobile ? 'text-base' : 'text-lg'
                        }`}
                      >
                        Edit Ticket Information
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {notFound && (
              <Card className="bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/30 card-modern">
                <CardContent className="pt-6 sm:pt-8 pb-6 sm:pb-8">
                  <div className="text-center space-y-3 sm:space-y-4">
                    <div className="text-4xl sm:text-6xl text-destructive">×</div>
                    <div>
                      <p className="text-lg sm:text-xl font-semibold text-destructive mb-2">
                        Ticket Not Found
                      </p>
                      <p className="text-sm sm:text-base text-muted-foreground">
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

      {/* Edit Ticket Dialog */}
      {ticketInfo && (
        <EditTicketDialog
          isOpen={showEditDialog}
          onClose={() => setShowEditDialog(false)}
          ticket={ticketInfo}
          onTicketUpdated={handleTicketUpdated}
        />
      )}
    </div>
  );
}; 