'use client';

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { AddSearchModal } from "@/components/AddSearchModal";
import { ScheduleModal } from "@/components/ScheduleModal";
import { SearchBlock } from "@/components/SearchBlock";
import { useToast } from "@/hooks/use-toast";
import { getSearches, createSearch, updateSearch, deleteSearch, type SearchData } from "@/lib/api";

export default function Home() {
  const [addSearchOpen, setAddSearchOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [searches, setSearches] = useState<SearchData[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [collapsedSearches, setCollapsedSearches] = useState<Record<string, boolean>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem("collapsed-searches");
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });

  const { toast } = useToast();

  // Fetch searches from API on component mount
  useEffect(() => {
    const fetchSearches = async () => {
      try {
        setLoading(true);
        const data = await getSearches();
        setSearches(data);
      } catch (error) {
        console.error("Failed to fetch searches:", error);
        toast({
          title: "Error",
          description: "Failed to load searches. Please refresh the page.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchSearches();
  }, [toast]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("collapsed-searches", JSON.stringify(collapsedSearches));
    }
  }, [collapsedSearches]);

  const toggleSearchCollapse = (searchId: string) => {
    setCollapsedSearches((prev) => ({ ...prev, [searchId]: !prev[searchId] }));
  };

  const collapseAll = () => {
    const allCollapsed = searches.reduce((acc, search) => ({ ...acc, [search.id!]: true }), {});
    setCollapsedSearches(allCollapsed);
  };

  const expandAll = () => {
    setCollapsedSearches({});
  };

  const handleAddSearch = async (data: { name: string; url: string; cleaningFee: number }) => {
    try {
      const newSearch = await createSearch(data);
      setSearches([...searches, newSearch]);
      toast({
        title: "Search added",
        description: `${data.name} has been added to your monitoring list.`,
      });
    } catch (error) {
      console.error("Failed to create search:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add search.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateSearch = async (id: string, data: { name: string; url: string }) => {
    try {
      const updatedSearch = await updateSearch(id, data);
      setSearches(searches.map(s => s.id === id ? updatedSearch : s));
      toast({
        title: "Search updated",
        description: "Your changes have been saved.",
      });
    } catch (error) {
      console.error("Failed to update search:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update search.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSearch = async (id: string) => {
    try {
      const search = searches.find(s => s.id === id);
      await deleteSearch(id);
      setSearches(searches.filter(s => s.id !== id));
      toast({
        title: "Search deleted",
        description: `${search?.name} has been removed.`,
      });
    } catch (error) {
      console.error("Failed to delete search:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete search.",
        variant: "destructive",
      });
    }
  };

  const handleRunAll = () => {
    toast({
      title: "Running all searches",
      description: "Fetching latest pricing data...",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        onAddSearch={() => setAddSearchOpen(true)}
        onRunAll={handleRunAll}
        onSchedule={() => setScheduleOpen(true)}
        onCollapseAll={collapseAll}
        onExpandAll={expandAll}
      />
      
      <main className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 md:py-8">
        {loading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading searches...</p>
          </div>
        ) : searches.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No searches yet. Add your first search to get started!</p>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {searches.map((search) => (
              <SearchBlock
                key={search.id}
                id={search.id!}
                name={search.name}
                url={search.url}
                cleaningFee={search.cleaningFee}
                lastRun={search.lastRun}
                isCollapsed={collapsedSearches[search.id!]}
                onToggleCollapse={() => toggleSearchCollapse(search.id!)}
                onUpdate={(data) => handleUpdateSearch(search.id!, data)}
                onDelete={() => handleDeleteSearch(search.id!)}
              />
            ))}
          </div>
        )}
      </main>
      
      <AddSearchModal
        open={addSearchOpen}
        onOpenChange={setAddSearchOpen}
        onSave={handleAddSearch}
      />
      
      <ScheduleModal
        open={scheduleOpen}
        onOpenChange={setScheduleOpen}
      />
    </div>
  );
}

