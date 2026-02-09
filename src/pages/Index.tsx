import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { FeaturedCharitiesSection } from "@/components/home/FeaturedCharitiesSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { usePageTitle } from "@/hooks/usePageTitle";

const Index = () => {
  usePageTitle();
  return (
    <Layout>
      <HeroSection />
      <CategoriesSection />
      <FeaturedCharitiesSection />
      <HowItWorksSection />
    </Layout>
  );
};

export default Index;
