import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TicketForm } from "@/components/TicketForm";
import { TicketLookup } from "@/components/TicketLookup";
import { AdminPanel } from "@/components/AdminPanel";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

const Index = () => {
  const [showAdmin, setShowAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState("register");

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-2">
              Remedios Raffle 2025
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-primary-glow mx-auto rounded-full"></div>
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
