import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, Mail, Send, Bot, User } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { usePageTitle } from "@/hooks/usePageTitle";

interface KnowledgeEntry {
  keywords: string[];
  answer: string;
}

const knowledge: KnowledgeEntry[] = [
  {
    keywords: ["givewize score", "score calculated", "how are scores", "scoring", "rating calculated", "how is the"],
    answer:
      "The GiveWiZe Score is a weighted average: Financial Efficiency (35%), Transparency (30%), Impact (25%), and Longevity (10%). If a sub-score isn't available, the remaining weights are renormalized. You can learn more on our FAQ page.",
  },
  {
    keywords: ["combined rating", "combined score", "overall rating"],
    answer:
      "The Combined Rating is 60% GiveWiZe Score + 40% Community Rating. It gives you both the data-driven analysis and real donor feedback in one number.",
  },
  {
    keywords: ["donate", "donation", "give money", "can i donate"],
    answer:
      "GiveWiZe doesn't process donations directly yet. When you find a charity you'd like to support, we'll direct you to their official website to donate safely.",
  },
  {
    keywords: ["quiz", "match", "find charity", "recommendation"],
    answer:
      "Our Charity Match Quiz asks 11 questions about your values and preferences, then uses a matching algorithm to recommend charities that align with what matters to you. Try it at /quiz!",
  },
  {
    keywords: ["request", "add charity", "missing charity", "don't see", "not listed"],
    answer:
      'You can request a charity be added to GiveWiZe! Visit our "Request a Charity" page at /request-charity and fill out the form. We review every suggestion.',
  },
  {
    keywords: ["gift registry", "donate on behalf", "gift"],
    answer:
      "The Gift Registry lets you create a list of charities and share it with friends and family. Instead of traditional gifts, they can donate to causes you care about on your behalf.",
  },
  {
    keywords: ["employer match", "matching", "employer"],
    answer:
      "If your employer matches donations, set up your employer info in your profile. Then from any charity page, you can submit a match request to potentially double your impact!",
  },
  {
    keywords: ["data", "privacy", "safe", "security", "secure"],
    answer:
      "Your data is safe with us. We use Supabase with Row Level Security, never sell personal information, and only store what's needed to provide our services.",
  },
  {
    keywords: ["delete account", "remove account", "delete my"],
    answer:
      "To delete your account, email us at admin@givewize.org and we'll process your request promptly.",
  },
  {
    keywords: ["z's list", "zs list", "z list", "personal", "family"],
    answer:
      "Z's List is a curated collection of charities personally important to Z and the family behind GiveWiZe, from rare disease research to education access. Find it on the Explore page!",
  },
  {
    keywords: ["who", "behind", "created", "founder", "team"],
    answer:
      "GiveWiZe was created by a family inspired by Z's journey with a rare disease. That experience motivated us to build a tool that helps everyone give with confidence.",
  },
  {
    keywords: ["free", "cost", "money", "pay", "charge", "ads"],
    answer:
      "GiveWiZe is completely free! It's a passion project with no fees, no ads, and no commissions. Our only goal is to help you give wisely.",
  },
  {
    keywords: ["low score", "bad score", "worthiness", "worth"],
    answer:
      "A lower score reflects available data, not a charity's worthiness. Smaller or newer organizations may have limited filings. We encourage you to look beyond the number and consider each organization's mission.",
  },
  {
    keywords: ["update", "how often", "frequency", "current"],
    answer:
      "Ratings are updated periodically as new IRS filings, financial reports, and community reviews become available. We aim to keep data as current as possible.",
  },
];

function findAnswer(input: string): string {
  const lower = input.toLowerCase();
  let bestMatch: KnowledgeEntry | null = null;
  let bestCount = 0;

  for (const entry of knowledge) {
    const matchCount = entry.keywords.filter((kw) => lower.includes(kw)).length;
    if (matchCount > bestCount) {
      bestCount = matchCount;
      bestMatch = entry;
    }
  }

  if (bestMatch) return bestMatch.answer;

  // Single-word fallback
  const words = lower.split(/\s+/);
  for (const entry of knowledge) {
    for (const kw of entry.keywords) {
      if (words.some((w) => kw.includes(w) && w.length > 3)) {
        return entry.answer;
      }
    }
  }

  return "I couldn't find a specific answer for that. You can check our FAQ page for more details, or email us at admin@givewize.org and we'll get back to you within 1-2 business days.";
}

interface Message {
  role: "bot" | "user";
  text: string;
}

const quickActions = [
  "How are scores calculated?",
  "Request a charity",
  "Can I donate?",
  "What is Z's List?",
];

const Help = () => {
  usePageTitle(
    "Help & Contact",
    "Get help with GiveWiZe. Chat with our smart assistant or contact us by email."
  );

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text: "Hi! I'm the GiveWiZe assistant. Ask me anything about our platform, scores, or features. You can also try one of the quick actions below!",
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (text?: string) => {
    const msg = text || input.trim();
    if (!msg) return;

    const userMsg: Message = { role: "user", text: msg };
    const botMsg: Message = { role: "bot", text: findAnswer(msg) };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

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
              <MessageCircle className="h-4 w-4 text-orange-light" />
              <span className="text-sm font-medium text-white/80">Help & Contact</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
              How Can We Help?
            </h1>
            <p className="text-xl text-white/60 leading-relaxed">
              Chat with our assistant or reach out by email.
            </p>
          </div>

          {/* Two-column layout */}
          <div className="max-w-5xl mx-auto pb-16 grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Chat Bot — takes more space */}
            <div className="lg:col-span-3 glass-dark rounded-2xl flex flex-col" style={{ minHeight: "480px" }}>
              <div className="p-4 border-b border-white/10 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg gradient-orange flex items-center justify-center">
                  <Bot className="h-4 w-4 text-accent-foreground" />
                </div>
                <div>
                  <h2 className="font-semibold text-white text-sm">Smart FAQ Assistant</h2>
                  <p className="text-xs text-white/40">Instant answers to common questions</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role === "bot" && (
                      <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center shrink-0 mt-0.5">
                        <Bot className="h-3.5 w-3.5 text-orange-light" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "gradient-orange text-accent-foreground"
                          : "bg-white/10 text-white/80"
                      }`}
                    >
                      {msg.text}
                    </div>
                    {msg.role === "user" && (
                      <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center shrink-0 mt-0.5">
                        <User className="h-3.5 w-3.5 text-white/60" />
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick actions */}
              {messages.length <= 1 && (
                <div className="px-4 pb-2 flex flex-wrap gap-2">
                  {quickActions.map((action) => (
                    <button
                      key={action}
                      onClick={() => handleSend(action)}
                      className="text-xs bg-white/10 hover:bg-white/20 text-white/70 hover:text-white rounded-full px-3 py-1.5 transition-colors"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <div className="p-4 border-t border-white/10">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your question..."
                    className="flex-1 bg-white/10 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-orange-light/50"
                  />
                  <Button
                    onClick={() => handleSend()}
                    disabled={!input.trim()}
                    className="gradient-orange text-accent-foreground rounded-xl px-4 glow-orange"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Email Contact */}
            <div className="lg:col-span-2 space-y-6">
              <div className="glass-dark rounded-2xl p-6 md:p-8">
                <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center mb-4">
                  <Mail className="h-6 w-6 text-orange-light" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Email Us</h2>
                <p className="text-white/60 text-sm mb-6 leading-relaxed">
                  Prefer to reach out directly? Send us an email and we'll get back to you.
                </p>
                <a
                  href="mailto:admin@givewize.org"
                  className="inline-flex items-center gap-2 gradient-orange text-accent-foreground font-semibold px-6 py-3 rounded-2xl glow-orange hover:scale-[1.02] transition-all duration-300"
                >
                  <Mail className="h-4 w-4" />
                  admin@givewize.org
                </a>
                <p className="text-xs text-white/40 mt-4">
                  Email responses may take 1–2 business days.
                </p>
              </div>

              <div className="glass-dark rounded-2xl p-6 md:p-8">
                <h3 className="font-semibold text-white mb-2">Check our FAQ</h3>
                <p className="text-white/60 text-sm mb-4">
                  We have detailed answers for 15 of the most common questions.
                </p>
                <Link
                  to="/faq"
                  className="text-orange-light hover:underline text-sm font-medium"
                >
                  Browse FAQ →
                </Link>
              </div>

              <div className="glass-dark rounded-2xl p-6 md:p-8">
                <h3 className="font-semibold text-white mb-2">Missing a charity?</h3>
                <p className="text-white/60 text-sm mb-4">
                  Suggest a charity you'd like us to add to the platform.
                </p>
                <Link
                  to="/request-charity"
                  className="text-orange-light hover:underline text-sm font-medium"
                >
                  Request a Charity →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Help;
