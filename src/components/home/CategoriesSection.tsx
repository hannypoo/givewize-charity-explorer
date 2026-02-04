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
    <section className="py-16 md:py-24 bg-secondary relative overflow-hidden">
      {/* Zigzag top border */}
      <div className="absolute top-0 left-0 right-0 h-4 zigzag-border" />
      
      <div className="container relative">
        {/* Section Header - Brutalist */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-4">
          <div>
            <div className="inline-block bg-accent border-3 border-foreground px-3 py-1 mb-4 -rotate-1 brutal-shadow-sm">
              <span className="text-xs font-black uppercase">Categories</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground uppercase tracking-tight">
              Browse by cause
            </h2>
          </div>
          <Link 
            to="/charities" 
            className="group inline-flex items-center text-sm font-black text-foreground uppercase hover:text-primary transition-colors"
          >
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        {/* Brutalist grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category, index) => (
            <Link
              key={category.slug}
              to={`/charities?category=${category.slug}`}
              className="group relative bg-card border-3 border-foreground hover:bg-accent transition-all brutal-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none p-5"
              style={{ transform: `rotate(${index % 2 === 0 ? '-1' : '1'}deg)` }}
            >
              {/* Icon box */}
              <div className="w-12 h-12 bg-primary border-3 border-foreground flex items-center justify-center mb-4 group-hover:bg-foreground transition-colors">
                <category.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              
              <h3 className="font-black text-foreground text-sm uppercase group-hover:text-accent-foreground transition-colors">
                {category.name}
              </h3>
              <span className="text-xs font-bold text-muted-foreground mt-1 block group-hover:text-accent-foreground/80 transition-colors">
                {category.count} charities
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
