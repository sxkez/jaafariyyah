"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

// 🔹 Sample Playlists (move this to /data/playlists.ts later)
const samplePlaylists = [
  {
    id: 1,
    title: "Adalat al-Sahaba in the Quran",
    teacher: "Sayyid Ali Abu al-Hasan",
    description:
      "The Uprightness of the Companions in the Qurʾān...",
    category: "Aqidah / Ethics",
    episodes: 8,
    videoUrls: {
      EN: "https://www.youtube.com/watch?v=MMmhOdEYYek&list=PLuQ8WZvjfbBzlwih81Ugdr-YDmCh7Jtof",
    },
  },
  {
    id: 2,
    title: "طريق معرفة الحق بين المذاهب الإسلامية",
    teacher: "السيد علي أبو الحسن",
    description:
      "كيفية معرفة الحق بين المذاهب الإسلامية",
    category: "Aqeedah",
    episodes: 37,
    videoUrls: {
      AR: "https://www.youtube.com/watch?v=I1HkRvIVZ1Y&list=PLvlHnPlDJB2XIC8hKuNbA747ZKS-NxVof",
    },
  },
];

// 🔹 Extract YouTube thumbnail
function getYoutubeThumbnail(url?: string) {
  if (!url) {
    return "https://via.placeholder.com/480x360?text=No+Thumbnail";
  }

  try {
    // Extract ?v=VIDEOID
    const videoMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    if (videoMatch) {
      return `https://img.youtube.com/vi/${videoMatch[1]}/hqdefault.jpg`;
    }

    // If it's a playlist (list=...), use generic
    if (url.includes("list=")) {
      return "https://via.placeholder.com/480x360?text=Playlist";
    }

    // Default fallback
    return "https://via.placeholder.com/480x360?text=Video";
  } catch {
    return "https://via.placeholder.com/480x360?text=Error";
  }
}

// 🎥 Video Player Modal
function VideoPlayerModal({
  playlist,
  isOpen,
  onClose,
  selectedLanguage,
  selectedEpisode,
}: {
  playlist: typeof samplePlaylists[0] | null;
  isOpen: boolean;
  onClose: () => void;
  selectedLanguage: string;
  selectedEpisode: number;
}) {
  if (!isOpen || !playlist) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-green-950/90 border border-green-700 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-auto shadow-xl"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">
                  {playlist.title} — Ep {selectedEpisode}
                </h2>
                <Button
                  onClick={onClose}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-green-800"
                >
                  ✕
                </Button>
              </div>

              {/* Video */}
              <div className="aspect-video bg-black rounded-lg mb-4 overflow-hidden">
                <iframe
                  src={
                    playlist.videoUrls[
                      selectedLanguage as keyof typeof playlist.videoUrls
                    ]
                  }
                  title={`${playlist.title} - Episode ${selectedEpisode}`}
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>

              {/* Description */}
              <p className="text-gray-300 text-sm">{playlist.description}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// 📺 Playlist Card
function PlaylistCard({ playlist }: { playlist: typeof samplePlaylists[0] }) {
  const [selectedLanguage, setSelectedLanguage] = useState("EN");
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  return (
    <>
      <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
        <Card className="bg-green-900/30 border-green-700/40 hover:bg-green-900/50 transition-all duration-300 overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col">
              {/* Thumbnail */}
              <div
                className="aspect-video relative cursor-pointer"
                onClick={() => setIsPlayerOpen(true)}
              >
                <img
                  src={getYoutubeThumbnail(playlist.videoUrls.EN)}
                  alt={playlist.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center hover:bg-black/40 transition">
                  <span className="text-white text-3xl">▶</span>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white mb-1">
                  {playlist.title}
                </h3>
                <p className="text-sm text-green-300 mb-2">
                  {playlist.teacher}
                </p>
                <p className="text-sm text-gray-300 mb-3 line-clamp-3">
                  {playlist.description}
                </p>

                {/* Language Toggle */}
                <div className="flex gap-2 mb-3">
                  {["AR", "UR", "EN"].map((lang) => (
                    <Button
                      key={lang}
                      size="sm"
                      variant={
                        selectedLanguage === lang ? "default" : "outline"
                      }
                      onClick={() => setSelectedLanguage(lang)}
                      className="text-xs"
                    >
                      {lang}
                    </Button>
                  ))}
                </div>

                {/* Episodes Pills */}
                <div className="mb-3">
                <p className="text-sm text-gray-400 mb-2">Episodes:</p>
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: playlist.episodes }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setSelectedEpisode(i + 1)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition 
                        ${
                          selectedEpisode === i + 1
                            ? "bg-green-600 text-white shadow-lg"
                            : "bg-green-800/30 text-gray-300 hover:bg-green-700/50"
                        }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>

                <Button
                  size="sm"
                  onClick={() => setIsPlayerOpen(true)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  ▶ Watch Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Modal */}
      <VideoPlayerModal
        playlist={playlist}
        isOpen={isPlayerOpen}
        onClose={() => setIsPlayerOpen(false)}
        selectedLanguage={selectedLanguage}
        selectedEpisode={selectedEpisode}
      />
    </>
  );
}

// 📚 Main Page
export default function LessonsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-emerald-950 to-black">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Lessons
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Explore Shi‘i lectures and courses from trusted teachers.
          </p>
        </div>

        {/* Playlists Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {samplePlaylists.map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </div>
      </div>
    </div>
  );
}
