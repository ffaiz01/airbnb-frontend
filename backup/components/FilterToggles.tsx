import { Button } from "@/components/ui/button";
import { EyeOff, Eye } from "lucide-react";

interface FilterTogglesProps {
  filters: {
    show1N: boolean;
    show2N: boolean;
    show3N: boolean;
    show14N: boolean;
    show30N: boolean;
  };
  onToggle: (key: keyof FilterTogglesProps["filters"]) => void;
}

export const FilterToggles = ({ filters, onToggle }: FilterTogglesProps) => {
  const toggles = [
    { key: "show1N" as const, label: "1N" },
    { key: "show2N" as const, label: "2N" },
    { key: "show3N" as const, label: "3N" },
    { key: "show14N" as const, label: "14N" },
    { key: "show30N" as const, label: "30N" },
  ];

  return (
    <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
      <span className="text-xs sm:text-sm text-muted-foreground mr-1 sm:mr-2 hidden md:inline">Show/Hide:</span>
      {toggles.map(({ key, label }) => (
        <Button
          key={key}
          variant={filters[key] ? "outline" : "secondary"}
          size="sm"
          onClick={() => onToggle(key)}
          className="h-7 sm:h-8 px-2 sm:px-3 text-xs"
        >
          {filters[key] ? (
            <Eye className="h-3 w-3 sm:mr-1" />
          ) : (
            <EyeOff className="h-3 w-3 sm:mr-1" />
          )}
          <span className="hidden sm:inline">{label}</span>
          <span className="sm:hidden">{label.replace('N', '')}</span>
        </Button>
      ))}
    </div>
  );
};

