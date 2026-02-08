import { useState } from "react";
import { ShieldCheck, ThumbsUp, MessageCircle, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { StarRating } from "./StarRating";

// ── Types ────────────────────────────────────────────────────────────────
export interface DonorReview {
  id: string;
  donor_name: string;
  verified: boolean;
  date: string;
  rating: number;
  categories: {
    impact: number;
    communication: number;
    transparency: number;
    experience: number;
  };
  text: string;
  donation_amount?: number | null;
  helpful_count: number;
}

interface VerifiedDonorReviewsProps {
  charityName: string;
  reviews: DonorReview[];
  onSubmitReview?: (review: DonorReview) => void;
}

const REVIEW_CATEGORIES = [
  { key: "impact" as const, label: "Impact", description: "How effectively does this charity make a difference?" },
  { key: "communication" as const, label: "Communication", description: "How well does the charity communicate with donors?" },
  { key: "transparency" as const, label: "Transparency", description: "How transparent is the charity about finances?" },
  { key: "experience" as const, label: "Experience", description: "How was your overall donor experience?" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "highest", label: "Highest Rated" },
  { value: "lowest", label: "Lowest Rated" },
  { value: "most_helpful", label: "Most Helpful" },
];

// ── Review Card ──────────────────────────────────────────────────────────
function ReviewCard({ review, onHelpful }: { review: DonorReview; onHelpful: (id: string) => void }) {
  const avgRating = (review.categories.impact + review.categories.communication + review.categories.transparency + review.categories.experience) / 4;
  const dateStr = new Date(review.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const initials = review.donor_name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-soft">
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
            {initials}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-foreground">{review.donor_name}</span>
              {review.verified && (
                <span className="flex items-center gap-0.5 text-xs font-medium text-primary">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Verified Donor
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{dateStr}</span>
              {review.donation_amount && (
                <span className="text-xs text-muted-foreground">
                  Donated: ${review.donation_amount.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </div>
        <StarRating rating={avgRating} size="sm" showValue />
      </div>

      <p className="mb-3 text-sm leading-relaxed text-muted-foreground">{review.text}</p>

      <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {REVIEW_CATEGORIES.map((cat) => (
          <div key={cat.key} className="rounded-lg bg-secondary p-2 text-center">
            <div className="mb-0.5 text-xs text-muted-foreground">{cat.label}</div>
            <StarRating rating={review.categories[cat.key]} size="sm" />
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 border-t border-border pt-2">
        <button
          onClick={() => onHelpful(review.id)}
          className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-primary"
        >
          <ThumbsUp className="h-3.5 w-3.5" />
          Helpful ({review.helpful_count || 0})
        </button>
      </div>
    </div>
  );
}

// ── Review Form ──────────────────────────────────────────────────────────
function ReviewForm({ onSubmit, charityName }: { onSubmit: (review: DonorReview) => void; charityName: string }) {
  const [categoryRatings, setCategoryRatings] = useState({ impact: 0, communication: 0, transparency: 0, experience: 0 });
  const [reviewText, setReviewText] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donationAmount, setDonationAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const MAX_CHARS = 1000;
  const MIN_CHARS = 50;

  const overallRating = Object.values(categoryRatings).some((r) => r > 0)
    ? Object.values(categoryRatings).reduce((a, b) => a + b, 0) / Object.values(categoryRatings).filter((r) => r > 0).length
    : 0;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!donorName.trim()) errs.donorName = "Name is required";
    if (Object.values(categoryRatings).some((r) => r === 0)) errs.categories = "Please rate all categories";
    if (reviewText.trim().length < MIN_CHARS) errs.reviewText = `Review must be at least ${MIN_CHARS} characters`;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    const review: DonorReview = {
      id: `donor_${Date.now()}`,
      donor_name: donorName.trim(),
      verified: true,
      date: new Date().toISOString(),
      rating: Math.round(overallRating * 2) / 2,
      categories: categoryRatings,
      text: reviewText.trim(),
      donation_amount: donationAmount ? parseFloat(donationAmount) : null,
      helpful_count: 0,
    };
    setTimeout(() => { onSubmit(review); setIsSubmitting(false); setSubmitted(true); }, 800);
  };

  if (submitted) {
    return (
      <div className="rounded-xl border-2 border-success/30 bg-success/5 p-6 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
          <ShieldCheck className="h-6 w-6 text-success" />
        </div>
        <h4 className="text-lg font-bold text-foreground">Thank you for your review!</h4>
        <p className="mt-1 text-sm text-muted-foreground">
          Your verified donor review for {charityName} has been submitted.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border-2 border-primary/20 bg-card p-6">
      <div className="mb-4 flex items-center gap-2">
        <ShieldCheck className="h-5 w-5 text-primary" />
        <h4 className="font-display font-bold text-foreground">Leave a Verified Donor Review</h4>
      </div>
      <p className="mb-5 text-sm text-muted-foreground">
        Share your experience as a donor to {charityName}. Your review helps other donors give with confidence.
      </p>

      {/* Name */}
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-foreground">
          Your Name <span className="text-error">*</span>
        </label>
        <Input
          value={donorName}
          onChange={(e) => setDonorName(e.target.value)}
          placeholder="Jane Doe"
          className={cn(errors.donorName && "border-error")}
        />
        {errors.donorName && <p className="mt-1 text-xs text-error">{errors.donorName}</p>}
      </div>

      {/* Donation amount */}
      <div className="mb-5">
        <label className="mb-1 block text-sm font-medium text-foreground">
          Donation Amount <span className="font-normal text-muted-foreground">(optional)</span>
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
          <Input
            type="number"
            value={donationAmount}
            onChange={(e) => setDonationAmount(e.target.value)}
            placeholder="0.00"
            min={0}
            step={0.01}
            className="pl-7"
          />
        </div>
      </div>

      {/* Category ratings */}
      <div className="mb-5">
        <label className="mb-3 block text-sm font-medium text-foreground">
          Rate by Category <span className="text-error">*</span>
        </label>
        {errors.categories && <p className="mb-2 text-xs text-error">{errors.categories}</p>}
        <div className="space-y-3">
          {REVIEW_CATEGORIES.map((cat) => (
            <div key={cat.key} className="flex items-center justify-between rounded-lg bg-secondary p-3">
              <div>
                <span className="text-sm font-medium text-foreground">{cat.label}</span>
                <p className="text-xs text-muted-foreground">{cat.description}</p>
              </div>
              <StarRating
                rating={categoryRatings[cat.key]}
                size="md"
                interactive
                onRate={(r) => setCategoryRatings((prev) => ({ ...prev, [cat.key]: r }))}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Overall auto-calculated */}
      {overallRating > 0 && (
        <div className="mb-5 flex items-center justify-between rounded-lg bg-primary/5 p-3">
          <span className="text-sm font-semibold text-primary">Overall Rating</span>
          <StarRating rating={overallRating} size="md" showValue />
        </div>
      )}

      {/* Review text */}
      <div className="mb-5">
        <label className="mb-1 block text-sm font-medium text-foreground">
          Your Review <span className="text-error">*</span>
        </label>
        <Textarea
          value={reviewText}
          onChange={(e) => { if (e.target.value.length <= MAX_CHARS) setReviewText(e.target.value); }}
          placeholder="Share your experience donating to this charity. What was the impact? How did they communicate with you?"
          rows={5}
          className={cn("resize-none", errors.reviewText && "border-error")}
        />
        <div className="mt-1 flex justify-between">
          {errors.reviewText && <p className="text-xs text-error">{errors.reviewText}</p>}
          <span className={cn("ml-auto text-xs", reviewText.length < MIN_CHARS ? "text-muted-foreground" : "text-muted-foreground")}>
            {reviewText.length}/{MAX_CHARS}
          </span>
        </div>
      </div>

      {/* Submit */}
      <Button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-primary/90">
        {isSubmitting ? "Submitting..." : "Submit Verified Review"}
      </Button>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        By submitting, you confirm that you have donated to this charity and that your review reflects your genuine experience.
      </p>
    </form>
  );
}

// ── Main Component ───────────────────────────────────────────────────────
export function VerifiedDonorReviews({ charityName, reviews = [], onSubmitReview }: VerifiedDonorReviewsProps) {
  const [sortBy, setSortBy] = useState("newest");
  const [filterStars, setFilterStars] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [localReviews, setLocalReviews] = useState<DonorReview[]>(reviews);

  const handleSubmit = (review: DonorReview) => {
    setLocalReviews([review, ...localReviews]);
    onSubmitReview?.(review);
    setShowForm(false);
  };

  const handleHelpful = (id: string) => {
    setLocalReviews((prev) => prev.map((r) => (r.id === id ? { ...r, helpful_count: (r.helpful_count || 0) + 1 } : r)));
  };

  const sortedReviews = [...localReviews].sort((a, b) => {
    switch (sortBy) {
      case "newest": return new Date(b.date).getTime() - new Date(a.date).getTime();
      case "oldest": return new Date(a.date).getTime() - new Date(b.date).getTime();
      case "highest": return b.rating - a.rating;
      case "lowest": return a.rating - b.rating;
      case "most_helpful": return (b.helpful_count || 0) - (a.helpful_count || 0);
      default: return 0;
    }
  });

  const filteredReviews = filterStars === 0 ? sortedReviews : sortedReviews.filter((r) => Math.round(r.rating) === filterStars);

  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: localReviews.filter((r) => Math.round(r.rating) === star).length,
    pct: localReviews.length > 0 ? (localReviews.filter((r) => Math.round(r.rating) === star).length / localReviews.length) * 100 : 0,
  }));

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <h3 className="font-display text-lg font-bold text-foreground">Verified Donor Reviews</h3>
          <span className="text-sm text-muted-foreground">({localReviews.length})</span>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} size="sm" className="bg-primary hover:bg-primary/90">
            Write a Review
          </Button>
        )}
      </div>

      {/* Rating distribution */}
      {localReviews.length > 0 && (
        <div className="rounded-xl bg-secondary p-4">
          <div className="space-y-1.5">
            {distribution.map((d) => (
              <button
                key={d.star}
                onClick={() => setFilterStars(filterStars === d.star ? 0 : d.star)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-2 py-1 text-left transition-colors",
                  filterStars === d.star ? "bg-primary/10" : "hover:bg-muted"
                )}
              >
                <span className="w-12 text-xs font-medium text-muted-foreground">{d.star} star{d.star !== 1 ? "s" : ""}</span>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${d.pct}%` }} />
                </div>
                <span className="w-8 text-right text-xs text-muted-foreground">{d.count}</span>
              </button>
            ))}
          </div>
          {filterStars > 0 && (
            <button onClick={() => setFilterStars(0)} className="mt-2 text-xs text-primary hover:underline">
              Clear filter
            </button>
          )}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div>
          <div className="mb-2 flex justify-end">
            <button onClick={() => setShowForm(false)} className="text-sm text-muted-foreground hover:text-foreground">
              Cancel
            </button>
          </div>
          <ReviewForm onSubmit={handleSubmit} charityName={charityName} />
        </div>
      )}

      {/* Sort */}
      {localReviews.length > 1 && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Sort by:</span>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none rounded-md border border-border bg-card px-3 py-1 pr-7 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
      )}

      {/* Reviews list */}
      <div className="space-y-3">
        {filteredReviews.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <MessageCircle className="mx-auto mb-3 h-10 w-10 text-muted" />
            {localReviews.length === 0 ? (
              <div>
                <p className="font-medium text-foreground">No donor reviews yet</p>
                <p className="mt-1 text-sm">Be the first verified donor to leave a review!</p>
                {!showForm && (
                  <Button onClick={() => setShowForm(true)} variant="outline" size="sm" className="mt-3">
                    Write the first review
                  </Button>
                )}
              </div>
            ) : (
              <p className="text-sm">No reviews match this filter.</p>
            )}
          </div>
        ) : (
          filteredReviews.map((review) => (
            <ReviewCard key={review.id} review={review} onHelpful={handleHelpful} />
          ))
        )}
      </div>
    </div>
  );
}
