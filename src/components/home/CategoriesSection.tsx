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
    <section className="py-20 md:py-28 relative overflow-hidden">
      {/* Soft gradient background */}
      <div className="absolute inset-0 gradient-soft" />
      
      <div className="container relative">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 text-sm font-medium text-accent mb-3">
            <span className="w-8 h-[2px] bg-accent rounded-full" />
            Categories
            <span className="w-8 h-[2px] bg-accent rounded-full" />
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground tracking-tight mb-4">
            Browse by cause
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Find organizations aligned with what matters most to you
          </p>
        </div>

        {/* Organic grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {categories.map((category) => (
            <Link
              key={category.slug}
              to={`/charities?category=${category.slug}`}
              className="group relative bg-card rounded-2xl border border-border hover:border-primary/30 hover:shadow-card transition-all duration-300 p-5"
            >
              {/* Hover glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
              
              <div className="relative">
                {/* Icon in soft circle */}
                <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                  <category.icon className="h-5 w-5 text-primary" />
                </div>
                
                <h3 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <span className="text-xs text-muted-foreground mt-1 block">
                  {category.count} charities
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* View all link */}
        <div className="text-center">
          <Link 
            to="/charities" 
            className="group inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            View all categories
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
