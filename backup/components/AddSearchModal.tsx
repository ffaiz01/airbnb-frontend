import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddSearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: { name: string; url: string; cleaningFee: number }) => void;
}

export const AddSearchModal = ({ open, onOpenChange, onSave }: AddSearchModalProps) => {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [cleaningFee, setCleaningFee] = useState("");

  const handleSave = () => {
    if (name && url) {
      onSave({
        name,
        url,
        cleaningFee: parseFloat(cleaningFee) || 0,
      });
      setName("");
      setUrl("");
      setCleaningFee("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Search</DialogTitle>
          <DialogDescription>
            Add a new Airbnb search to monitor pricing data
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Search Name</Label>
            <Input
              id="name"
              placeholder="e.g., Manchester City Centre"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="url">Airbnb URL</Label>
            <Input
              id="url"
              placeholder="https://airbnb.com/s/Manchester"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cleaning">Cleaning Fee (£)</Label>
            <Input
              id="cleaning"
              type="number"
              placeholder="40"
              value={cleaningFee}
              onChange={(e) => setCleaningFee(e.target.value)}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Search
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

