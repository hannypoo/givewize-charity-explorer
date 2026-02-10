import { Link } from "react-router-dom";
import { HelpCircle, MessageCircle } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { usePageTitle } from "@/hooks/usePageTitle";

interface FAQItem {
  question: string;
  answer: React.ReactNode;
}

interface FAQGroup {
  title: string;
  items: FAQItem[];
}

const faqGroups: FAQGroup[] = [
  {
    title: "About GiveWiZe",
    items: [
      {
        question: "What is GiveWiZe?",
        answer: (
          <p>
            GiveWiZe is an AI-powered charity discovery platform that helps donors find and evaluate
            charities based on financial efficiency, transparency, impact, and community feedback.
            We are not a nonprofit ourselves — we're a free tool designed to help you give wisely.
          </p>
        ),
      },
      {
        question: "How does GiveWiZe make money?",
        answer: (
          <p>
            GiveWiZe is a free passion project. We don't charge fees, run ads, or take commissions
            on donations. Our goal is to empower thoughtful giving, not to profit from it.
          </p>
        ),
      },
      {
        question: "Who is behind GiveWiZe?",
        answer: (
          <p>
            GiveWiZe was created by a family inspired by Z's journey with a rare disease.
            That experience taught us how hard it can be to find trustworthy charities —
            and motivated us to build something that helps everyone give with confidence.
          </p>
        ),
      },
    ],
  },
  {
    title: "Ratings & Scores",
    items: [
      {
        question: "How is the GiveWiZe Score calculated?",
        answer: (
          <div className="space-y-2">
            <p>The GiveWiZe Score is a weighted average of four factors:</p>
            <ul className="list-disc list-inside space-y-1 text-white/50">
              <li><strong className="text-white/70">Financial Efficiency (35%)</strong> — How much goes directly to programs</li>
              <li><strong className="text-white/70">Transparency (30%)</strong> — Availability of financial reports and audits</li>
              <li><strong className="text-white/70">Impact (25%)</strong> — Measurable outcomes and documented programs</li>
              <li><strong className="text-white/70">Longevity (10%)</strong> — Track record and organizational stability</li>
            </ul>
            <p>If a sub-score isn't available for a charity, it's excluded and the remaining weights are renormalized.</p>
          </div>
        ),
      },
      {
        question: "What is the Combined Rating?",
        answer: (
          <p>
            The Combined Rating blends our data-driven GiveWiZe Score (60%) with the Community
            Rating (40%) to give you a complete picture of each charity's performance and reputation.
          </p>
        ),
      },
      {
        question: "Why does a charity I like have a low score?",
        answer: (
          <p>
            A lower score reflects the available data, not a charity's worthiness. Some organizations
            — especially smaller or newer ones — may have limited financial filings or fewer community
            reviews. We encourage you to look beyond the number and consider each organization's
            mission and impact. Read more on the{" "}
            <Link to="/charities" className="text-orange-light hover:underline">Explore page</Link> scoring disclaimer.
          </p>
        ),
      },
      {
        question: "How often are ratings updated?",
        answer: (
          <p>
            Ratings are updated periodically as new IRS filings, financial reports, and community
            reviews become available. We aim to keep our data as current as possible.
          </p>
        ),
      },
    ],
  },
  {
    title: "Using the Platform",
    items: [
      {
        question: "Can I donate through GiveWiZe?",
        answer: (
          <p>
            Not yet — GiveWiZe currently helps you discover and evaluate charities. When you're
            ready to donate, we'll direct you to the charity's own website to complete the process.
          </p>
        ),
      },
      {
        question: "How does the quiz work?",
        answer: (
          <p>
            Our{" "}
            <Link to="/quiz" className="text-orange-light hover:underline">Charity Match Quiz</Link>{" "}
            starts with just 3 questions about your values and interests, then lets you optionally
            refine your results with more detail across 3 tiers. Our matching algorithm scores every
            charity against your answers to recommend the best fits.
          </p>
        ),
      },
      {
        question: "What is the Gift Registry?",
        answer: (
          <p>
            The Gift Registry lets you create a list of charities you care about and share it with
            friends and family. Instead of traditional gifts, they can "donate on your behalf" to
            causes that matter to you.
          </p>
        ),
      },
      {
        question: "How does employer matching work?",
        answer: (
          <p>
            If your employer matches charitable donations, you can set up your employer information
            in your profile. Then, from any charity's detail page, you can submit an employer match
            request to potentially double your impact.
          </p>
        ),
      },
    ],
  },
  {
    title: "Account & Privacy",
    items: [
      {
        question: "Is my data safe?",
        answer: (
          <p>
            Yes. We use Supabase with Row Level Security to protect your data. We never sell your
            personal information, and we only store what's necessary to provide our services. Your
            giving preferences and favorites are private to your account.
          </p>
        ),
      },
      {
        question: "How do I delete my account?",
        answer: (
          <p>
            To delete your account and all associated data, please email us at{" "}
            <a href="mailto:admin@givewize.org" className="text-orange-light hover:underline">
              admin@givewize.org
            </a>{" "}
            and we'll process your request promptly.
          </p>
        ),
      },
      {
        question: "I don't see a charity I'm looking for",
        answer: (
          <p>
            We're always adding new charities! You can{" "}
            <Link to="/request-charity" className="text-orange-light hover:underline">
              request a charity
            </Link>{" "}
            and we'll review your suggestion. We evaluate each submission based on our standard criteria.
          </p>
        ),
      },
    ],
  },
  {
    title: "Z's List",
    items: [
      {
        question: "What is Z's List?",
        answer: (
          <p>
            Z's List is a curated collection of charities that are personally important to Z and
            the family behind GiveWiZe. These organizations represent causes close to our hearts —
            from rare disease research to education access. You can find Z's List on the{" "}
            <Link to="/charities" className="text-orange-light hover:underline">Explore page</Link>.
          </p>
        ),
      },
    ],
  },
];

const FAQ = () => {
  usePageTitle(
    "FAQ",
    "Find answers to common questions about GiveWiZe's charity ratings, scoring system, and how to use the platform."
  );

  return (
    <Layout>
      <div className="bg-about min-h-screen -mt-16 pt-16 relative overflow-hidden">
        {/* Light orbs */}
        <div className="absolute top-32 left-[10%] w-80 h-80 bg-white/8 rounded-full blur-[100px]" />
        <div className="absolute top-[60%] right-[15%] w-72 h-72 bg-white/5 rounded-full blur-[100px]" />

        <div className="container relative">
          {/* Hero */}
          <div className="py-16 md:py-24 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 glass-dark rounded-full px-5 py-2.5 mb-8">
              <HelpCircle className="h-4 w-4 text-orange-light" />
              <span className="text-sm font-medium text-white/80">Frequently asked questions</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
              FAQ
            </h1>
            <p className="text-xl text-white/60 leading-relaxed">
              Everything you need to know about GiveWiZe, our ratings, and how to make the most of the platform.
            </p>
          </div>

          {/* FAQ Groups */}
          <div className="max-w-3xl mx-auto pb-16 space-y-8">
            {faqGroups.map((group) => (
              <section key={group.title} className="glass-dark rounded-2xl p-6 md:p-8">
                <h2 className="text-xl font-bold text-white mb-4">{group.title}</h2>
                <Accordion type="multiple" className="w-full">
                  {group.items.map((item, i) => (
                    <AccordionItem
                      key={i}
                      value={`${group.title}-${i}`}
                      className="border-white/10"
                    >
                      <AccordionTrigger className="text-white/90 hover:text-white hover:no-underline text-left">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-white/60 leading-relaxed">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            ))}

            {/* Still have questions CTA */}
            <div className="glass-dark rounded-2xl p-6 md:p-8 text-center">
              <MessageCircle className="h-8 w-8 text-orange-light mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">Still have questions?</h2>
              <p className="text-white/60 mb-6">
                Our help center has a smart assistant that can answer your questions instantly.
              </p>
              <Link
                to="/help"
                className="inline-flex items-center gap-2 gradient-orange text-accent-foreground font-semibold px-6 py-3 rounded-2xl glow-orange hover:scale-[1.02] transition-all duration-300"
              >
                Get Help
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FAQ;
