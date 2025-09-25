"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ScanTopic } from "@/data/scanTopics";

export default function TopicClient({ data }: { data: ScanTopic }) {
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

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

  // ⌨ Keyboard navigation
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
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Button
          asChild
          className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2"
        >
          <Link href="/scans">← Back to Scans</Link>
        </Button>
      </motion.div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-500 drop-shadow">
          {data.term} • {data.arabic}
        </h1>
        {data.category && (
          <span className="inline-block px-3 py-1 mb-4 text-sm font-medium rounded-full bg-green-800/40 border border-green-600/50 text-green-300 shadow-md">
            {data.category}
          </span>
        )}
        <p className="text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed">
          {data.description}
        </p>
      </motion.div>

      {/* Grid of scans */}
      {data.scans && data.scans.length > 0 ? (
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {data.scans.map((scan, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.03 }}
              className="bg-green-900/30 border border-green-700/40 rounded-xl overflow-hidden shadow-md hover:shadow-green-500/30 transition-all"
            >
              <img
                src={scan.img}
                alt={scan.caption}
                className="w-full h-72 object-contain bg-black/30 cursor-pointer"
                onClick={() => setCurrentIndex(idx)}
              />
              <div className="p-5 flex flex-col items-center">
                <p className="text-sm text-gray-200 font-semibold text-center mb-4">
                  {scan.caption}
                </p>
                <Button
                  onClick={() => setCurrentIndex(idx)}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-medium rounded-lg shadow-md"
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
              className="bg-green-950 border border-green-700 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
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
                  className="rounded-lg mb-6 max-h-[60vh] mx-auto shadow-lg"
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
