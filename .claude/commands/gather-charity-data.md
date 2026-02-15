# Gather Charity Data

Pull comprehensive data for a charity to populate the GiveWiZe charities table.

## Input
The user will provide a charity name, EIN, or a previous verification result.
$ARGUMENTS

## Steps

1. **Fetch ProPublica data** (if US charity):
   - Organization endpoint: `https://projects.propublica.org/nonprofits/api/v2/organizations/{ein}.json`
   - Extract org-level fields: name, ein, city, state, ntee_code, ruling_date, income_amount, asset_amount
   - Extract the latest filing data: totrevenue, totfuncexpns, totprgmrevnue, compnsatncurrofcr

2. **Compute expense percentages** from filing data:
   - `program_expense_percentage` = (program service expenses / total functional expenses) * 100
   - `admin_expense_percentage` = (management expenses / total functional expenses) * 100
   - `fundraising_expense_percentage` = (fundraising expenses / total functional expenses) * 100
   - Round to one decimal place

3. **Map NTEE code to GiveWiZe category**:
   - A → arts-culture
   - B → education
   - C → environment-climate
   - D → animal-welfare
   - E, G, H → medical-health
   - F → mental-health
   - I, R → human-rights
   - K → hunger-food-security
   - L → housing-homelessness
   - O → child-welfare
   - Q → international-development
   - X → faith-based
   - Default → community-development

4. **Fetch charity website** (if available) using WebFetch:
   - Extract mission statement from About page
   - Find programs list
   - Look for annual report links
   - Identify target population

5. **Determine geographic scope**:
   - If NTEE starts with Q or name contains "International" → global
   - If operates in multiple states → national
   - Default → national

6. **Extract year_founded** from ProPublica `ruling_date` field (parse the year component)

## Output Format

Output a JSON object matching the `charities` table schema:

```json
{
  "name": "Organization Name",
  "ein": "XX-XXXXXXX",
  "city": "City",
  "state": "ST",
  "country": "USA",
  "primary_category": "category-slug",
  "geographic_scope": "national",
  "year_founded": 1990,
  "website": "https://www.example.org",
  "mission_statement": "The organization's mission...",
  "program_expense_percentage": 85.2,
  "admin_expense_percentage": 10.1,
  "fundraising_expense_percentage": 4.7,
  "complete_990_filed": true,
  "financials_published": true,
  "programs_list": ["Program A", "Program B"],
  "people_served_annually": null,
  "target_population": null,
  "full_description": "Detailed description...",
  "_missing_fields": ["people_served_annually", "target_population"]
}
```

Flag any fields that couldn't be populated in the `_missing_fields` array so they can be requested from the charity.
