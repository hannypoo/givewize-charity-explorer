/**
 * Update online_review_sources note fields to match actual ratings.
 */
const SUPA_URL = "https://lljyfqgjszucsqbpkthp.supabase.co";
const SERVICE_KEY = process.argv[2];
if (!SERVICE_KEY) { console.error("Usage: node scripts/update-source-notes.mjs <SERVICE_ROLE_KEY>"); process.exit(1); }

const headers = { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, "Content-Type": "application/json", Prefer: "return=minimal" };
const headersJson = { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` };

async function main() {
  console.log("Fetching all online_review_sources...");
  const res = await fetch(`${SUPA_URL}/rest/v1/online_review_sources?select=id,source_name,rating,max_rating&order=id`, { headers: headersJson });
  const sources = await res.json();
  console.log(`  Found ${sources.length} source entries\n`);

  let ok = 0;
  for (const src of sources) {
    let note;
    if (src.rating == null) {
      note = "Not rated on this platform";
    } else if (src.source_name === "charity_navigator") {
      note = src.rating >= 4 ? "4/4 stars — excellent"
        : src.rating >= 3 ? "3/4 stars — good"
        : src.rating >= 2 ? "2/4 stars — needs improvement"
        : "1/4 stars — poor";
    } else if (src.source_name === "bbb_wise_giving") {
      note = `Meets ${src.rating} of ${src.max_rating} accountability standards`;
    } else if (src.source_name === "guidestar") {
      const seal = src.rating >= 4 ? "Platinum" : src.rating >= 3 ? "Gold" : src.rating >= 2 ? "Silver" : "Bronze";
      note = `${seal} Seal of Transparency`;
    } else if (src.source_name === "greatnonprofits") {
      note = src.rating >= 4.5 ? "Top-rated nonprofit"
        : src.rating >= 4.0 ? "Highly rated"
        : src.rating >= 3.5 ? "Well rated"
        : "Community reviewed";
    } else {
      continue;
    }

    await fetch(`${SUPA_URL}/rest/v1/online_review_sources?id=eq.${src.id}`, {
      method: "PATCH", headers, body: JSON.stringify({ note }),
    });
    ok++;
  }
  console.log(`Updated ${ok} source notes`);
}
main().catch(console.error);
