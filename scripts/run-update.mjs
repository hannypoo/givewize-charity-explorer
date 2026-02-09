/**
 * Run the charity data update against Supabase.
 *
 * Usage:
 *   node scripts/run-update.mjs <SERVICE_ROLE_KEY>
 *
 * Get your service role key from:
 *   https://supabase.com/dashboard/project/lljyfqgjszucsqbpkthp/settings/api
 *   → Under "Project API keys" → "service_role" (secret)
 */

import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = "https://lljyfqgjszucsqbpkthp.supabase.co";
const SERVICE_ROLE_KEY = process.argv[2];

if (!SERVICE_ROLE_KEY) {
  console.error("Usage: node scripts/run-update.mjs <SERVICE_ROLE_KEY>");
  console.error("");
  console.error("Get your service role key from:");
  console.error("  https://supabase.com/dashboard/project/lljyfqgjszucsqbpkthp/settings/api");
  console.error('  → Under "Project API keys" → "service_role" (secret)');
  process.exit(1);
}

// Read the SQL file
const sqlPath = join(__dirname, "update-charity-data.sql");
const sql = readFileSync(sqlPath, "utf8");

// Split into individual statements (skip empty lines and comments-only blocks)
const statements = sql
  .split(";")
  .map((s) => s.trim())
  .filter((s) => s && !s.startsWith("--") && s.split("\n").some((line) => !line.trim().startsWith("--") && line.trim() !== ""));

console.log(`Found ${statements.length} SQL statements to execute.`);
console.log("");

// Execute via Supabase REST SQL endpoint (uses the pg_net extension)
// Actually, use the /rest/v1/rpc endpoint won't work for DDL.
// Instead, we'll use the Management API or direct REST calls.

// Approach: use the service_role key with the REST API for data updates,
// and for ALTER TABLE, we'll use fetch to the Supabase SQL endpoint.

async function runSQL(statement) {
  // Use the Supabase PostgREST endpoint for raw SQL via the pg API
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/`, {
    method: "POST",
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: statement }),
  });
  return res;
}

// Alternative: Execute all SQL as one batch using the pg endpoint
async function runAllSQL() {
  // First try the direct SQL execution endpoint
  const fullSQL = sql;

  // Use service role key for individual PATCH operations via REST API
  console.log("Executing data updates via REST API...\n");

  // Parse the SQL for UPDATE statements and convert to REST calls
  const updateRegex =
    /UPDATE charities SET (.+?) WHERE (.+?)(?:;|$)/g;
  let match;
  let successCount = 0;
  let failCount = 0;
  const updates = [];

  // Collect all unique statements
  while ((match = updateRegex.exec(sql)) !== null) {
    updates.push({ set: match[1].trim(), where: match[2].trim() });
  }

  // Also handle ALTER TABLE - these need special handling
  const alterRegex = /ALTER TABLE charities ADD COLUMN IF NOT EXISTS (\w+) (\w+)(.*?);/g;
  const alters = [];
  while ((match = alterRegex.exec(sql)) !== null) {
    alters.push({
      column: match[1],
      type: match[2],
      rest: match[3].trim(),
    });
  }

  // For ALTER TABLE, we need to use supabase management API or the SQL editor
  if (alters.length > 0) {
    console.log(`Found ${alters.length} ALTER TABLE statements.`);
    console.log("Attempting to add columns via REST API...\n");

    // Try using the pg endpoint (available in some Supabase configurations)
    for (const alt of alters) {
      const alterSQL = `ALTER TABLE charities ADD COLUMN IF NOT EXISTS ${alt.column} ${alt.type} ${alt.rest}`;
      try {
        // Use the /pg endpoint if available
        const res = await fetch(`${SUPABASE_URL}/rest/v1/`, {
          method: "OPTIONS",
          headers: {
            apikey: SERVICE_ROLE_KEY,
            Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
          },
        });
        // If columns don't exist yet, REST updates will fail - we'll handle that below
        console.log(`  Column ${alt.column}: will be added via SQL Editor if needed`);
      } catch (e) {
        console.log(`  Column ${alt.column}: needs SQL Editor`);
      }
    }
    console.log("");
    console.log("NOTE: If the new columns don't exist yet, run the ALTER TABLE");
    console.log("statements first in the Supabase SQL Editor, then re-run this script.\n");
  }

  // Group updates by SET clause for batch processing
  console.log(`Processing ${updates.length} UPDATE operations...\n`);

  for (let i = 0; i < updates.length; i++) {
    const u = updates[i];
    const setClause = u.set;
    const whereClause = u.where;

    // Parse SET clause into key-value pairs
    const body = {};
    const setParts = setClause.split(/,\s*(?=\w+\s*=)/);
    for (const part of setParts) {
      const eqIdx = part.indexOf("=");
      if (eqIdx === -1) continue;
      const key = part.substring(0, eqIdx).trim();
      let val = part.substring(eqIdx + 1).trim();
      // Parse value
      if (val === "true") body[key] = true;
      else if (val === "false") body[key] = false;
      else if (val === "null" || val === "NULL") body[key] = null;
      else if (/^\d+$/.test(val)) body[key] = parseInt(val);
      else if (/^\d+\.\d+$/.test(val)) body[key] = parseFloat(val);
      else body[key] = val.replace(/^'|'$/g, "");
    }

    // Parse WHERE clause into PostgREST filter
    let filter = "";
    // Handle: name = 'X' AND field IS NULL
    const nameMatch = whereClause.match(/name\s*(?:=|ILIKE)\s*'([^']+)'/i);
    const inMatch = whereClause.match(/name\s+IN\s*\(([^)]+)\)/i);

    if (nameMatch) {
      const isIlike = /ILIKE/i.test(whereClause);
      const nameVal = nameMatch[1].replace(/''/g, "'");
      if (isIlike) {
        filter = `name=ilike.${encodeURIComponent(nameVal)}`;
      } else {
        filter = `name=eq.${encodeURIComponent(nameVal)}`;
      }

      // Check for AND conditions
      if (/AND\s+\w+\s+IS\s+NULL/i.test(whereClause)) {
        const nullField = whereClause.match(/AND\s+(\w+)\s+IS\s+NULL/i);
        if (nullField) {
          filter += `&${nullField[1]}=is.null`;
        }
      }
    } else if (inMatch) {
      const names = inMatch[1]
        .split(",")
        .map((n) => n.trim().replace(/^'|'$/g, "").replace(/''/g, "'"));
      filter = `name=in.(${names.map((n) => encodeURIComponent(n)).join(",")})`;
    } else if (/ein\s+IS\s+NOT\s+NULL/i.test(whereClause)) {
      filter = "ein=not.is.null";
      if (/complete_990_filed\s+IS\s+NULL/i.test(whereClause)) {
        filter += "&complete_990_filed=is.null";
      }
      if (/financials_published\s+IS\s+NULL/i.test(whereClause)) {
        filter += "&financials_published=is.null";
      }
    } else if (/annual_report_url\s+IS\s+NOT\s+NULL/i.test(whereClause)) {
      filter = "annual_report_url=not.is.null";
      if (/financials_published\s+IS\s+NULL/i.test(whereClause)) {
        filter += "&financials_published=is.null";
      }
    } else {
      // Generic: try to execute anyway
      filter = whereClause
        .replace(/\s*AND\s*/gi, "&")
        .replace(/(\w+)\s*=\s*'([^']+)'/g, "$1=eq.$2");
    }

    try {
      const url = `${SUPABASE_URL}/rest/v1/charities?${filter}`;
      const res = await fetch(url, {
        method: "PATCH",
        headers: {
          apikey: SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        successCount++;
        if (nameMatch) {
          process.stdout.write(`\r  [${i + 1}/${updates.length}] Updated: ${nameMatch[1].substring(0, 40)}`);
        } else {
          process.stdout.write(`\r  [${i + 1}/${updates.length}] Bulk update applied`);
        }
      } else {
        failCount++;
        const errText = await res.text();
        console.log(`\n  FAILED [${res.status}]: ${whereClause.substring(0, 60)} → ${errText.substring(0, 100)}`);
      }
    } catch (e) {
      failCount++;
      console.log(`\n  ERROR: ${e.message}`);
    }
  }

  console.log(`\n\nDone! ${successCount} succeeded, ${failCount} failed.`);

  // Verify
  console.log("\nVerifying...");
  const verifyRes = await fetch(
    `${SUPABASE_URL}/rest/v1/charities?select=name,year_founded,people_served_annually,complete_990_filed,financials_published,allows_donation_tracking&order=name&limit=5`,
    {
      headers: {
        apikey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      },
    }
  );
  if (verifyRes.ok) {
    const sample = await verifyRes.json();
    console.log("\nSample (first 5):");
    for (const c of sample) {
      console.log(`  ${c.name}: YF=${c.year_founded} PS=${c.people_served_annually} 990=${c.complete_990_filed} FP=${c.financials_published} DT=${c.allows_donation_tracking}`);
    }
  }
}

runAllSQL().catch(console.error);
