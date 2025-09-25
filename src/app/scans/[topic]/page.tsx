"use client";

import { useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const scansData: Record<
  string,
  {
    title: string;
    description: string;
    scans: { img: string; caption: string; context: string }[];
  }
> = {
  tawassul: {
    title: "Tawassul • التوسل",
    description: "Scans supporting tawassul through Ahl al-Bayt (a).",
    scans: [
      {
        img: "https://i.imgur.com/Ew9Q52J.jpg",
        caption: "Tawassul is a fiqhi matter",
        context:
          "Al-Shaykh Ali Ale Muhsin says in the Muqadima of Shaykh Ahmad Salman's Kitab al-Waseela, pg. 6, Although tawassul is a jurisprudential matter unrelated to creed as it pertains to the acts of the obligated individuals, Ibn Taymiyyah and his followers categorized it under creed, exaggerated its implications, and ruled that tawassul through the dead, seeking their intercession, and requesting needs from them constitutes major shirk that expels one from the fold of Islam.",
      },
      {
        img: "https://i.imgur.com/d3LVAOk.jpg",
        caption: "Ibn Hanbal doing Istighatha",
        context:
          "Al-Jami’ li-’Ulum al-Imam Ahmad, vol. 8, pg. 74, Abdullah said: I heard my father say: “I performed five Hajj pilgrimages—two of them while riding and three while walking, or two while walking and three while riding. During one of the pilgrimages, I lost my way while walking, so I began saying: ‘O servants of Allah, guide us to the path!’ I kept saying that until I found the road.” Or as my father said.",
      },
    ],
  },
};

export default function TopicPage({ params }: { params: { topic: string } }) {
  const topic = params.topic;
  const data = scansData[topic];
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  if (!data) return notFound();

  const handleNext = () => {
    if (currentIndex !== null && currentIndex < data.scans.length - 1) {
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
      {/* Breadcrumbs */}
      <div className="text-sm text-gray-400 mb-6 flex items-center gap-2">
        <Link href="/scans" className="hover:text-green-400">
          Scans
        </Link>
        <span>›</span>
        <span className="text-white font-medium">{data.title}</span>
      </div>

      {/* Title */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{data.title}</h1>
        <p className="text-gray-300 text-lg max-w-3xl mx-auto">
          {data.description}
        </p>
      </div>

      {/* Grid of scans */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.scans.map((scan, idx) => (
          <div
            key={idx}
            className="bg-green-900/30 border border-green-700/30 rounded-lg p-4 hover:bg-green-900/50 transition"
          >
            <img
              src={scan.img}
              alt={scan.caption}
              className="rounded-lg mb-4 cursor-pointer"
              onClick={() => setCurrentIndex(idx)}
            />
            <p className="text-sm text-gray-200 font-semibold mb-2">
              {scan.caption}
            </p>
            <Button
              onClick={() => setCurrentIndex(idx)}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              📖 View
            </Button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {currentIndex !== null && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
          <div className="bg-green-950 border border-green-700 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
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

            {/* Scan Image + Context */}
            <div className="p-4 text-center">
              <figure>
                <img
                  src={data.scans[currentIndex].img}
                  alt={data.scans[currentIndex].caption}
                  className="rounded-lg mb-4 max-h-[60vh] mx-auto"
                />
                <figcaption className="text-gray-300 text-sm leading-relaxed">
                  {data.scans[currentIndex].context}
                </figcaption>
              </figure>
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
                disabled={currentIndex === data.scans.length - 1}
                className="bg-green-700 hover:bg-green-600 text-white disabled:opacity-50"
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
