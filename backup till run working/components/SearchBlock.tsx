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

interface PricingDataItem {
  checkin: string;
  checkout: string;
  price: number;
  date: string;
}

interface PricingData {
  oneNight: PricingDataItem[];
  twoNights: PricingDataItem[];
  threeNights: PricingDataItem[];
  fourteenNights: PricingDataItem;
  thirtyNights: PricingDataItem;
}

interface SearchBlockProps {
  id: string;
  name: string;
  url: string;
  cleaningFee: number;
  lastRun: string;
  status?: 'idle' | 'running' | 'completed' | 'error';
  pricingData?: PricingData;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onUpdate?: (data: { name: string; url: string }) => void;
  onDelete?: () => void;
  onRun?: () => void;
  onRefresh?: () => void;
}

export const SearchBlock = ({ id, name, url, cleaningFee, lastRun, status = 'idle', pricingData, isCollapsed = false, onToggleCollapse, onUpdate, onDelete, onRun, onRefresh }: SearchBlockProps) => {
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

  // Convert pricing data to display format
  const dates1N = pricingData?.oneNight?.map(item => ({
    total: item.price || 0,
    date: item.date || item.checkin,
    checkin: item.checkin,
    checkout: item.checkout
  })) || [];

  const dates2N = pricingData?.twoNights?.map(item => ({
    total: item.price || 0,
    date: item.date || item.checkin,
    checkin: item.checkin,
    checkout: item.checkout
  })) || [];

  const dates3N = pricingData?.threeNights?.map(item => ({
    total: item.price || 0,
    date: item.date || item.checkin,
    checkin: item.checkin,
    checkout: item.checkout
  })) || [];

  const longTermData = [];
  
  // Add 14 nights if available
  if (pricingData?.fourteenNights && pricingData.fourteenNights.checkin) {
    longTermData.push({
      startDate: pricingData.fourteenNights.checkin,
      endDate: pricingData.fourteenNights.checkout,
      nights: 14,
      total: pricingData.fourteenNights.price || 0,
    });
  }
  
  // Add 30 nights if available
  if (pricingData?.thirtyNights && pricingData.thirtyNights.checkin) {
    longTermData.push({
      startDate: pricingData.thirtyNights.checkin,
      endDate: pricingData.thirtyNights.checkout,
      nights: 30,
      total: pricingData.thirtyNights.price || 0,
    });
  }

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
              <div className="flex-1 min-w-0 overflow-hidden">
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
                      className="text-xs break-all"
                    />
                  </div>
                ) : (
                  <>
                    <h2 className="text-base sm:text-lg md:text-xl font-semibold text-foreground truncate">{name}</h2>
                    <div className="mt-1 overflow-hidden">
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-muted-foreground hover:text-primary inline-flex items-start gap-1 break-all overflow-wrap-anywhere word-break-break-all"
                        title={url}
                      >
                        <span className="break-all overflow-wrap-anywhere word-break-break-all">{url}</span>
                        <ExternalLink className="h-3 w-3 shrink-0 mt-0.5 flex-shrink-0" />
                      </a>
                    </div>
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
              <div className="flex items-center gap-2 flex-wrap">
                <div className="text-xs text-muted-foreground">
                  Last run: {lastRun}
                </div>
                {status && (
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    status === 'running' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                    status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                    status === 'error' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' :
                    'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                  }`}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2 flex-wrap">
                <div className="hidden sm:block">
                  <FilterToggles filters={filters} onToggle={handleToggle} />
                </div>
                
                {status === 'running' ? (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="shrink-0"
                    disabled
                  >
                    <PlayCircle className="h-4 w-4 sm:mr-2 animate-spin" />
                    <span className="hidden sm:inline">Running...</span>
                  </Button>
                ) : (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="shrink-0"
                    onClick={onRun}
                  >
                    <PlayCircle className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Run Now</span>
                  </Button>
                )}
                {onRefresh && (
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="shrink-0"
                    onClick={onRefresh}
                  >
                    <span className="hidden sm:inline">Refresh</span>
                  </Button>
                )}
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

