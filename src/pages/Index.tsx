import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TicketForm } from "@/components/TicketForm";
import { TicketLookup } from "@/components/TicketLookup";
import { EditTickets } from "@/components/EditTickets";
import { AdminPanel } from "@/components/AdminPanel";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Settings, Menu, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const [showAdmin, setShowAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState("register");
  const [ticketCount, setTicketCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

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
      <header className={`border-b border-border/40 bg-background/80 backdrop-blur-sm z-40 ${
        isMobile ? 'relative' : 'sticky top-0'
      }`}>
        <div className="container mx-auto px-6 py-4 sm:py-8">
          <div className="flex flex-row justify-between items-center gap-4 sm:gap-6">
            {/* Left Side - Title */}
            <div className="text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mb-2">
                Remedios Raffle 2025
              </h1>
              <div className="w-32 sm:w-48 lg:w-64 mt-3 h-1 bg-gradient-to-r from-primary to-primary-glow rounded-full"></div>
            </div>
            
            {/* Right Side - Ticket Count */}
            <div className="text-right">
              <div className="bg-primary/10 border border-primary/20 rounded-2xl px-3 sm:px-6 py-3 sm:py-4">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-primary mb-1">
                  {ticketCount}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground font-medium">
                  Registered Tickets
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Toggle */}
      {isMobile && (
        <div className="border-b border-border/40 bg-background/95 backdrop-blur-sm sticky top-0 z-30">
          <div className="container mx-auto px-6 py-3">
            <Button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              variant="ghost"
              size="sm"
              className="w-full justify-between"
            >
              <span className="font-medium">Navigation Menu</span>
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      )}

      {/* Mobile Navigation Menu */}
      {isMobile && isMobileMenuOpen && (
        <div className="border-b border-border/40 bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-6 py-4">
            <div className="space-y-3">
              <button
                onClick={() => {
                  setActiveTab("register");
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full p-3 rounded-xl border transition-all duration-200 text-left font-medium ${
                  activeTab === "register"
                    ? "bg-primary text-primary-foreground border-primary shadow-lg"
                    : "bg-muted/30 text-foreground border-border/40 hover:bg-muted/50 hover:border-primary/30"
                }`}
              >
                Register Tickets
              </button>
              <button
                onClick={() => {
                  setActiveTab("lookup");
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full p-3 rounded-xl border transition-all duration-200 text-left font-medium ${
                  activeTab === "lookup"
                    ? "bg-primary text-primary-foreground border-primary shadow-lg"
                    : "bg-muted/30 text-foreground border-border/40 hover:bg-muted/50 hover:border-primary/30"
                }`}
              >
                Lookup Ticket
              </button>
              <button
                onClick={() => {
                  setActiveTab("edit");
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full p-3 rounded-xl border transition-all duration-200 text-left font-medium ${
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
      )}

      {/* Main Content - Responsive Layout */}
      <main className="container mx-auto px-6 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Left Column - Tabs Navigation (Hidden on Mobile) */}
            {!isMobile && (
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
            )}

            {/* Right Column - Content Area (Full width on Mobile) */}
            <div className={isMobile ? "col-span-1" : "lg:col-span-3"}>
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
