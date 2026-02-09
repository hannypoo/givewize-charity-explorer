/**
 * Comprehensive charity data update script.
 * Uses Supabase REST API with service_role key.
 */

const SUPA_URL = "https://lljyfqgjszucsqbpkthp.supabase.co";
const SERVICE_KEY = process.argv[2];

if (!SERVICE_KEY) {
  console.error("Usage: node scripts/run-all-updates.mjs <SERVICE_ROLE_KEY>");
  process.exit(1);
}

const headers = {
  apikey: SERVICE_KEY,
  Authorization: `Bearer ${SERVICE_KEY}`,
  "Content-Type": "application/json",
  Prefer: "return=minimal",
};

async function patch(filter, body) {
  const res = await fetch(`${SUPA_URL}/rest/v1/charities?${filter}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`PATCH ${filter}: ${res.status} ${err}`);
  }
  return res;
}

async function main() {
  let ok = 0, fail = 0;

  // ═══════════════════════════════════════════
  // YEAR_FOUNDED updates (59 charities)
  // ═══════════════════════════════════════════
  console.log("Updating year_founded...");
  const yearData = [
    ["1in6", 2007],
    ["ACLU", 1920],
    ["Alex's Lemonade Stand Foundation", 2005],
    ["All Hands and Hearts", 2005],
    ["American Cancer Society", 1913],
    ["American Diabetes Association", 1940],
    ["American Heart Association", 1924],
    ["American Red Cross", 1881],
    ["Amnesty International USA", 1961],
    ["ASPCA", 1866],
    ["Best Friends Animal Society", 1984],
    ["Breast Cancer Research Foundation", 1993],
    ["Crisis Text Line", 2013],
    ["CURE Epilepsy", 1998],
    ["Dana-Farber Cancer Institute", 1947],
    ["Direct Relief", 1948],
    ["Doctors Without Borders (MSF)", 1971],
    ["DonorsChoose", 2000],
    ["Environmental Defense Fund", 1967],
    ["Farm Sanctuary", 1986],
    ["Feeding America", 1979],
    ["Girls Who Code", 2012],
    ["Global Genes", 2009],
    ["Human Rights Watch", 1978],
    ["International Rescue Committee", 1933],
    ["Khan Academy", 2008],
    ["Leukemia & Lymphoma Society", 1949],
    ["Meals on Wheels America", 1954],
    ["Memorial Sloan Kettering Cancer Center", 1884],
    ["No Kid Hungry", 1984],
    ["Ocean Conservancy", 1972],
    ["Osteogenesis Imperfecta Foundation", 1970],
    ["Partners In Health", 1987],
    ["Pencils of Promise", 2008],
    ["Prostate Cancer Foundation", 1993],
    ["Rainforest Alliance", 1987],
    ["Rare Disease Foundation", 2006],
    ["Room to Read", 2000],
    ["Scholarship America", 1958],
    ["Sierra Club Foundation", 1960],
    ["Single Parent Scholarship Fund", 1990],
    ["Southern Poverty Law Center", 1971],
    ["Susan G. Komen", 1982],
    ["Teach For America", 1990],
    ["Team Rubicon", 2010],
    ["The Ehlers-Danlos Society", 1985],
    ["The Humane Society of the United States", 1954],
    ["The Nature Conservancy", 1951],
    ["The Trevor Project", 1998],
    ["World Central Kitchen", 2010],
    ["World Wildlife Fund", 1961],
    ["Zero Abuse Project", 2018],
  ];

  // ILIKE matches for names with special chars
  const ilikeYears = [
    ["Everylife Foundation%", 2009],
    ["National Alliance on Mental Illness%", 1979],
    ["National Domestic Violence Hotline%", 1996],
    ["National Osteoporosis Foundation%", 1984],
    ["Paget Foundation%", 1987],
    ["Rare Diseases International%", 2015],
    ["Seattle Children%", 1907],
  ];

  for (const [name, year] of yearData) {
    try {
      await patch(`name=eq.${encodeURIComponent(name)}`, { year_founded: year });
      ok++;
    } catch (e) { console.error(`  FAIL: ${name} - ${e.message}`); fail++; }
  }
  for (const [pattern, year] of ilikeYears) {
    try {
      await patch(`name=ilike.${encodeURIComponent(pattern)}`, { year_founded: year });
      ok++;
    } catch (e) { console.error(`  FAIL: ${pattern} - ${e.message}`); fail++; }
  }
  console.log(`  year_founded: ${ok} ok, ${fail} fail\n`);

  // ═══════════════════════════════════════════
  // PEOPLE_SERVED_ANNUALLY updates (fix corrupted values)
  // ═══════════════════════════════════════════
  console.log("Updating people_served_annually...");
  ok = 0; fail = 0;
  const peopleData = [
    ["1in6", 100000],
    ["ACLU", 2000000],
    ["All Hands and Hearts", 50000],
    ["American Cancer Society", 1500000],
    ["American Diabetes Association", 1600000],
    ["American Heart Association", 22500000],
    ["American Red Cross", 29000000],
    ["Amnesty International USA", 10000000],
    ["ASPCA", 700000],
    ["Best Friends Animal Society", 300000],
    ["Breast Cancer Research Foundation", 2800000],
    ["Crisis Text Line", 2000000],
    ["CURE Epilepsy", 65000],
    ["Direct Relief", 90000000],
    ["Doctors Without Borders (MSF)", 16000000],
    ["Environmental Defense Fund", 3000000],
    ["Farm Sanctuary", 10000],
    ["Feeding America", 40000000],
    ["Genetic Alliance", 10000000],
    ["Global Genes", 400000],
    ["Human Rights Watch", 100000000],
    ["International Rescue Committee", 36000000],
    ["Khan Academy", 150000000],
    ["Learning Disabilities Association of America", 350000],
    ["Leukemia & Lymphoma Society", 1300000],
    ["Meals on Wheels America", 2300000],
    ["Memorial Sloan Kettering Cancer Center", 140000],
    ["No Kid Hungry", 12000000],
    ["Partners In Health", 3000000],
    ["Prostate Cancer Foundation", 3300000],
    ["Rainforest Alliance", 8000000],
    ["Rare Disease Foundation", 3000],
    ["Room to Read", 23000000],
    ["Single Parent Scholarship Fund", 3000],
    ["Southern Poverty Law Center", 5200000],
    ["Susan G. Komen", 500000],
    ["Team Rubicon", 300000],
    ["The Arc of the United States", 1000000],
    ["The Ehlers-Danlos Society", 100000],
    ["The Humane Society of the United States", 10000000],
    ["The Nature Conservancy", 125000000],
    ["World Central Kitchen", 20000000],
    ["World Wildlife Fund", 5000000],
  ];

  const ilikePeople = [
    ["Everylife Foundation%", 30000000],
    ["National Osteoporosis Foundation%", 54000000],
    ["Paget Foundation%", 10000],
    ["Rare Diseases International%", 300000],
    ["University of Washington Foundation%", 61000],
  ];

  for (const [name, ps] of peopleData) {
    try {
      await patch(`name=eq.${encodeURIComponent(name)}`, { people_served_annually: ps });
      ok++;
    } catch (e) { console.error(`  FAIL: ${name} - ${e.message}`); fail++; }
  }
  for (const [pattern, ps] of ilikePeople) {
    try {
      await patch(`name=ilike.${encodeURIComponent(pattern)}`, { people_served_annually: ps });
      ok++;
    } catch (e) { console.error(`  FAIL: ${pattern} - ${e.message}`); fail++; }
  }
  console.log(`  people_served: ${ok} ok, ${fail} fail\n`);

  // ═══════════════════════════════════════════
  // TRANSPARENCY: complete_990_filed + financials_published
  // ═══════════════════════════════════════════
  console.log("Updating transparency fields...");
  ok = 0; fail = 0;

  // All US 501(c)(3) with EIN → file 990
  try {
    await patch("ein=not.is.null&complete_990_filed=is.null", { complete_990_filed: true });
    ok++;
    console.log("  Set complete_990_filed=true for all charities with EIN");
  } catch (e) { console.error(`  FAIL: 990 bulk - ${e.message}`); fail++; }

  // All with EIN or annual report → financials published
  try {
    await patch("ein=not.is.null&financials_published=is.null", { financials_published: true });
    ok++;
    console.log("  Set financials_published=true for all charities with EIN");
  } catch (e) { console.error(`  FAIL: fp bulk - ${e.message}`); fail++; }

  // Exception: RDI (international, may not file US 990)
  try {
    await patch(`name=ilike.${encodeURIComponent("Rare Diseases International%")}`, { complete_990_filed: false });
    ok++;
  } catch (e) { fail++; }

  console.log(`  transparency: ${ok} ok, ${fail} fail\n`);

  // ═══════════════════════════════════════════
  // COMMODITY FEATURES
  // ═══════════════════════════════════════════
  console.log("Updating commodity features...");
  ok = 0; fail = 0;

  // First: set accepts_direct_donation = true for all
  try {
    // We can't set for all at once easily, but we can use a broad filter
    await patch("id=not.is.null", { accepts_direct_donation: true });
    ok++;
    console.log("  Set accepts_direct_donation=true for all charities");
  } catch (e) { console.error(`  FAIL: direct donation bulk - ${e.message}`); fail++; }

  // Donation impact tracking
  const impactTracking = [
    "DonorsChoose", "Pencils of Promise", "Room to Read", "World Central Kitchen",
    "Feeding America", "No Kid Hungry", "Direct Relief", "Partners In Health",
    "All Hands and Hearts", "Team Rubicon", "Farm Sanctuary", "Best Friends Animal Society",
    "St. Jude Children's Research Hospital", "Make-A-Wish Foundation of America",
    "Alex's Lemonade Stand Foundation", "Doctors Without Borders (MSF)",
    "International Rescue Committee", "American Red Cross", "Khan Academy",
    "Scholarship America", "The Nature Conservancy", "Ocean Conservancy",
    "Sierra Club Foundation", "Environmental Defense Fund",
  ];
  for (const name of impactTracking) {
    try {
      await patch(`name=eq.${encodeURIComponent(name)}`, { allows_donation_tracking: true });
      ok++;
    } catch (e) { console.error(`  FAIL impact: ${name} - ${e.message}`); fail++; }
  }
  console.log(`  Set allows_donation_tracking for ${impactTracking.length} charities`);

  // Donor-recipient contact
  const donorContact = [
    "DonorsChoose", "Pencils of Promise", "Room to Read", "Farm Sanctuary",
    "Best Friends Animal Society", "Scholarship America",
    "St. Jude Children's Research Hospital", "Make-A-Wish Foundation of America",
    "Alex's Lemonade Stand Foundation", "International Rescue Committee",
    "Single Parent Scholarship Fund",
  ];
  for (const name of donorContact) {
    try {
      await patch(`name=eq.${encodeURIComponent(name)}`, { allows_donor_recipient_contact: true });
      ok++;
    } catch (e) { console.error(`  FAIL contact: ${name} - ${e.message}`); fail++; }
  }
  console.log(`  Set allows_donor_recipient_contact for ${donorContact.length} charities`);

  // Donor perks
  const perks = [
    "World Wildlife Fund", "ASPCA", "The Nature Conservancy", "Sierra Club Foundation",
    "Farm Sanctuary", "Best Friends Animal Society", "Susan G. Komen",
    "American Heart Association", "American Cancer Society", "ACLU",
    "Amnesty International USA", "Human Rights Watch", "Girls Who Code",
    "Ocean Conservancy", "Rainforest Alliance", "Environmental Defense Fund",
    "Leukemia & Lymphoma Society", "American Red Cross", "The Trevor Project",
    "Teach For America", "DonorsChoose", "Doctors Without Borders (MSF)", "Khan Academy",
  ];
  for (const name of perks) {
    try {
      await patch(`name=eq.${encodeURIComponent(name)}`, { offers_donor_perks: true });
      ok++;
    } catch (e) { console.error(`  FAIL perks: ${name} - ${e.message}`); fail++; }
  }
  // Also NAMI with special name
  try {
    await patch(`name=ilike.${encodeURIComponent("National Alliance on Mental Illness%")}`, { offers_donor_perks: true });
    ok++;
  } catch (e) { fail++; }

  console.log(`  Set offers_donor_perks for ${perks.length + 1} charities`);
  console.log(`  commodities total: ${ok} ok, ${fail} fail\n`);

  // ═══════════════════════════════════════════
  // VERIFY
  // ═══════════════════════════════════════════
  console.log("Verifying...");
  const verRes = await fetch(
    `${SUPA_URL}/rest/v1/charities?select=name,year_founded,people_served_annually,complete_990_filed,financials_published,allows_donation_tracking,allows_donor_recipient_contact,offers_donor_perks&order=name`,
    { headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` } }
  );
  const all = await verRes.json();
  const nullYF = all.filter(c => !c.year_founded).length;
  const nullPS = all.filter(c => !c.people_served_annually).length;
  const null990 = all.filter(c => c.complete_990_filed == null).length;
  const nullFP = all.filter(c => c.financials_published == null).length;
  const withTracking = all.filter(c => c.allows_donation_tracking).length;
  const withContact = all.filter(c => c.allows_donor_recipient_contact).length;
  const withPerks = all.filter(c => c.offers_donor_perks).length;

  console.log(`\n========== RESULTS ==========`);
  console.log(`Total charities: ${all.length}`);
  console.log(`Missing year_founded: ${nullYF} (was 59)`);
  console.log(`Missing people_served: ${nullPS} (was 9)`);
  console.log(`Missing 990_filed: ${null990} (was 69)`);
  console.log(`Missing financials_pub: ${nullFP} (was 69)`);
  console.log(`With donation tracking: ${withTracking}`);
  console.log(`With donor contact: ${withContact}`);
  console.log(`With donor perks: ${withPerks}`);
  console.log(`================================\n`);

  // Print sample
  console.log("Sample: American Red Cross");
  const arc = all.find(c => c.name === "American Red Cross");
  if (arc) console.log(JSON.stringify(arc, null, 2));
}

main().catch(console.error);
