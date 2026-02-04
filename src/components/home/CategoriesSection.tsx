import { Link } from "react-router-dom";
import { 
  Dna, 
  HeartPulse, 
  GraduationCap, 
  Utensils,
  PawPrint,
  Baby,
  Leaf, 
  Siren,
  ArrowRight
} from "lucide-react";

const categories = [
  { icon: Dna, name: "Rare Diseases", slug: "rare-diseases", count: 12 },
  { icon: HeartPulse, name: "Medical & Health", slug: "medical-health", count: 24 },
  { icon: GraduationCap, name: "Education", slug: "education", count: 18 },
  { icon: Utensils, name: "Hunger & Food", slug: "hunger-food-security", count: 15 },
  { icon: PawPrint, name: "Animal Welfare", slug: "animal-welfare", count: 21 },
  { icon: Baby, name: "Child Welfare", slug: "child-welfare", count: 16 },
  { icon: Leaf, name: "Environment", slug: "environment-climate", count: 19 },
  { icon: Siren, name: "Emergency Relief", slug: "emergency-relief", count: 8 },
];

export function CategoriesSection() {
  return (
    <section className="py-20 md:py-28 bg-secondary/30">
      <div className="container">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight">
              Browse by cause
            </h2>
            <p className="text-muted-foreground mt-1">
              Find organizations working on what matters to you.
            </p>
          </div>
          <Link 
            to="/charities" 
            className="group inline-flex items-center text-sm font-medium text-primary hover:text-sage-dark transition-colors"
          >
            View all
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Simple grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              key={category.slug}
              to={`/charities?category=${category.slug}`}
              className="group flex flex-col p-5 rounded-xl bg-card border border-border transition-all hover:shadow-soft hover:border-primary/30"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary mb-4">
                <category.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-medium text-foreground text-sm group-hover:text-primary transition-colors">
                {category.name}
              </h3>
              <span className="text-xs text-muted-foreground mt-0.5">
                {category.count} charities
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
