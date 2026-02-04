import { CharityCard, Charity } from "./CharityCard";

interface CharityGridProps {
  charities: Charity[];
}

export function CharityGrid({ charities }: CharityGridProps) {
  if (charities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-lg font-medium text-foreground">No charities found</p>
        <p className="mt-1 text-muted-foreground">
          Try adjusting your filters or search terms
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
