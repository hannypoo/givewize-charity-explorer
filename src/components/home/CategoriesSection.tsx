import { Link } from "react-router-dom";
import { 
  Dna, HeartPulse, GraduationCap, Utensils,
  PawPrint, Baby, Leaf, Siren, ArrowRight
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
    <section className="py-16 md:py-24 relative overflow-hidden bg-categories">
      {/* Light orbs */}
      <div className="absolute top-0 right-[20%] w-64 h-64 bg-white/10 rounded-full blur-[80px]" />
      <div className="absolute bottom-0 left-[10%] w-72 h-72 bg-white/5 rounded-full blur-[100px]" />

      <div className="container relative">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 glass-dark rounded-full px-4 py-1.5 mb-4">
              <span className="text-xs font-semibold text-white/80">Categories</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Browse by cause
            </h2>
          </div>
          <Link 
            to="/charities" 
            className="group inline-flex items-center text-sm font-semibold text-white/80 hover:text-white transition-colors"
          >
            View All
            <ArrowRight className="ml-1.5 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              key={category.slug}
              to={`/charities?category=${category.slug}`}
              className="group glass-dark rounded-2xl p-5 hover:bg-white/20 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center mb-4 group-hover:bg-white/25 transition-colors duration-300">
                <category.icon className="h-5 w-5 text-white" />
              </div>
              
              <h3 className="font-semibold text-white text-sm mb-1">
                {category.name}
              </h3>
              <span className="text-xs text-white/50">
                {category.count} charities
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
