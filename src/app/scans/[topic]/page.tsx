"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { scanTopics } from "@/data/scanTopics";
import { motion, AnimatePresence } from "framer-motion";

export default function TopicPage({ params }: { params: { topic: string } }) {
  const topic = params.topic;
  const data = scanTopics.find((t) => t.term === topic);

  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  if (!data) return notFound();

  const handleNext = () => {
    if (currentIndex !== null && currentIndex < (data.scans?.length || 0) - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex !== null && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // 🔑 keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (currentIndex !== null) {
        if (e.key === "ArrowRight") handleNext();
        if (e.key === "ArrowLeft") handlePrev();
        if (e.key === "Escape") setCurrentIndex(null);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [currentIndex]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-emerald-950 to-black text-white px-6 py-12">
      {/* Back Button */}
      <div className="mb-6">
        <Button
          asChild
          className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2"
        >
          <Link href="/scans">← Back to Scans</Link>
        </Button>
      </div>

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-500">
          {data.term} • {data.arabic}
        </h1>
        {data.category && (
          <p className="text-green-400 font-medium mb-2">{data.category}</p>
        )}
        <p className="text-gray-300 text-lg max-w-3xl mx-auto">
          {data.description}
        </p>
      </div>

      {/* Grid of scans */}
      {data.scans && data.scans.length > 0 ? (
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.scans.map((scan, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              className="bg-green-900/30 border border-green-700/30 rounded-xl overflow-hidden shadow-md hover:shadow-green-500/20 transition"
            >
              <img
                src={scan.img}
                alt={scan.caption}
                className="w-full h-64 object-contain bg-black/20 cursor-pointer"
                onClick={() => setCurrentIndex(idx)}
              />
              <div className="p-4">
                <p className="text-sm text-gray-200 font-semibold mb-2">
                  {scan.caption}
                </p>
                <Button
                  onClick={() => setCurrentIndex(idx)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2"
                >
                  👁️ View Scan
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400 italic">
          Scans coming soon for this topic.
        </p>
      )}

      {/* Modal */}
      <AnimatePresence>
        {currentIndex !== null && data.scans && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-green-950 border border-green-700 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b border-green-700">
                <h2 className="text-lg font-semibold text-white">
                  {data.scans[currentIndex].caption}
                </h2>
                <button
                  onClick={() => setCurrentIndex(null)}
                  className="text-gray-400 hover:text-white text-xl"
                >
                  ✕
                </button>
              </div>

              {/* Scan Image */}
              <div className="p-6 text-center">
                <img
                  src={data.scans[currentIndex].img}
                  alt={data.scans[currentIndex].caption}
                  className="rounded-lg mb-4 max-h-[60vh] mx-auto"
                />
                <p className="text-gray-300 text-sm leading-relaxed">
                  {data.scans[currentIndex].context}
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
                <span className="text-gray-400 text-sm">
                  {currentIndex + 1} / {data.scans.length}
                </span>
                <Button
                  onClick={handleNext}
                  disabled={currentIndex === data.scans.length - 1}
                  className="bg-green-700 hover:bg-green-600 text-white disabled:opacity-50"
                >
                  Next ➡
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
