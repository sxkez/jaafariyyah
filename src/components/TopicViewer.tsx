"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

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
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between mb-12"
      >
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
      </motion.div>

      {/* Scans Grid */}
      {topic.scans && topic.scans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topic.scans.map((scan, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              whileHover={{ scale: 1.03 }}
              className="bg-green-900/30 border border-green-700/30 rounded-lg p-4 hover:bg-green-900/50 transition cursor-pointer"
              onClick={() => setCurrentIndex(idx)}
            >
              <motion.img
                src={scan.img}
                alt={scan.caption}
                className="rounded-lg mb-4"
                whileHover={{ scale: 1.05 }}
              />
              <p className="text-sm text-gray-200 font-semibold mb-2">
                {scan.caption}
              </p>
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                📖 View
              </Button>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-400 italic"
        >
          Scans coming soon for this topic.
        </motion.p>
      )}

      {/* Modal */}
      <AnimatePresence>
        {currentIndex !== null && topic.scans && (
          <motion.div
            key="modal"
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-green-950 border border-green-700 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
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
                <motion.img
                  src={topic.scans[currentIndex].img}
                  alt={topic.scans[currentIndex].caption}
                  className="rounded-lg mb-4 max-h-[60vh] mx-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                />
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-gray-300 text-sm leading-relaxed"
                >
                  {topic.scans[currentIndex].context}
                </motion.p>
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
