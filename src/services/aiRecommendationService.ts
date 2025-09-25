// src/services/aiRecommendationService.ts

// --- Interfaces ---
export interface BookRecommendation {
  bookId: string;
  title: string;
  author: string;
  reason: string;
  confidence: number; // 0–1 scale
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  readingTime: string;
  cover: string;
}

export interface UserPreferences {
  categories: string[];
  languages: string[];
  difficultyLevel: "beginner" | "intermediate" | "advanced" | "mixed";
  readingHistory: string[];
  bookmarks: string[];
  searchHistory: string[];
  timeSpent: Record<string, number>; // category → minutes
}

export interface RecommendationContext {
  currentBook?: string;
  currentCategory?: string;
  timeOfDay: "morning" | "afternoon" | "evening" | "night";
  sessionType: "quick_read" | "deep_study" | "casual_browse";
}

// --- Engine ---
export class AIRecommendationEngine {
  private static instance: AIRecommendationEngine;

  static getInstance(): AIRecommendationEngine {
    if (!this.instance) {
      this.instance = new AIRecommendationEngine();
    }
    return this.instance;
  }

  /**
   * Main API to get recommendations
   */
  async getRecommendations(
    prefs: UserPreferences,
    context: RecommendationContext,
    limit: number = 5
  ): Promise<BookRecommendation[]> {
    try {
      const allBooks = this.getBookDatabase();

      // Very simple rule-based filtering for now
      let recs = allBooks.map((book) => ({
        bookId: book.id.toString(),
        title: book.title,
        author: book.author,
        reason: `Matches your interest in ${book.category}`,
        confidence: Math.random(), // Fake confidence for demo
        category: book.category,
        difficulty: this.getDifficulty(book),
        readingTime: this.estimateReadingTime(book),
        cover: book.cover,
      }));

      // Filter out already read
      recs = recs.filter((rec) => !prefs.readingHistory.includes(rec.bookId));

      // Sort by confidence
      return recs.sort((a, b) => b.confidence - a.confidence).slice(0, limit);
    } catch (err) {
      console.error("AI recommendations failed:", err);
      return this.getFallbackRecommendations(limit);
    }
  }

  // --- Helpers ---
  private getBookDatabase(): any[] {
    return [
      {
        id: 1,
        title: "Al-Kāfī (Uṣūl al-Kāfī)",
        author: "Shaykh al-Kulaynī (d. 329 AH)",
        category: "Hadith",
        language: "AR",
        rating: 5,
        tags: ["Classical", "Hadith", "Ahl al-Bayt"],
        cover: "https://images.arabicbookshop.net/132-313.jpg",
      },
      {
        id: 2,
        title: "Man Lā Yaḥḍuruhu al-Faqīh",
        author: "Shaykh al-Ṣadūq",
        category: "Fiqh",
        language: "AR",
        rating: 4.5,
        tags: ["Classical", "Fiqh"],
        cover: "https://example.com/fiqh.jpg",
      },
    ];
  }

  private getDifficulty(book: any): "beginner" | "intermediate" | "advanced" {
    if (book.tags.includes("Beginner")) return "beginner";
    if (book.tags.includes("Classical")) return "advanced";
    return "intermediate";
  }

  private estimateReadingTime(book: any): string {
    if (book.tags.includes("Primer")) return "45m";
    if (book.tags.includes("Reference")) return "3h";
    return "1h 30m";
  }

  private getFallbackRecommendations(limit: number): BookRecommendation[] {
    return [
      {
        bookId: "1",
        title: "Al-Kāfī (Uṣūl al-Kāfī)",
        author: "Shaykh al-Kulaynī",
        reason: "Essential Shi'i Hadith text",
        confidence: 0.9,
        category: "Hadith",
        difficulty: "intermediate",
        readingTime: "1h 30m",
        cover: "https://images.arabicbookshop.net/132-313.jpg",
      },
    ].slice(0, limit);
  }
}

// --- User Preference Helpers ---
export async function getUserPreferences(userId: string): Promise<UserPreferences> {
  try {
    const stored = localStorage.getItem(`user-preferences-${userId}`);
    if (stored) return JSON.parse(stored);
  } catch (err) {
    console.error("Failed to load prefs:", err);
  }
  return {
    categories: [],
    languages: ["EN"],
    difficultyLevel: "mixed",
    readingHistory: [],
    bookmarks: [],
    searchHistory: [],
    timeSpent: {},
  };
}

export function updateUserPreferences(
  userId: string,
  updates: Partial<UserPreferences>
): void {
  try {
    const current = localStorage.getItem(`user-preferences-${userId}`);
    const parsed = current ? JSON.parse(current) : {};
    const updated = { ...parsed, ...updates };
    localStorage.setItem(`user-preferences-${userId}`, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to update prefs:", err);
  }
}

export async function trackUserInteraction(
  userId: string,
  interaction: {
    type: "book_view" | "book_read" | "bookmark" | "search" | "category_browse";
    bookId?: string;
    category?: string;
    query?: string;
    duration?: number;
  }
): Promise<void> {
  try {
    const prefs = await getUserPreferences(userId);
    switch (interaction.type) {
      case "book_read":
        if (interaction.bookId && !prefs.readingHistory.includes(interaction.bookId)) {
          prefs.readingHistory.push(interaction.bookId);
        }
        break;
      case "bookmark":
        if (interaction.bookId && !prefs.bookmarks.includes(interaction.bookId)) {
          prefs.bookmarks.push(interaction.bookId);
        }
        break;
      case "search":
        if (interaction.query) prefs.searchHistory.push(interaction.query);
        break;
      case "category_browse":
        if (interaction.category && interaction.duration) {
          prefs.timeSpent[interaction.category] =
            (prefs.timeSpent[interaction.category] || 0) + interaction.duration;
        }
        break;
    }
    updateUserPreferences(userId, prefs);
  } catch (err) {
    console.error("Failed to track interaction:", err);
  }
}
