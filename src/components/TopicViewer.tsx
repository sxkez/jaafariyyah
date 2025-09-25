"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScanTopic } from "@/data/scanTopics";

export default function TopicViewer({ topic }: { topic: ScanTopic }) {
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  const handleNext = () => {
    if (currentIndex !== null && topic.scans && currentIndex < topic.scans.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex !== null && topic.scans && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-emerald-950 to-black text-white px-6 py-12">
      {/* Title */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          {topic.title || `${topic.term} • ${topic.arabic}`}
        </h1>
        <p className="text-gray-300 text-lg max-w-3xl mx-auto">
          {topic.description}
        </p>
      </div>

      {/* Scans grid */}
      {topic.scans?.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topic.scans.map((scan, idx) => (
            <div
              key={idx}
              className="bg-green-900/30 border border-green-700/30 rounded-lg p-4 hover:bg-green-900/50 transition"
            >
              <img
                src={scan.img}
                alt={scan.caption}
                className="rounded-lg mb-4 cursor-pointer"
                onClick={() => setCurrentIndex(idx)}
              />
              <p className="text-sm text-gray-200 font-semibold mb-2">{scan.caption}</p>
              <Button
                onClick={() => setCurrentIndex(idx)}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                📖 View
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-center italic">
          No scans uploaded yet for this topic.
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

            {/* Image & context */}
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
