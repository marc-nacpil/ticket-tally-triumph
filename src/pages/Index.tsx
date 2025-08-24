import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TicketForm } from "@/components/TicketForm";
import { TicketLookup } from "@/components/TicketLookup";
import { EditTickets } from "@/components/EditTickets";
import { AdminPanel } from "@/components/AdminPanel";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [showAdmin, setShowAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState("register");
  const [ticketCount, setTicketCount] = useState(0);

  // Fetch ticket count from database
  useEffect(() => {
    const fetchTicketCount = async () => {
      try {
        const { count, error } = await supabase
          .from('tickets')
          .select('*', { count: 'exact', head: true });

        if (error) {
          console.error('Error fetching ticket count:', error);
        } else {
          setTicketCount(count || 0);
        }
      } catch (error) {
        console.error('Error fetching ticket count:', error);
      }
    };

    fetchTicketCount();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            {/* Left Side - Title */}
            <div className="text-center sm:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-2">
                Remedios Raffle 2025
              </h1>
              <div className="w-64 mt-3 h-1 bg-gradient-to-r from-primary to-primary-glow mx-auto sm:mx-0 rounded-full"></div>
            </div>
            
            {/* Right Side - Ticket Count */}
            <div className="text-center sm:text-right">
              <div className="bg-primary/10 border border-primary/20 rounded-2xl px-6 py-4">
                <div className="text-2xl font-bold text-primary mb-1">
                  {ticketCount}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  Registered Tickets
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Side by Side Layout */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Left Column - Tabs Navigation */}
            <div className="lg:col-span-2">
              <div className="sticky top-32">
                <div className="bg-card border border-border/40 rounded-2xl p-8 shadow-sm">
                  <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
                    Navigation
                  </h2>
                  <div className="space-y-4">
                    <button
                      onClick={() => setActiveTab("register")}
                      className={`w-full p-4 rounded-xl border transition-all duration-200 text-left font-medium ${
                        activeTab === "register"
                          ? "bg-primary text-primary-foreground border-primary shadow-lg"
                          : "bg-muted/30 text-foreground border-border/40 hover:bg-muted/50 hover:border-primary/30"
                      }`}
                    >
                      Register Tickets
                    </button>
                    <button
                      onClick={() => setActiveTab("lookup")}
                      className={`w-full p-4 rounded-xl border transition-all duration-200 text-left font-medium ${
                        activeTab === "lookup"
                          ? "bg-primary text-primary-foreground border-primary shadow-lg"
                          : "bg-muted/30 text-foreground border-border/40 hover:bg-muted/50 hover:border-primary/30"
                      }`}
                    >
                      Lookup Ticket
                    </button>
                    <button
                      onClick={() => setActiveTab("edit")}
                      className={`w-full p-4 rounded-xl border transition-all duration-200 text-left font-medium ${
                        activeTab === "edit"
                          ? "bg-primary text-primary-foreground border-primary shadow-lg"
                          : "bg-muted/30 text-foreground border-border/40 hover:bg-muted/50 hover:border-primary/30"
                      }`}
                    >
                      Edit Tickets
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Content Area */}
            <div className="lg:col-span-3">
              {activeTab === "register" && (
                <TicketForm />
              )}
              
              {activeTab === "lookup" && (
                <TicketLookup />
              )}

              {activeTab === "edit" && (
                <EditTickets />
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Floating Admin Button */}
      <Button
        onClick={() => setShowAdmin(true)}
        className="fab bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl"
        size="icon"
      >
        <Settings className="w-5 h-5" />
      </Button>

      {/* Admin Panel Modal */}
      {showAdmin && (
        <div className="modal-overlay flex items-center justify-center p-4">
          <div className="modal-content">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-foreground">Admin Panel</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowAdmin(false)}
                  className="h-10 w-10 rounded-full hover:bg-muted"
                >
                  ×
                </Button>
              </div>
              <AdminPanel />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
