"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { scanCategories } from "@/data/scanTopics";

export default function CategoryPage({ params }: { params: { category: string } }) {
  const categoryId = params.category;
  const category = scanCategories.find((c) => c.id.toString() === categoryId);

  if (!category) return notFound();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-emerald-950 to-black text-white px-6 py-12">
      {/* Back to Scans */}
      <div className="mb-6">
        <Button
          asChild
          className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2"
        >
          <Link href="/scans">← Back to Categories</Link>
        </Button>
      </div>

      {/* Category Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
          {category.name}
        </h1>
        <p className="text-gray-300 text-lg max-w-3xl mx-auto">
          {category.description}
        </p>
      </div>

      {/* Topics Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {category.topics.map((topic) => (
          <motion.div
            key={topic.id}
            whileHover={{ scale: 1.05 }}
            className="bg-green-900/30 border border-green-700/30 rounded-xl shadow-md hover:shadow-green-500/20 transition p-6"
          >
            <h3 className="text-xl font-semibold text-green-300 mb-2">
              {topic.term} • {topic.arabic}
            </h3>
            <p className="text-gray-300 text-sm mb-4">{topic.description}</p>
            <Button
              asChild
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              <Link href={`/scans/${topic.term}`}>📄 View Topic</Link>
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
