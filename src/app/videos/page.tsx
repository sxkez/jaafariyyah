"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Twelver Shi'i sample playlist data (replace embeds with your actual video/playlist URLs)
const samplePlaylists = [
  {
    id: 1,
    title: "Nahj al‑Balāgha: Imam ‘Alī (a) in the 21st Century",
    titleEnglish: "Nahj al‑Balāgha Series",
    teacher: "Dr. Sayed Ammar Nakshawani",
    description:
      "An accessible, modern walk‑through of key sermons and letters from Nahj al‑Balāgha, exploring ethics, leadership, and spirituality.",
    thumbnail: "https://ext.same-assets.com/4138622892/2476500941.png",
    language: "EN",
    category: "Aqidah/Ethics",
    duration: "~60:00",
    episodes: 20,
    videoUrls: {
      AR: "https://www.youtube.com/embed/videoseries?list=PLgz_bSlK7VLwHQ2qSK1kkUpCEKCzszZbL",
      EN: "https://www.youtube.com/embed/videoseries?list=PLgz_bSlK7VLwHQ2qSK1kkUpCEKCzszZbL",
      UR: "https://www.youtube.com/embed/videoseries?list=PLgz_bSlK7VLwHQ2qSK1kkUpCEKCzszZbL"
    }
  },
  {
    id: 2,
    title: "Tafsīr al‑Mīzān – Semester One",
    titleEnglish: "Tafsīr al‑Mīzān – Method & Selections",
    teacher: "Shaykh Dr. Mohammed Ali Shomali",
    description:
      "Intro to ‘Allāma Ṭabāṭabā’ī’s exegetical method, with applied readings and thematic discussions.",
    thumbnail: "https://ext.same-assets.com/4138622892/645406049.png",
    language: "EN",
    category: "Tafsir",
    duration: "~50:00",
    episodes: 10,
    videoUrls: {
      AR: "https://www.youtube.com/embed/videoseries?list=PLGpGEfBFqEitIjOzIWwciuTpPc2jGRjqT",
      EN: "https://www.youtube.com/embed/videoseries?list=PLGpGEfBFqEitIjOzIWwciuTpPc2jGRjqT",
      UR: "https://www.youtube.com/embed/videoseries?list=PLGpGEfBFqEitIjOzIWwciuTpPc2jGRjqT"
    }
  },
  {
    id: 3,
    title: "Islamic Belief System (Aqāʾid)",
    titleArabic: "النظام الاعتقادي",
    titleEnglish: "Islamic Belief System Course",
    teacher: "Shaykh Dr. Mohammed Ali Shomali",
    description:
      "Systematic uṣūl al‑dīn series (Knowing God, Prophethood, Imamate, Resurrection) delivered at the Hawza of England/ICEL.",
    thumbnail: "https://ext.same-assets.com/4138622892/2893945201.png",
    language: "EN",
    category: "Aqidah",
    duration: "~45:00",
    episodes: 16,
    videoUrls: {
      AR: "https://www.youtube.com/embed/videoseries?list=PLD91w_p7jCJ4A75LfYCaZkx4jlBJ7TDsA",
      EN: "https://www.youtube.com/embed/videoseries?list=PLD91w_p7jCJ4A75LfYCaZkx4jlBJ7TDsA",
      UR: "https://www.youtube.com/embed/videoseries?list=PLD91w_p7jCJ4A75LfYCaZkx4jlBJ7TDsA"
    }
  }
];

// Video Player Modal Component
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
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-purple-900/90 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">
              {playlist.title} - Episode {selectedEpisode}
            </h2>
            <Button onClick={onClose} variant="ghost" size="sm" className="text-white hover:bg-purple-800">
              ✕
            </Button>
          </div>

          <div className="aspect-video bg-black rounded-lg mb-4 overflow-hidden">
            <iframe
              src={playlist.videoUrls[selectedLanguage as keyof typeof playlist.videoUrls]}
              title={`${playlist.title} - Episode ${selectedEpisode}`}
              className="w-full h-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>

          <div className="text-center">
            <h3 className="text-lg font-semibold text-white mb-2">
              {playlist.titleEnglish || playlist.title}
            </h3>
            <p className="text-purple-200 text-sm mb-2">Teacher: {playlist.teacher}</p>
            <p className="text-gray-300 text-sm">{playlist.descriptionEnglish || playlist.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// PlaylistCard component
function PlaylistCard({ playlist }: { playlist: typeof samplePlaylists[0] }) {
  const [selectedLanguage, setSelectedLanguage] = useState(playlist.language);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  const handleWatch = () => setIsPlayerOpen(true);
  const handleDownload = () => {
    alert(`Downloading ${playlist.title} - Episode ${selectedEpisode} (${selectedLanguage})...`);
  };

  return (
    <>
      <Card className="bg-purple-900/30 border-purple-600/30 backdrop-blur-sm hover:bg-purple-900/40 transition-all duration-300 overflow-hidden">
        <CardContent className="p-0">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Video Thumbnail */}
            <div
              className="aspect-video bg-gradient-to-br from-purple-800/50 to-blue-800/50 relative overflow-hidden cursor-pointer"
              onClick={handleWatch}
            >
              <img src={playlist.thumbnail} alt={playlist.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center hover:bg-black/40 transition-colors">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-white/30 transition-colors">
                  <div className="w-0 h-0 border-l-[15px] border-l-white border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent ml-1"></div>
                </div>
              </div>
              <div className="absolute top-2 left-2">
                <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded">{selectedLanguage}</span>
              </div>
              <div className="absolute bottom-2 right-2">
                <span className="bg-black/70 text-white text-xs px-2 py-1 rounded">{playlist.duration}</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-purple-600/40 text-purple-200 text-xs px-2 py-1 rounded">{playlist.category}</span>
                <span className="text-gray-400 text-xs">{playlist.episodes} episodes</span>
              </div>

              <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">{playlist.title}</h3>
              {(playlist.titleEnglish || playlist.titleArabic) && (
                <h4 className="text-purple-300 text-sm mb-3">{playlist.titleEnglish || playlist.titleArabic}</h4>
              )}
              <p className="text-purple-200 text-sm mb-3">{playlist.teacher}</p>
              <p className="text-gray-300 text-sm mb-4 line-clamp-3">{playlist.descriptionEnglish || playlist.description}</p>

              {/* Language Toggle */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm text-gray-400">Choose language:</span>
                <div className="flex gap-1">
                  {["AR", "UR", "EN"].map((lang) => (
                    <Button
                      key={lang}
                      size="sm"
                      variant={selectedLanguage === lang ? "default" : "outline"}
                      onClick={() => setSelectedLanguage(lang)}
                      className="text-xs px-2 py-1 h-6"
                    >
                      {lang}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Episode Selection */}
              <div className="mb-4">
                <label className="text-sm text-gray-400 block mb-2">Choose episode:</label>
                <select
                  value={selectedEpisode}
                  onChange={(e) => setSelectedEpisode(Number(e.target.value))}
                  className="w-full bg-purple-900/30 border border-purple-600/30 rounded text-white text-sm py-2 px-3 focus:outline-none focus:border-purple-400"
                >
                  {Array.from({ length: playlist.episodes }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      Episode {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button size="sm" onClick={handleWatch} className="bg-purple-600 hover:bg-purple-700 text-white flex-1">
                  ▶ Watch
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDownload}
                  className="border-purple-400 text-purple-300 hover:bg-purple-500/20"
                >
                  📥
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Video Player Modal */}
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

export default function VideosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-indigo-950 to-blue-950">
      <div className="container mx-auto px-6 py-8">
        {/* Main Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Lessons</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Watch featured Shi‘i lectures and series from trusted teachers.
          </p>
        </div>

        {/* Playlists Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Playlists</h2>
          <div className="space-y-6">
            {samplePlaylists.map((playlist) => (
              <PlaylistCard key={playlist.id} playlist={playlist} />)
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-purple-600/30">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center border border-purple-300">
              <div className="text-white text-xs">☪</div>
            </div>
            <span className="text-white font-semibold text-lg">𝘼𝙡 𝙅𝙖‘𝙛𝙖𝙧𝙞𝙮𝙮𝙖</span>
          </div>
          <p className="text-gray-300 italic">
            “May Allah have mercy on the one who revives our affair.” — Imām Ja‘far al‑Ṣādiq (a)
          </p>
          <div className="flex justify-center gap-6 mt-4">
            <Button variant="ghost" size="sm" className="text-purple-300 hover:text-white">
              Discord
            </Button>
            <Button variant="ghost" size="sm" className="text-purple-300 hover:text-white">
              TikTok
            </Button>
            <Button variant="ghost" size="sm" className="text-purple-300 hover:text-white">
              Instagram
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
