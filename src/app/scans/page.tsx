"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { scanTopics, ScanTopic } from "@/data/scanTopics";

function TopicCard({ topic }: { topic: ScanTopic }) {
  return (
    <Card className="bg-green-900/30 border-green-600/30 backdrop-blur-sm hover:shadow-lg hover:shadow-green-600/20 hover:border-green-500/50 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-green-600/40 text-green-200 text-xs px-2 py-1 rounded">Topic</span>
          <span className="bg-emerald-600/40 text-emerald-200 text-xs px-2 py-1 rounded">{topic.category}</span>
        </div>
        <h3 className="text-white font-bold text-xl mb-2">
          {topic.term} • {topic.arabic}
        </h3>
        <p className="text-gray-300 text-sm mb-6 leading-relaxed">{topic.description}</p>
        <Link href={`/scans/${topic.term}`}>
          <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-3">
            📖 Open Topic
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

export default function ScansPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-emerald-950 to-black">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Scans</h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            A collection of scans regarding creed, fiqh, history, and refutations within Twelver Shi‘i scholarship.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {scanTopics.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      </div>
    </div>
  );
}
