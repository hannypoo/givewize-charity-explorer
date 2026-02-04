import { Link } from "react-router-dom";
import { 
  Dna, 
  HeartPulse, 
  GraduationCap, 
  Utensils,
  PawPrint,
  Baby,
  Leaf, 
  Siren
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
    <section className="py-20 md:py-28 bg-[#F8FAFC]">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-14">
          <h2 className="font-display text-3xl font-bold text-[#1a365d] sm:text-4xl">
            Browse by Cause
          </h2>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 max-w-5xl mx-auto">
          {categories.map((category) => (
            <Link
              key={category.slug}
              to={`/charities?category=${category.slug}`}
              className="group flex flex-col items-center rounded-xl bg-white p-6 text-center transition-all duration-200 hover:shadow-md hover:-translate-y-1 border-2 border-transparent hover:border-[#4A90D9]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#4A90D9]/10 mb-4">
                <category.icon className="h-6 w-6 text-[#4A90D9]" />
              </div>
              <h3 className="font-semibold text-[#1a365d] text-sm md:text-base">
                {category.name}
              </h3>
              <span className="mt-1 text-xs text-[#9CA3AF]">
                {category.count} charities
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
