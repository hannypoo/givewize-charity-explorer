/**
 * Update online_review_sources with researched actual ratings.
 * Also updates community_rating_average on charities table.
 */

const SUPA_URL = "https://lljyfqgjszucsqbpkthp.supabase.co";
const SERVICE_KEY = process.argv[2];

if (!SERVICE_KEY) {
  console.error("Usage: node scripts/update-ratings.mjs <SERVICE_ROLE_KEY>");
  process.exit(1);
}

const headers = {
  apikey: SERVICE_KEY,
  Authorization: `Bearer ${SERVICE_KEY}`,
  "Content-Type": "application/json",
  Prefer: "return=minimal",
};

// All 71 charities with researched ratings
// cn = Charity Navigator (0-4), bbb = BBB standards (0-20), gs = GuideStar seal (1-4), gnp = GreatNonprofits (0-5)
const ratingsData = [
  { name: "1in6", cn: null, bbb: null, gs: 2, gnp: null },
  { name: "ACLU", cn: null, bbb: null, gs: 3, gnp: null },
  { name: "Alex's Lemonade Stand Foundation", cn: 4, bbb: 20, gs: 4, gnp: 4.5 },
  { name: "All Hands and Hearts", cn: 4, bbb: 20, gs: 4, gnp: 5.0 },
  { name: "American Cancer Society", cn: 4, bbb: 17, gs: 4, gnp: 3.5 },
  { name: "American Diabetes Association", cn: 3, bbb: 14, gs: 3, gnp: 3.0 },
  { name: "American Heart Association", cn: 3, bbb: 18, gs: 4, gnp: 3.5 },
  { name: "American Red Cross", cn: 3, bbb: 17, gs: 4, gnp: 3.0 },
  { name: "Amnesty International USA", cn: 3, bbb: 19, gs: 3, gnp: 4.0 },
  { name: "ASPCA", cn: 3, bbb: 17, gs: 4, gnp: 4.0 },
  { name: "Autism Society of America", cn: null, bbb: null, gs: 2, gnp: null },
  { name: "Best Friends Animal Society", cn: 4, bbb: 20, gs: 4, gnp: 4.5 },
  { name: "Breast Cancer Research Foundation", cn: 4, bbb: 20, gs: 4, gnp: 4.5 },
  { name: "Crisis Text Line", cn: 4, bbb: 20, gs: 4, gnp: 4.5 },
  { name: "CURE Epilepsy", cn: 4, bbb: null, gs: 4, gnp: null },
  { name: "Dana-Farber Cancer Institute", cn: 4, bbb: 18, gs: 4, gnp: 4.0 },
  { name: "Direct Relief", cn: 4, bbb: 20, gs: 4, gnp: 5.0 },
  { name: "Doctors Without Borders (MSF)", cn: 4, bbb: 20, gs: 4, gnp: 5.0 },
  { name: "DonorsChoose", cn: 4, bbb: 20, gs: 4, gnp: 4.8 },
  { name: "Environmental Defense Fund", cn: 4, bbb: 20, gs: 4, gnp: 4.2 },
  { name: "Epilepsy Foundation", cn: 3, bbb: 17, gs: 4, gnp: 4.3 },
  { name: "Everylife Foundation", cn: null, bbb: null, gs: 3, gnp: null },
  { name: "Farm Sanctuary", cn: 4, bbb: 18, gs: 4, gnp: 4.7 },
  { name: "Feeding America", cn: 4, bbb: 20, gs: 4, gnp: 4.5 },
  { name: "Genetic Alliance", cn: null, bbb: null, gs: 3, gnp: null },
  { name: "Girls Who Code", cn: 4, bbb: 20, gs: 4, gnp: 4.6 },
  { name: "Global Genes", cn: 3, bbb: null, gs: 3, gnp: 4.5 },
  { name: "Human Rights Watch", cn: 4, bbb: 19, gs: 4, gnp: 4.0 },
  { name: "International Rescue Committee", cn: 4, bbb: 20, gs: 4, gnp: 4.3 },
  { name: "Khan Academy", cn: 4, bbb: 20, gs: 4, gnp: 4.7 },
  { name: "Learning Disabilities Association of America", cn: null, bbb: null, gs: 2, gnp: null },
  { name: "Leukemia & Lymphoma Society", cn: 4, bbb: 20, gs: 4, gnp: 4.4 },
  { name: "Make-A-Wish Foundation of America", cn: 4, bbb: 20, gs: 4, gnp: 4.7 },
  { name: "Meals on Wheels America", cn: 4, bbb: 20, gs: 4, gnp: 4.6 },
  { name: "Memorial Sloan Kettering Cancer Center", cn: 4, bbb: null, gs: 4, gnp: 3.8 },
  { name: "National Alliance on Mental Illness (NAMI)", cn: 4, bbb: 20, gs: 4, gnp: 4.5 },
  { name: "National Domestic Violence Hotline", cn: 4, bbb: 20, gs: 4, gnp: null },
  { name: "National Organization for Rare Disorders (NORD)", cn: 4, bbb: 20, gs: 4, gnp: null },
  { name: "National Osteoporosis Foundation", cn: null, bbb: null, gs: null, gnp: null },
  { name: "Nicolaides-Baraitser Syndrome Support & Research", cn: null, bbb: null, gs: null, gnp: null },
  { name: "No Kid Hungry", cn: 4, bbb: 20, gs: 4, gnp: null },
  { name: "Ocean Conservancy", cn: 4, bbb: 20, gs: 4, gnp: null },
  { name: "Osteogenesis Imperfecta Foundation", cn: 4, bbb: null, gs: 3, gnp: null },
  { name: "Paget Foundation", cn: null, bbb: null, gs: null, gnp: null },
  { name: "Partners In Health", cn: 4, bbb: 20, gs: 4, gnp: null },
  { name: "Pencils of Promise", cn: 4, bbb: 17, gs: 4, gnp: null },
  { name: "Prevent Child Abuse America", cn: 3, bbb: 20, gs: 4, gnp: null },
  { name: "Prostate Cancer Foundation", cn: 4, bbb: 20, gs: 4, gnp: null },
  { name: "Rainforest Alliance", cn: 4, bbb: 19, gs: 4, gnp: null },
  { name: "RAINN (Rape, Abuse & Incest National Network)", cn: 4, bbb: 20, gs: 4, gnp: null },
  { name: "Rare Disease Foundation", cn: null, bbb: null, gs: null, gnp: null },
  { name: "Rare Diseases International (RDI)", cn: null, bbb: null, gs: null, gnp: null },
  { name: "Room to Read", cn: 4, bbb: 20, gs: 4, gnp: null },
  { name: "Scholarship America", cn: 4, bbb: 20, gs: 4, gnp: null },
  { name: "Seattle Children's Hospital", cn: 4, bbb: null, gs: 4, gnp: null },
  { name: "Sierra Club Foundation", cn: 4, bbb: 17, gs: 4, gnp: null },
  { name: "Single Parent Scholarship Fund", cn: null, bbb: null, gs: null, gnp: null },
  { name: "Southern Poverty Law Center", cn: 2, bbb: 12, gs: 4, gnp: null },
  { name: "St. Jude Children's Research Hospital", cn: 4, bbb: 20, gs: 4, gnp: 4.7 },
  { name: "Susan G. Komen", cn: 3, bbb: 17, gs: 4, gnp: 3.8 },
  { name: "Teach For America", cn: 3, bbb: 18, gs: 4, gnp: 3.5 },
  { name: "Team Rubicon", cn: 4, bbb: 20, gs: 4, gnp: 4.8 },
  { name: "The Arc of the United States", cn: 3, bbb: null, gs: 4, gnp: null },
  { name: "The Ehlers-Danlos Society", cn: null, bbb: null, gs: 3, gnp: null },
  { name: "The Humane Society of the United States", cn: 2, bbb: 9, gs: 4, gnp: 3.2 },
  { name: "The Nature Conservancy", cn: 4, bbb: 20, gs: 4, gnp: 4.2 },
  { name: "The Trevor Project", cn: 4, bbb: 20, gs: 4, gnp: 4.6 },
  { name: "University of Washington Foundation", cn: null, bbb: null, gs: null, gnp: null },
  { name: "World Central Kitchen", cn: 4, bbb: 18, gs: 4, gnp: 4.7 },
  { name: "World Wildlife Fund", cn: 4, bbb: 19, gs: 4, gnp: 4.0 },
  { name: "Zero Abuse Project", cn: null, bbb: null, gs: 3, gnp: null },
];

const sourceMap = {
  cn: "charity_navigator",
  bbb: "bbb_wise_giving",
  gs: "guidestar",
  gnp: "greatnonprofits",
};

async function patchSource(charityId, sourceName, rating) {
  const filter = `charity_id=eq.${charityId}&source_name=eq.${sourceName}`;
  const res = await fetch(`${SUPA_URL}/rest/v1/online_review_sources?${filter}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ rating }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`PATCH ${sourceName} for ${charityId}: ${res.status} ${err}`);
  }
}

async function main() {
  // Step 1: Get all charity IDs by name
  console.log("Fetching charity IDs...");
  const charRes = await fetch(
    `${SUPA_URL}/rest/v1/charities?select=id,name&order=name`,
    { headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` } }
  );
  const charities = await charRes.json();
  const nameToId = {};
  for (const c of charities) nameToId[c.name] = c.id;

  // Step 2: Update online_review_sources for each charity
  console.log("Updating online_review_sources...");
  let ok = 0, fail = 0, skipped = 0;

  for (const entry of ratingsData) {
    const charityId = nameToId[entry.name];
    if (!charityId) {
      // Try ilike match for names with special chars
      const match = charities.find(c => c.name.startsWith(entry.name.split("(")[0].trim()));
      if (!match) {
        console.error(`  SKIP: ${entry.name} — not found in DB`);
        skipped++;
        continue;
      }
    }
    const id = charityId || charities.find(c => c.name.startsWith(entry.name.split("(")[0].trim()))?.id;

    for (const [key, sourceName] of Object.entries(sourceMap)) {
      const rating = entry[key];
      try {
        await patchSource(id, sourceName, rating);
        ok++;
      } catch (e) {
        console.error(`  FAIL: ${entry.name} / ${sourceName} — ${e.message}`);
        fail++;
      }
    }
  }
  console.log(`  Sources updated: ${ok} ok, ${fail} fail, ${skipped} charities skipped\n`);

  // Step 3: Recompute community_rating_average for each charity
  // The CommunityRatingAgent component does this client-side, but we should also
  // update the DB column so cards/filters use correct values.
  console.log("Recomputing community_rating_average...");
  let updated = 0;

  for (const charity of charities) {
    // Get this charity's source ratings
    const srcRes = await fetch(
      `${SUPA_URL}/rest/v1/online_review_sources?charity_id=eq.${charity.id}&select=source_name,rating,max_rating`,
      { headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` } }
    );
    const sources = await srcRes.json();

    // Get donor reviews
    const revRes = await fetch(
      `${SUPA_URL}/rest/v1/community_reviews?charity_id=eq.${charity.id}&select=rating`,
      { headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` } }
    );
    const reviews = await revRes.json();

    // Compute weighted average of normalized source ratings
    const weights = { charity_navigator: 0.30, bbb_wise_giving: 0.20, guidestar: 0.20, greatnonprofits: 0.15 };
    let weightedSum = 0, totalWeight = 0;

    for (const src of sources) {
      if (src.rating != null && weights[src.source_name]) {
        const normalized = (src.rating / src.max_rating) * 5;
        weightedSum += normalized * weights[src.source_name];
        totalWeight += weights[src.source_name];
      }
    }

    // Add donor reviews (weight 0.15)
    if (reviews.length > 0) {
      const avgDonor = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
      weightedSum += avgDonor * 0.15;
      totalWeight += 0.15;
    }

    const communityAvg = totalWeight > 0 ? Math.round((weightedSum / totalWeight) * 100) / 100 : null;

    // Update charities table
    const patchRes = await fetch(
      `${SUPA_URL}/rest/v1/charities?id=eq.${charity.id}`,
      {
        method: "PATCH",
        headers,
        body: JSON.stringify({ community_rating_average: communityAvg }),
      }
    );
    if (patchRes.ok) updated++;
  }
  console.log(`  Updated community_rating_average for ${updated} charities\n`);

  // Step 4: Verify — show sample of varied ratings
  console.log("Verifying...");
  const verRes = await fetch(
    `${SUPA_URL}/rest/v1/charities?select=name,community_rating_average&order=community_rating_average.desc.nullslast&limit=15`,
    { headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` } }
  );
  const top = await verRes.json();
  console.log("\nTop 15 community ratings:");
  for (const c of top) {
    console.log(`  ${c.community_rating_average?.toFixed(2) ?? "null"} — ${c.name}`);
  }

  const verRes2 = await fetch(
    `${SUPA_URL}/rest/v1/charities?select=name,community_rating_average&order=community_rating_average.asc.nullslast&limit=10`,
    { headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` } }
  );
  const bottom = await verRes2.json();
  console.log("\nBottom 10 community ratings:");
  for (const c of bottom) {
    console.log(`  ${c.community_rating_average?.toFixed(2) ?? "null"} — ${c.name}`);
  }
}

main().catch(console.error);
