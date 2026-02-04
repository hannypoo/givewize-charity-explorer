import { Link } from "react-router-dom";
import { Heart, Shield, Star, Eye, ArrowRight, Target, Users, TrendingUp } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";

const About = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-100">
        <div className="container py-16 md:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-[#1a365d] mb-6">
              About GiveWiZe
            </h1>
            <p className="text-xl text-[#6B7280] leading-relaxed">
              We believe everyone deserves to give with confidence, knowing their 
              donation will make a real difference.
            </p>
          </div>
        </div>
      </div>

      {/* Our Mission Section */}
      <section className="bg-[#F8FAFC] py-16 md:py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#4A90D9]/10">
                <Heart className="h-6 w-6 text-[#4A90D9]" />
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-[#1a365d]">
                Our Mission
              </h2>
            </div>
            <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm">
              <p className="text-lg text-[#6B7280] leading-relaxed mb-4">
                GiveWiZe exists to help donors give confidently. In a world with millions of 
                charities, finding the right one to support can feel overwhelming. How do you 
                know your money will be used effectively? Which organizations are truly 
                transparent about their work?
              </p>
              <p className="text-lg text-[#6B7280] leading-relaxed mb-4">
                We created GiveWiZe to answer these questions. By combining rigorous financial 
                analysis with community insights, we help you discover charities that align 
                with your values and meet the highest standards of accountability.
              </p>
              <p className="text-lg text-[#6B7280] leading-relaxed">
                Our goal is simple: <span className="font-semibold text-[#1F2937]">make giving easier, 
                smarter, and more impactful</span> for everyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Founder's Story Section */}
      <section className="bg-white py-16 md:py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#4A90D9]/10">
                <Users className="h-6 w-6 text-[#4A90D9]" />
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-[#1a365d]">
                The Founder's Story
              </h2>
            </div>
            <div className="bg-[#F8FAFC] rounded-xl p-6 md:p-8">
              <p className="text-lg text-[#6B7280] leading-relaxed mb-4">
                GiveWiZe was born from a personal experience. After being touched by a rare 
                disease in our family, we wanted to support research and patient advocacy 
                organizations—but we quickly discovered how difficult it was to evaluate 
                charities objectively.
              </p>
              <p className="text-lg text-[#6B7280] leading-relaxed mb-4">
                Which organizations put the most money toward their mission? Who was truly 
                making progress? Where would our donation have the greatest impact? These 
                questions led to months of research, spreadsheets, and frustration.
              </p>
              <p className="text-lg text-[#6B7280] leading-relaxed">
                We built GiveWiZe so that no one else has to go through that process alone. 
                Every feature, every metric, and every recommendation is designed with the 
                thoughtful donor in mind—<span className="font-semibold text-[#1F2937]">someone 
                who cares deeply and wants to give wisely</span>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How We Rate Section */}
      <section className="bg-[#F8FAFC] py-16 md:py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#4A90D9]/10">
                <Shield className="h-6 w-6 text-[#4A90D9]" />
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-[#1a365d]">
                How We Rate Charities
              </h2>
            </div>
            <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm mb-6">
              <p className="text-lg text-[#6B7280] leading-relaxed mb-6">
                We use a <span className="font-semibold text-[#1F2937]">dual rating system</span> that 
                combines objective data with real-world experiences:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* GiveWiZe Score */}
                <div className="border border-gray-100 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#4A90D9]/10">
                      <Target className="h-5 w-5 text-[#4A90D9]" />
                    </div>
                    <h3 className="font-semibold text-[#1a365d]">GiveWiZe Score</h3>
                  </div>
                  <p className="text-[#6B7280] text-sm mb-4">
                    Our proprietary rating based on objective metrics:
                  </p>
                  <ul className="space-y-2 text-sm text-[#6B7280]">
                    <li className="flex items-start gap-2">
                      <TrendingUp className="h-4 w-4 text-[#4A90D9] mt-0.5" />
                      <span><strong className="text-[#1F2937]">Financial Efficiency</strong> — Percentage of funds going to programs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Eye className="h-4 w-4 text-[#4A90D9] mt-0.5" />
                      <span><strong className="text-[#1F2937]">Transparency</strong> — Availability of financial reports and audits</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Shield className="h-4 w-4 text-[#4A90D9] mt-0.5" />
                      <span><strong className="text-[#1F2937]">Longevity</strong> — Track record and organizational stability</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Heart className="h-4 w-4 text-[#4A90D9] mt-0.5" />
                      <span><strong className="text-[#1F2937]">Impact</strong> — Measurable outcomes and effectiveness</span>
                    </li>
                  </ul>
                </div>

                {/* Community Rating */}
                <div className="border border-gray-100 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FBBF24]/10">
                      <Star className="h-5 w-5 text-[#FBBF24]" />
                    </div>
                    <h3 className="font-semibold text-[#1a365d]">Community Rating</h3>
                  </div>
                  <p className="text-[#6B7280] text-sm mb-4">
                    Real feedback from donors like you:
                  </p>
                  <ul className="space-y-2 text-sm text-[#6B7280]">
                    <li className="flex items-start gap-2">
                      <Star className="h-4 w-4 text-[#FBBF24] mt-0.5" />
                      <span>Donor satisfaction and experience</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="h-4 w-4 text-[#FBBF24] mt-0.5" />
                      <span>Communication and responsiveness</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="h-4 w-4 text-[#FBBF24] mt-0.5" />
                      <span>Perceived impact and trust</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="h-4 w-4 text-[#FBBF24] mt-0.5" />
                      <span>Overall recommendation score</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <p className="text-[#6B7280] text-center">
              Together, these ratings give you a complete picture of each charity's 
              performance and reputation.
            </p>
          </div>
        </div>
      </section>

      {/* Our Vision Section */}
      <section className="bg-white py-16 md:py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#4A90D9]/10">
                <Eye className="h-6 w-6 text-[#4A90D9]" />
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-[#1a365d]">
                Our Vision
              </h2>
            </div>
            <div className="bg-[#F8FAFC] rounded-xl p-6 md:p-8 mb-8">
              <p className="text-lg text-[#6B7280] leading-relaxed mb-4">
                We envision a future where <span className="font-semibold text-[#1F2937]">every 
                donation is an informed donation</span>. Where donors feel empowered to ask 
                questions, compare options, and give with complete confidence.
              </p>
              <p className="text-lg text-[#6B7280] leading-relaxed mb-4">
                We're building tools to match you with causes that resonate with your personal 
                values and experiences. We're creating transparency standards that hold 
                charities accountable. And we're fostering a community of thoughtful givers 
                who share their insights to help others.
              </p>
              <p className="text-lg text-[#6B7280] leading-relaxed">
                The future of giving is confident, connected, and impactful—and we're 
                building it together.
              </p>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="bg-[#4A90D9] hover:bg-[#3d7fc4] text-white px-8"
                asChild
              >
                <Link to="/quiz">
                  Find Your Match
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-[#4A90D9] text-[#4A90D9] hover:bg-[#4A90D9]/5"
                asChild
              >
                <Link to="/charities">Explore Charities</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
