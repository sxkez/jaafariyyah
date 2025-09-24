"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { DiscordWidget } from "@/components/DiscordWidget";
import { PrayerTimesWidget } from "@/components/PrayerTimesWidget";

// Replace with your real Discord invite
const DISCORD_INVITE_URL = "https://discord.gg/jafariyya";

// 🌌 Starfield background
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

// 🕌 Hero section
function HeroSection() {
  const handleDiscordJoin = () =>
    window.open(DISCORD_INVITE_URL, "_blank", "noopener,noreferrer");

  return (
    <section className="relative z-10 text-center px-6 py-20">
      <h1 className="text-6xl md:text-7xl font-bold text-white mb-4 leading-tight">
        Al Ja‘fariyya
      </h1>
      <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed">
        Where the light of Ja‘farī (Twelver Shi‘i) scholarship meets the
        inquisitive heart. Learn, share, and connect around the Qur’an, the
        Sunnah of the Prophet ﷺ, and the teachings of the Ahl al-Bayt (a).
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Button
          size="lg"
          onClick={handleDiscordJoin}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          👥 Join Our Discord
        </Button>
        <Link href="/books/">
          <Button
            size="lg"
            variant="outline"
            className="border-green-400 text-green-300 hover:bg-green-500/20 px-8 py-3 transition-all duration-300"
          >
            📚 Explore Shi‘i Books
          </Button>
        </Link>
        <Link href="/videos/">
          <Button
            size="lg"
            variant="outline"
            className="border-green-400 text-green-300 hover:bg-green-500/20 px-8 py-3 transition-all duration-300"
          >
            🎥 Watch Lessons
          </Button>
        </Link>
      </div>
    </section>
  );
}

// 📚 Features
function FeaturesSection() {
  const handleDiscordJoin = () =>
    window.open(DISCORD_INVITE_URL, "_blank", "noopener,noreferrer");

  const features = [
    {
      title: "Join our Discord",
      description: "Connect with students of the Ja‘farī tradition",
      icon: "💬",
      onClick: handleDiscordJoin,
    },
    {
      title: "Explore Books",
      description: "Curated Shi‘i library across key disciplines",
      icon: "📚",
      link: "/books/",
    },
    {
      title: "Watch Lessons",
      description: "Featured lectures and playlists",
      icon: "🎥",
      link: "/videos/",
    },
  ];

  return (
    <section className="relative z-10 px-6 py-20">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        {features.map((feature, i) =>
          feature.link ? (
            <Link href={feature.link} key={i}>
              <Card className="bg-green-900/30 border-green-600/30 backdrop-blur-sm hover:bg-green-900/40 transition-all duration-300 cursor-pointer">
                <CardContent className="p-8 text-center">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300">{feature.description}</p>
                </CardContent>
              </Card>
            </Link>
          ) : (
            <Card
              key={i}
              onClick={feature.onClick}
              className="bg-green-900/30 border-green-600/30 backdrop-blur-sm hover:bg-green-900/40 transition-all duration-300 cursor-pointer"
            >
              <CardContent className="p-8 text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-300">{feature.description}</p>
              </CardContent>
            </Card>
          )
        )}
      </div>
    </section>
  );
}

// 🕋 Footer
function Footer() {
  const open = (url: string) =>
    window.open(url, "_blank", "noopener,noreferrer");

  return (
    <footer className="relative z-10 text-center px-6 py-12 border-t border-green-600/30">
      <div className="max-w-4xl mx-auto">
        <p className="text-gray-300 mb-8 italic text-lg">
          “May Allah have mercy on the one who revives our affair.” — Imām Ja‘far
          al-Ṣādiq (a)
        </p>
        <div className="flex justify-center gap-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => open(DISCORD_INVITE_URL)}
            className="text-green-300 hover:text-white hover:bg-green-600/20 transition-all"
          >
            Discord
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => open("https://tiktok.com/@aljafariyya")}
            className="text-green-300 hover:text-white hover:bg-green-600/20 transition-all"
          >
            TikTok
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => open("https://instagram.com/aljafariyya")}
            className="text-green-300 hover:text-white hover:bg-green-600/20 transition-all"
          >
            Instagram
          </Button>
        </div>
      </div>
    </footer>
  );
}

// 🌙 Main Home Page
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-emerald-950 to-teal-950 relative overflow-hidden">
      <StarField />
      <div className="relative z-10">
        <HeroSection />
        <FeaturesSection />

        {/* Discord & Prayer Times */}
        <section className="relative z-10 px-6 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Stay Connected
              </h2>
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
