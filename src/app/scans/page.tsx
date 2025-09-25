"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { scanCategories } from "@/data/scanTopics";

export default function ScansPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-emerald-950 to-black px-6 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-500">
          Scans Library
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Browse scans by category → then choose a topic to dive deeper.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="max-w-6xl mx-auto grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {scanCategories.map((category, i) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
          >
            <Card className="bg-green-900/30 border border-green-700/30 hover:bg-green-900/50 transition shadow-md">
              <CardContent className="p-6 flex flex-col h-full">
                <h2 className="text-2xl font-bold text-green-300 mb-2">
                  {category.name}
                </h2>
                <p className="text-gray-400 text-sm mb-4">
                  {category.description}
                </p>

                {/* Topics List */}
                <div className="flex-1 space-y-2">
                  {category.topics.map((topic) => (
                    <Link
                      key={topic.id}
                      href={`/scans/${topic.term}`}
                      className="block bg-green-800/30 hover:bg-green-700/50 rounded-lg px-3 py-2 text-gray-200 text-sm transition"
                    >
                      {topic.term} • {topic.arabic}
                    </Link>
                  ))}
                </div>

                {/* View All Button */}
                <div className="mt-4">
                  <Button
                    asChild
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Link href={`#${category.name.toLowerCase()}`}>
                      View All {category.name}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
