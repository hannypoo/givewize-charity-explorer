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
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Soft gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary/30 to-background" />
      
      {/* Subtle decorative orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] right-[10%] h-[400px] w-[400px] rounded-full bg-rose/10 blur-[100px]" />
        <div className="absolute bottom-[10%] left-[5%] h-[350px] w-[350px] rounded-full bg-plum/10 blur-[80px]" />
      </div>

      <div className="container relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-6">
          <div className="bg-white/60 backdrop-blur-xl rounded-2xl px-8 py-6 border border-white/50 shadow-[0_4px_20px_rgba(0,0,0,0.05)] inline-block">
            <span className="text-rose font-semibold text-sm tracking-wide uppercase mb-2 block">
              Explore Causes
            </span>
            <h2 className="font-display text-editorial text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              Find Your
              <span className="rose-gradient"> Passion</span>
            </h2>
          </div>
          <Link 
            to="/charities" 
            className="group inline-flex items-center text-plum font-semibold hover:text-rose transition-colors bg-white/60 backdrop-blur-xl px-6 py-3 rounded-full border border-white/50"
          >
            View All Categories
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Categories Grid - Glass cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {categories.map((category) => (
            <Link
              key={category.slug}
              to={`/charities?category=${category.slug}`}
              className="group relative"
            >
              {/* Glass card */}
              <div className="relative flex flex-col items-start rounded-[1.5rem] bg-white/70 backdrop-blur-xl p-6 transition-all duration-300 border border-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:bg-white/80 hover:shadow-[0_12px_40px_rgba(0,0,0,0.1)] hover:-translate-y-2 hover:border-rose/30 overflow-hidden">
                {/* Highlight gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[1.5rem]" />
                
                {/* Icon in glass circle */}
                <div className="relative flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-plum to-plum-dark ring-2 ring-rose/25 group-hover:ring-rose/50 transition-all mb-5 shadow-[0_4px_15px_rgba(100,60,120,0.3)]">
                  <category.icon className="h-6 w-6 text-rose" />
                </div>
                
                {/* Content */}
                <h3 className="relative font-bold text-foreground text-base md:text-lg mb-1 group-hover:text-plum transition-colors">
                  {category.name}
                </h3>
                <span className="relative text-sm text-muted-foreground">
                  {category.count} charities
                </span>

                {/* Hover arrow */}
                <ArrowRight className="absolute bottom-6 right-6 h-5 w-5 text-rose opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
