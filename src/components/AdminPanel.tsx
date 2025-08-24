import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const AdminPanel = () => {
  const [password, setPassword] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteRequest = () => {
    setShowDialog(true);
    setPassword("");
  };

  const confirmDelete = async () => {
    if (password !== "admin") {
      toast({ title: "Error", description: "Incorrect password", variant: "destructive" });
      return;
    }

    setIsDeleting(true);
    try {
      const { error } = await supabase.from("tickets").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Success", description: "All tickets have been deleted from the database" });
        setShowDialog(false);
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete tickets", variant: "destructive" });
    } finally {
      setIsDeleting(false);
      setPassword("");
    }
  };

  return (
    <>
      <Card className="w-full max-w-md card-modern border-destructive/20">
        <CardHeader className="pb-6 text-center">
          <CardTitle className="text-2xl font-bold text-foreground mb-2">
            Admin Panel
          </CardTitle>
          <p className="text-muted-foreground">Database management tools</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="status-error">
            <p className="text-sm font-medium text-destructive text-center">
              Warning: This action will permanently delete all tickets from the database. This cannot be undone.
            </p>
          </div>
          <Button 
            variant="destructive" 
            onClick={handleDeleteRequest}
            className="w-full h-14 text-lg font-semibold bg-destructive hover:bg-destructive/90 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Clear Database
          </Button>
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-destructive text-xl">Confirm Database Deletion</DialogTitle>
            <DialogDescription className="text-base">
              This will permanently delete ALL tickets from the database.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3">
            <Label htmlFor="adminPassword" className="form-label">Password</Label>
            <Input
              id="adminPassword"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-modern h-12"
            />
          </div>

          <DialogFooter className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
              disabled={isDeleting}
              className="h-11 px-6"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={confirmDelete} 
              disabled={isDeleting || password !== "admin"}
              className="h-11 px-6"
            >
              {isDeleting ? "Deleting..." : "Delete All"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};