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
    <section className="py-20 md:py-28 bg-secondary/30 relative overflow-hidden">
      {/* Geometric pattern */}
      <div className="absolute inset-0 diagonal-lines" />
      
      <div className="container relative">
        {/* Section Header with geometric accent */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
          <div className="flex items-start gap-4">
            <div className="w-1 h-16 bg-coral hidden md:block" />
            <div>
              <span className="text-xs font-semibold text-primary uppercase tracking-widest mb-2 block">
                Categories
              </span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
                Browse by cause
              </h2>
            </div>
          </div>
          <Link 
            to="/charities" 
            className="group inline-flex items-center text-sm font-semibold text-foreground hover:text-coral transition-colors"
          >
            VIEW ALL
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Geometric grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category, index) => (
            <Link
              key={category.slug}
              to={`/charities?category=${category.slug}`}
              className="group relative bg-card border-2 border-border hover:border-primary transition-all p-5"
            >
              {/* Corner accent on hover */}
              <div className="absolute top-0 right-0 w-0 h-0 bg-coral transition-all group-hover:w-4 group-hover:h-4" />
              
              {/* Icon in geometric box */}
              <div className="w-12 h-12 bg-primary/10 border border-primary/30 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:border-primary transition-all">
                <category.icon className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              
              <h3 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">
                {category.name}
              </h3>
              <span className="text-xs text-muted-foreground mt-1 block">
                {category.count} charities
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
