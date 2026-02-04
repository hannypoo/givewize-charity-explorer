import { Link } from "react-router-dom";
import { 
  Heart, 
  GraduationCap, 
  Leaf, 
  Globe, 
  Home, 
  Utensils,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

const categories = [
  {
    icon: Heart,
    name: "Health",
    description: "Medical research, patient care, and health equity",
    color: "bg-red-500/10 text-red-600",
    count: 124,
  },
  {
    icon: GraduationCap,
    name: "Education",
    description: "Schools, scholarships, and learning programs",
    color: "bg-blue-500/10 text-blue-600",
    count: 98,
  },
  {
    icon: Leaf,
    name: "Environment",
    description: "Climate action, conservation, and sustainability",
    color: "bg-green-500/10 text-green-600",
    count: 76,
  },
  {
    icon: Globe,
    name: "International",
    description: "Global development and humanitarian aid",
    color: "bg-purple-500/10 text-purple-600",
    count: 89,
  },
  {
    icon: Home,
    name: "Housing",
    description: "Homelessness prevention and affordable housing",
    color: "bg-amber-500/10 text-amber-600",
    count: 45,
  },
  {
    icon: Utensils,
    name: "Hunger",
    description: "Food security and nutrition programs",
    color: "bg-orange-500/10 text-orange-600",
    count: 67,
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={`/explore?category=${category.name.toLowerCase()}`}
              className="group relative rounded-xl border border-border bg-card p-6 transition-all hover:shadow-lg hover:border-primary/30 hover:-translate-y-1"
            >
              <div className="flex items-start gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${category.color}`}>
                  <category.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <span className="text-sm text-muted-foreground">{category.count} charities</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {category.description}
                  </p>
                </div>
              </div>
              <ArrowRight className="absolute bottom-6 right-6 h-5 w-5 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1" />
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
