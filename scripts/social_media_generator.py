"""
GiveWiZe AI Social Media Content Generator

Pulls real charity data from the GiveWiZe Supabase database, enriches it with
live web data (charity websites, current campaigns, news), and generates
branded social media content for Instagram and LinkedIn.

Content types:
  - Charity Spotlights (feature a specific charity with live web context)
  - Cause Awareness (timely posts tied to awareness months/events)
  - Campaign Highlights (active fundraising drives, matching gifts, events)
  - Platform Promos (drive traffic to GiveWiZe features)
  - Impact Stats (aggregate data across charities)

Every post includes:
  - Platform-specific caption (Instagram vs LinkedIn tone/length)
  - Image generation prompt (for DALL-E / Midjourney)
  - Content type label
  - Suggested posting day
  - Web sources used for enrichment

Usage:
  python social_media_generator.py                                    # mixed 7-day calendar
  python social_media_generator.py --category hunger-food-security    # themed campaign
  python social_media_generator.py --days 14                          # two-week calendar
  python social_media_generator.py --charity "Feeding America"        # spotlight one charity
  python social_media_generator.py --no-onboard                       # skip auto-onboarding

Requires:
  pip install anthropic supabase python-dotenv requests beautifulsoup4
  Set ANTHROPIC_API_KEY in .env or environment
"""

import os
import sys
import io
import json
import csv
import re
import argparse
import random
from datetime import datetime, timedelta
from html import unescape

# Fix Windows terminal encoding for Unicode characters
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

from dotenv import load_dotenv
from supabase import create_client
import anthropic
import requests

# ── Configuration ────────────────────────────────────────────────────

load_dotenv()

SUPABASE_URL = "https://lljyfqgjszucsqbpkthp.supabase.co"
SUPABASE_KEY = (
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9."
    "eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxsanlmcWdqc3p1Y3NxYnBrdGhwIiwi"
    "cm9sZSI6ImFub24iLCJpYXQiOjE3NzA1OTQwNDIsImV4cCI6MjA4NjE3MDA0Mn0."
    "BofY-WDIFx6ZdKua7ANWb9WMryP-JW3jC_xzIhesQeU"
)

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
if not ANTHROPIC_API_KEY:
    print("ERROR: Set ANTHROPIC_API_KEY in your environment or .env file.")
    print("  export ANTHROPIC_API_KEY=sk-ant-...")
    sys.exit(1)

SITE_URL = "https://givewize.com"

# Optional: for auto-posting
META_ACCESS_TOKEN = os.getenv("META_ACCESS_TOKEN")
INSTAGRAM_ACCOUNT_ID = os.getenv("INSTAGRAM_ACCOUNT_ID")
LINKEDIN_ACCESS_TOKEN = os.getenv("LINKEDIN_ACCESS_TOKEN")
LINKEDIN_PERSON_ID = os.getenv("LINKEDIN_PERSON_ID")
LINKEDIN_ORG_ID = os.getenv("LINKEDIN_ORG_ID")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# ── Posting Schedule ────────────────────────────────────────────────
# Growth-phased posting strategy for LinkedIn Company Page.
# Phase auto-advances based on page creation date.
#   Phase 1 (weeks 1-4):   3x/week  Tue, Wed, Thu
#   Phase 2 (months 2-3):  4x/week  Mon, Tue, Wed, Thu
#   Phase 3 (month 4+):    5x/week  Mon-Fri
# Optimal posting times: 9:00 AM or 12:00 PM ET

PAGE_LAUNCH_DATE = datetime(2026, 2, 25)  # When the Company Page was created

POSTING_PHASES = {
    1: {
        "label": "Growth Phase 1 (3x/week)",
        "days_of_week": [1, 2, 3],          # Tue, Wed, Thu (Monday=0)
        "posts_per_week": 3,
        "weeks": 4,                          # Duration: 4 weeks
    },
    2: {
        "label": "Growth Phase 2 (4x/week)",
        "days_of_week": [0, 1, 2, 3],       # Mon-Thu
        "posts_per_week": 4,
        "weeks": 8,                          # Duration: 8 weeks (months 2-3)
    },
    3: {
        "label": "Growth Phase 3 (5x/week)",
        "days_of_week": [0, 1, 2, 3, 4],    # Mon-Fri
        "posts_per_week": 5,
        "weeks": None,                       # Indefinite
    },
}

OPTIMAL_POST_TIMES = ["09:00", "12:00"]  # ET, alternating


def get_current_phase():
    """Determine the current posting phase based on page age."""
    age_days = (datetime.now() - PAGE_LAUNCH_DATE).days
    age_weeks = age_days / 7

    if age_weeks < POSTING_PHASES[1]["weeks"]:
        return 1
    elif age_weeks < POSTING_PHASES[1]["weeks"] + POSTING_PHASES[2]["weeks"]:
        return 2
    else:
        return 3


def get_next_posting_days(num_posts, start_date=None, skip_today=False):
    """Get the next N posting days based on the current phase schedule.

    Returns list of datetime objects for each posting day.
    """
    phase = get_current_phase()
    schedule = POSTING_PHASES[phase]
    allowed_days = schedule["days_of_week"]

    if start_date is None:
        start_date = datetime.now()

    posting_days = []
    current = start_date

    # Include today if it's a posting day (unless skipped)
    if not skip_today and current.weekday() in allowed_days:
        posting_days.append(current)

    # Find subsequent posting days
    while len(posting_days) < num_posts:
        current = current + timedelta(days=1)
        if current.weekday() in allowed_days:
            posting_days.append(current)

    return posting_days


CATEGORY_LABELS = {
    "rare-diseases": "Rare Diseases",
    "medical-health": "Medical & Health",
    "mental-health": "Mental Health",
    "child-welfare": "Child Welfare",
    "senior-services": "Senior Services",
    "disability-services": "Disability Services",
    "veterans": "Veterans",
    "housing-homelessness": "Housing & Homelessness",
    "environment-climate": "Environment & Climate",
    "animal-welfare": "Animal Welfare",
    "education": "Education",
    "community-development": "Community Development",
    "international-development": "International Development",
    "hunger-food-security": "Hunger & Food Security",
    "emergency-relief": "Emergency Relief",
    "arts-culture": "Arts & Culture",
    "human-rights": "Human Rights",
    "faith-based": "Faith-Based",
}

# ── Awareness Calendar ───────────────────────────────────────────────
# Maps month numbers to relevant cause awareness events/months

AWARENESS_CALENDAR = {
    1: [
        {"name": "National Blood Donor Month", "categories": ["medical-health"]},
        {"name": "National Mentoring Month", "categories": ["education", "child-welfare"]},
        {"name": "Human Trafficking Awareness Month", "categories": ["human-rights"]},
    ],
    2: [
        {"name": "American Heart Month", "categories": ["medical-health"]},
        {"name": "Black History Month", "categories": ["human-rights", "education"]},
        {"name": "Rare Disease Day (Feb 28)", "categories": ["rare-diseases"]},
        {"name": "Random Acts of Kindness Week", "categories": ["community-development"]},
    ],
    3: [
        {"name": "Women's History Month", "categories": ["human-rights", "education"]},
        {"name": "National Nutrition Month", "categories": ["hunger-food-security"]},
        {"name": "World Wildlife Day (Mar 3)", "categories": ["animal-welfare", "environment-climate"]},
    ],
    4: [
        {"name": "Autism Awareness Month", "categories": ["disability-services", "medical-health"]},
        {"name": "Earth Month / Earth Day (Apr 22)", "categories": ["environment-climate"]},
        {"name": "Child Abuse Prevention Month", "categories": ["child-welfare"]},
        {"name": "National Volunteer Month", "categories": ["community-development"]},
    ],
    5: [
        {"name": "Mental Health Awareness Month", "categories": ["mental-health"]},
        {"name": "Asian American Pacific Islander Heritage Month", "categories": ["human-rights"]},
        {"name": "Military Appreciation Month", "categories": ["veterans"]},
        {"name": "Older Americans Month", "categories": ["senior-services"]},
    ],
    6: [
        {"name": "Pride Month", "categories": ["human-rights"]},
        {"name": "World Environment Day (Jun 5)", "categories": ["environment-climate"]},
        {"name": "World Refugee Day (Jun 20)", "categories": ["international-development", "emergency-relief"]},
    ],
    7: [
        {"name": "Disability Pride Month", "categories": ["disability-services"]},
        {"name": "World Hunger Day", "categories": ["hunger-food-security"]},
    ],
    8: [
        {"name": "Back to School Season", "categories": ["education"]},
        {"name": "World Humanitarian Day (Aug 19)", "categories": ["emergency-relief", "international-development"]},
    ],
    9: [
        {"name": "National Suicide Prevention Month", "categories": ["mental-health"]},
        {"name": "Hunger Action Month", "categories": ["hunger-food-security"]},
        {"name": "National Disaster Preparedness Month", "categories": ["emergency-relief"]},
    ],
    10: [
        {"name": "Breast Cancer Awareness Month", "categories": ["medical-health"]},
        {"name": "Domestic Violence Awareness Month", "categories": ["human-rights", "child-welfare"]},
        {"name": "National Arts & Humanities Month", "categories": ["arts-culture"]},
        {"name": "World Homeless Day (Oct 10)", "categories": ["housing-homelessness"]},
    ],
    11: [
        {"name": "National Adoption Month", "categories": ["child-welfare"]},
        {"name": "Veterans Day (Nov 11)", "categories": ["veterans"]},
        {"name": "Giving Tuesday (last Tue after Thanksgiving)", "categories": ["all"]},
        {"name": "National Homelessness Awareness Month", "categories": ["housing-homelessness"]},
    ],
    12: [
        {"name": "Giving Season / Year-End Giving", "categories": ["all"]},
        {"name": "International Day of Persons with Disabilities (Dec 3)", "categories": ["disability-services"]},
        {"name": "Human Rights Day (Dec 10)", "categories": ["human-rights"]},
    ],
}


def get_current_awareness_events(category_focus=None):
    """Get awareness events relevant to the current month."""
    month = datetime.now().month
    events = AWARENESS_CALENDAR.get(month, [])
    if category_focus:
        events = [e for e in events if category_focus in e["categories"] or "all" in e["categories"]]
    return events


# ── Auto-Onboarding (Gap Detection + ProPublica + Edge Function) ─────
# Maps GiveWiZe categories to NTEE major codes for ProPublica search

CATEGORY_TO_NTEE = {
    "arts-culture": ["A"],
    "education": ["B", "U"],
    "environment-climate": ["C"],
    "animal-welfare": ["D"],
    "medical-health": ["E", "G", "H"],
    "mental-health": ["F"],
    "human-rights": ["I", "J", "R"],
    "hunger-food-security": ["K"],
    "housing-homelessness": ["L"],
    "child-welfare": ["O"],
    "community-development": ["N", "P", "S", "T", "W", "Y"],
    "international-development": ["Q"],
    "faith-based": ["X"],
    "rare-diseases": ["E", "G", "H"],  # subset of medical
    "veterans": ["W"],  # often classified under public benefit
    "senior-services": ["P"],  # subset of human services
    "disability-services": ["P"],  # subset of human services
    "emergency-relief": ["M", "Q"],  # disaster relief + international
}

MIN_CHARITIES_PER_CATEGORY = 3  # auto-onboard if fewer than this


def search_propublica(query, ntee_codes=None, max_results=5):
    """Search ProPublica Nonprofit Explorer for charities."""
    results = []

    # Strategy 1: Search by name/keyword
    try:
        url = f"https://projects.propublica.org/nonprofits/api/v2/search.json?q={query}&page=0"
        resp = requests.get(url, timeout=10)
        if resp.status_code == 200:
            data = resp.json()
            orgs = data.get("organizations", [])
            for org in orgs[:max_results * 2]:
                ntee = org.get("ntee_code", "")
                # Filter by NTEE if specified
                if ntee_codes and ntee and ntee[0].upper() not in ntee_codes:
                    continue
                if org.get("ein") and org.get("name"):
                    results.append({
                        "ein": str(org["ein"]),
                        "name": org["name"],
                        "city": org.get("city", ""),
                        "state": org.get("state", ""),
                        "ntee_code": ntee,
                    })
                if len(results) >= max_results:
                    break
    except requests.RequestException:
        pass

    return results


def detect_category_gaps(charities, awareness_events):
    """Find categories that need more charities based on this month's awareness events."""
    # Count charities per category
    category_counts = {}
    for c in charities:
        cat = c.get("primary_category", "other")
        category_counts[cat] = category_counts.get(cat, 0) + 1

    # Find which awareness-event categories are underrepresented
    gaps = []
    needed_categories = set()
    for event in awareness_events:
        for cat in event.get("categories", []):
            if cat == "all":
                continue
            needed_categories.add(cat)

    for cat in needed_categories:
        count = category_counts.get(cat, 0)
        if count < MIN_CHARITIES_PER_CATEGORY:
            gaps.append({
                "category": cat,
                "label": CATEGORY_LABELS.get(cat, cat),
                "current_count": count,
                "need": MIN_CHARITIES_PER_CATEGORY - count,
            })

    return gaps


def auto_onboard_charities(gaps, existing_eins):
    """Find and onboard charities to fill category gaps via the existing pipeline."""
    if not gaps:
        return []

    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    onboarded = []

    for gap in gaps:
        cat = gap["category"]
        label = gap["label"]
        need = gap["need"]
        ntee_codes = CATEGORY_TO_NTEE.get(cat, [])

        print(f"\n    Searching ProPublica for {label} charities...", end=" ", flush=True)

        # Search with category-relevant keywords
        # Search terms target well-known, established organizations more
        # likely to auto-approve (good data on ProPublica + websites)
        search_terms = {
            "rare-diseases": "rare disease research foundation",
            "medical-health": "american health association",
            "mental-health": "mental health america",
            "child-welfare": "children foundation america",
            "senior-services": "senior citizens foundation",
            "disability-services": "disability rights foundation",
            "veterans": "veterans assistance foundation",
            "housing-homelessness": "habitat housing america",
            "environment-climate": "conservation foundation america",
            "animal-welfare": "humane society animal",
            "education": "education foundation america",
            "community-development": "united way community",
            "international-development": "international relief foundation",
            "hunger-food-security": "food bank america",
            "emergency-relief": "disaster relief american",
            "arts-culture": "arts foundation america",
            "human-rights": "civil rights foundation",
            "faith-based": "faith community foundation",
        }

        query = search_terms.get(cat, label)
        candidates = search_propublica(query, ntee_codes, max_results=need + 3)

        # Filter out charities already in our database
        new_candidates = [c for c in candidates if c["ein"] not in existing_eins]

        if not new_candidates:
            print(f"No new charities found")
            continue

        print(f"Found {len(new_candidates)} candidates")

        for candidate in new_candidates[:need]:
            ein = candidate["ein"]
            name = candidate["name"]
            print(f"      Onboarding: {name} (EIN: {ein})...", end=" ", flush=True)

            try:
                # Step 1: Insert charity request
                insert_result = supabase.table("charity_requests").insert({
                    "charity_name": name,
                    "ein": ein,
                    "reason": f"Auto-onboarded for {label} content campaign",
                }).execute()

                if not insert_result.data:
                    print("insert failed")
                    continue

                request_id = insert_result.data[0]["id"]

                # Step 2: Invoke the processing Edge Function via HTTP
                # (direct HTTP call with longer timeout since pipeline takes ~20s)
                fn_url = f"{SUPABASE_URL}/functions/v1/process-charity-request"
                fn_resp = requests.post(
                    fn_url,
                    json={"charity_request_id": request_id},
                    headers={
                        "Authorization": f"Bearer {SUPABASE_KEY}",
                        "Content-Type": "application/json",
                    },
                    timeout=60,  # pipeline needs ~15-20s
                )

                if fn_resp.status_code == 200:
                    result = fn_resp.json()
                else:
                    result = {"status": "error", "message": fn_resp.text[:200]}

                status = result.get("status", "unknown")

                if status == "auto_approved":
                    print(f"Added! (Score: {result.get('score', 'N/A')})")
                    existing_eins.add(ein)
                    onboarded.append({
                        "name": result.get("charity_name", name),
                        "category": cat,
                        "status": status,
                        "score": result.get("score"),
                        "charity_id": result.get("charity_id"),
                    })
                elif status == "duplicate":
                    print("Already exists")
                    existing_eins.add(ein)
                else:
                    print(f"{status}")

            except Exception as e:
                print(f"Error: {e}")
                continue

    return onboarded


# ── Web Enrichment ───────────────────────────────────────────────────

CAMPAIGN_KEYWORDS = [
    "donate now", "give today", "matching gift", "match your",
    "double your", "triple your", "fundrais", "campaign",
    "goal", "raised so far", "help us reach", "emergency appeal",
    "year-end", "giving tuesday", "giving season",
    "volunteer", "sign up", "join us", "gala", "event",
    "annual fund", "spring campaign", "summer campaign",
    "challenge grant", "monthly donor", "become a member",
]

HEADERS = {
    "User-Agent": "GiveWiZe-ContentBot/1.0 (charity research; contact: info@givewize.org)",
    "Accept": "text/html,application/xhtml+xml",
}


def scrape_charity_website(url):
    """Fetch a charity's homepage and extract campaign/event information."""
    if not url:
        return None

    # Normalize URL
    if not url.startswith("http"):
        url = "https://" + url

    result = {
        "campaigns": [],
        "recent_news": [],
        "upcoming_events": [],
        "donate_cta": None,
        "meta_description": None,
        "raw_snippets": [],
    }

    try:
        resp = requests.get(url, headers=HEADERS, timeout=8, allow_redirects=True)
        if resp.status_code != 200:
            return None
        html = resp.text

        # Extract meta description for context
        meta_match = re.search(r'<meta\s+(?:name|property)=["\'](?:og:)?description["\']\s+content=["\']([^"\']+)', html, re.I)
        if meta_match:
            result["meta_description"] = unescape(meta_match.group(1).strip())

        # Strip HTML tags for text analysis
        text = re.sub(r'<script[^>]*>[\s\S]*?</script>', '', html, flags=re.I)
        text = re.sub(r'<style[^>]*>[\s\S]*?</style>', '', html, flags=re.I)
        text = re.sub(r'<[^>]+>', ' ', text)
        text = re.sub(r'\s+', ' ', unescape(text)).strip()

        # Look for campaign-related content
        text_lower = text.lower()
        for keyword in CAMPAIGN_KEYWORDS:
            idx = text_lower.find(keyword)
            if idx != -1:
                # Extract surrounding context (100 chars before and after)
                start = max(0, idx - 100)
                end = min(len(text), idx + len(keyword) + 100)
                snippet = text[start:end].strip()
                if len(snippet) > 20:  # skip tiny fragments
                    result["raw_snippets"].append(snippet)

        # Deduplicate snippets (some overlap)
        seen = set()
        unique_snippets = []
        for s in result["raw_snippets"]:
            key = s[:50].lower()
            if key not in seen:
                seen.add(key)
                unique_snippets.append(s)
        result["raw_snippets"] = unique_snippets[:8]  # cap at 8 snippets

        # Look for donate CTA text
        donate_match = re.search(
            r'(?:donate|give|contribute)\s+(?:now|today|here)[^<]*',
            text, re.I
        )
        if donate_match:
            result["donate_cta"] = donate_match.group(0).strip()[:200]

        return result

    except requests.RequestException:
        return None
    except Exception:
        return None


def enrich_charity_from_web(charity):
    """Enrich a charity's data with live web information."""
    website = charity.get("website")
    if not website:
        return {"web_context": None, "has_active_campaign": False}

    print("(web)", end=" ", flush=True)
    data = scrape_charity_website(website)

    if not data or not data.get("raw_snippets"):
        return {"web_context": None, "has_active_campaign": False}

    has_campaign = len(data["raw_snippets"]) > 0
    context_parts = []

    if data.get("meta_description"):
        context_parts.append(f"Website description: {data['meta_description']}")

    if data["raw_snippets"]:
        context_parts.append("Current website highlights:")
        for snippet in data["raw_snippets"][:5]:
            context_parts.append(f"  - {snippet}")

    if data.get("donate_cta"):
        context_parts.append(f"Active donation CTA: {data['donate_cta']}")

    return {
        "web_context": "\n".join(context_parts) if context_parts else None,
        "has_active_campaign": has_campaign,
    }


# ── Supabase Data Fetching ───────────────────────────────────────────


def fetch_charities(category=None, charity_name=None):
    """Pull charity data from Supabase."""
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

    query = supabase.table("charities").select(
        "id, name, ein, primary_category, mission_statement, full_description, "
        "programs_list, target_population, people_served_annually, "
        "target_population_size, year_founded, geographic_scope, "
        "program_expense_percentage, admin_expense_percentage, "
        "community_rating_average, website, logo_url"
    )

    if category:
        query = query.eq("primary_category", category)
    if charity_name:
        query = query.ilike("name", f"%{charity_name}%")

    result = query.execute()
    return result.data


def compute_givewize_score(charity):
    """Compute GiveWiZe score client-side (mirrors charityUtils.ts)."""
    sub_scores = []
    weights = []

    pep = charity.get("program_expense_percentage")
    if pep is not None:
        if pep >= 85:
            score = 5.0
        elif pep >= 75:
            score = 4.0
        elif pep >= 65:
            score = 3.0
        elif pep >= 50:
            score = 2.0
        else:
            score = 1.0
        sub_scores.append(score)
        weights.append(0.35)

    transparency_points = 0
    if charity.get("website"):
        transparency_points += 1.25
    if charity.get("program_expense_percentage") is not None:
        transparency_points += 1.25
    if charity.get("community_rating_average") is not None:
        transparency_points += 1.25
    if charity.get("ein"):
        transparency_points += 1.25
    sub_scores.append(transparency_points)
    weights.append(0.30)

    served = charity.get("people_served_annually")
    target = charity.get("target_population_size")
    if served and target and target > 0:
        coverage = served / target
        if coverage >= 0.50:
            score = 5.0
        elif coverage >= 0.25:
            score = 4.5
        elif coverage >= 0.10:
            score = 4.0
        elif coverage >= 0.05:
            score = 3.5
        else:
            score = max(3.0, coverage * 60)
        sub_scores.append(score)
        weights.append(0.25)

    year = charity.get("year_founded")
    if year:
        try:
            age = 2026 - int(str(year).replace("+", ""))
        except (ValueError, TypeError):
            age = None
        if age is not None:
            if age >= 50:
                score = 5.0
            elif age >= 25:
                score = 4.0
            elif age >= 10:
                score = 3.5
            elif age >= 5:
                score = 3.0
            else:
                score = max(3.0, 2.0)
            sub_scores.append(score)
            weights.append(0.10)

    if not weights:
        return None

    total_weight = sum(weights)
    return round(sum(s * w for s, w in zip(sub_scores, weights)) / total_weight, 1)


# ── Content Generation with Claude ───────────────────────────────────

SYSTEM_PROMPT = """You are the social media manager for GiveWiZe, an AI-powered charity discovery platform. You create engaging social media content that:

1. Builds GiveWiZe's brand as THE place to find trustworthy charities
2. Educates people about charitable causes
3. Always includes a call-to-action driving traffic to GiveWiZe
4. Sounds like a real human wrote it, not AI

CRITICAL STYLE RULES (follow these exactly):
- NEVER use em dashes or double dashes (-- or —). Use commas, periods, or parentheses instead.
- NEVER use the word "delve", "landscape", "comprehensive", "leverage", or "elevate"
- Use emojis naturally like real people do on social media (2-5 per post, not overdone)
- Vary sentence length. Mix short punchy lines with longer ones.
- Start some sentences with "And" or "But" for a casual feel.

INSTAGRAM rules:
- Under 2200 characters
- Casual, personal, conversational tone
- Use line breaks generously for readability
- Use emojis as bullet points or emphasis (not every line)
- 3-5 hashtags at the end
- Talk TO the reader ("you", "your")

LINKEDIN rules:
- Professional but human, 150-300 words
- Use emojis sparingly but naturally (1-3 total, like real LinkedIn creators)
- Open with a hook (stat, question, or bold statement)
- Short paragraphs (1-3 sentences each)
- 2-3 hashtags at the end
- Data-driven, reference specific numbers

BOTH platforms:
- The CTA should feel natural, not forced
- Reference GiveWiZe's features: quiz matching, GiveWiZe Score, charity profiles
- Do NOT fabricate statistics or claims about charities
- Use the exact charity data provided, do not embellish
- If live website data mentions an active campaign, fundraiser, or event, weave it naturally into the post
- If an awareness month/day is mentioned, tie the post to that timely event

Return ONLY valid JSON in this exact format:
{
  "instagram_caption": "the full instagram caption with line breaks as \\n",
  "linkedin_post": "the full linkedin post",
  "image_prompt": "a detailed prompt for generating an accompanying image using AI (DALL-E style). Describe the scene, mood, colors, composition. Should feel warm and hopeful, not stock-photo generic. Never include text or logos in the image prompt.",
  "content_type": "spotlight|awareness|campaign|promo|impact",
  "suggested_hashtags_ig": ["#hashtag1", "#hashtag2"],
  "suggested_hashtags_li": ["#hashtag1", "#hashtag2"]
}"""


def generate_spotlight_post(charity, client, web_data=None, awareness_events=None):
    """Generate a charity spotlight post enriched with web data."""
    score = compute_givewize_score(charity)
    programs = charity.get("programs_list") or []

    context = f"""Create a CHARITY SPOTLIGHT post for GiveWiZe's social media.

Charity data (use only what's provided, do not make up details):
- Name: {charity['name']}
- Category: {CATEGORY_LABELS.get(charity.get('primary_category', ''), charity.get('primary_category', 'Unknown'))}
- Mission: {charity.get('mission_statement') or 'Not available'}
- Programs: {', '.join(programs[:5]) if programs else 'Not listed'}
- People served annually: {charity.get('people_served_annually') or 'Not available'}
- Target population: {charity.get('target_population') or 'Not specified'}
- Program spending: {f"{charity['program_expense_percentage']}% goes to programs" if charity.get('program_expense_percentage') else 'Not available'}
- GiveWiZe Score: {f"{score}/5.0" if score else 'Not yet rated'}
- Year founded: {charity.get('year_founded') or 'Unknown'}
- Geographic scope: {charity.get('geographic_scope') or 'Unknown'}"""

    if web_data and web_data.get("web_context"):
        context += f"""

LIVE DATA from their website (use this to make the post timely and relevant):
{web_data['web_context']}"""

    if awareness_events:
        relevant = [e for e in awareness_events
                    if charity.get("primary_category") in e.get("categories", []) or "all" in e.get("categories", [])]
        if relevant:
            events_str = ", ".join(e["name"] for e in relevant)
            context += f"""

TIMELY CONTEXT: This month features {events_str}. If relevant to this charity, tie the post to this awareness event."""

    context += """

The post should highlight what makes this charity noteworthy. If there's an active campaign or timely event, lead with that. End with a CTA to learn more about them on GiveWiZe."""

    return _call_claude(client, context)


def generate_campaign_post(charity, web_data, client, awareness_events=None):
    """Generate a post about an active campaign/event detected on a charity's website."""
    score = compute_givewize_score(charity)

    context = f"""Create a CAMPAIGN HIGHLIGHT post for GiveWiZe's social media.

This charity has an ACTIVE CAMPAIGN or event happening right now. Make this feel urgent and timely.

Charity: {charity['name']}
Category: {CATEGORY_LABELS.get(charity.get('primary_category', ''), charity.get('primary_category', 'Unknown'))}
Mission: {charity.get('mission_statement') or 'Not available'}
GiveWiZe Score: {f"{score}/5.0" if score else 'Not yet rated'}
Program spending: {f"{charity['program_expense_percentage']}% goes to programs" if charity.get('program_expense_percentage') else 'Not available'}

LIVE CAMPAIGN DATA from their website:
{web_data.get('web_context', 'Campaign detected but details limited.')}"""

    if awareness_events:
        relevant = [e for e in awareness_events
                    if charity.get("primary_category") in e.get("categories", []) or "all" in e.get("categories", [])]
        if relevant:
            events_str = ", ".join(e["name"] for e in relevant)
            context += f"""

TIMELY CONTEXT: This aligns with {events_str} this month."""

    context += """

Frame this as: "This charity is doing something RIGHT NOW that you can support. Here's what's happening and why it matters." The CTA should drive to GiveWiZe to learn more about them AND to their campaign if applicable."""

    return _call_claude(client, context)


def generate_awareness_post(category, charities_in_category, client, awareness_events=None):
    """Generate a cause awareness post, tied to current awareness month if applicable."""
    cat_label = CATEGORY_LABELS.get(category, category)
    charity_names = [c["name"] for c in charities_in_category[:5]]
    pcts = [c["program_expense_percentage"] for c in charities_in_category if c.get("program_expense_percentage")]
    avg_program_pct = round(sum(pcts) / len(pcts), 1) if pcts else None

    context = f"""Create a CAUSE AWARENESS post for GiveWiZe's social media about {cat_label}.

Available data:
- Category: {cat_label}
- Number of {cat_label} charities on GiveWiZe: {len(charities_in_category)}
- Example charities in this category: {', '.join(charity_names)}
- Average program spending in this category: {f"{avg_program_pct}%" if avg_program_pct else "varies"}"""

    if awareness_events:
        relevant = [e for e in awareness_events if category in e.get("categories", []) or "all" in e.get("categories", [])]
        if relevant:
            events_str = ", ".join(e["name"] for e in relevant)
            context += f"""

TIMELY HOOK: This month features {events_str}. Lead with this awareness event to make the post timely and relevant. Reference the specific day/month by name."""

    context += f"""

The post should raise awareness about this cause area and why it matters. End with a CTA to explore {cat_label} charities on GiveWiZe or take the quiz to find their match. Do NOT fabricate statistics about the cause unless the charity data above supports it."""

    return _call_claude(client, context)


def generate_promo_post(feature, client):
    """Generate a GiveWiZe platform promo post."""
    features = {
        "quiz": "GiveWiZe's charity matching quiz. Users answer as few as 3 questions and get matched with charities that align with their values. The quiz has 3 tiers: Quick Match (3 questions), Refined Match (6 questions), and Deep Match (8 questions). Each tier narrows results for a more personalized match.",
        "scores": "GiveWiZe's proprietary scoring system. Every charity gets a GiveWiZe Score (0-5) based on Financial Efficiency (35%), Transparency (30%), Impact (25%), and Longevity (10%). Combined with Community Ratings for a complete picture. All scores are transparent and data-driven.",
        "explore": "GiveWiZe's Explore page. Users can browse 70+ verified charities, filter by category, geographic scope, GiveWiZe Score, and key factors like financial transparency. Each charity has a detailed profile with ratings, programs, and financial breakdowns.",
    }

    context = f"""Create a PLATFORM PROMO post for GiveWiZe's social media.

Feature to highlight: {features[feature]}

The post should explain the feature's value to potential donors and make them want to try it. Keep it conversational, not salesy. End with a clear CTA to visit GiveWiZe."""

    return _call_claude(client, context)


def generate_impact_post(all_charities, client, awareness_events=None):
    """Generate an aggregate impact/stats post."""
    total = len(all_charities)
    categories = len(set(c.get("primary_category") for c in all_charities if c.get("primary_category")))
    pcts = [c["program_expense_percentage"] for c in all_charities if c.get("program_expense_percentage")]
    avg_pct = round(sum(pcts) / len(pcts), 1) if pcts else None
    oldest = min((c.get("year_founded") for c in all_charities if c.get("year_founded")), default=None)
    served = [c["people_served_annually"] for c in all_charities if c.get("people_served_annually")]
    total_served = sum(served) if served else None

    context = f"""Create an IMPACT STATS post for GiveWiZe's social media.

Aggregate data from GiveWiZe's charity database:
- Total verified charities: {total}
- Categories covered: {categories}
- Average program spending: {f"{avg_pct}% of donations go directly to programs" if avg_pct else "varies"}
- Oldest charity founded: {oldest or "unknown"}
- Total people served by listed charities: {f"{total_served:,}" if total_served else "millions"}"""

    if awareness_events:
        general = [e for e in awareness_events if "all" in e.get("categories", [])]
        if general:
            events_str = ", ".join(e["name"] for e in general)
            context += f"""

TIMELY HOOK: {events_str} is happening this month. Tie the stats to a giving-focused message."""

    context += """

The post should use these real numbers to build trust in GiveWiZe as a reliable platform. Make it feel like a milestone or progress update. End with a CTA."""

    return _call_claude(client, context)


def _call_claude(client, user_message):
    """Call Claude API and parse the JSON response."""
    try:
        response = client.messages.create(
            model="claude-sonnet-4-5-20250929",
            max_tokens=1024,
            system=SYSTEM_PROMPT,
            messages=[{"role": "user", "content": user_message}],
        )
        raw = response.content[0].text

        # 3-strategy JSON parsing (same as our Edge Functions)
        try:
            return json.loads(raw)
        except json.JSONDecodeError:
            pass

        fence_match = re.search(r"```(?:json)?\s*\n?([\s\S]*?)\n?```", raw)
        if fence_match:
            try:
                return json.loads(fence_match.group(1).strip())
            except json.JSONDecodeError:
                pass

        brace_start = raw.find("{")
        brace_end = raw.rfind("}")
        if brace_start != -1 and brace_end > brace_start:
            try:
                return json.loads(raw[brace_start:brace_end + 1])
            except json.JSONDecodeError:
                pass

        print("WARNING: Could not parse Claude response", end=" ", flush=True)
        return None

    except Exception as e:
        print(f"ERROR: {e}", end=" ", flush=True)
        return None


# ── Content Calendar Builder ─────────────────────────────────────────


def build_content_calendar(charities, days=None, category_focus=None, skip_today=False):
    """Build a content calendar with web-enriched, timely posts.

    Uses the growth-phased posting schedule to assign posts to optimal days.
    The 'days' param means number of posts to generate (default: 1 week's worth).
    Posts are assigned to the next available posting days per the phase schedule.
    """
    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
    calendar = []

    # Determine posting schedule
    phase = get_current_phase()
    schedule = POSTING_PHASES[phase]
    if days is None:
        days = schedule["posts_per_week"]

    print(f"\n  Schedule: {schedule['label']}")
    day_names = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    posting_days_str = ", ".join(day_names[d] for d in schedule["days_of_week"])
    print(f"  Posting days: {posting_days_str}")
    print(f"  Optimal times: {' or '.join(OPTIMAL_POST_TIMES)} ET")

    # Get the next N posting days
    posting_dates = get_next_posting_days(days, skip_today=skip_today)

    # Get current awareness events
    awareness_events = get_current_awareness_events(category_focus)
    if awareness_events:
        print(f"\n  Current awareness events this month:")
        for event in awareness_events:
            print(f"    - {event['name']}")

    # Group charities by category
    by_category = {}
    for c in charities:
        cat = c.get("primary_category", "other")
        by_category.setdefault(cat, []).append(c)

    # Determine categories to feature
    if category_focus:
        featured_cats = [category_focus]
    else:
        featured_cats = list(by_category.keys())
        random.shuffle(featured_cats)

    # Pick spotlight charities (one per category, then fill)
    spotlight_charities = []
    for cat in featured_cats:
        cat_charities = by_category.get(cat, [])
        if cat_charities:
            spotlight_charities.append(random.choice(cat_charities))
        if len(spotlight_charities) >= days:
            break

    used_ids = {c["id"] for c in spotlight_charities}
    remaining = [c for c in charities if c["id"] not in used_ids]
    random.shuffle(remaining)
    while len(spotlight_charities) < days and remaining:
        spotlight_charities.append(remaining.pop())

    # Web-enrich spotlight charities (fetch their websites for campaigns)
    web_data_cache = {}
    print(f"\n  Scanning charity websites for active campaigns...")
    for charity in spotlight_charities:
        web_result = enrich_charity_from_web(charity)
        web_data_cache[charity["id"]] = web_result
        if web_result.get("has_active_campaign"):
            print(f"    Found activity: {charity['name']}")

    # Find charities with active campaigns
    campaign_charities = [
        c for c in spotlight_charities
        if web_data_cache.get(c["id"], {}).get("has_active_campaign")
    ]

    # Build the content plan using scheduled posting days
    content_plan = []
    for post_idx, post_date in enumerate(posting_dates):
        day_label = post_date.strftime("%A, %B %d")
        post_time = OPTIMAL_POST_TIMES[post_idx % len(OPTIMAL_POST_TIMES)]

        # Content type rotation based on post index within the week:
        #   Post 1: Spotlight, Post 2: Awareness/Campaign, Post 3: Spotlight,
        #   Post 4: Promo, Post 5: Impact (if 5x/week)
        week_pos = post_idx % schedule["posts_per_week"]
        if week_pos == 1:
            if campaign_charities and random.random() < 0.5:
                content_plan.append(("campaign", day_label, post_idx, post_date, post_time))
            else:
                content_plan.append(("awareness", day_label, post_idx, post_date, post_time))
        elif week_pos == 3:
            content_plan.append(("promo", day_label, post_idx, post_date, post_time))
        elif week_pos == 4:
            if campaign_charities:
                content_plan.append(("campaign", day_label, post_idx, post_date, post_time))
            else:
                content_plan.append(("impact", day_label, post_idx, post_date, post_time))
        else:
            content_plan.append(("spotlight", day_label, post_idx, post_date, post_time))

    # Generate content for each day
    spotlight_idx = 0
    awareness_cat_idx = 0
    campaign_idx = 0
    promo_features = ["quiz", "scores", "explore"]
    promo_idx = 0

    for content_type, day_label, post_idx, post_date, post_time in content_plan:
        print(f"\n  Post {post_idx + 1} ({day_label} @ {post_time}) - {content_type.upper()}...", end=" ", flush=True)

        post = None

        if content_type == "spotlight" and spotlight_idx < len(spotlight_charities):
            charity = spotlight_charities[spotlight_idx]
            print(f"[{charity['name']}]", end=" ", flush=True)
            web = web_data_cache.get(charity["id"])
            post = generate_spotlight_post(charity, client, web, awareness_events)
            if post:
                post["charity_name"] = charity["name"]
            spotlight_idx += 1

        elif content_type == "campaign" and campaign_idx < len(campaign_charities):
            charity = campaign_charities[campaign_idx]
            print(f"[{charity['name']} - ACTIVE CAMPAIGN]", end=" ", flush=True)
            web = web_data_cache.get(charity["id"])
            post = generate_campaign_post(charity, web, client, awareness_events)
            if post:
                post["charity_name"] = charity["name"]
            campaign_idx += 1

        elif content_type == "awareness":
            cat = featured_cats[awareness_cat_idx % len(featured_cats)]
            cat_charities = by_category.get(cat, [])
            print(f"[{CATEGORY_LABELS.get(cat, cat)}]", end=" ", flush=True)
            post = generate_awareness_post(cat, cat_charities, client, awareness_events)
            awareness_cat_idx += 1

        elif content_type == "promo":
            feature = promo_features[promo_idx % len(promo_features)]
            print(f"[{feature}]", end=" ", flush=True)
            post = generate_promo_post(feature, client)
            promo_idx += 1

        elif content_type == "impact":
            print("[aggregate stats]", end=" ", flush=True)
            post = generate_impact_post(charities, client, awareness_events)

        if post:
            post["day"] = day_label
            post["day_number"] = post_idx + 1
            post["scheduled_date"] = post_date.strftime("%Y-%m-%d")
            post["scheduled_time"] = post_time
            calendar.append(post)
            print("Done!")
        else:
            print("FAILED - skipping")

    return calendar


# ── Output Formatters ────────────────────────────────────────────────


def print_calendar(calendar):
    """Print the content calendar to the terminal."""
    print("\n" + "=" * 70)
    print("  GIVEWIZE SOCIAL MEDIA CONTENT CALENDAR")
    print("=" * 70)

    for post in calendar:
        ctype = post.get("content_type", "").upper()
        if ctype == "CAMPAIGN":
            ctype = "CAMPAIGN (LIVE)"

        sched_time = post.get("scheduled_time", "")
        time_str = f" @ {sched_time}" if sched_time else ""

        print(f"\n{'─' * 70}")
        print(f"  POST {post.get('day_number', '?')} | {post.get('day', '')}{time_str} | {ctype}")
        print(f"{'─' * 70}")

        print(f"\n  INSTAGRAM:")
        caption = post.get("instagram_caption", "")
        for line in caption.split("\\n"):
            print(f"    {line}")
        tags = post.get("suggested_hashtags_ig", [])
        if tags:
            print(f"    {' '.join(tags)}")

        print(f"\n  LINKEDIN:")
        li_post = post.get("linkedin_post", "")
        for line in li_post.split("\n"):
            print(f"    {line}")
        tags = post.get("suggested_hashtags_li", [])
        if tags:
            print(f"    {' '.join(tags)}")

        print(f"\n  IMAGE PROMPT:")
        print(f"    {post.get('image_prompt', 'N/A')}")

    print(f"\n{'=' * 70}")
    print(f"  Total posts generated: {len(calendar)}")
    print(f"{'=' * 70}\n")


def save_csv(calendar, filename="content_calendar.csv"):
    """Save the content calendar as a CSV file."""
    filepath = os.path.join(os.path.dirname(__file__), "..", "docs", filename)
    os.makedirs(os.path.dirname(filepath), exist_ok=True)

    with open(filepath, "w", newline="", encoding="utf-8") as f:
        fieldnames = [
            "day_number", "scheduled_date", "scheduled_time", "day", "content_type",
            "instagram_caption", "suggested_hashtags_ig",
            "linkedin_post", "suggested_hashtags_li",
            "image_prompt",
        ]
        writer = csv.DictWriter(f, fieldnames=fieldnames, extrasaction="ignore")
        writer.writeheader()
        for post in calendar:
            row = dict(post)
            row["suggested_hashtags_ig"] = " ".join(row.get("suggested_hashtags_ig", []))
            row["suggested_hashtags_li"] = " ".join(row.get("suggested_hashtags_li", []))
            writer.writerow(row)

    print(f"\n  Saved to: {os.path.abspath(filepath)}")
    return filepath


# ── Image Generation (DALL-E) ────────────────────────────────────────


def generate_image(prompt):
    """Generate an image using OpenAI's DALL-E API. Returns the image URL."""
    if not OPENAI_API_KEY:
        return None

    try:
        resp = requests.post(
            "https://api.openai.com/v1/images/generations",
            headers={
                "Authorization": f"Bearer {OPENAI_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": "dall-e-3",
                "prompt": prompt,
                "n": 1,
                "size": "1024x1024",
                "quality": "standard",
            },
            timeout=60,
        )
        if resp.status_code == 200:
            data = resp.json()
            url = data["data"][0]["url"]
            print("(image generated)", end=" ", flush=True)
            return url
        else:
            print(f"(image failed: {resp.status_code})", end=" ", flush=True)
            return None
    except Exception as e:
        print(f"(image error: {e})", end=" ", flush=True)
        return None


# ── Auto-Posting: Instagram (Meta Graph API) ────────────────────────


def post_to_instagram(caption, image_url):
    """Post to Instagram Business account via Meta Graph API.

    Requires:
    - META_ACCESS_TOKEN: Long-lived token from Meta Developer portal
    - INSTAGRAM_ACCOUNT_ID: Instagram Business Account ID
    - image_url: Public URL of image to post (DALL-E URLs work)

    Flow: Create media container -> Publish container
    """
    if not META_ACCESS_TOKEN or not INSTAGRAM_ACCOUNT_ID:
        return {"success": False, "error": "Missing META_ACCESS_TOKEN or INSTAGRAM_ACCOUNT_ID in .env"}

    if not image_url:
        return {"success": False, "error": "Instagram requires an image. Set OPENAI_API_KEY in .env for DALL-E image generation."}

    graph_url = "https://graph.facebook.com/v21.0"

    try:
        # Step 1: Create media container
        create_resp = requests.post(
            f"{graph_url}/{INSTAGRAM_ACCOUNT_ID}/media",
            data={
                "image_url": image_url,
                "caption": caption,
                "access_token": META_ACCESS_TOKEN,
            },
            timeout=30,
        )

        if create_resp.status_code != 200:
            error_msg = create_resp.json().get("error", {}).get("message", create_resp.text[:200])
            return {"success": False, "error": f"Container creation failed: {error_msg}"}

        container_id = create_resp.json().get("id")
        if not container_id:
            return {"success": False, "error": "No container ID returned"}

        # Step 2: Wait briefly for container to be ready
        import time
        time.sleep(5)

        # Step 3: Publish the container
        publish_resp = requests.post(
            f"{graph_url}/{INSTAGRAM_ACCOUNT_ID}/media_publish",
            data={
                "creation_id": container_id,
                "access_token": META_ACCESS_TOKEN,
            },
            timeout=30,
        )

        if publish_resp.status_code != 200:
            error_msg = publish_resp.json().get("error", {}).get("message", publish_resp.text[:200])
            return {"success": False, "error": f"Publish failed: {error_msg}"}

        media_id = publish_resp.json().get("id")
        return {
            "success": True,
            "media_id": media_id,
            "platform": "instagram",
        }

    except Exception as e:
        return {"success": False, "error": str(e)}


# ── Auto-Posting: LinkedIn (REST API) ───────────────────────────────


def _resolve_linkedin_org(name):
    """Look up a LinkedIn organization ID by vanity name or keyword search.

    Returns urn:li:organization:{id} if found, else None.
    """
    if not LINKEDIN_ACCESS_TOKEN:
        return None

    headers = {
        "Authorization": f"Bearer {LINKEDIN_ACCESS_TOKEN}",
        "X-Restli-Protocol-Version": "2.0.0",
    }

    # Try vanity name lookup (convert name to slug)
    slug = name.lower().strip().replace(" ", "-").replace(":", "")
    slug = re.sub(r"[^a-z0-9-]", "", slug)

    try:
        resp = requests.get(
            f"https://api.linkedin.com/v2/organizations?q=vanityName&vanityName={slug}",
            headers=headers,
            timeout=10,
        )
        if resp.status_code == 200:
            elements = resp.json().get("elements", [])
            if elements:
                org_id = elements[0].get("id")
                org_name = elements[0].get("localizedName", name)
                print(f"(tagged: {org_name})", end=" ", flush=True)
                return {"urn": f"urn:li:organization:{org_id}", "name": org_name}
    except Exception:
        pass

    return None


# Cache for LinkedIn org lookups (avoid repeated API calls)
_linkedin_org_cache = {}


def _get_linkedin_mention(charity_name):
    """Get LinkedIn mention info for a charity, with caching."""
    if charity_name in _linkedin_org_cache:
        return _linkedin_org_cache[charity_name]

    result = _resolve_linkedin_org(charity_name)
    _linkedin_org_cache[charity_name] = result
    return result


def _build_mention_attributes(text, mentions):
    """Build LinkedIn ugcPosts attributes array for @mentions.

    Args:
        text: The post text
        mentions: List of {"name": "Org Name", "urn": "urn:li:organization:123"}

    Returns:
        List of attribute dicts with start, length, value
    """
    attributes = []
    for mention in mentions:
        name = mention["name"]
        urn = mention["urn"]
        start = text.find(name)
        if start == -1:
            continue

        attr = {
            "start": start,
            "length": len(name),
            "value": {},
        }
        if "organization" in urn:
            attr["value"]["com.linkedin.common.CompanyAttributedEntity"] = {
                "company": urn
            }
        else:
            attr["value"]["com.linkedin.common.MemberAttributedEntity"] = {
                "member": urn
            }
        attributes.append(attr)

    return attributes


def post_to_linkedin(text, image_url=None, mentions=None):
    """Post to LinkedIn Company Page via v2 ugcPosts API.

    Uses v2 API instead of REST API to avoid dev tier character limit (400 chars).
    Requires:
    - LINKEDIN_ACCESS_TOKEN: OAuth2 token with w_organization_social scope
    - LINKEDIN_ORG_ID: LinkedIn Company Page ID

    Args:
        text: Post text content
        image_url: Optional URL to an image to attach
        mentions: Optional list of {"name": "Org Name", "urn": "urn:li:organization:123"}
                  to tag organizations in the post
    """
    if not LINKEDIN_ACCESS_TOKEN or not LINKEDIN_ORG_ID:
        return {"success": False, "error": "Missing LINKEDIN_ACCESS_TOKEN or LINKEDIN_ORG_ID in .env"}

    headers = {
        "Authorization": f"Bearer {LINKEDIN_ACCESS_TOKEN}",
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
    }

    author = f"urn:li:organization:{LINKEDIN_ORG_ID}"

    # Upload image if provided
    asset_urn = None
    if image_url:
        asset_urn = _upload_linkedin_image(image_url, author, headers)

    # Build mention attributes
    commentary = {"text": text}
    if mentions:
        attributes = _build_mention_attributes(text, mentions)
        if attributes:
            commentary["attributes"] = attributes

    # Build post body
    share_content = {
        "shareCommentary": commentary,
        "shareMediaCategory": "IMAGE" if asset_urn else "NONE",
    }
    if asset_urn:
        share_content["media"] = [{
            "status": "READY",
            "media": asset_urn,
        }]

    post_body = {
        "author": author,
        "lifecycleState": "PUBLISHED",
        "specificContent": {
            "com.linkedin.ugc.ShareContent": share_content,
        },
        "visibility": {"com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"},
    }

    try:
        resp = requests.post(
            "https://api.linkedin.com/v2/ugcPosts",
            headers=headers,
            json=post_body,
            timeout=30,
        )

        if resp.status_code in (200, 201):
            post_id = resp.json().get("id", "unknown")
            return {
                "success": True,
                "post_id": post_id,
                "platform": "linkedin",
                "page": "company",
            }
        else:
            error_detail = resp.text[:300]
            return {"success": False, "error": f"LinkedIn API error ({resp.status_code}): {error_detail}"}

    except Exception as e:
        return {"success": False, "error": str(e)}


def _upload_linkedin_image(image_url, author, headers):
    """Upload an image to LinkedIn via v2 assets API. Returns the asset URN."""
    try:
        # Step 1: Register upload via v2 assets
        reg_resp = requests.post(
            "https://api.linkedin.com/v2/assets?action=registerUpload",
            headers=headers,
            json={
                "registerUploadRequest": {
                    "recipes": ["urn:li:digitalmediaRecipe:feedshare-image"],
                    "owner": author,
                    "serviceRelationships": [
                        {"relationshipType": "OWNER", "identifier": "urn:li:userGeneratedContent"}
                    ],
                }
            },
            timeout=15,
        )

        if reg_resp.status_code != 200:
            print(f"(LinkedIn image register failed: {reg_resp.status_code})", end=" ", flush=True)
            return None

        reg_data = reg_resp.json().get("value", {})
        upload_url = reg_data.get("uploadMechanism", {}).get(
            "com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest", {}
        ).get("uploadUrl")
        asset_urn = reg_data.get("asset")

        if not upload_url or not asset_urn:
            return None

        # Step 2: Download the image from DALL-E URL
        img_resp = requests.get(image_url, timeout=30)
        if img_resp.status_code != 200:
            return None

        # Step 3: Upload to LinkedIn
        upload_resp = requests.put(
            upload_url,
            headers={
                "Authorization": f"Bearer {LINKEDIN_ACCESS_TOKEN}",
                "Content-Type": "image/jpeg",
            },
            data=img_resp.content,
            timeout=30,
        )

        if upload_resp.status_code in (200, 201):
            print("(image uploaded)", end=" ", flush=True)
            return asset_urn
        else:
            print(f"(LinkedIn image upload failed: {upload_resp.status_code})", end=" ", flush=True)
            return None

    except Exception as e:
        print(f"(LinkedIn image error: {e})", end=" ", flush=True)
        return None


# ── Auto-Posting Orchestrator ────────────────────────────────────────


def auto_post_linkedin_browser(calendar):
    """Assisted posting to LinkedIn Company Page.

    Copies each post to clipboard and opens the Company Page.
    User clicks 'Start a post', Ctrl+V to paste, then clicks 'Post'.

    Once the Community Management API is approved, this will be fully
    automated via the LinkedIn API (like personal profile posting).
    """
    import time
    import subprocess
    import pyperclip

    print("\n" + "=" * 70)
    print("  LINKEDIN COMPANY PAGE POSTING")
    print("=" * 70)

    company_url = "https://www.linkedin.com/company/112427523/admin/dashboard/"

    print(f"\n  Posts to publish: {len(calendar)}")
    print()
    print("  NOTE: Full auto-posting to Company Pages requires the")
    print("  Community Management API (pending approval). Until then,")
    print("  each post is copied to your clipboard automatically.")
    print()
    print("  For each post, you just need to:")
    print('    1. Click "Start a post" on the Company Page')
    print("    2. Press Ctrl+V to paste")
    print("    3. Click the Post button")
    print()

    # Open Company Page in default browser
    print("  Opening Company Page...", end=" ", flush=True)
    subprocess.Popen(
        ['cmd', '/c', 'start', '', company_url],
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL
    )
    time.sleep(3)
    print("Done")

    posted = 0

    for i, post in enumerate(calendar):
        day_num = post.get("day_number", i + 1)
        day_label = post.get("day", "")
        content_type = post.get("content_type", "").upper()

        li_text = post.get("linkedin_post", "")
        tags = post.get("suggested_hashtags_li", [])
        if tags and isinstance(tags, list):
            tag_str = " ".join(tags)
            if tag_str not in li_text:
                li_text += "\n\n" + tag_str

        # Copy to clipboard
        pyperclip.copy(li_text)

        print(f"\n  [{i+1}/{len(calendar)}] Day {day_num} ({day_label}) - {content_type}")
        print(f"    Copied to clipboard! ({len(li_text)} chars)")
        print(f'    -> Click "Start a post", Ctrl+V, then Post')

        try:
            if i < len(calendar) - 1:
                input("    Press Enter here when done to load the next post...")
            else:
                input("    Press Enter here when done...")
        except EOFError:
            # Non-interactive terminal — just pause between posts
            if i < len(calendar) - 1:
                print("    (Waiting 30s before next post — paste now!)")
                time.sleep(30)
        posted += 1

    print(f"\n{'=' * 70}")
    print(f"  Done! Published {posted}/{len(calendar)} posts to Company Page.")
    print(f"{'=' * 70}\n")


def auto_post_calendar(calendar, post_ig=True, post_li=True, post_all=False):
    """Post generated content to Instagram and/or LinkedIn.

    By default, only posts content scheduled for TODAY. Use post_all=True to
    post everything immediately (useful for demos or backfilling).
    Future posts are shown as an upcoming schedule.
    """
    import time

    results = {"instagram": [], "linkedin": []}
    today_str = datetime.now().strftime("%Y-%m-%d")

    # Split calendar into today's posts and future posts
    if post_all:
        todays_posts = calendar
        future_posts = []
    else:
        todays_posts = [p for p in calendar if p.get("scheduled_date") == today_str]
        future_posts = [p for p in calendar if p.get("scheduled_date") != today_str]

    # Validate credentials before starting
    if post_ig:
        if not META_ACCESS_TOKEN or not INSTAGRAM_ACCOUNT_ID:
            print("\n  WARNING: Instagram posting requires META_ACCESS_TOKEN and INSTAGRAM_ACCOUNT_ID in .env")
            print("  Skipping Instagram. See docs/demo-commands.md for setup instructions.")
            post_ig = False
        elif not OPENAI_API_KEY:
            print("\n  WARNING: Instagram requires images. Set OPENAI_API_KEY in .env for DALL-E generation.")
            print("  Skipping Instagram.")
            post_ig = False

    if post_li:
        if not LINKEDIN_ACCESS_TOKEN or not LINKEDIN_ORG_ID:
            print("\n  WARNING: LinkedIn posting requires LINKEDIN_ACCESS_TOKEN and LINKEDIN_ORG_ID in .env")
            print("  Skipping LinkedIn. See docs/demo-commands.md for setup instructions.")
            post_li = False

    if not post_ig and not post_li:
        print("\n  No posting credentials configured. Content generated but not posted.")
        print("  Add API tokens to .env to enable auto-posting.")
        return results

    # Post today's content
    if todays_posts:
        print("\n" + "=" * 70)
        print(f"  POSTING TODAY'S CONTENT ({len(todays_posts)} post{'s' if len(todays_posts) != 1 else ''})")
        print("=" * 70)

        for i, post in enumerate(todays_posts):
            day_num = post.get("day_number", i + 1)
            day_label = post.get("day", "")
            content_type = post.get("content_type", "").upper()
            post_time = post.get("scheduled_time", "")

            if content_type == "CAMPAIGN":
                content_type = "CAMPAIGN (LIVE)"

            print(f"\n  Post {day_num} ({day_label} @ {post_time}) - {content_type}")

            # Generate image
            image_url = None
            image_prompt = post.get("image_prompt")
            if (post_ig or post_li) and image_prompt and OPENAI_API_KEY:
                print(f"    Generating image with DALL-E...", end=" ", flush=True)
                image_url = generate_image(image_prompt)
                if image_url:
                    print("Done!")
                else:
                    print("Failed (will post without image)")

            # Post to Instagram
            if post_ig:
                caption = post.get("instagram_caption", "")
                tags = post.get("suggested_hashtags_ig", [])
                if tags and isinstance(tags, list):
                    tag_str = " ".join(tags)
                    if tag_str not in caption:
                        caption += "\n\n" + tag_str

                print(f"    Posting to Instagram...", end=" ", flush=True)
                ig_result = post_to_instagram(caption, image_url)
                if ig_result["success"]:
                    print(f"Posted! (media_id: {ig_result.get('media_id', 'N/A')})")
                    results["instagram"].append({"day": day_num, "success": True, "id": ig_result.get("media_id")})
                else:
                    print(f"Failed: {ig_result['error']}")
                    results["instagram"].append({"day": day_num, "success": False, "error": ig_result["error"]})

            # Post to LinkedIn
            if post_li:
                li_text = post.get("linkedin_post", "")
                tags = post.get("suggested_hashtags_li", [])
                if tags and isinstance(tags, list):
                    tag_str = " ".join(tags)
                    if tag_str not in li_text:
                        li_text += "\n\n" + tag_str

                # Resolve LinkedIn mentions for tagged charities
                mentions = []
                charity_name = post.get("charity_name")
                if charity_name and charity_name in li_text:
                    print(f"    Resolving LinkedIn tag for {charity_name}...", end=" ", flush=True)
                    org_info = _get_linkedin_mention(charity_name)
                    if org_info:
                        li_name = org_info["name"]
                        if li_name != charity_name and li_name not in li_text:
                            li_text = li_text.replace(charity_name, li_name, 1)
                        mentions.append(org_info)

                print(f"    Posting to LinkedIn...", end=" ", flush=True)
                li_result = post_to_linkedin(li_text, image_url, mentions=mentions or None)
                if li_result["success"]:
                    print(f"Posted! (post_id: {li_result.get('post_id', 'N/A')})")
                    results["linkedin"].append({"day": day_num, "success": True, "id": li_result.get("post_id")})
                else:
                    print(f"Failed: {li_result['error']}")
                    results["linkedin"].append({"day": day_num, "success": False, "error": li_result["error"]})

            if i < len(todays_posts) - 1:
                time.sleep(2)
    else:
        print("\n  No posts scheduled for today.")
        print(f"  Today ({datetime.now().strftime('%A')}) is not a posting day in the current schedule.")

    # Show upcoming schedule
    if future_posts:
        print(f"\n{'=' * 70}")
        print("  UPCOMING SCHEDULE")
        print(f"{'=' * 70}")
        for post in future_posts:
            ctype = post.get("content_type", "").upper()
            if ctype == "CAMPAIGN":
                ctype = "CAMPAIGN (LIVE)"
            charity = post.get("charity_name", "")
            charity_str = f" [{charity}]" if charity else ""
            print(f"  {post.get('scheduled_date')} ({post.get('day', '')}) @ {post.get('scheduled_time', '')} "
                  f"- {ctype}{charity_str}")
        print(f"\n  Run this script again on each posting day to auto-post.")
        print(f"  Tip: Set up Windows Task Scheduler to run at 9:00 AM ET on posting days.")

    # Summary
    posted_count = len(todays_posts)
    if posted_count > 0:
        print(f"\n{'=' * 70}")
        print("  POSTING SUMMARY")
        print(f"{'=' * 70}")
        if post_ig:
            ig_ok = sum(1 for r in results["instagram"] if r["success"])
            print(f"  Instagram: {ig_ok}/{len(results['instagram'])} posts published")
        if post_li:
            li_ok = sum(1 for r in results["linkedin"] if r["success"])
            print(f"  LinkedIn:  {li_ok}/{len(results['linkedin'])} posts published")
        print(f"{'=' * 70}\n")

    return results


# ── Main ─────────────────────────────────────────────────────────────


def main():
    phase = get_current_phase()
    default_posts = POSTING_PHASES[phase]["posts_per_week"]

    parser = argparse.ArgumentParser(
        description="GiveWiZe AI Social Media Content Generator",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=f"""
Examples:
  python social_media_generator.py                                    # {default_posts}-post week (auto-scheduled)
  python social_media_generator.py --category hunger-food-security    # themed
  python social_media_generator.py --charity "NCBRS Foundation"       # spotlight
  python social_media_generator.py --days 6 --category medical-health # 6 posts on optimal days
  python social_media_generator.py --post-li                          # generate + post today's to LinkedIn
  python social_media_generator.py --post-li --post-all               # generate + post ALL immediately
  python social_media_generator.py --post                             # generate + post today's to IG & LI

Current schedule: {POSTING_PHASES[phase]['label']}
        """,
    )
    parser.add_argument("--category", type=str, help="Focus on a specific category")
    parser.add_argument("--charity", type=str, help="Spotlight a specific charity by name")
    parser.add_argument("--days", type=int, default=None, help=f"Number of posts (default: {default_posts} per week)")
    parser.add_argument("--no-csv", action="store_true", help="Skip saving CSV file")
    parser.add_argument("--no-onboard", action="store_true", help="Skip auto-onboarding of missing charities")
    parser.add_argument("--post", action="store_true", help="Auto-post today's content to both IG and LinkedIn")
    parser.add_argument("--post-ig", action="store_true", help="Auto-post today's content to Instagram only")
    parser.add_argument("--post-li", action="store_true", help="Auto-post today's content to LinkedIn only")
    parser.add_argument("--post-all", action="store_true", help="Post ALL generated content now (not just today's)")
    parser.add_argument("--skip-today", action="store_true", help="Skip today and start schedule from next posting day")
    parser.add_argument("--open-li", action="store_true", help="Copy content to clipboard & open LinkedIn Company Page")
    args = parser.parse_args()

    print("\n  GiveWiZe Social Media Content Generator")
    print("  " + "─" * 40)

    # Fetch charity data
    print("\n  Connecting to Supabase...", end=" ", flush=True)
    if args.charity:
        charities = fetch_charities(charity_name=args.charity)
        if not charities:
            print(f"\n  ERROR: No charity found matching '{args.charity}'")
            sys.exit(1)
        print(f"Found {len(charities)} matching charities")
    elif args.category:
        if args.category not in CATEGORY_LABELS:
            print(f"\n  ERROR: Unknown category '{args.category}'")
            print(f"  Valid categories: {', '.join(sorted(CATEGORY_LABELS.keys()))}")
            sys.exit(1)
        charities = fetch_charities(category=args.category)
        if not charities:
            print(f"\n  ERROR: No charities found in category '{args.category}'")
            sys.exit(1)
        print(f"Found {len(charities)} charities in {CATEGORY_LABELS[args.category]}")
    else:
        charities = fetch_charities()
        print(f"Found {len(charities)} charities")

    all_charities = charities if not args.category else fetch_charities()

    # Auto-onboard charities if categories are underrepresented
    if not args.no_onboard:
        awareness_events = get_current_awareness_events(args.category)
        if awareness_events:
            gaps = detect_category_gaps(all_charities, awareness_events)
            if gaps:
                print(f"\n  Category gaps detected for this month's awareness events:")
                for g in gaps:
                    print(f"    - {g['label']}: {g['current_count']} charities (need {g['need']} more)")

                existing_eins = {c.get("ein") for c in all_charities if c.get("ein")}
                print(f"\n  Auto-onboarding charities to fill gaps...")
                onboarded = auto_onboard_charities(gaps, existing_eins)

                if onboarded:
                    print(f"\n  Successfully onboarded {len(onboarded)} new charities!")
                    # Re-fetch to include new charities
                    if args.category:
                        charities = fetch_charities(category=args.category)
                    else:
                        charities = fetch_charities()
                    all_charities = charities if not args.category else fetch_charities()
                    print(f"  Database now has {len(all_charities)} charities")
            else:
                print(f"\n  All awareness categories are well-covered!")

    # Generate content calendar
    num_posts = args.days if args.days else default_posts
    print(f"\n  Generating {num_posts}-post content calendar (with web enrichment)...")
    print("  (Each post takes ~3-5 seconds for AI generation)")

    calendar = build_content_calendar(
        charities=all_charities if not args.category else charities,
        days=args.days,
        category_focus=args.category,
        skip_today=args.skip_today,
    )

    # Output
    print_calendar(calendar)

    if not args.no_csv:
        save_csv(calendar)

    # Auto-post if requested
    should_post_ig = args.post or args.post_ig
    should_post_li = args.post or args.post_li

    if should_post_ig or should_post_li:
        auto_post_calendar(
            calendar,
            post_ig=should_post_ig,
            post_li=should_post_li,
            post_all=args.post_all,
        )

    # Automated LinkedIn Company Page posting (browser automation)
    if args.open_li:
        auto_post_linkedin_browser(calendar)

    print(f"  Done! Generated {len(calendar)} posts.\n")


if __name__ == "__main__":
    main()
