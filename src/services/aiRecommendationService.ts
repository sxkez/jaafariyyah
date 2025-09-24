// AI-powered book recommendation service for Al Hanafiyya
export interface BookRecommendation {
  bookId: string;
  title: string;
  author: string;
  reason: string;
  confidence: number; // 0-1 scale
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  readingTime: string;
  cover: string;
}

export interface UserPreferences {
  categories: string[];
  languages: string[];
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced' | 'mixed';
  readingHistory: string[];
  bookmarks: string[];
  searchHistory: string[];
  timeSpent: Record<string, number>; // category -> minutes
}

export interface RecommendationContext {
  currentBook?: string;
  currentCategory?: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  sessionType: 'quick_read' | 'deep_study' | 'casual_browse';
}

/**
 * Advanced AI recommendation engine using multiple factors
 */
export class AIRecommendationEngine {
  private static instance: AIRecommendationEngine;

  static getInstance(): AIRecommendationEngine {
    if (!this.instance) {
      this.instance = new AIRecommendationEngine();
    }
    return this.instance;
  }

  /**
   * Get personalized book recommendations based on user profile
   */
  async getRecommendations(
    userPreferences: UserPreferences,
    context: RecommendationContext,
    limit: number = 5
  ): Promise<BookRecommendation[]> {
    try {
      // In a real implementation, this would call an AI service like OpenAI, Claude, or a custom ML model
      // For now, we'll use sophisticated rule-based recommendations

      const recommendations = this.generateSmartRecommendations(
        userPreferences,
        context,
        limit
      );

      return recommendations;
    } catch (error) {
      console.error('Failed to get AI recommendations:', error);
      return this.getFallbackRecommendations(limit);
    }
  }

  /**
   * Generates intelligent recommendations using multiple algorithms
   */
  private generateSmartRecommendations(
    prefs: UserPreferences,
    context: RecommendationContext,
    limit: number
  ): BookRecommendation[] {
    const allBooks = this.getBookDatabase();

    // Apply multiple recommendation strategies
    const contentBased = this.contentBasedFiltering(allBooks, prefs);
    const collaborative = this.collaborativeFiltering(allBooks, prefs);
    const contextual = this.contextualFiltering(allBooks, context);
    const trending = this.getTrendingBooks(allBooks);

    // Combine and weight recommendations
    const combined = this.combineRecommendations([
      { recommendations: contentBased, weight: 0.4 },
      { recommendations: collaborative, weight: 0.3 },
      { recommendations: contextual, weight: 0.2 },
      { recommendations: trending, weight: 0.1 }
    ]);

    // Remove already read books
    const filtered = combined.filter(rec =>
      !prefs.readingHistory.includes(rec.bookId)
    );

    // Sort by confidence and return top results
    return filtered
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, limit);
  }

  /**
   * Content-based filtering: Recommend books similar to user's preferences
   */
  private contentBasedFiltering(
    books: any[],
    prefs: UserPreferences
  ): BookRecommendation[] {
    return books
      .filter(book => {
        // Filter by preferred categories
        const categoryMatch = prefs.categories.length === 0 ||
          prefs.categories.includes(book.category);

        // Filter by preferred languages
        const languageMatch = prefs.languages.length === 0 ||
          prefs.languages.includes(book.language);

        // Filter by difficulty level
        const difficultyMatch = prefs.difficultyLevel === 'mixed' ||
          this.getDifficulty(book) === prefs.difficultyLevel;

        return categoryMatch && languageMatch && difficultyMatch;
      })
      .map(book => ({
        bookId: book.id.toString(),
        title: book.title,
        author: book.author,
        reason: this.generateContentReason(book, prefs),
        confidence: this.calculateContentConfidence(book, prefs),
        category: book.category,
        difficulty: this.getDifficulty(book),
        readingTime: this.estimateReadingTime(book),
        cover: book.cover
      }));
  }

  /**
   * Collaborative filtering: Recommend books liked by similar users
   */
  private collaborativeFiltering(
    books: any[],
    prefs: UserPreferences
  ): BookRecommendation[] {
    // Simulate collaborative filtering based on reading patterns
    const similarUserBooks = this.findSimilarUserBooks(prefs);

    return books
      .filter(book => similarUserBooks.includes(book.id.toString()))
      .map(book => ({
        bookId: book.id.toString(),
        title: book.title,
        author: book.author,
        reason: "Readers with similar interests loved this book",
        confidence: 0.7 + Math.random() * 0.2,
        category: book.category,
        difficulty: this.getDifficulty(book),
        readingTime: this.estimateReadingTime(book),
        cover: book.cover
      }));
  }

  /**
   * Contextual filtering: Recommend based on current context
   */
  private contextualFiltering(
    books: any[],
    context: RecommendationContext
  ): BookRecommendation[] {
    return books
      .filter(book => {
        if (context.sessionType === 'quick_read') {
          return this.getReadingTimeMinutes(book) < 60;
        }
        if (context.sessionType === 'deep_study') {
          return ['jurisprudence', 'creed', 'usul'].includes(book.category);
        }
        return true;
      })
      .map(book => ({
        bookId: book.id.toString(),
        title: book.title,
        author: book.author,
        reason: this.generateContextReason(book, context),
        confidence: 0.6 + Math.random() * 0.3,
        category: book.category,
        difficulty: this.getDifficulty(book),
        readingTime: this.estimateReadingTime(book),
        cover: book.cover
      }));
  }

  /**
   * Get trending books based on community activity
   */
  private getTrendingBooks(books: any[]): BookRecommendation[] {
    // Simulate trending based on category popularity and ratings
    const trendingCategories = ['jurisprudence', 'creed', 'hadith'];

    return books
      .filter(book => trendingCategories.includes(book.category))
      .filter(book => book.rating >= 4)
      .map(book => ({
        bookId: book.id.toString(),
        title: book.title,
        author: book.author,
        reason: "Trending in the Al Hanafiyya community",
        confidence: 0.5 + (book.rating - 4) * 0.2,
        category: book.category,
        difficulty: this.getDifficulty(book),
        readingTime: this.estimateReadingTime(book),
        cover: book.cover
      }));
  }

  /**
   * Combines multiple recommendation sources with weights
   */
  private combineRecommendations(
    sources: Array<{ recommendations: BookRecommendation[]; weight: number }>
  ): BookRecommendation[] {
    const combined = new Map<string, BookRecommendation>();

    sources.forEach(({ recommendations, weight }) => {
      recommendations.forEach(rec => {
        const existing = combined.get(rec.bookId);
        if (existing) {
          // Boost confidence for books appearing in multiple sources
          existing.confidence = Math.min(1, existing.confidence + (rec.confidence * weight * 0.5));
        } else {
          combined.set(rec.bookId, {
            ...rec,
            confidence: rec.confidence * weight
          });
        }
      });
    });

    return Array.from(combined.values());
  }

  // Helper methods
  private generateContentReason(book: any, prefs: UserPreferences): string {
    if (prefs.categories.includes(book.category)) {
      return `Matches your interest in ${book.category}`;
    }
    if (prefs.languages.includes(book.language)) {
      return `Available in your preferred language (${book.language})`;
    }
    return "Highly rated classical text";
  }

  private generateContextReason(book: any, context: RecommendationContext): string {
    if (context.sessionType === 'quick_read') {
      return "Perfect for a quick study session";
    }
    if (context.sessionType === 'deep_study') {
      return "Excellent for deep scholarly study";
    }
    if (context.timeOfDay === 'morning') {
      return "Great way to start your day with knowledge";
    }
    return "Recommended for your current session";
  }

  private calculateContentConfidence(book: any, prefs: UserPreferences): number {
    let confidence = 0.5;

    if (prefs.categories.includes(book.category)) confidence += 0.2;
    if (prefs.languages.includes(book.language)) confidence += 0.1;
    if (book.rating >= 4.5) confidence += 0.1;
    if (prefs.timeSpent[book.category] > 30) confidence += 0.1;

    return Math.min(1, confidence);
  }

  private getDifficulty(book: any): 'beginner' | 'intermediate' | 'advanced' {
    if (book.tags.includes('Beginner') || book.tags.includes('Primer')) {
      return 'beginner';
    }
    if (book.tags.includes('Classical') || book.tags.includes('Reference')) {
      return 'advanced';
    }
    return 'intermediate';
  }

  private estimateReadingTime(book: any): string {
    const minutes = this.getReadingTimeMinutes(book);
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.round(minutes / 60);
    return `${hours}h`;
  }

  private getReadingTimeMinutes(book: any): number {
    // Estimate based on category and tags
    if (book.tags.includes('Primer')) return 45;
    if (book.tags.includes('Reference')) return 180;
    if (book.category === 'hadith') return 120;
    return 90;
  }

  private findSimilarUserBooks(prefs: UserPreferences): string[] {
    // Simulate finding books liked by similar users
    // In reality, this would use collaborative filtering algorithms
    return ['1', '3', '5', '7', '9']; // Mock similar user preferences
  }

  private getBookDatabase(): any[] {
    // This would typically come from a database
    // For now, return mock data matching our books
    return [
      {
        id: 1,
        title: "Al-'Aqida al-Tahawiyya",
        author: "Imam Abu Ja'far al-Tahawi",
        category: "creed",
        language: "AR",
        rating: 5,
        tags: ["Aqidah", "Creed", "Hanafi", "Classical"],
        cover: "https://ext.same-assets.com/4138622892/2402292075.png"
      },
      // ... other books would be here
    ];
  }

  private getFallbackRecommendations(limit: number): BookRecommendation[] {
    return [
      {
        bookId: "1",
        title: "Al-'Aqida al-Tahawiyya",
        author: "Imam Abu Ja'far al-Tahawi",
        reason: "Essential Hanafi creed text",
        confidence: 0.9,
        category: "creed",
        difficulty: "intermediate" as const,
        readingTime: "1h 30m",
        cover: "https://ext.same-assets.com/4138622892/2402292075.png"
      }
    ].slice(0, limit);
  }
}

/**
 * Get user preferences from various sources
 */
export async function getUserPreferences(userId: string): Promise<UserPreferences> {
  try {
    // In reality, this would fetch from user profile, analytics, etc.
    const stored = localStorage.getItem(`user-preferences-${userId}`);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load user preferences:', error);
  }

  // Return default preferences
  return {
    categories: [],
    languages: ['EN'],
    difficultyLevel: 'mixed',
    readingHistory: [],
    bookmarks: [],
    searchHistory: [],
    timeSpent: {}
  };
}

/**
 * Update user preferences based on actions
 */
export function updateUserPreferences(
  userId: string,
  updates: Partial<UserPreferences>
): void {
  try {
    const current = getUserPreferences(userId);
    const updated = { ...current, ...updates };
    localStorage.setItem(`user-preferences-${userId}`, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to update user preferences:', error);
  }
}

/**
 * Track user interaction for improving recommendations
 */
export async function trackUserInteraction(
  userId: string,
  interaction: {
    type: 'book_view' | 'book_read' | 'bookmark' | 'search' | 'category_browse';
    bookId?: string;
    category?: string;
    query?: string;
    duration?: number;
  }
): Promise<void> {
  try {
    // Track interaction for improving future recommendations
    const prefs = await getUserPreferences(userId);

    switch (interaction.type) {
      case 'book_read':
        if (interaction.bookId && !prefs.readingHistory.includes(interaction.bookId)) {
          prefs.readingHistory.push(interaction.bookId);
        }
        break;
      case 'bookmark':
        if (interaction.bookId && !prefs.bookmarks.includes(interaction.bookId)) {
          prefs.bookmarks.push(interaction.bookId);
        }
        break;
      case 'search':
        if (interaction.query) {
          prefs.searchHistory.push(interaction.query);
        }
        break;
      case 'category_browse':
        if (interaction.category && interaction.duration) {
          prefs.timeSpent[interaction.category] =
            (prefs.timeSpent[interaction.category] || 0) + interaction.duration;
        }
        break;
    }

    updateUserPreferences(userId, prefs);
  } catch (error) {
    console.error('Failed to track user interaction:', error);
  }
}
