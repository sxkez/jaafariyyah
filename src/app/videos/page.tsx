"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

// 🔹 Sample Playlists (move this to /data/playlists.ts later)
const samplePlaylists = [
  {
    id: 1,
    title: "Nahj al-Balāgha: Imam ‘Alī (a) in the 21st Century",
    teacher: "Dr. Sayed Ammar Nakshawani",
    description:
      "Walkthrough of Nahj al-Balāgha’s key sermons and letters, exploring ethics, leadership, and spirituality.",
    category: "Aqidah / Ethics",
    episodes: 20,
    videoUrls: {
      EN: "https://www.youtube.com/embed/videoseries?list=PLgz_bSlK7VLwHQ2qSK1kkUpCEKCzszZbL",
      AR: "https://www.youtube.com/embed/videoseries?list=PLgz_bSlK7VLwHQ2qSK1kkUpCEKCzszZbL",
      UR: "https://www.youtube.com/embed/videoseries?list=PLgz_bSlK7VLwHQ2qSK1kkUpCEKCzszZbL",
    },
  },
  {
    id: 2,
    title: "Tafsīr al-Mīzān – Semester One",
    teacher: "Shaykh Dr. Mohammed Ali Shomali",
    description:
      "Intro to ‘Allāma Ṭabāṭabā’ī’s tafsīr method, with applied readings and thematic discussions.",
    category: "Tafsir",
    episodes: 10,
    videoUrls: {
      EN: "https://www.youtube.com/embed/videoseries?list=PLGpGEfBFqEitIjOzIWwciuTpPc2jGRjqT",
      AR: "https://www.youtube.com/embed/videoseries?list=PLGpGEfBFqEitIjOzIWwciuTpPc2jGRjqT",
      UR: "https://www.youtube.com/embed/videoseries?list=PLGpGEfBFqEitIjOzIWwciuTpPc2jGRjqT",
    },
  },
  {
    id: 3,
    title: "Islamic Belief System (Aqāʾid)",
    teacher: "Shaykh Dr. Mohammed Ali Shomali",
    description:
      "Systematic uṣūl al-dīn series (Knowing God, Prophethood, Imamate, Resurrection).",
    category: "Aqidah",
    episodes: 16,
    videoUrls: {
      EN: "https://www.youtube.com/embed/videoseries?list=PLD91w_p7jCJ4A75LfYCaZkx4jlBJ7TDsA",
      AR: "https://www.youtube.com/embed/videoseries?list=PLD91w_p7jCJ4A75LfYCaZkx4jlBJ7TDsA",
      UR: "https://www.youtube.com/embed/videoseries?list=PLD91w_p7jCJ4A75LfYCaZkx4jlBJ7TDsA",
    },
  },
];

// 🔹 Extract YouTube thumbnail
function getYoutubeThumbnail(url: string) {
  const match = url.match(/list=([a-zA-Z0-9_-]+)/);
  const id = match ? match[1] : null;
  return id
    ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
    : "https://via.placeholder.com/480x360?text=Video";
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
                  <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                    {Array.from({ length: playlist.episodes }, (_, i) => (
                      <Button
                        key={i + 1}
                        size="sm"
                        variant={
                          selectedEpisode === i + 1 ? "default" : "outline"
                        }
                        onClick={() => setSelectedEpisode(i + 1)}
                        className="text-xs px-3 py-1 rounded-full"
                      >
                        {i + 1}
                      </Button>
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
