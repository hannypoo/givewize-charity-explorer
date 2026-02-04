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
  {
    icon: Dna,
    name: "Rare Diseases",
    slug: "rare-diseases",
    count: 12,
  },
  {
    icon: HeartPulse,
    name: "Medical & Health",
    slug: "medical-health",
    count: 24,
  },
  {
    icon: GraduationCap,
    name: "Education",
    slug: "education",
    count: 18,
  },
  {
    icon: Utensils,
    name: "Hunger & Food Security",
    slug: "hunger-food-security",
    count: 15,
  },
  {
    icon: PawPrint,
    name: "Animal Welfare",
    slug: "animal-welfare",
    count: 21,
  },
  {
    icon: Baby,
    name: "Child Welfare",
    slug: "child-welfare",
    count: 16,
  },
  {
    icon: Leaf,
    name: "Environment",
    slug: "environment-climate",
    count: 19,
  },
  {
    icon: Siren,
    name: "Emergency Relief",
    slug: "emergency-relief",
    count: 8,
  },
];

export function CategoriesSection() {
  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="container">
        {/* Section Header - Editorial style */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-6">
          <div>
            <span className="text-gold font-semibold text-sm tracking-wide uppercase mb-3 block">
              Explore Causes
            </span>
            <h2 className="font-display text-editorial text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              Find Your
              <span className="gold-gradient"> Passion</span>
            </h2>
          </div>
          <Link 
            to="/charities" 
            className="group inline-flex items-center text-navy font-semibold hover:text-gold transition-colors"
          >
            View All Categories
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Categories Grid - Bold cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link
              key={category.slug}
              to={`/charities?category=${category.slug}`}
              className="group relative flex flex-col items-start rounded-2xl bg-card p-6 transition-all duration-300 hover:shadow-elevated hover:-translate-y-2 border border-border hover:border-gold/30 overflow-hidden"
            >
              {/* Background gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              {/* Icon container */}
              <div className="relative flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-navy to-navy-dark ring-2 ring-gold/20 group-hover:ring-gold/40 transition-all mb-5 shadow-navy">
                <category.icon className="h-6 w-6 text-gold" />
              </div>
              
              {/* Content */}
              <h3 className="relative font-bold text-foreground text-base md:text-lg mb-1 group-hover:text-navy transition-colors">
                {category.name}
              </h3>
              <span className="relative text-sm text-muted-foreground">
                {category.count} charities
              </span>

              {/* Hover arrow */}
              <ArrowRight className="absolute bottom-6 right-6 h-5 w-5 text-gold opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
