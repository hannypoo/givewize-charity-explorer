import { Link } from "react-router-dom";
import { Heart, Shield, Star, Eye, Target, Users, TrendingUp } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { usePageTitle } from "@/hooks/usePageTitle";

const About = () => {
  usePageTitle("About", "Learn about GiveWiZe's mission to help donors give confidently with transparent charity ratings and community insights.");
  return (
    <Layout>
      <div className="bg-about min-h-screen -mt-16 pt-16 relative overflow-hidden">
        {/* Light orbs */}
        <div className="absolute top-32 left-[10%] w-80 h-80 bg-white/8 rounded-full blur-[100px]" />
        <div className="absolute top-[60%] right-[15%] w-72 h-72 bg-white/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-32 left-[20%] w-64 h-64 bg-orange/10 rounded-full blur-[100px]" />

        <div className="container relative">
          {/* Hero */}
          <div className="py-16 md:py-24 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 glass-dark rounded-full px-5 py-2.5 mb-8">
              <Heart className="h-4 w-4 text-orange-light" />
              <span className="text-sm font-medium text-white/80">Our story</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
              About GiveWiZe
            </h1>
            <p className="text-xl text-white/60 leading-relaxed">
              We believe everyone deserves to give with confidence, knowing their
              donation will make a real difference.
            </p>
          </div>

          {/* Our Mission */}
          <section className="max-w-3xl mx-auto mb-12">
            <div className="glass-dark rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">Our Mission</h2>
              </div>
              <p className="text-white/60 leading-relaxed mb-4">
                GiveWiZe exists to help donors give confidently. In a world with millions of
                charities, finding the right one to support can feel overwhelming. How do you
                know your money will be used effectively?
              </p>
              <p className="text-white/60 leading-relaxed mb-4">
                We created GiveWiZe to answer these questions. By combining rigorous financial
                analysis with community insights, we help you discover charities that align
                with your values and meet the highest standards of accountability.
              </p>
              <p className="text-white/60 leading-relaxed">
                Our goal is simple: <span className="font-semibold text-white">make giving easier,
                smarter, and more impactful</span> for everyone.
              </p>
            </div>
          </section>

          {/* Founder's Story */}
          <section className="max-w-3xl mx-auto mb-12">
            <div className="glass-dark rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">The Founder's Story</h2>
              </div>
              <p className="text-white/60 leading-relaxed mb-4">
                GiveWiZe was born from a personal experience. After being touched by a rare
                disease in our family, we wanted to support research and patient advocacy
                organizations—but we quickly discovered how difficult it was to evaluate
                charities objectively.
              </p>
              <p className="text-white/60 leading-relaxed mb-4">
                Which organizations put the most money toward their mission? Who was truly
                making progress? Where would our donation have the greatest impact? These
                questions led to months of research, spreadsheets, and frustration.
              </p>
              <p className="text-white/60 leading-relaxed">
                We built GiveWiZe so that no one else has to go through that process alone.
                Every feature, every metric, and every recommendation is designed with the
                thoughtful donor in mind—<span className="font-semibold text-white">someone
                who cares deeply and wants to give wisely</span>.
              </p>
            </div>
          </section>

          {/* How We Rate */}
          <section className="max-w-3xl mx-auto mb-12">
            <div className="glass-dark rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">How We Rate Charities</h2>
              </div>
              <p className="text-white/60 leading-relaxed mb-6">
                We use a <span className="font-semibold text-white">dual rating system</span> that
                combines objective data with real-world experiences:
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                {/* GiveWiZe Score */}
                <div className="bg-white/10 rounded-xl p-5 border border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-white/15 flex items-center justify-center">
                      <Target className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-white">GiveWiZe Score</h3>
                  </div>
                  <p className="text-white/50 text-sm mb-4">Our proprietary rating based on objective metrics:</p>
                  <ul className="space-y-2 text-sm text-white/60">
                    <li className="flex items-start gap-2">
                      <TrendingUp className="h-4 w-4 text-orange-light mt-0.5 shrink-0" />
                      <span><strong className="text-white">Financial Efficiency</strong> — Percentage of funds going to programs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Eye className="h-4 w-4 text-orange-light mt-0.5 shrink-0" />
                      <span><strong className="text-white">Transparency</strong> — Availability of financial reports and audits</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Shield className="h-4 w-4 text-orange-light mt-0.5 shrink-0" />
                      <span><strong className="text-white">Longevity</strong> — Track record and organizational stability</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Heart className="h-4 w-4 text-orange-light mt-0.5 shrink-0" />
                      <span><strong className="text-white">Impact</strong> — Measurable outcomes and effectiveness</span>
                    </li>
                  </ul>
                </div>

                {/* Community Rating */}
                <div className="bg-white/10 rounded-xl p-5 border border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg gradient-orange flex items-center justify-center">
                      <Star className="h-5 w-5 text-accent-foreground" />
                    </div>
                    <h3 className="font-semibold text-white">Community Rating</h3>
                  </div>
                  <p className="text-white/50 text-sm mb-4">Real feedback from donors like you:</p>
                  <ul className="space-y-2 text-sm text-white/60">
                    <li className="flex items-start gap-2">
                      <Star className="h-4 w-4 text-orange-light mt-0.5 shrink-0" />
                      <span>Donor satisfaction and experience</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="h-4 w-4 text-orange-light mt-0.5 shrink-0" />
                      <span>Communication and responsiveness</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="h-4 w-4 text-orange-light mt-0.5 shrink-0" />
                      <span>Perceived impact and trust</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="h-4 w-4 text-orange-light mt-0.5 shrink-0" />
                      <span>Overall recommendation score</span>
                    </li>
                  </ul>
                </div>
              </div>

              <p className="text-white/50 text-center mt-6 text-sm">
                Together, these ratings give you a complete picture of each charity's performance and reputation.
              </p>
            </div>
          </section>

          {/* Our Vision + CTA */}
          <section className="max-w-3xl mx-auto pb-16 md:pb-24">
            <div className="glass-dark rounded-2xl p-6 md:p-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center">
                  <Eye className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">Our Vision</h2>
              </div>
              <p className="text-white/60 leading-relaxed mb-4">
                We envision a future where <span className="font-semibold text-white">every
                donation is an informed donation</span>. Where donors feel empowered to ask
                questions, compare options, and give with complete confidence.
              </p>
              <p className="text-white/60 leading-relaxed mb-4">
                We're building tools to match you with causes that resonate with your personal
                values. We're creating transparency standards that hold charities accountable.
                And we're fostering a community of thoughtful givers who share their insights.
              </p>
              <p className="text-white/60 leading-relaxed mb-8">
                The future of giving is confident, connected, and impactful—and we're
                building it together.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  size="lg"
                  className="gradient-orange text-accent-foreground font-semibold px-8 rounded-2xl glow-orange hover:scale-[1.02] transition-all duration-300"
                  asChild
                >
                  <Link to="/quiz">Find Your Match</Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/25 text-white hover:bg-white/15 rounded-2xl"
                  asChild
                >
                  <Link to="/charities">Explore Charities</Link>
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default About;
