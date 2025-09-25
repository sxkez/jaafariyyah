"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface Topic {
  term: string;
  arabic: string;
  description: string;
  scans?: { img: string; caption: string; context: string }[];
}

export default function TopicViewer({ topic }: { topic: Topic }) {
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const router = useRouter();

  const handleNext = () => {
    if (currentIndex !== null && topic.scans && currentIndex < topic.scans.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex !== null && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-emerald-950 to-black text-white px-6 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <Button
          onClick={() => router.push("/scans")}
          className="bg-green-700 hover:bg-green-600 text-white"
        >
          ← Back to Scans
        </Button>
        <div className="text-center flex-1">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {topic.term} • {topic.arabic}
          </h1>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            {topic.description}
          </p>
        </div>
      </div>

      {/* Scans Grid */}
      {topic.scans && topic.scans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topic.scans.map((scan, idx) => (
            <div
              key={idx}
              className="bg-green-900/30 border border-green-700/30 rounded-lg p-4 hover:bg-green-900/50 transition cursor-pointer transform-gpu transition-transform duration-200 hover:scale-[1.03]"
              onClick={() => setCurrentIndex(idx)}
            >
              <img
                src={scan.img}
                alt={scan.caption}
                className="rounded-lg mb-4 transition-transform duration-200 hover:scale-105"
              />
              <p className="text-sm text-gray-200 font-semibold mb-2">
                {scan.caption}
              </p>
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                📖 View
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400 italic">
          Scans coming soon for this topic.
        </p>
      )}

      {/* Modal */}
      {currentIndex !== null && topic.scans && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
          <div className="bg-green-950 border border-green-700 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-green-700">
              <h2 className="text-lg font-semibold text-white">
                {topic.scans[currentIndex].caption}
              </h2>
              <button
                onClick={() => setCurrentIndex(null)}
                className="text-gray-400 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-4 text-center">
              <img
                src={topic.scans[currentIndex].img}
                alt={topic.scans[currentIndex].caption}
                className="rounded-lg mb-4 max-h-[60vh] mx-auto"
              />
              <p className="text-gray-300 text-sm leading-relaxed">
                {topic.scans[currentIndex].context}
              </p>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center p-4 border-t border-green-700">
              <Button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="bg-green-700 hover:bg-green-600 text-white disabled:opacity-50"
              >
                ⬅ Previous
              </Button>
              <Button
                onClick={handleNext}
                disabled={currentIndex === topic.scans.length - 1}
                className="bg-green-700 hover:bg-green-600 text-white disabled:opacity-50"
              >
                Next ➡
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
