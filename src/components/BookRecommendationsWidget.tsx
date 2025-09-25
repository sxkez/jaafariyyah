"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  getAIRecommendations,
  type BookRecommendation,
} from "@/services/aiRecommendationService"; // new service

interface BookRecommendationsWidgetProps {
  currentCategory?: string;
  onBookSelect?: (bookId: string) => void;
}

export function BookRecommendationsWidget({
  currentCategory,
  onBookSelect,
}: BookRecommendationsWidgetProps) {
  const [recommendations, setRecommendations] = useState<BookRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    loadRecommendations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, currentCategory]);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);

      const recs = await getAIRecommendations(
        {
          user,
          category: currentCategory,
        },
        4
      );

      setRecommendations(recs);
    } catch (err) {
      console.error("Recommendation error:", err);
      setError("Unable to load recommendations");
    } finally {
      setLoading(false);
    }
  };

  const handleBookClick = (bookId: string) => {
    if (onBookSelect) onBookSelect(bookId);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "text-green-400";
      case "intermediate":
        return "text-yellow-400";
      case "advanced":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  if (loading) {
    return (
      <Card className="bg-green-950/30 border-green-700/40 backdrop-blur-sm">
        <CardContent className="p-6 flex items-center justify-center gap-3">
          <div className="animate-spin w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full"></div>
          <span className="text-gray-300">Fetching recommendations...</span>
        </CardContent>
      </Card>
    );
  }

  if (error || recommendations.length === 0) {
    return (
      <Card className="bg-green-950/30 border-green-700/40 backdrop-blur-sm">
        <CardContent className="p-6 text-center">
          <div className="text-4xl mb-2">🤖</div>
          <h3 className="text-lg font-semibold text-white mb-2">
            AI Recommendations
          </h3>
          <p className="text-gray-300 text-sm mb-4">
            {error || "No recommendations available at the moment"}
          </p>
          <Button
            onClick={loadRecommendations}
            variant="outline"
            size="sm"
            className="border-green-500 text-green-300 hover:bg-green-700/30"
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-green-950/30 border-green-700/40 backdrop-blur-sm">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-purple-700 rounded-full flex items-center justify-center">
              <span className="text-white text-lg">🤖</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                {isAuthenticated ? "Recommended for You" : "Popular Selections"}
              </h3>
              <p className="text-green-200 text-sm">
                {isAuthenticated
                  ? "AI-powered suggestions"
                  : "Trending in the community"}
              </p>
            </div>
          </div>
          <Button
            onClick={loadRecommendations}
            variant="ghost"
            size="sm"
            className="text-green-300 hover:text-white"
          >
            🔄
          </Button>
        </div>

        {/* Recommendations */}
        <div className="space-y-4">
          {recommendations.map((rec) => (
            <div
              key={rec.bookId}
              onClick={() => handleBookClick(rec.bookId)}
              className="flex items-start gap-3 p-3 rounded-lg bg-green-900/20 hover:bg-green-900/30 cursor-pointer transition-colors"
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
                <p className="text-green-300 text-xs mb-2">{rec.reason}</p>

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
          <div className="mt-6 pt-4 border-t border-green-700/40 text-center">
            <p className="text-gray-400 text-xs mb-2">
              Recommendations improve as you read more
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="text-green-300 hover:text-white text-xs"
            >
              ⚙️ Customize Preferences
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* --- Quick Recommendation Snippet --- */
export function QuickRecommendation() {
  const [rec, setRec] = useState<BookRecommendation | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const loadQuick = async () => {
      try {
        const quick = await getAIRecommendations(
          { user, category: undefined },
          1
        );
        if (quick.length > 0) setRec(quick[0]);
      } catch (err) {
        console.error("Quick recommendation error:", err);
      }
    };
    loadQuick();
  }, [user]);

  if (!rec) return null;

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-green-400">📖</span>
      <span className="text-white">{rec.title}</span>
      <span className="text-gray-400">recommended</span>
    </div>
  );
}
