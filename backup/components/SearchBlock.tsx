'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlayCircle, ExternalLink, ChevronDown, Pencil, Trash2, Check, X } from "lucide-react";
import { ShortTermTable } from "./ShortTermTable";
import { LongTermPricing } from "./LongTermPricing";
import { FilterToggles } from "./FilterToggles";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface SearchBlockProps {
  id: string;
  name: string;
  url: string;
  cleaningFee: number;
  lastRun: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onUpdate?: (data: { name: string; url: string }) => void;
  onDelete?: () => void;
}

export const SearchBlock = ({ id, name, url, cleaningFee, lastRun, isCollapsed = false, onToggleCollapse, onUpdate, onDelete }: SearchBlockProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(name);
  const [editUrl, setEditUrl] = useState(url);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const [filters, setFilters] = useState({
    show1N: true,
    show2N: true,
    show3N: true,
    show14N: true,
    show30N: true,
  });

  const [sectionCollapsed, setSectionCollapsed] = useState<Record<string, boolean>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`section-collapsed-${id}`);
      return saved ? JSON.parse(saved) : { "1N": false, "2N": false, "3N": false, "long": false };
    }
    return { "1N": false, "2N": false, "3N": false, "long": false };
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`section-collapsed-${id}`, JSON.stringify(sectionCollapsed));
    }
  }, [sectionCollapsed, id]);

  const handleToggle = (key: keyof typeof filters) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleSection = (section: string) => {
    setSectionCollapsed((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSaveEdit = () => {
    if (editName.trim() && editUrl.trim()) {
      onUpdate?.({ name: editName, url: editUrl });
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditName(name);
    setEditUrl(url);
    setIsEditing(false);
  };

  // Mock data for demonstration
  const dates1N = [
    { total: 120, date: "2024-11-05" },
    { total: 140, date: "2024-11-06" },
    { total: 150, date: "2024-11-07" },
    { total: 135, date: "2024-11-08" },
    { total: 130, date: "2024-11-09" },
    { total: 145, date: "2024-11-10" },
    { total: 155, date: "2024-11-11" },
  ];

  const dates2N = [
    { total: 230, date: "2024-11-05" },
    { total: 260, date: "2024-11-06" },
    { total: 280, date: "2024-11-07" },
    { total: 255, date: "2024-11-08" },
    { total: 245, date: "2024-11-09" },
    { total: 275, date: "2024-11-10" },
    { total: 295, date: "2024-11-11" },
  ];

  const dates3N = [
    { total: 330, date: "2024-11-05" },
    { total: 360, date: "2024-11-06" },
    { total: 390, date: "2024-11-07" },
    { total: 365, date: "2024-11-08" },
    { total: 350, date: "2024-11-09" },
    { total: 380, date: "2024-11-10" },
    { total: 410, date: "2024-11-11" },
  ];

  const longTermData = [
    {
      startDate: "2024-11-08",
      endDate: "2024-11-21",
      nights: 14,
      total: 1850,
    },
    {
      startDate: "2024-11-22",
      endDate: "2024-12-05",
      nights: 14,
      total: 1940,
    },
    {
      startDate: "2024-12-06",
      endDate: "2025-01-04",
      nights: 30,
      total: 3200,
    },
  ];

  return (
    <Collapsible open={!isCollapsed} onOpenChange={onToggleCollapse}>
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="border-b border-border p-4 sm:p-6">
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex items-start gap-2 sm:gap-3">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="p-1 h-auto hover:bg-secondary shrink-0">
                  <ChevronDown className={`h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-200 ${isCollapsed ? "-rotate-90" : ""}`} />
                </Button>
              </CollapsibleTrigger>
              <div className="flex-1 min-w-0">
                {isEditing ? (
                  <div className="space-y-2">
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Search name"
                      className="text-base sm:text-lg font-semibold"
                    />
                    <Input
                      value={editUrl}
                      onChange={(e) => setEditUrl(e.target.value)}
                      placeholder="Search URL"
                      className="text-xs"
                    />
                  </div>
                ) : (
                  <>
                    <h2 className="text-base sm:text-lg md:text-xl font-semibold text-foreground truncate">{name}</h2>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-muted-foreground hover:text-primary inline-flex items-center gap-1 mt-1 break-all"
                    >
                      <span className="truncate max-w-[200px] sm:max-w-none">{url}</span>
                      <ExternalLink className="h-3 w-3 shrink-0" />
                    </a>
                  </>
                )}
              </div>
              {isEditing ? (
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="sm" onClick={handleSaveEdit} className="p-1 h-auto hover:bg-secondary">
                    <Check className="h-4 w-4 text-green-600" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleCancelEdit} className="p-1 h-auto hover:bg-secondary">
                    <X className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              ) : (
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)} className="p-1 h-auto hover:bg-secondary">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setShowDeleteDialog(true)} className="p-1 h-auto hover:bg-secondary">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
              <div className="text-xs text-muted-foreground">
                Last run: {lastRun}
              </div>
              
              <div className="flex items-center gap-2 flex-wrap">
                <div className="hidden sm:block">
                  <FilterToggles filters={filters} onToggle={handleToggle} />
                </div>
                
                <Button size="sm" variant="outline" className="shrink-0">
                  <PlayCircle className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Run Now</span>
                </Button>
              </div>
            </div>
            
            <div className="sm:hidden">
              <FilterToggles filters={filters} onToggle={handleToggle} />
            </div>
          </div>
        </CardHeader>
        
        <CollapsibleContent>
          <CardContent className="p-4 sm:p-6 pt-4 sm:pt-6">
            <ShortTermTable
              nights={1}
              dates={dates1N}
              cleaningFee={cleaningFee}
              visible={filters.show1N}
              isCollapsed={sectionCollapsed["1N"]}
              onToggle={() => toggleSection("1N")}
            />
            
            <ShortTermTable
              nights={2}
              dates={dates2N}
              cleaningFee={cleaningFee}
              visible={filters.show2N}
              isCollapsed={sectionCollapsed["2N"]}
              onToggle={() => toggleSection("2N")}
            />
            
            <ShortTermTable
              nights={3}
              dates={dates3N}
              cleaningFee={cleaningFee}
              visible={filters.show3N}
              isCollapsed={sectionCollapsed["3N"]}
              onToggle={() => toggleSection("3N")}
            />
            
            <LongTermPricing
              data={longTermData}
              cleaningFee={cleaningFee}
              show14N={filters.show14N}
              show30N={filters.show30N}
              isCollapsed={sectionCollapsed["long"]}
              onToggle={() => toggleSection("long")}
            />
          </CardContent>
        </CollapsibleContent>
      </Card>
      
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Search</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Collapsible>
  );
};

