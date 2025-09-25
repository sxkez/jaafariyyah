// src/app/scans/[topic]/TopicClient.tsx  (client)
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { CategorizedScanTopic } from "@/data/scanTopics";

export default function TopicClient({
  topic,
}: {
  topic: CategorizedScanTopic;
}) {
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  const handleNext = () =>
    setCurrentIndex((i) =>
      i !== null && i < (topic.scans?.length || 0) - 1 ? i + 1 : i
    );
  const handlePrev = () =>
    setCurrentIndex((i) => (i !== null && i > 0 ? i - 1 : i));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (currentIndex !== null) {
        if (e.key === "ArrowRight") handleNext();
        if (e.key === "ArrowLeft") handlePrev();
        if (e.key === "Escape") setCurrentIndex(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [currentIndex]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-emerald-950 to-black text-white px-6 py-12">
      {/* Back */}
      <div className="mb-6">
        <Button asChild className="bg-green-700 hover:bg-green-600 text-white">
          <Link href="/scans">← Back to Scans</Link>
        </Button>
      </div>

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-2">{topic.term} • {topic.arabic}</h1>
        <p className="text-gray-300">{topic.description}</p>
      </div>

      {/* Grid of scans */}
      {topic.scans && topic.scans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {topic.scans.map((scan, idx) => (
            <div
              key={idx}
              className="bg-green-900/30 border border-green-700/30 rounded-xl p-4 cursor-pointer transition-transform duration-200 hover:scale-105"
              onClick={() => setCurrentIndex(idx)}
            >
              <img src={scan.img} alt={scan.caption} className="rounded-lg mb-3" />
              <p className="text-sm text-gray-200">{scan.caption}</p>
              <Button className="w-full mt-2 bg-green-600 hover:bg-green-700">
                View
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400">Scans coming soon for this topic.</p>
      )}

      {/* Modal */}
      {currentIndex !== null && topic.scans && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-green-950 border border-green-700 rounded-lg max-w-3xl w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2>{topic.scans[currentIndex].caption}</h2>
              <button onClick={() => setCurrentIndex(null)}>✕</button>
            </div>
            <img
              src={topic.scans[currentIndex].img}
              alt={topic.scans[currentIndex].caption}
              className="rounded-lg mb-4"
            />
            <p className="text-gray-300">{topic.scans[currentIndex].context}</p>

            <div className="flex justify-between mt-6">
              <Button onClick={handlePrev} disabled={currentIndex === 0}>
                ⬅ Prev
              </Button>
              <Button
                onClick={handleNext}
                disabled={currentIndex === topic.scans.length - 1}
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
