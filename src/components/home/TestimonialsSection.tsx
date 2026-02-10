import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah M.",
    role: "Monthly Donor",
    quote:
      "GiveWiZe helped me find a rare disease research charity I never would have discovered on my own. The transparency scores gave me confidence my donation was going to the right place.",
    rating: 5,
  },
  {
    name: "James L.",
    role: "First-time Donor",
    quote:
      "I always wanted to give but didn't know where to start. The quiz matched me with three charities perfectly aligned with my values. I'm now a regular donor to two of them.",
    rating: 5,
  },
  {
    name: "Priya K.",
    role: "Philanthropist",
    quote:
      "The dual rating system is brilliant. Seeing both the financial data and community feedback side by side makes evaluating charities so much easier.",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-testimonials">
      {/* Light orbs */}
      <div className="absolute top-1/3 right-[10%] w-72 h-72 bg-white/8 rounded-full blur-[100px]" />
      <div className="absolute bottom-10 left-[20%] w-64 h-64 bg-orange/10 rounded-full blur-[100px]" />

      <div className="container relative">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 glass-dark rounded-full px-4 py-1.5 mb-4">
            <span className="text-xs font-semibold text-white/80">What donors say</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            Trusted by thoughtful givers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className="glass-dark rounded-2xl p-6 hover:bg-white/20 hover:-translate-y-1 transition-all duration-300 animate-fade-in-up opacity-0"
              style={{ animationDelay: `${i * 100}ms`, animationFillMode: "forwards" }}
            >
              <Quote className="h-8 w-8 text-orange-light/40 mb-4" />

              <p className="text-sm text-white/70 leading-relaxed mb-6">
                "{t.quote}"
              </p>

              <div className="flex items-center gap-1 mb-3">
                {[...Array(t.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-orange-light text-orange-light"
                  />
                ))}
              </div>

              <div>
                <p className="font-semibold text-white text-sm">{t.name}</p>
                <p className="text-xs text-white/50">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
