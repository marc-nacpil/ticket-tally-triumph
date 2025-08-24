import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TicketForm } from "@/components/TicketForm";
import { TicketLookup } from "@/components/TicketLookup";
import { AdminPanel } from "@/components/AdminPanel";

const Index = () => {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Raffle Ticket Management System</h1>
          <p className="text-xl text-muted-foreground">Manage your raffle tickets from 00001 to 20000</p>
        </div>

        <Tabs defaultValue="register" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="register">Register Tickets</TabsTrigger>
            <TabsTrigger value="lookup">Lookup Ticket</TabsTrigger>
            <TabsTrigger value="admin">Admin</TabsTrigger>
          </TabsList>

          <TabsContent value="register" className="flex justify-center">
            <TicketForm />
          </TabsContent>

          <TabsContent value="lookup" className="flex justify-center">
            <TicketLookup />
          </TabsContent>

          <TabsContent value="admin" className="flex justify-center">
            <AdminPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
