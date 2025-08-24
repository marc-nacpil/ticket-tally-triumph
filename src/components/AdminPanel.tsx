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
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-destructive">Admin Panel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This action will permanently delete all tickets from the database. This cannot be undone.
            </p>
            <Button 
              variant="destructive" 
              onClick={handleDeleteRequest}
              className="w-full"
            >
              Clear Database
            </Button>
          </div>
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