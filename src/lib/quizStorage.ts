import { supabase } from "@/integrations/supabase/client";

const PROGRESS_KEY = "givewize-quiz-progress";
const RESULTS_KEY = "givewize-quiz-results";
const STALE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export interface StoredQuizResults {
  answers: Record<string, string | string[] | number>;
  tier: 1 | 2 | 3;
  matchedCharityIds: string[];
  timestamp: number;
}

export function loadQuizResults(): StoredQuizResults | null {
  try {
    const raw = localStorage.getItem(RESULTS_KEY);
    if (!raw) return null;
    const parsed: StoredQuizResults = JSON.parse(raw);
    if (!parsed || !parsed.answers || !parsed.tier) return null;
    if (Date.now() - parsed.timestamp > STALE_MS) {
      localStorage.removeItem(RESULTS_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function saveQuizResults(
  answers: Record<string, string | string[] | number>,
  tier: 1 | 2 | 3,
  matchedCharityIds: string[],
): void {
  const data: StoredQuizResults = {
    answers,
    tier,
    matchedCharityIds,
    timestamp: Date.now(),
  };
  localStorage.setItem(RESULTS_KEY, JSON.stringify(data));
}

export function clearQuizResults(): void {
  localStorage.removeItem(RESULTS_KEY);
  localStorage.removeItem(PROGRESS_KEY);
}

export async function migrateQuizResults(userId: string, supa = supabase): Promise<void> {
  try {
    const stored = loadQuizResults();
    if (!stored) return;

    await supa.from("user_quiz_results").insert({
      user_id: userId,
      answers: stored.answers as any,
      matched_charity_ids: stored.matchedCharityIds,
    });

    clearQuizResults();
  } catch {
    // silently ignore migration errors
  }
}
