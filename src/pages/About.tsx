import { Heart, Shield, Star, Eye, Target, Users, TrendingUp } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
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
              About Give<span className="text-orange-light">WiZ</span>e
            </h1>
            <p className="text-xl text-white/60 leading-relaxed">
              Born from a mother's journey, built to help everyone give with confidence.
            </p>
          </div>

          {/* The Inspiration */}
          <section className="max-w-3xl mx-auto mb-12">
            <div className="glass-dark rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">The Inspiration</h2>
              </div>
              <p className="text-white/60 leading-relaxed mb-4">
                My name is Hannah Hoffmaster, and I'm a single mom to a beautiful, medically
                fragile little boy named Ezra — the "Z" in GiveWiZe. Since he was eight months
                old, we've been in and out of hospitals navigating a journey neither of us
                asked for but one that has shaped everything I believe about generosity.
              </p>
              <p className="text-white/60 leading-relaxed mb-4">
                Through the kindness of others — charitable organizations, community support,
                and the many people who showed up when we needed it most — we've been able to
                not only get by, but to live comfortable and happy lives. Ezra gets the care
                he needs, and I've even been able to pursue a master's degree, something I
                once thought was out of reach.
              </p>
              <p className="text-white/60 leading-relaxed mb-4">
                As I look toward the future and the opportunity to earn a higher income, my
                heart keeps returning to the same question:{" "}
                <span className="font-semibold text-white">how can I give back the way others
                gave to us?</span> I want my giving to make the same kind of difference that
                receiving made for me and Z. But when I started looking into where to donate,
                I ran into a problem — it's genuinely difficult to know which charities you
                can trust to use your money well and truly help the people who need it.
              </p>
              <p className="text-white/60 leading-relaxed mb-4">
                That frustration became the spark for GiveWiZe.
              </p>
              <p className="text-white/60 leading-relaxed">
                Ezra is my inspiration for all of it. Without him, I would never have
                understood firsthand what a difference charity and generosity can make in
                someone's life. He gives so much love to everyone around him and stays strong
                no matter what comes his way. Because of him,{" "}
                <span className="font-semibold text-white">GiveWiZe is more than a project
                — it's my life's purpose</span>: to help people like us, and everyone in need,
                find genuine help so they can have a chance at a happy and prosperous life.
              </p>
            </div>
          </section>

          {/* Our Mission */}
          <section className="max-w-3xl mx-auto mb-12">
            <div className="glass-dark rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">Our Mission</h2>
              </div>
              <p className="text-white/60 leading-relaxed mb-4">
                I believe that now more than ever, we need to see goodness in one another — to
                lean into that place of love and generosity that I believe lives in all of us.
                GiveWiZe exists to make that easier.
              </p>
              <p className="text-white/60 leading-relaxed mb-4">
                In a world with millions of charities, finding the right one to support can feel
                overwhelming. Which organizations truly put their money toward their mission? Who
                is making real progress? Where will your donation have the greatest impact?
              </p>
              <p className="text-white/60 leading-relaxed">
                By combining rigorous financial analysis with community insights, GiveWiZe helps
                you discover charities that align with your values and meet the highest standards
                of accountability. Our goal is simple:{" "}
                <span className="font-semibold text-white">make giving easier, smarter, and
                more impactful</span> — so that every act of generosity reaches the people who
                need it most.
              </p>
            </div>
          </section>

          {/* Our Vision */}
          <section className="max-w-3xl mx-auto mb-12">
            <div className="glass-dark rounded-2xl p-6 md:p-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center">
                  <Eye className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">Our Vision</h2>
              </div>
              <p className="text-white/60 leading-relaxed mb-4">
                I envision a future where <span className="font-semibold text-white">every
                donation is an informed donation</span> — where donors feel empowered to ask
                questions, compare options, and give with complete confidence that their
                generosity will reach the people who need it.
              </p>
              <p className="text-white/60 leading-relaxed mb-4">
                GiveWiZe is building tools to match you with causes that resonate with your
                values, creating transparency standards that hold charities accountable, and
                fostering a community of thoughtful givers who share their insights.
              </p>
              <p className="text-white/60 leading-relaxed mb-4">
                We are committed to{" "}
                <span className="font-semibold text-white">honest transparency with no
                biases</span>. We will always give you the truth — our ratings are driven
                purely by data and community feedback, never by partnerships, sponsorships,
                or hidden agendas. You deserve to make your giving decisions based on facts,
                and that's exactly what we provide.
              </p>
              <p className="text-white/60 leading-relaxed">
                Because of Z, I know what it feels like to be on the receiving end of
                someone's generosity. That feeling is what drives this work — the belief
                that <span className="font-semibold text-white">when we make it easier to
                give wisely, we make it easier to change lives</span>.
              </p>
            </div>
          </section>

          {/* How We Rate */}
          <section className="max-w-3xl mx-auto pb-16 md:pb-24">
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

              <p className="text-white/50 text-center mt-6 text-sm leading-relaxed">
                Scores are based on available data and may not reflect the full picture of an
                organization. They are meant to be one part of your decision, not the entire
                decision.
              </p>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default About;
