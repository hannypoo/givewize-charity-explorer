# Score Charity

Compute GiveWiZe scores for a charity, mirroring the canonical scoring algorithm exactly.

## Input
The user will provide charity data (JSON object) or a charity name to look up.
$ARGUMENTS

## Steps

1. **Read the canonical scoring source** at `src/lib/charityUtils.ts` first. Always read this file to ensure the computation stays in sync with the production app. The function `computeGivewizeScores()` is the source of truth.

2. **Compute sub-scores** using the exact algorithm from that file:

   ### Financial Efficiency (weight: 35%)
   Based on `program_expense_percentage`:
   - >= 90% → 5.0
   - >= 85% → 4.5
   - >= 80% → 4.0
   - >= 75% → 3.5
   - >= 70% → 3.0
   - >= 60% → 2.5
   - >= 50% → 2.0
   - < 50% → 1.5
   - No data → NULL (excluded from overall)

   ### Transparency (weight: 30%)
   Checklist scoring (always computable):
   - Valid EIN (not containing "verify" or "contact") → +1.0
   - complete_990_filed = true → +1.0
   - financials_published = true → +1.0
   - annual_report_url present → +1.25
   - program_expense_percentage present → +0.75
   - Cap at 5.0

   ### Impact (weight: 25%)
   If `people_served_annually` available:
   - With `target_population_size`: coverage-based (>=50%→5.0, >=25%→4.5, >=10%→4.0, >=5%→3.5, else→3.0)
   - Without: headcount thresholds (>=1M→5.0, >=500K→4.5, >=100K→4.0, >=10K→3.5, else→3.0)
   - Programs list bonus: >=8 programs +0.5, >=4 programs +0.25 (cap 5.0)

   If only `programs_list` available (no people_served):
   - >= 8 programs → 4.0
   - >= 4 programs → 3.5
   - < 4 programs → 3.0

   No data at all → NULL (excluded from overall)

   ### Longevity (weight: 10%)
   Based on age from `year_founded`:
   - >= 50 years → 5.0
   - >= 30 years → 4.5
   - >= 20 years → 4.0
   - >= 10 years → 3.5
   - < 10 years → 3.0
   - No year_founded → NULL (excluded from overall)

3. **Compute overall score**: Weighted average of available (non-null) components. Weights are renormalized when components are missing.

4. **Flag for admin review** if overall score < 2.0

## Output Format

```
GiveWiZe Score Report
=====================
Charity: {name}

Sub-Scores:
  Financial Efficiency: {score}/5.0 (weight: 35%) — {program_expense_percentage}% to programs
  Transparency:         {score}/5.0 (weight: 30%) — {n}/5 indicators met
  Impact:               {score}/5.0 (weight: 25%) — {description of basis}
  Longevity:            {score}/5.0 (weight: 10%) — Founded {year}, {age} years

Overall GiveWiZe Score: {overall}/5.0

Components included: {list of non-null components}
Components missing:  {list of null components}

Admin Review Required: {Yes/No}
Reason: {if yes, explain why — e.g., "Overall score below 2.0 threshold"}
```
