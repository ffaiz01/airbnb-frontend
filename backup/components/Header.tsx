import { Button } from "@/components/ui/button";
import { Plus, PlayCircle, Calendar } from "lucide-react";

interface HeaderProps {
  onAddSearch: () => void;
  onRunAll: () => void;
  onSchedule: () => void;
  onCollapseAll?: () => void;
  onExpandAll?: () => void;
  lastUpdated?: string;
  nextRuns?: string[];
}

export const Header = ({ 
  onAddSearch, 
  onRunAll, 
  onSchedule,
  onCollapseAll,
  onExpandAll,
  lastUpdated = "22:00",
  nextRuns = ["07:00", "14:00", "21:00"]
}: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex flex-col gap-3 sm:gap-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground">
                Airbnb Pricing CRM
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 hidden sm:block">
                Monitor and compare Airbnb prices by location and stay length
              </p>
            </div>
            
            <Button 
              onClick={onAddSearch}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shrink-0"
              size="sm"
            >
              <Plus className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Add New Search</span>
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <div className="text-xs sm:text-sm text-muted-foreground order-2 sm:order-1">
              <span className="hidden sm:inline">Last updated: {lastUpdated}</span>
              <span className="hidden sm:inline mx-2">|</span>
              <span className="hidden sm:inline">Next run: {nextRuns.join(", ")}</span>
              <span className="sm:hidden">Updated: {lastUpdated} | Next: {nextRuns[0]}</span>
            </div>
            
            <div className="flex items-center gap-2 order-1 sm:order-2 sm:ml-auto flex-wrap">
              <Button 
                onClick={onRunAll}
                variant="outline"
                size="sm"
              >
                <PlayCircle className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Run All</span>
              </Button>
              
              <Button 
                onClick={onSchedule}
                variant="outline"
                size="sm"
              >
                <Calendar className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Schedule</span>
              </Button>
              
              {onCollapseAll && onExpandAll && (
                <>
                  <div className="hidden md:flex gap-2 border-l border-border pl-4 ml-4">
                    <Button onClick={onExpandAll} variant="ghost" size="sm">
                      Expand All
                    </Button>
                    <Button onClick={onCollapseAll} variant="ghost" size="sm">
                      Collapse All
                    </Button>
                  </div>
                  <div className="flex md:hidden gap-2">
                    <Button onClick={onExpandAll} variant="ghost" size="sm">
                      Expand
                    </Button>
                    <Button onClick={onCollapseAll} variant="ghost" size="sm">
                      Collapse
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

