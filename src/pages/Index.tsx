import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TicketForm } from "@/components/TicketForm";
import { TicketLookup } from "@/components/TicketLookup";
import { AdminPanel } from "@/components/AdminPanel";

const Index = () => {
  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Raffle Ticket Management
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Manage your raffle tickets from 00001 to 20000 with our modern, secure system
          </p>
        </div>

        <Tabs defaultValue="register" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 p-1 h-12 bg-muted/50 backdrop-blur-sm">
            <TabsTrigger 
              value="register" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all duration-300"
            >
              Register Tickets
            </TabsTrigger>
            <TabsTrigger 
              value="lookup"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all duration-300"
            >
              Lookup Ticket
            </TabsTrigger>
            <TabsTrigger 
              value="admin"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all duration-300"
            >
              Admin
            </TabsTrigger>
          </TabsList>

          <TabsContent value="register" className="flex justify-center mt-0">
            <TicketForm />
          </TabsContent>

          <TabsContent value="lookup" className="flex justify-center mt-0">
            <TicketLookup />
          </TabsContent>

          <TabsContent value="admin" className="flex justify-center mt-0">
            <AdminPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
