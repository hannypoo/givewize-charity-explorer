/**
 * Apply the Dormant Reviews migration + update NCBRS reviews to 5.0.
 *
 * Usage:
 *   node scripts/apply-dormant-reviews.mjs <SERVICE_ROLE_KEY>
 *
 * This script:
 *   1. Updates all 5 NCBRS seed reviews to 5.0 across all categories
 *   2. Reminds you to run the DDL migration via the Supabase SQL Editor
 *
 * The DDL migration (ALTER TABLE, trigger, RLS) must be applied via the
 * Supabase SQL Editor: supabase/migrations/20260210_dormant_reviews.sql
 */

const SUPA_URL = "https://lljyfqgjszucsqbpkthp.supabase.co";
const SERVICE_KEY = process.argv[2];

if (!SERVICE_KEY) {
  console.error("Usage: node scripts/apply-dormant-reviews.mjs <SERVICE_ROLE_KEY>");
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

async function main() {
  // ── Step 1: Find the NCBRS charity ID ──────────────────────────────────
  console.log("Finding NCBRS charity...");
  const charRes = await fetch(
    `${SUPA_URL}/rest/v1/charities?name=eq.Nicolaides-Baraitser Syndrome Support %26 Research&select=id,name,community_rating_average`,
    { headers: headersJson }
  );
  const charities = await charRes.json();
  if (charities.length === 0) {
    console.error("NCBRS charity not found!");
    process.exit(1);
  }
  const ncbrs = charities[0];
  console.log(`  Found: ${ncbrs.name} (${ncbrs.id})`);
  console.log(`  Current community_rating_average: ${ncbrs.community_rating_average}\n`);

  // ── Step 2: Fetch existing NCBRS reviews ──────────────────────────────
  console.log("Fetching NCBRS reviews...");
  const revRes = await fetch(
    `${SUPA_URL}/rest/v1/community_reviews?charity_id=eq.${ncbrs.id}&select=id,donor_name,rating,rating_impact,rating_communication,rating_transparency,rating_experience`,
    { headers: headersJson }
  );
  const reviews = await revRes.json();
  console.log(`  Found ${reviews.length} reviews\n`);

  // ── Step 3: Update each review to 5.0 across all categories ───────────
  console.log("Updating all NCBRS reviews to 5.0...");
  let ok = 0;
  let fail = 0;
  for (const review of reviews) {
    const patchRes = await fetch(
      `${SUPA_URL}/rest/v1/community_reviews?id=eq.${review.id}`,
      {
        method: "PATCH",
        headers,
        body: JSON.stringify({
          rating: 5.0,
          rating_impact: 5.0,
          rating_communication: 5.0,
          rating_transparency: 5.0,
          rating_experience: 5.0,
        }),
      }
    );
    if (patchRes.ok) {
      ok++;
      console.log(`  Updated: ${review.donor_name} (was ${review.rating} -> 5.0)`);
    } else {
      fail++;
      const err = await patchRes.text();
      console.error(`  FAIL: ${review.donor_name} — ${err}`);
    }
  }
  console.log(`\n  ${ok} updated, ${fail} failed\n`);

  // ── Step 4: Verify the community_rating_average was updated by trigger ─
  console.log("Verifying community_rating_average...");
  const verRes = await fetch(
    `${SUPA_URL}/rest/v1/charities?id=eq.${ncbrs.id}&select=name,community_rating_average,community_rating_count`,
    { headers: headersJson }
  );
  const updated = await verRes.json();
  console.log(`  ${updated[0].name}: community_rating_average = ${updated[0].community_rating_average}, count = ${updated[0].community_rating_count}\n`);

  // ── Reminder for DDL migration ────────────────────────────────────────
  console.log("========================================");
  console.log("IMPORTANT: Run the DDL migration via the Supabase SQL Editor:");
  console.log("  File: supabase/migrations/20260210_dormant_reviews.sql");
  console.log("  URL:  https://supabase.com/dashboard/project/lljyfqgjszucsqbpkthp/sql/new");
  console.log("========================================");
}

main().catch(console.error);
