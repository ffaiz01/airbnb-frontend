import { useState, useEffect } from "react";
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
import { Switch } from "@/components/ui/switch";

interface ScheduleData {
  enabled: boolean;
  times: Array<{ time: string; enabled: boolean }>;
}

interface ScheduleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  searchId?: string;
  searchName?: string;
  initialSchedule?: ScheduleData;
  onSave?: (schedule: ScheduleData) => void;
}

export const ScheduleModal = ({ 
  open, 
  onOpenChange, 
  searchId,
  searchName,
  initialSchedule,
  onSave 
}: ScheduleModalProps) => {
  const [enabled, setEnabled] = useState(initialSchedule?.enabled || false);
  const [time1, setTime1] = useState(initialSchedule?.times[0]?.time || "07:00");
  const [time1Enabled, setTime1Enabled] = useState(initialSchedule?.times[0]?.enabled || false);
  const [time2, setTime2] = useState(initialSchedule?.times[1]?.time || "14:00");
  const [time2Enabled, setTime2Enabled] = useState(initialSchedule?.times[1]?.enabled || false);
  const [time3, setTime3] = useState(initialSchedule?.times[2]?.time || "21:00");
  const [time3Enabled, setTime3Enabled] = useState(initialSchedule?.times[2]?.enabled || false);

  // Update state when initialSchedule changes
  useEffect(() => {
    if (initialSchedule) {
      setEnabled(initialSchedule.enabled || false);
      setTime1(initialSchedule.times[0]?.time || "07:00");
      setTime1Enabled(initialSchedule.times[0]?.enabled || false);
      setTime2(initialSchedule.times[1]?.time || "14:00");
      setTime2Enabled(initialSchedule.times[1]?.enabled || false);
      setTime3(initialSchedule.times[2]?.time || "21:00");
      setTime3Enabled(initialSchedule.times[2]?.enabled || false);
    }
  }, [initialSchedule]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>
            {searchName ? `Schedule: ${searchName}` : 'Schedule Automatic Runs'}
          </DialogTitle>
          <DialogDescription>
            {searchName 
              ? `Set up to 3 daily run times for automatic price updates for this search`
              : 'Set up to 3 daily run times for automatic price updates'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="automation">Enable Automation</Label>
            <Switch
              id="automation"
              checked={enabled}
              onCheckedChange={setEnabled}
            />
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="time1" className={!enabled || !time1Enabled ? "text-muted-foreground" : ""}>
                  Morning (07:00)
                </Label>
                <Switch
                  checked={time1Enabled}
                  onCheckedChange={setTime1Enabled}
                  disabled={!enabled}
                />
              </div>
              <Input
                id="time1"
                type="time"
                value={time1}
                onChange={(e) => setTime1(e.target.value)}
                disabled={!enabled || !time1Enabled}
                className={!enabled || !time1Enabled ? "opacity-50" : ""}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="time2" className={!enabled || !time2Enabled ? "text-muted-foreground" : ""}>
                  Afternoon (14:00)
                </Label>
                <Switch
                  checked={time2Enabled}
                  onCheckedChange={setTime2Enabled}
                  disabled={!enabled}
                />
              </div>
              <Input
                id="time2"
                type="time"
                value={time2}
                onChange={(e) => setTime2(e.target.value)}
                disabled={!enabled || !time2Enabled}
                className={!enabled || !time2Enabled ? "opacity-50" : ""}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="time3" className={!enabled || !time3Enabled ? "text-muted-foreground" : ""}>
                  Evening (21:00)
                </Label>
                <Switch
                  checked={time3Enabled}
                  onCheckedChange={setTime3Enabled}
                  disabled={!enabled}
                />
              </div>
              <Input
                id="time3"
                type="time"
                value={time3}
                onChange={(e) => setTime3(e.target.value)}
                disabled={!enabled || !time3Enabled}
                className={!enabled || !time3Enabled ? "opacity-50" : ""}
              />
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => {
            const schedule: ScheduleData = {
              enabled,
              times: [
                { time: time1, enabled: time1Enabled },
                { time: time2, enabled: time2Enabled },
                { time: time3, enabled: time3Enabled }
              ]
            };
            onSave?.(schedule);
            onOpenChange(false);
          }}>
            Save Schedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

