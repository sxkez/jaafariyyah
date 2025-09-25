"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import type { ScanTopic } from "@/data/scanTopics";

export default function CategoryClient({
  category,
  topics,
}: {
  category: string;
  topics: ScanTopic[];
}) {
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
        <h1 className="text-4xl md:text-5xl font-bold mb-2 capitalize">{category}</h1>
        <p className="text-gray-300 text-lg">Topics under {category}</p>
      </div>

      {/* Topics */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {topics.map((topic) => (
          <motion.div
            key={topic.id}
            whileHover={{ scale: 1.05 }}
            className="bg-green-900/30 border border-green-700/30 rounded-xl p-6 hover:bg-green-900/50 transition"
          >
            <h2 className="text-xl font-semibold mb-2">
              {topic.term} • {topic.arabic}
            </h2>
            <p className="text-gray-300 text-sm mb-4">{topic.description}</p>
            <Button asChild className="w-full bg-green-600 hover:bg-green-700">
              <Link href={`/scans/${topic.term}`}>📖 Open Topic</Link>
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
