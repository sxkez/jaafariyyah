// services/recommendationService.ts

export interface BookRecommendation {
  bookId: string;
  title: string;
  author: string;
  cover: string;
  reason: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  readingTime: string;
  confidence: number; // 0–1
}

interface RecommendationContext {
  user?: { email: string; name: string };
  category?: string;
}

/**
 * Main entry point – get AI (or fallback) book recommendations.
 * @param context – user & browsing context
 * @param count – how many recs to return
 */
export async function getAIRecommendations(
  context: RecommendationContext,
  count: number = 4
): Promise<BookRecommendation[]> {
  try {
    // In the future, you can swap this out with:
    // 1. OpenAI API call (embedding + reasoning)
    // 2. Firebase Firestore query for trending books
    // For now → rule-based / mocked
    return await getRuleBasedRecommendations(context, count);
  } catch (err) {
    console.error("AI recommendation fallback:", err);
    return getFallbackRecommendations(count);
  }
}

/* --------------------------
   RULE-BASED RECOMMENDER
--------------------------- */
async function getRuleBasedRecommendations(
  context: RecommendationContext,
  count: number
): Promise<BookRecommendation[]> {
  const { category } = context;

  // Example dataset – replace with Firestore/DB later
  const books: BookRecommendation[] = [
    {
      bookId: "1",
      title: "Al-Kāfī, Vol. 1",
      author: "Shaykh al-Kulaynī",
      cover: "/covers/alkafi1.jpg",
      reason: "Foundational ḥadīth collection for Shi‘i theology.",
      difficulty: "advanced",
      readingTime: "20+ hrs",
      confidence: 0.95,
    },
    {
      bookId: "2",
      title: "Nahj al-Balāgha",
      author: "Attributed to Imām ‘Alī (a)",
      cover: "/covers/nahj.jpg",
      reason: "Seminal collection of sermons, letters, and wisdoms.",
      difficulty: "intermediate",
      readingTime: "15 hrs",
      confidence: 0.9,
    },
    {
      bookId: "3",
      title: "Ṣaḥīfa al-Sajjādiyya",
      author: "Imām Zayn al-‘Ābidīn (a)",
      cover: "/covers/sahifa.jpg",
      reason: "Spiritual supplications, called ‘The Psalms of Islam’.",
      difficulty: "beginner",
      readingTime: "6 hrs",
      confidence: 0.88,
    },
    {
      bookId: "4",
      title: "Tafsīr al-Mīzān",
      author: "‘Allāma Ṭabāṭabā’ī",
      cover: "/covers/mizan.jpg",
      reason: "A deep philosophical and linguistic exegesis.",
      difficulty: "advanced",
      readingTime: "50+ hrs",
      confidence: 0.93,
    },
    {
      bookId: "5",
      title: "Fiqh al-‘Ibādāt",
      author: "Contemporary Marja‘",
      cover: "/covers/fiqh.jpg",
      reason: "Practical manual of Ja‘farī jurisprudence.",
      difficulty: "intermediate",
      readingTime: "12 hrs",
      confidence: 0.82,
    },
  ];

  // Filter by category if present
  let filtered = books;
  if (category) {
    filtered = books.filter((b) =>
      category.toLowerCase().includes("fiqh")
        ? b.title.toLowerCase().includes("fiqh")
        : category.toLowerCase().includes("hadith")
        ? b.reason.toLowerCase().includes("ḥadīth")
        : true
    );
  }

  // Randomize and trim
  const shuffled = filtered.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

/* --------------------------
   FALLBACK RECOMMENDER
--------------------------- */
function getFallbackRecommendations(count: number): BookRecommendation[] {
  const defaults: BookRecommendation[] = [
    {
      bookId: "fallback-1",
      title: "Shi‘i Essentials",
      author: "Various Scholars",
      cover: "/covers/default.jpg",
      reason: "Starter collection across fiqh, theology, and spirituality.",
      difficulty: "beginner",
      readingTime: "5 hrs",
      confidence: 0.6,
    },
  ];

  return Array(count).fill(defaults[0]).map((rec, i) => ({
    ...rec,
    bookId: `${rec.bookId}-${i}`,
  }));
}
