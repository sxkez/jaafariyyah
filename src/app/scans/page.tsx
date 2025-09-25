"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { scanTopics } from "@/data/scanTopics";
import { motion } from "framer-motion";

function TopicCard({ topic }: { topic: (typeof scanTopics)[0] }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="bg-green-900/30 border-green-600/30 backdrop-blur-sm hover:shadow-lg hover:shadow-green-600/20 hover:border-green-500/50 transition-all duration-300 rounded-xl overflow-hidden">
        <CardContent className="p-6 flex flex-col h-full">
          {/* Badges */}
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-green-600/40 text-green-200 text-xs px-2 py-1 rounded">
              Topic
            </span>
            <span className="bg-emerald-600/40 text-emerald-200 text-xs px-2 py-1 rounded">
              {topic.category}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-white font-bold text-xl mb-2">
            {topic.term} • {topic.arabic}
          </h3>

          {/* Description */}
          <p className="text-gray-300 text-sm mb-6 leading-relaxed flex-grow">
            {topic.description}
          </p>

          {/* Button */}
          <Link href={`/scans/${topic.term}`}>
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-3">
              📖 Open Topic
            </Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function ScansPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-emerald-950 to-black">
      <div className="container mx-auto px-6 py-12">
        {/* Main Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Scans
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            A collection of scans regarding creed, fiqh, history, and
            refutations within Twelver Shi‘i scholarship.
          </p>
        </motion.div>

        {/* Topics Grid */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.08 },
            },
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
        >
          {scanTopics.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center pt-10 border-t border-green-600/30"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center border border-green-300 shadow-md">
              <div className="text-white text-xs">☪</div>
            </div>
            <span className="text-white font-semibold text-lg">
              𝘼𝙡 𝙅𝙖‘𝙛𝙖𝙧𝙞𝙮𝙮𝙖
            </span>
          </div>
          <p className="text-gray-300 italic">
            “May Allah have mercy on the one who revives our affair.” — Imām
            Ja‘far al-Ṣādiq (a)
          </p>
        </motion.div>
      </div>
    </div>
  );
}
