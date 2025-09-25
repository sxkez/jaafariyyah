"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { scanCategories } from "@/data/scanTopics";

export default function ScansPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-emerald-950 to-black">
      <div className="container mx-auto px-6 py-12">
        {/* Main Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Scans
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Browse scans by category — creed, fiqh, history, hadith, and more
            within Twelver Shi‘i scholarship.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {scanCategories.map((category) => (
            <Card
              key={category.id}
              className="bg-green-900/30 border-green-600/30 backdrop-blur-sm
                         hover:shadow-lg hover:shadow-green-600/20
                         hover:border-green-500/50 transition-all duration-300"
            >
              <CardContent className="p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-green-600/40 text-green-200 text-xs px-2 py-1 rounded">
                      Category
                    </span>
                  </div>
                  <h3 className="text-white font-bold text-xl mb-2">
                    {category.name}
                  </h3>
                  <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                    {category.description}
                  </p>
                </div>
                <Link href={`/scans/${category.id}`}>
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-3">
                    📂 Open {category.name} ({category.topics.length})
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center pt-10 border-t border-green-600/30">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center border border-green-300">
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
        </div>
      </div>
    </div>
  );
}
