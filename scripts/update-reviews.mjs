/**
 * Replace identical seed donor reviews with varied, charity-specific reviews.
 * Each charity gets 2-5 reviews with different ratings, texts, and reviewer names.
 */

const SUPA_URL = "https://lljyfqgjszucsqbpkthp.supabase.co";
const SERVICE_KEY = process.argv[2];

if (!SERVICE_KEY) {
  console.error("Usage: node scripts/update-reviews.mjs <SERVICE_ROLE_KEY>");
  process.exit(1);
}

const headers = {
  apikey: SERVICE_KEY,
  Authorization: `Bearer ${SERVICE_KEY}`,
  "Content-Type": "application/json",
  Prefer: "return=minimal",
};

const headersJson = {
  apikey: SERVICE_KEY,
  Authorization: `Bearer ${SERVICE_KEY}`,
};

// Reviewer name pool
const NAMES = [
  "Sarah M.", "Michael T.", "Dr. Patricia W.", "James R.", "Linda K.",
  "Rebecca S.", "Carlos D.", "Emily C.", "David L.", "Jennifer H.",
  "Robert A.", "Maria G.", "Thomas B.", "Amanda F.", "Christopher P.",
  "Jessica N.", "Daniel W.", "Katherine E.", "Andrew J.", "Nicole V.",
  "Mark S.", "Stephanie L.", "Brian H.", "Laura J.", "Kevin D.",
  "Rachel B.", "John F.", "Michelle R.", "Steven C.", "Angela T.",
];

// Review templates by sentiment tier
const POSITIVE_REVIEWS = [
  "Exceptional organization that consistently delivers on its mission. I've been donating for years and the impact reports always exceed expectations. Highly transparent operations.",
  "One of the most well-run nonprofits I've supported. Every dollar seems to go directly to making a difference. Their communication is excellent.",
  "Truly impressive work. The team is passionate and the results speak for themselves. I feel confident my donations are making a real difference.",
  "A gold standard in the nonprofit world. Their programs are evidence-based, their reporting is thorough, and their impact is measurable.",
  "I've volunteered and donated, and I can attest to the quality of their operations. They treat every contribution with care and accountability.",
  "Outstanding transparency and impact. They regularly update donors on progress and aren't afraid to share both successes and challenges.",
  "My family has been impacted by their work and I can't say enough good things. Professional, compassionate, and effective.",
  "As a recurring donor, I appreciate the detailed annual reports and clear communication about how funds are used. Top-notch organization.",
];

const GOOD_REVIEWS = [
  "Solid organization doing good work. Their programs are well-designed and they maintain reasonable transparency. Room for improvement in communication frequency.",
  "I've been a supporter for a couple of years now. They do meaningful work and are generally transparent about finances. Could improve donor engagement.",
  "Good charity with a clear mission. The impact is visible in the communities they serve. Financial reporting could be more detailed.",
  "They do important work and I trust them with my donations. Not the most communicative organization, but the results are there.",
  "A reliable nonprofit that consistently delivers value. Their annual reports are informative, though I'd like to see more frequent updates.",
  "Decent organization with genuine impact. They have good leadership and maintain adequate financial transparency.",
];

const MIXED_REVIEWS = [
  "The mission is important and they do good work, but I wish there was more transparency about how funds are allocated. Still worth supporting.",
  "Mixed feelings. The programs are good but overhead seems higher than similar organizations. They could improve efficiency.",
  "I support their cause but have noticed some inconsistency in communication. When they do report outcomes, the numbers look good.",
  "Good mission, adequate execution. I've seen positive change from their programs but would like to see more detailed financial breakdowns.",
];

const CRITICAL_REVIEWS = [
  "I believe in their mission, but administrative costs seem high compared to peers. I'd like to see more funds going directly to programs.",
  "The cause is worthy but I've been disappointed by the lack of communication. Hard to know exactly where my donations go.",
];

// Category-specific review additions
const CATEGORY_FLAVOR = {
  "rare-diseases": [
    "As a rare disease family, this organization has been our lifeline. They connected us with specialists we never would have found otherwise.",
    "Their research funding has led to breakthroughs that give our community real hope. Grateful for their dedication to overlooked conditions.",
  ],
  "medical-health": [
    "Their healthcare programs have reached underserved communities that desperately needed access to medical care.",
    "As a healthcare professional, I've seen the positive impact of their evidence-based programs firsthand.",
  ],
  "education": [
    "I've seen students transform through their programs. Education really is the key to breaking cycles of poverty.",
    "Their educational initiatives are innovative and data-driven. They measure outcomes carefully to maximize impact.",
  ],
  "animal-welfare": [
    "The animals in their care are treated with incredible compassion. Their adoption programs are thoughtfully designed.",
    "As a veterinarian, I'm impressed by their evidence-based approach to animal welfare and rescue operations.",
  ],
  "environment-climate": [
    "Their conservation work has preserved critical ecosystems that would have been lost without their intervention.",
    "Science-based environmental advocacy at its best. They balance urgency with pragmatic solutions.",
  ],
  "hunger-food-security": [
    "Their food distribution network is incredibly efficient. They get meals to families faster than any organization I've seen.",
    "I've volunteered at their local distribution center and the operation is impressive — well-organized and compassionate.",
  ],
  "emergency-relief": [
    "When disaster struck our community, they were among the first to arrive. Their rapid response saved lives.",
    "Having seen their disaster relief operations firsthand, I can say they set the standard for emergency response.",
  ],
  "child-welfare": [
    "Their programs for vulnerable children provide not just immediate help but long-term support for better futures.",
    "As a social worker, I've seen how their child welfare programs create lasting positive change in families.",
  ],
  "mental-health": [
    "Mental health is finally getting the attention it deserves, and this organization is leading the charge.",
    "Their crisis support services have literally saved lives. The counselors are compassionate and well-trained.",
  ],
  "housing-homelessness": [
    "Their housing-first approach is backed by research and their results prove it works. Real people getting real homes.",
    "I've volunteered with them and seen the dignity they bring to serving people experiencing homelessness.",
  ],
  "veterans": [
    "As a veteran myself, I appreciate how this organization understands and addresses the unique challenges we face.",
    "Their veteran support services go beyond the basics — they help with the whole person, not just the immediate need.",
  ],
  "human-rights": [
    "Their legal advocacy has protected vulnerable communities and held powerful institutions accountable.",
    "Courageous work defending human rights in challenging environments. Their impact is felt around the world.",
  ],
  "international-development": [
    "Their community-centered approach to development ensures programs are sustainable and culturally appropriate.",
    "I've visited their projects abroad and was impressed by how they empower local communities rather than creating dependence.",
  ],
};

// Generate reviews for a charity based on its rating tier
function generateReviews(charity, communityRating) {
  const reviews = [];
  const cat = charity.primary_category;
  const catFlavors = CATEGORY_FLAVOR[cat] || [];

  // Determine number of reviews (2-5) based on charity size/prominence
  const numReviews = communityRating >= 4.5 ? 5
    : communityRating >= 4.0 ? 4
    : communityRating >= 3.5 ? 3
    : 2;

  // Seed-like deterministic randomness from charity name
  let seed = 0;
  for (let i = 0; i < charity.name.length; i++) seed += charity.name.charCodeAt(i);
  const pick = (arr, offset = 0) => arr[(seed + offset) % arr.length];
  const nameOffset = seed % NAMES.length;

  for (let i = 0; i < numReviews; i++) {
    let text, rating, impact, comm, trans, exp;

    if (communityRating >= 4.5) {
      // Mostly glowing reviews
      if (i === 0 && catFlavors.length > 0) {
        text = catFlavors[0];
        rating = 5.0; impact = 5; comm = 5; trans = 5; exp = 5;
      } else if (i === 1 && catFlavors.length > 1) {
        text = catFlavors[1];
        rating = 4.8; impact = 5; comm = 5; trans = 4; exp = 5;
      } else if (i < numReviews - 1) {
        text = pick(POSITIVE_REVIEWS, i);
        rating = [5.0, 4.8, 4.5, 4.8][i % 4];
        impact = 5; comm = [5, 4, 5, 4][i % 4]; trans = [5, 4, 5, 4][i % 4]; exp = 5;
      } else {
        text = pick(GOOD_REVIEWS, i);
        rating = 4.0; impact = 4; comm = 4; trans = 4; exp = 4;
      }
    } else if (communityRating >= 4.0) {
      // Mix of positive and good
      if (i === 0 && catFlavors.length > 0) {
        text = catFlavors[0];
        rating = 4.5; impact = 5; comm = 4; trans = 4; exp = 5;
      } else if (i < numReviews - 1) {
        text = pick(i % 2 === 0 ? POSITIVE_REVIEWS : GOOD_REVIEWS, i);
        rating = [4.5, 4.0, 4.3, 3.8][i % 4];
        impact = [5, 4, 4, 4][i % 4]; comm = [4, 4, 3, 4][i % 4];
        trans = [4, 3, 4, 3][i % 4]; exp = [5, 4, 4, 4][i % 4];
      } else {
        text = pick(MIXED_REVIEWS, i);
        rating = 3.5; impact = 4; comm = 3; trans = 3; exp = 3;
      }
    } else if (communityRating >= 3.5) {
      // Mix with more mixed reviews
      if (i === 0) {
        text = pick(GOOD_REVIEWS, i);
        rating = 4.0; impact = 4; comm = 4; trans = 4; exp = 4;
      } else if (i === 1) {
        text = pick(MIXED_REVIEWS, i);
        rating = 3.5; impact = 3; comm = 3; trans = 3; exp = 4;
      } else {
        text = pick(CRITICAL_REVIEWS, i);
        rating = 3.0; impact = 3; comm = 2; trans = 3; exp = 3;
      }
    } else {
      // Lower rated — more critical
      if (i === 0) {
        text = pick(MIXED_REVIEWS, i);
        rating = 3.5; impact = 3; comm = 3; trans = 3; exp = 4;
      } else {
        text = pick(CRITICAL_REVIEWS, i);
        rating = 2.5; impact = 3; comm = 2; trans = 2; exp = 3;
      }
    }

    const donorName = NAMES[(nameOffset + i * 3) % NAMES.length];
    const donationAmount = [50, 100, 150, 200, 250, 500, 750, 1000, 2000, 5000][(seed + i) % 10];
    const helpfulCount = Math.floor(((seed * (i + 1)) % 40) + 3);
    const daysAgo = 15 + Math.floor(((seed * (i + 2)) % 300));
    const createdAt = new Date(Date.now() - daysAgo * 86400000).toISOString();

    reviews.push({
      charity_id: charity.id,
      donor_name: donorName,
      verified: true,
      rating,
      rating_impact: impact,
      rating_communication: comm,
      rating_transparency: trans,
      rating_experience: exp,
      review_text: text,
      donation_amount: donationAmount,
      helpful_count: helpfulCount,
      created_at: createdAt,
    });
  }

  return reviews;
}

async function main() {
  // Step 1: Fetch all charities with their community rating
  console.log("Fetching charities...");
  const charRes = await fetch(
    `${SUPA_URL}/rest/v1/charities?select=id,name,primary_category,community_rating_average&order=name`,
    { headers: headersJson }
  );
  const charities = await charRes.json();
  console.log(`  Found ${charities.length} charities\n`);

  // Step 2: Delete all existing community reviews
  console.log("Deleting existing reviews...");
  const delRes = await fetch(
    `${SUPA_URL}/rest/v1/community_reviews?id=not.is.null`,
    { method: "DELETE", headers }
  );
  if (!delRes.ok) {
    console.error("Failed to delete reviews:", await delRes.text());
    process.exit(1);
  }
  console.log("  Deleted all existing reviews\n");

  // Step 3: Generate and insert varied reviews
  console.log("Generating varied reviews...");
  let totalReviews = 0;
  let ok = 0, fail = 0;

  for (const charity of charities) {
    const communityRating = charity.community_rating_average || 3.8;
    const reviews = generateReviews(charity, communityRating);
    totalReviews += reviews.length;

    // Insert reviews for this charity
    const insRes = await fetch(
      `${SUPA_URL}/rest/v1/community_reviews`,
      {
        method: "POST",
        headers: { ...headers, Prefer: "return=minimal" },
        body: JSON.stringify(reviews),
      }
    );
    if (insRes.ok) {
      ok++;
    } else {
      const err = await insRes.text();
      console.error(`  FAIL: ${charity.name} — ${err}`);
      fail++;
    }
  }
  console.log(`  Generated ${totalReviews} reviews for ${ok} charities (${fail} failures)\n`);

  // Step 4: Update community_rating_count on charities table
  console.log("Updating review counts...");
  for (const charity of charities) {
    const communityRating = charity.community_rating_average || 3.8;
    const numReviews = communityRating >= 4.5 ? 5
      : communityRating >= 4.0 ? 4
      : communityRating >= 3.5 ? 3
      : 2;

    await fetch(
      `${SUPA_URL}/rest/v1/charities?id=eq.${charity.id}`,
      {
        method: "PATCH",
        headers,
        body: JSON.stringify({ community_rating_count: numReviews }),
      }
    );
  }
  console.log("  Done\n");

  // Step 5: Verify
  console.log("Verifying...");
  const verRes = await fetch(
    `${SUPA_URL}/rest/v1/community_reviews?select=charity_id,rating,donor_name&order=created_at.desc&limit=15`,
    { headers: headersJson }
  );
  const recent = await verRes.json();
  console.log("Recent reviews:");
  for (const r of recent) {
    console.log(`  ${r.donor_name} — ${r.rating}/5`);
  }

  // Count reviews per charity
  const countRes = await fetch(
    `${SUPA_URL}/rest/v1/community_reviews?select=charity_id`,
    { headers: headersJson }
  );
  const allReviews = await countRes.json();
  const perCharity = {};
  allReviews.forEach(r => { perCharity[r.charity_id] = (perCharity[r.charity_id] || 0) + 1; });
  const counts = Object.values(perCharity);
  console.log(`\nTotal reviews: ${allReviews.length}`);
  console.log(`Reviews per charity: min=${Math.min(...counts)}, max=${Math.max(...counts)}, avg=${(counts.reduce((a,b)=>a+b,0)/counts.length).toFixed(1)}`);
}

main().catch(console.error);
