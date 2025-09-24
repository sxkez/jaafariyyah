"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  AIRecommendationEngine,
  getUserPreferences,
  trackUserInteraction,
  type BookRecommendation
} from '@/services/aiRecommendationService';

interface BookRecommendationsWidgetProps {
  currentCategory?: string;
  onBookSelect?: (bookId: string) => void;
}

export function BookRecommendationsWidget({
  currentCategory,
  onBookSelect
}: BookRecommendationsWidgetProps) {
  const [recommendations, setRecommendations] = useState<BookRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    loadRecommendations();
  }, [user, currentCategory]);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);

      const engine = AIRecommendationEngine.getInstance();

      // Get user preferences or use defaults
      const preferences = user
        ? await getUserPreferences(user.email)
        : {
            categories: currentCategory ? [currentCategory] : [],
            languages: ['EN'],
            difficultyLevel: 'mixed' as const,
            readingHistory: [],
            bookmarks: [],
            searchHistory: [],
            timeSpent: {}
          };

      // Determine context
      const context = {
        currentCategory,
        timeOfDay: getTimeOfDay(),
        sessionType: 'casual_browse' as const
      };

      const recs = await engine.getRecommendations(preferences, context, 4);
      setRecommendations(recs);

      // Track this interaction
      if (user && currentCategory) {
        trackUserInteraction(user.email, {
          type: 'category_browse',
          category: currentCategory,
          duration: 30 // Assume 30 seconds for viewing recommendations
        }).catch(console.error);
      }
    } catch (err) {
      console.error('Failed to load recommendations:', err);
      setError('Unable to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  const handleBookClick = (bookId: string) => {
    if (user) {
      trackUserInteraction(user.email, {
        type: 'book_view',
        bookId
      }).catch(console.error);
    }

    if (onBookSelect) {
      onBookSelect(bookId);
    }
  };

  const getTimeOfDay = (): 'morning' | 'afternoon' | 'evening' | 'night' => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    if (hour < 21) return 'evening';
    return 'night';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400';
      case 'intermediate': return 'text-yellow-400';
      case 'advanced': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  if (loading) {
    return (
      <Card className="bg-purple-900/30 border-purple-600/30 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full"></div>
            <span className="ml-3 text-gray-300">Getting recommendations...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || recommendations.length === 0) {
    return (
      <Card className="bg-purple-900/30 border-purple-600/30 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="text-4xl mb-2">🤖</div>
            <h3 className="text-lg font-semibold text-white mb-2">AI Recommendations</h3>
            <p className="text-gray-300 text-sm mb-4">
              {error || "No recommendations available at the moment"}
            </p>
            <Button
              onClick={loadRecommendations}
              variant="outline"
              size="sm"
              className="border-purple-400 text-purple-300 hover:bg-purple-500/20"
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-purple-900/30 border-purple-600/30 backdrop-blur-sm">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-lg">🤖</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                {isAuthenticated ? 'Recommended for You' : 'Popular Selections'}
              </h3>
              <p className="text-purple-200 text-sm">
                {isAuthenticated ? 'AI-powered recommendations' : 'Trending in the community'}
              </p>
            </div>
          </div>
          <Button
            onClick={loadRecommendations}
            variant="ghost"
            size="sm"
            className="text-purple-300 hover:text-white"
          >
            🔄
          </Button>
        </div>

        {/* Recommendations */}
        <div className="space-y-4">
          {recommendations.map((rec) => (
            <div
              key={rec.bookId}
              className="flex items-start gap-3 p-3 rounded-lg bg-purple-800/20 hover:bg-purple-800/30 cursor-pointer transition-colors"
              onClick={() => handleBookClick(rec.bookId)}
            >
              <img
                src={rec.cover}
                alt={rec.title}
                className="w-12 h-16 object-cover rounded"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-medium text-sm line-clamp-1 mb-1">
                  {rec.title}
                </h4>
                <p className="text-gray-400 text-xs mb-1">{rec.author}</p>
                <p className="text-purple-300 text-xs mb-2">{rec.reason}</p>

                <div className="flex items-center gap-2 text-xs">
                  <span className={`${getDifficultyColor(rec.difficulty)} capitalize`}>
                    {rec.difficulty}
                  </span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-400">{rec.readingTime}</span>
                  <span className="text-gray-500">•</span>
                  <span className="text-green-400">
                    {Math.round(rec.confidence * 100)}% match
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        {isAuthenticated && (
          <div className="mt-6 pt-4 border-t border-purple-600/30 text-center">
            <p className="text-gray-400 text-xs mb-2">
              Recommendations improve as you read more books
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="text-purple-300 hover:text-white text-xs"
            >
              ⚙️ Customize Preferences
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Simple recommendation indicator for other pages
export function QuickRecommendation() {
  const [recommendation, setRecommendation] = useState<BookRecommendation | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const loadQuickRec = async () => {
      try {
        const engine = AIRecommendationEngine.getInstance();
        const preferences = user
          ? await getUserPreferences(user.email)
          : {
              categories: [],
              languages: ['EN'],
              difficultyLevel: 'mixed' as const,
              readingHistory: [],
              bookmarks: [],
              searchHistory: [],
              timeSpent: {}
            };

        const context = {
          timeOfDay: 'morning' as const,
          sessionType: 'quick_read' as const
        };

        const recs = await engine.getRecommendations(preferences, context, 1);
        if (recs.length > 0) {
          setRecommendation(recs[0]);
        }
      } catch (error) {
        console.error('Failed to load quick recommendation:', error);
      }
    };

    loadQuickRec();
  }, [user]);

  if (!recommendation) return null;

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-blue-400">📖</span>
      <span className="text-white">{recommendation.title}</span>
      <span className="text-gray-400">recommended</span>
    </div>
  );
}
