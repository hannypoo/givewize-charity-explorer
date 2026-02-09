import { cn } from "@/lib/utils";

interface Section {
  id: string;
  label: string;
}

interface ProfileSectionNavProps {
  sections: Section[];
  activeSection: string;
  onSectionClick: (id: string) => void;
}

export function ProfileSectionNav({ sections, activeSection, onSectionClick }: ProfileSectionNavProps) {
  return (
    <nav className="sticky top-16 z-30 bg-card/95 backdrop-blur-md border-b border-border">
      <div className="container">
        <div className="flex gap-1">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => onSectionClick(section.id)}
              className={cn(
                "relative px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap",
                activeSection === section.id
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {section.label}
              {activeSection === section.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
