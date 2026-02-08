import type { DonorReview } from "@/components/charities/VerifiedDonorReviews";

/**
 * Sample verified donor reviews, keyed by charity UUID.
 *
 * For MVP demo purposes these are pre-populated.
 * Post-launch, these will come from a Supabase `community_reviews` table.
 *
 * To add reviews for a charity:
 *  1. Find the charity's UUID in Supabase (or from the URL)
 *  2. Add an entry below with that UUID as the key
 *  3. Each review follows the DonorReview interface
 */
export const SAMPLE_DONOR_REVIEWS: Record<string, DonorReview[]> = {
  // ──────────────────────────────────────────────────────────────────────
  // Reviews are matched by charity UUID from Supabase.
  // For the demo, we provide a "default" set that applies generically.
  // The CommunityRatingAgent will show "No donor reviews yet" for charities
  // not listed here, with a prompt to write the first review.
  // ──────────────────────────────────────────────────────────────────────

  // Example: Replace these UUIDs with actual ones from your Supabase charities table.
  // You can find them by visiting /charities/:id and copying the UUID from the URL.

  // Fallback sample reviews used when a charity ID is not found
  _default: [
    {
      id: "vdr_default_01",
      donor_name: "Sarah M.",
      verified: true,
      date: "2025-12-15T00:00:00.000Z",
      rating: 5,
      categories: { impact: 5, communication: 5, transparency: 4, experience: 5 },
      text: "This organization has made a tremendous difference in our community. Every dollar feels like it goes directly to the people who need it most. Their communication is outstanding — I receive regular updates about how my donations are being used, and the annual reports are incredibly transparent.",
      donation_amount: 500,
      helpful_count: 24,
    },
    {
      id: "vdr_default_02",
      donor_name: "James R.",
      verified: true,
      date: "2025-10-22T00:00:00.000Z",
      rating: 4,
      categories: { impact: 5, communication: 3, transparency: 4, experience: 4 },
      text: "I've been a recurring donor for several years. The impact is undeniable — you can see the real-world results of their programs. My only suggestion would be more frequent donor updates. The quarterly newsletter is good, but monthly would be even better. Highly recommend donating here.",
      donation_amount: 250,
      helpful_count: 18,
    },
    {
      id: "vdr_default_03",
      donor_name: "Dr. Patricia W.",
      verified: true,
      date: "2025-08-05T00:00:00.000Z",
      rating: 5,
      categories: { impact: 5, communication: 4, transparency: 5, experience: 5 },
      text: "As someone who works in this field professionally, I can attest to the quality of this organization's work. Their research and programs are top-tier, and they maintain the highest standards of financial transparency. The team is passionate and dedicated to their mission.",
      donation_amount: 1000,
      helpful_count: 31,
    },
  ],
};

/**
 * Helper to get reviews for a charity, falling back to defaults.
 * Use this when you want every charity to show some reviews for demo purposes.
 */
export function getDonorReviews(charityId: string): DonorReview[] {
  return SAMPLE_DONOR_REVIEWS[charityId] || SAMPLE_DONOR_REVIEWS._default || [];
}
