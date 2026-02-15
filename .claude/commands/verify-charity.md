# Verify Charity

Verify a charity's legitimacy using public registration databases.

## Input
The user will provide a charity name and optionally an EIN or registration number.
$ARGUMENTS

## Steps

1. **Determine country**: Ask the user if not obvious from context. Default to USA.

2. **US Charities (EIN provided)**:
   - Fetch `https://projects.propublica.org/nonprofits/api/v2/organizations/{ein}.json` using WebFetch
   - Extract: official name, city, state, NTEE code, ruling date, tax-exempt status
   - If found with matching EIN → **VERIFIED**

3. **US Charities (name only)**:
   - Search `https://projects.propublica.org/nonprofits/api/v2/search.json?q={name}` using WebFetch
   - If top result is a close name match → **PROBABLE**
   - If no good match → **UNVERIFIED**

4. **UK Charities**:
   - Search the Charity Commission website via WebSearch
   - Look for official registration number and details

5. **Canadian Charities**:
   - Search the CRA charity listings via WebSearch
   - Look for Business Number (BN) and registration status

6. **Other countries**: Use WebSearch to find the official nonprofit registry and verify

## Output Format

Report the following in a clear summary:

- **Verification Status**: VERIFIED / PROBABLE / UNVERIFIED
- **Official Name**: (as registered)
- **Registration ID**: EIN or equivalent
- **Location**: City, State/Province, Country
- **Tax Status**: e.g., 501(c)(3), registered charity
- **NTEE Code**: (if US) with human-readable description
- **Year Established**: from ruling date or registration date
- **Notes**: any discrepancies between submitted name and official name, concerns, or missing data
