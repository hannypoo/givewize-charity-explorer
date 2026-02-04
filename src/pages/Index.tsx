import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <CategoriesSection />
      <HowItWorksSection />
    </Layout>
  );
};

export default Index;
