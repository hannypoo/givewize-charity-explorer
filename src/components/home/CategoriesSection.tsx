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
import { Button } from "@/components/ui/button";

const categories = [
  {
    icon: Dna,
    name: "Rare Diseases",
    slug: "rare-diseases",
    count: 42,
  },
  {
    icon: HeartPulse,
    name: "Medical & Health",
    slug: "medical-health",
    count: 156,
  },
  {
    icon: GraduationCap,
    name: "Education",
    slug: "education",
    count: 98,
  },
  {
    icon: Utensils,
    name: "Hunger & Food Security",
    slug: "hunger-food-security",
    count: 67,
  },
  {
    icon: PawPrint,
    name: "Animal Welfare",
    slug: "animal-welfare",
    count: 84,
  },
  {
    icon: Baby,
    name: "Child Welfare",
    slug: "child-welfare",
    count: 73,
  },
  {
    icon: Leaf,
    name: "Environment & Climate",
    slug: "environment-climate",
    count: 91,
  },
  {
    icon: Siren,
    name: "Emergency Relief",
    slug: "emergency-relief",
    count: 38,
  },
];

export function CategoriesSection() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            Browse by Cause
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore charities across different categories and find causes that resonate with you.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link
              key={category.slug}
              to={`/charities?category=${category.slug}`}
              className="group relative flex flex-col items-center rounded-xl border border-border bg-card p-5 md:p-6 text-center transition-all hover:shadow-soft hover:border-primary/30 hover:-translate-y-1"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-3">
                <category.icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors text-sm md:text-base">
                {category.name}
              </h3>
              <span className="mt-1 text-xs text-muted-foreground">{category.count} charities</span>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-12 text-center">
          <Button variant="outline" size="lg" asChild>
            <Link to="/explore">
              View All Categories
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
