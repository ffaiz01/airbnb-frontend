interface LongTermData {
  startDate: string;
  endDate: string;
  nights: number;
  total: number;
}

interface LongTermPricingProps {
  data: LongTermData[];
  cleaningFee: number;
  show14N: boolean;
  show30N: boolean;
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export const LongTermPricing = ({ data, cleaningFee, show14N, show30N, isCollapsed = false, onToggle }: LongTermPricingProps) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  };

  const calculateAvg = (total: number, nights: number) => {
    return Math.round(((total - cleaningFee) / nights) * 100) / 100;
  };

  const filteredData = data.filter(item => {
    if (item.nights === 14) return show14N;
    if (item.nights === 30) return show30N;
    return true;
  });

  if (filteredData.length === 0) return null;

  return (
    <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-border">
      <button 
        onClick={onToggle}
        className="flex items-center gap-2 mb-3 sm:mb-4 hover:bg-secondary/50 p-2 rounded transition-colors"
      >
        <span className={`transition-transform duration-200 text-sm ${isCollapsed ? "-rotate-90" : ""}`}>▼</span>
        <h3 className="font-semibold text-foreground text-sm sm:text-base">Mid & Long Term</h3>
      </button>
      
      {!isCollapsed && (
        <div className="space-y-2 sm:space-y-3">
          {filteredData.map((item, index) => {
            const avgPerNight = calculateAvg(item.total, item.nights);
            
            return (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 p-3 sm:p-4 rounded-lg border border-border bg-secondary/30 hover:shadow-md transition-all"
              >
                <div>
                  <div className="font-medium text-foreground text-sm sm:text-base">
                    {formatDate(item.startDate)} – {formatDate(item.endDate)}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    {item.nights} nights
                  </div>
                </div>
                
                <div className="text-left sm:text-right">
                  <div className="text-xl sm:text-2xl font-bold text-primary">
                    £{avgPerNight}
                    <span className="text-xs sm:text-sm font-normal text-muted-foreground">/night</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    £{item.total} total – £{cleaningFee} cleaning
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

