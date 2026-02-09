import { SearchX } from "lucide-react";
import { CharityCard, Charity } from "./CharityCard";

interface CharityGridProps {
  charities: Charity[];
}

export function CharityGrid({ charities }: CharityGridProps) {
  if (charities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center mb-4">
          <SearchX className="h-8 w-8 text-white/40" />
        </div>
        <p className="text-lg font-semibold text-white">No charities found</p>
        <p className="mt-1 text-sm text-white/50 max-w-xs">
          Try adjusting your filters or search terms to discover more organizations.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {charities.map((charity) => (
        <CharityCard key={charity.id} charity={charity} />
      ))}
    </div>
  );
}
