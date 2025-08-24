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
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-center flex items-center justify-center gap-2">
            ⚠️ Admin Panel
          </CardTitle>
          <p className="text-sm text-muted-foreground text-center">
            Database management tools
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20">
            <p className="text-sm text-destructive font-medium text-center">
              ⚠️ Warning: This action will permanently delete all tickets from the database. This cannot be undone.
            </p>
          </div>
          <Button 
            variant="destructive" 
            onClick={handleDeleteRequest}
            className="w-full h-12 text-lg font-semibold bg-destructive hover:bg-destructive/90 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            🗑️ Clear Database
          </Button>
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-destructive">Confirm Database Deletion</DialogTitle>
            <DialogDescription>
              This will permanently delete ALL tickets from the database. Type "admin" to confirm.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-2">
            <Label htmlFor="adminPassword">Password</Label>
            <Input
              id="adminPassword"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={confirmDelete} 
              disabled={isDeleting || password !== "admin"}
            >
              {isDeleting ? "Deleting..." : "Delete All"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};