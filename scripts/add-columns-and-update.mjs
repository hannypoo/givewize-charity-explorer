/**
 * Add commodity columns and populate them via direct PostgreSQL connection.
 * Uses the Supabase pooler with service_role JWT auth.
 */

import pg from "pg";
const { Client } = pg;

const SERVICE_KEY = process.argv[2];
if (!SERVICE_KEY) {
  console.error("Usage: node scripts/add-columns-and-update.mjs <SERVICE_ROLE_KEY>");
  process.exit(1);
}

// Connect via Supabase connection pooler (Transaction mode)
const client = new Client({
  host: "aws-0-us-east-1.pooler.supabase.com",
  port: 6543,
  database: "postgres",
  user: "postgres.lljyfqgjszucsqbpkthp",
  password: SERVICE_KEY,
  ssl: { rejectUnauthorized: false },
});

async function main() {
  console.log("Connecting to Supabase PostgreSQL...");
  await client.connect();
  console.log("Connected!\n");

  // Add columns
  console.log("Adding commodity columns...");
  const alterStatements = [
    "ALTER TABLE charities ADD COLUMN IF NOT EXISTS allows_donation_tracking boolean DEFAULT false",
    "ALTER TABLE charities ADD COLUMN IF NOT EXISTS allows_donor_recipient_contact boolean DEFAULT false",
    "ALTER TABLE charities ADD COLUMN IF NOT EXISTS accepts_direct_donation boolean DEFAULT true",
    "ALTER TABLE charities ADD COLUMN IF NOT EXISTS offers_donor_perks boolean DEFAULT false",
  ];

  for (const sql of alterStatements) {
    try {
      await client.query(sql);
      const col = sql.match(/IF NOT EXISTS (\w+)/)?.[1];
      console.log(`  Added column: ${col}`);
    } catch (e) {
      console.error(`  Error: ${e.message}`);
    }
  }

  // Set accepts_direct_donation = true for all
  console.log("\nSetting accepts_direct_donation=true for all...");
  const r0 = await client.query("UPDATE charities SET accepts_direct_donation = true");
  console.log(`  Updated ${r0.rowCount} rows`);

  // Donation impact tracking
  console.log("\nSetting allows_donation_tracking...");
  const impactNames = [
    "DonorsChoose", "Pencils of Promise", "Room to Read", "World Central Kitchen",
    "Feeding America", "No Kid Hungry", "Direct Relief", "Partners In Health",
    "All Hands and Hearts", "Team Rubicon", "Farm Sanctuary", "Best Friends Animal Society",
    "St. Jude Children's Research Hospital", "Make-A-Wish Foundation of America",
    "Alex's Lemonade Stand Foundation", "Doctors Without Borders (MSF)",
    "International Rescue Committee", "American Red Cross", "Khan Academy",
    "Scholarship America", "The Nature Conservancy", "Ocean Conservancy",
    "Sierra Club Foundation", "Environmental Defense Fund",
  ];
  const r1 = await client.query(
    "UPDATE charities SET allows_donation_tracking = true WHERE name = ANY($1)",
    [impactNames]
  );
  console.log(`  Updated ${r1.rowCount} rows`);

  // Donor-recipient contact
  console.log("\nSetting allows_donor_recipient_contact...");
  const contactNames = [
    "DonorsChoose", "Pencils of Promise", "Room to Read", "Farm Sanctuary",
    "Best Friends Animal Society", "Scholarship America",
    "St. Jude Children's Research Hospital", "Make-A-Wish Foundation of America",
    "Alex's Lemonade Stand Foundation", "International Rescue Committee",
    "Single Parent Scholarship Fund",
  ];
  const r2 = await client.query(
    "UPDATE charities SET allows_donor_recipient_contact = true WHERE name = ANY($1)",
    [contactNames]
  );
  console.log(`  Updated ${r2.rowCount} rows`);

  // Donor perks
  console.log("\nSetting offers_donor_perks...");
  const perkNames = [
    "World Wildlife Fund", "ASPCA", "The Nature Conservancy", "Sierra Club Foundation",
    "Farm Sanctuary", "Best Friends Animal Society", "Susan G. Komen",
    "American Heart Association", "American Cancer Society", "ACLU",
    "Amnesty International USA", "Human Rights Watch", "Girls Who Code",
    "Ocean Conservancy", "Rainforest Alliance", "Environmental Defense Fund",
    "Leukemia & Lymphoma Society", "American Red Cross", "The Trevor Project",
    "Teach For America", "DonorsChoose", "Doctors Without Borders (MSF)", "Khan Academy",
  ];
  const r3 = await client.query(
    "UPDATE charities SET offers_donor_perks = true WHERE name = ANY($1)",
    [perkNames]
  );
  // Also NAMI
  await client.query(
    "UPDATE charities SET offers_donor_perks = true WHERE name ILIKE 'National Alliance on Mental Illness%'"
  );
  console.log(`  Updated ${r3.rowCount + 1} rows`);

  // Verify
  console.log("\n========== VERIFICATION ==========");
  const verify = await client.query(`
    SELECT
      COUNT(*) as total,
      COUNT(year_founded) as has_year,
      COUNT(people_served_annually) as has_people_served,
      COUNT(CASE WHEN complete_990_filed IS NOT NULL THEN 1 END) as has_990,
      COUNT(CASE WHEN financials_published IS NOT NULL THEN 1 END) as has_financials,
      COUNT(CASE WHEN allows_donation_tracking THEN 1 END) as tracking,
      COUNT(CASE WHEN allows_donor_recipient_contact THEN 1 END) as contact,
      COUNT(CASE WHEN accepts_direct_donation THEN 1 END) as direct,
      COUNT(CASE WHEN offers_donor_perks THEN 1 END) as perks
    FROM charities
  `);
  const v = verify.rows[0];
  console.log(`Total charities:        ${v.total}`);
  console.log(`Has year_founded:       ${v.has_year} (was 12)`);
  console.log(`Has people_served:      ${v.has_people_served} (was 62)`);
  console.log(`Has 990_filed:          ${v.has_990} (was 2)`);
  console.log(`Has financials_pub:     ${v.has_financials} (was 2)`);
  console.log(`Donation tracking:      ${v.tracking}`);
  console.log(`Donor-recipient contact: ${v.contact}`);
  console.log(`Direct donation:        ${v.direct}`);
  console.log(`Donor perks:            ${v.perks}`);

  // Sample: Red Cross
  const sample = await client.query("SELECT name, year_founded, people_served_annually, complete_990_filed, financials_published, allows_donation_tracking, allows_donor_recipient_contact, offers_donor_perks FROM charities WHERE name = 'American Red Cross'");
  console.log("\nSample - American Red Cross:");
  console.log(JSON.stringify(sample.rows[0], null, 2));

  await client.end();
  console.log("\nDone!");
}

main().catch((e) => { console.error(e); process.exit(1); });
