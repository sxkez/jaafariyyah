"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { DiscordWidget } from "@/components/DiscordWidget";
import { PrayerTimesWidget } from "@/components/PrayerTimesWidget";

// Discord invite link – replace with your real Al Ja‘fariyya invite
const DISCORD_INVITE_URL = "https://discord.gg/jafariyya"; // TODO: replace with your real invite

// Starfield background component with deterministic positions
function StarField() {
  const stars = Array.from({ length: 150 }, (_, i) => {
    const x = (i * 73 + 23) % 100;
    const y = (i * 137 + 47) % 100;
    const size = ((i * 19) % 10) > 8 ? 2 : 1;
    const opacity = 0.3 + ((i * 29) % 30) / 100;
    const delay = (i * 43) % 3;
    const duration = 2 + ((i * 17) % 20) / 10;
    return { x, y, size, opacity, delay, duration };
  });

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {stars.map((star, i) => (
        <div
          key={i}
          className="absolute bg-white rounded-full animate-pulse"
          style={{
            width: `${star.size}px`,
            height: `${star.size}px`,
            left: `${star.x}%`,
            top: `${star.y}%`,
            opacity: star.opacity,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

// Hero section (Shi‘i copy)
function HeroSection() {
  const handleDiscordJoin = () => {
    window.open(DISCORD_INVITE_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="relative z-10 text-center px-6 py-20">
      <h1 className="text-6xl md:text-7xl font-bold text-white mb-4 leading-tight">
        Al Ja'fariyyah
      </h1>
      <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed">
        Where the light of Ja‘farī (Twelver Shi‘i) scholarship meets the inquisitive heart.
        Learn, share, and connect around the Qur’an, the Sunnah of the Prophet ﷺ, and the teachings
        of the Ahl al‑Bayt (a).
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Button
          size="lg"
          onClick={handleDiscordJoin}
          className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          👥 Join Our Discord
        </Button>
        <Link href="/books/">
          <Button
            size="lg"
            variant="outline"
            className="border-purple-400 text-purple-300 hover:bg-purple-500/20 px-8 py-3 transition-all duration-300"
          >
            📚 Explore Shi‘i Books
          </Button>
        </Link>
        <Link href="/videos/">
          <Button
            size="lg"
            variant="outline"
            className="border-purple-400 text-purple-300 hover:bg-purple-500/20 px-8 py-3 transition-all duration-300"
          >
            🎥 Watch Lessons
          </Button>
        </Link>
      </div>
    </section>
  );
}

// Features section (unchanged structure, Shi‘i wording)
function FeaturesSection() {
  const handleDiscordJoin = () => {
    window.open(DISCORD_INVITE_URL, "_blank", "noopener,noreferrer");
  };

  const features = [
    {
      icon: (
        <div className="w-16 h-16 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
          <svg className="w-8 h-8 text-purple-300" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
      ),
      title: "Join our Discord",
      description: "Connect with students of the Ja‘farī tradition",
      onClick: handleDiscordJoin,
    },
    {
      icon: (
        <div className="w-16 h-16 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
          <svg className="w-8 h-8 text-purple-300" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/>
          </svg>
        </div>
      ),
      title: "Explore Books",
      description: "Curated Shi‘i library across key disciplines",
      link: "/books/",
    },
    {
      icon: (
        <div className="w-16 h-16 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
          <svg className="w-8 h-8 text-purple-300" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </div>
      ),
      title: "Watch Lessons",
      description: "Featured lectures and playlists",
      link: "/videos/",
    },
  ];

  return (
    <section className="relative z-10 px-6 py-20">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div key={index}>
            {feature.link ? (
              <Link href={feature.link}>
                <Card className="bg-purple-900/30 border-purple-600/30 backdrop-blur-sm hover:bg-purple-900/40 transition-all duration-300 cursor-pointer">
                  <CardContent className="p-8 text-center">
                    {feature.icon}
                    <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ) : (
              <Card
                className="bg-purple-900/30 border-purple-600/30 backdrop-blur-sm hover:bg-purple-900/40 transition-all duration-300 cursor-pointer"
                onClick={feature.onClick}
              >
                <CardContent className="p-8 text-center">
                  {feature.icon}
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// Footer (Shi‘i quote + functional links)
function Footer() {
  const handleDiscordClick = () => {
    window.open(DISCORD_INVITE_URL, "_blank", "noopener,noreferrer");
  };

  const handleTikTokClick = () => {
    window.open("https://tiktok.com/@aljafariyya", "_blank", "noopener,noreferrer");
  };

  const handleInstagramClick = () => {
    window.open("https://instagram.com/aljafariyya", "_blank", "noopener,noreferrer");
  };

  return (
    <footer className="relative z-10 text-center px-6 py-12 border-t border-purple-600/30">
      <div className="max-w-4xl mx-auto">
        <p className="text-gray-300 mb-8 italic text-lg">
          “May Allah have mercy on the one who revives our affair.” — Imām Ja‘far al‑Ṣādiq (a)
        </p>
        <div className="flex justify-center gap-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDiscordClick}
            className="text-purple-300 hover:text-white hover:bg-purple-600/20 transition-all duration-300"
          >
            Discord
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleTikTokClick}
            className="text-purple-300 hover:text-white hover:bg-purple-600/20 transition-all duration-300"
          >
            TikTok
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleInstagramClick}
            className="text-purple-300 hover:text-white hover:bg-purple-600/20 transition-all duration-300"
          >
            Instagram
          </Button>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-indigo-950 to-blue-950 relative overflow-hidden">
      <StarField />
      <div className="relative z-10">
        <HeroSection />
        <FeaturesSection />
        {/* Community & Prayer Times Section */}
        <section className="relative z-10 px-6 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Stay Connected</h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Join our vibrant community and stay updated with prayer times
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <DiscordWidget showActivity={true} />
              <PrayerTimesWidget />
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </div>
  );
}
