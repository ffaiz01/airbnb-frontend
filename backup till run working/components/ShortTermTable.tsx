interface PriceData {
  total: number;
  date: string;
  checkin?: string;
  checkout?: string;
}

interface ShortTermTableProps {
  nights: number;
  dates: PriceData[];
  cleaningFee: number;
  visible: boolean;
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export const ShortTermTable = ({ nights, dates, cleaningFee, visible, isCollapsed = false, onToggle }: ShortTermTableProps) => {
  if (!visible) return null;

  const calculatePerNight = (total: number) => {
    return Math.round((total / nights - cleaningFee) * 100) / 100;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  };

  return (
    <div className="mb-4">
      <button 
        onClick={onToggle}
        className="flex items-center gap-2 mb-2 w-full hover:bg-secondary/50 p-2 rounded transition-colors"
      >
        <span className={`transition-transform duration-200 text-sm ${isCollapsed ? "-rotate-90" : ""}`}>▼</span>
        <span className="font-semibold text-foreground text-sm sm:text-base">{nights} Night{nights > 1 ? "s" : ""}</span>
        <span className="text-xs text-muted-foreground">Cleaning: £{cleaningFee}</span>
      </button>
      
      {!isCollapsed && (
        <div className="overflow-x-auto -mx-2 px-2">
          <div className="flex gap-2 sm:gap-3 pb-2 min-w-max">
            {dates.map((data, index) => {
              const perNight = calculatePerNight(data.total);
              const avgBeforeCleaning = Math.round((data.total / nights) * 100) / 100;
              
              return (
                <div
                  key={index}
                  className={`flex-shrink-0 w-32 sm:w-36 md:w-40 p-3 sm:p-4 rounded-lg border border-border transition-all hover:shadow-md ${
                    index % 2 === 0 ? "bg-secondary/30" : "bg-background"
                  }`}
                >
                  <div className="text-xs text-muted-foreground mb-2 leading-tight">
                    {formatDate(data.checkin || data.date)}
                    {nights > 1 && (
                      <>
                        <br className="sm:hidden" />
                        <span className="hidden sm:inline"> – </span>
                        {formatDate(data.checkout || new Date(new Date(data.date).getTime() + (nights - 1) * 86400000).toISOString())}
                      </>
                    )}
                  </div>
                  
                  <div className="text-xl sm:text-2xl font-bold text-primary mb-1">
                    £{perNight}
                  </div>
                  
                  <div className="text-xs text-muted-foreground leading-tight">
                    {nights > 1 ? `£${data.total} ÷ ${nights}` : `£${data.total}`} – £{cleaningFee}
                  </div>
                  
                  {nights > 1 && (
                    <div className="text-xs text-muted-foreground mt-1 leading-tight">
                      (£{avgBeforeCleaning}/night before cleaning)
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

