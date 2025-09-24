"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Stats data
const communityStats = [
  {
    number: "700+",
    label: "Active Members",
    icon: "👥"
  },
  {
    number: "600+",
    label: "Texts & Lessons",
    icon: "📚"
  },
  {
    number: "20,000+",
    label: "Messages Daily",
    icon: "💬"
  },
  {
    number: "4.9",
    label: "Community Rating",
    icon: "⭐"
  }
];

// Belief sections
const beliefSections = [
  {
    title: "Love of the Ahl al-Bayt",
    description:
      "Rooted in devotion to the Prophet ﷺ and his purified Household, we learn, discuss, and serve with adab. Our space centers the ethics, teachings, and legacy of the Twelve Imams (a).",
    icon: "❤️"
  },
  {
    title: "Ja‘farī Scholarship",
    description:
      "From ‘aqīdah (tawḥīd, ‘adl, nubuwwa, imāmah, ma‘ād) to uṣūl al-fiqh and ḥadīth, we explore the living tradition of ijtihād and marja‘iyyah through evidence-based study and respectful dialogue.",
    icon: "🧭"
  },
  {
    title: "Thoughtful, Inclusive Discourse",
    description:
      "Whether you’re new to Twelver Shi‘ism or deep in hawza readings, every sincere question matters. We host balanced discussions, friendly debates, and collaborative learning grounded in mutual respect.",
    icon: "🤝"
  }
];

// StatCard component
function StatCard({ stat }: { stat: typeof communityStats[0] }) {
  return (
    <Card className="bg-primary/30 border-primary/30 backdrop-blur-sm text-center">
      <CardContent className="p-6">
        <div className="text-3xl mb-2">{stat.icon}</div>
        <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
        <div className="text-green-200 text-sm">{stat.label}</div>
      </CardContent>
    </Card>
  );
}

// BeliefCard component
function BeliefCard({ belief }: { belief: typeof beliefSections[0] }) {
  return (
    <Card className="bg-primary/20 border-primary/30 backdrop-blur-sm hover:bg-primary/30 transition-all duration-300">
      <CardContent className="p-8">
        <div className="text-4xl mb-4 text-center">{belief.icon}</div>
        <h3 className="text-xl font-semibold text-white mb-4 text-center">{belief.title}</h3>
        <p className="text-gray-300 leading-relaxed text-center">{belief.description}</p>
      </CardContent>
    </Card>
  );
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-emerald-900 to-black">
      <div className="container mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            About <span className="bg-gradient-to-r from-green-300 to-red-400 bg-clip-text text-transparent">Us</span>
          </h1>

          <div className="max-w-4xl mx-auto text-left mt-12">
            <h2 className="text-3xl font-bold text-white mb-6">
              Where the ‘Ilm of the Ahl al-Bayt (a) is Illuminated
            </h2>

            <div className="space-y-6 text-gray-300 leading-relaxed">
              <p>
                Welcome to <span className="font-semibold">Al Ja‘fariyya</span> — an online community dedicated to Twelver
                Shi‘a (Ja‘farī) studies. We explore creed, law, spirituality, and history through the guidance of the
                Qur’an, authentic ḥadīth, and the teachings of the Twelve Imams (a).
              </p>

              <p>
                Our forum gathers students, seekers, and readers to deepen their understanding of Shi‘i jurisprudence,
                theology, ethics, and contemporary issues. We value clarity, humility, and sincerity while engaging with
                classical and modern scholarship.
              </p>

              <p>
                You’ll find curated resources—from primary texts and hawza syllabi to lectures and study guides—aimed at
                building a grounded grasp of uṣūl and furū‘, ḥadīth methodology, and the practice of ijtihād and taqlīd
                within the marja‘iyyah.
              </p>

              <p>
                Whether you’re beginning your journey or advancing your readings, you are welcome to ask, share, and
                learn in a supportive environment that prioritizes adab and evidence.
              </p>

              <p>
                Join us as we nurture love for the Ahl al-Bayt (a), strengthen community, and strive for knowledge that
                refines the soul and serves society.
              </p>
            </div>
          </div>
        </div>

        {/* Universe of Ilm Section */}
        <div className="mb-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://ext.same-assets.com/4138622892/3457436693.png"
                alt="A Universe of ‘Ilm"
                className="w-full rounded-lg"
              />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">A Universe of ‘Ilm</h3>
              <p className="text-gray-300 leading-relaxed">
                From thoughtful question threads to shared moments of insight, our community spans backgrounds and
                experiences—united by devotion to the Qur’an and the teachings of the Prophet ﷺ and his Household.
              </p>
            </div>
          </div>
        </div>

        {/* Community Stats */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Our Growing Majlis</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {communityStats.map((stat, index) => (
              <StatCard key={index} stat={stat} />
            ))}
          </div>
        </div>

        {/* What We Embrace */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">What We Embrace</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {beliefSections.map((belief, index) => (
              <BeliefCard key={index} belief={belief} />
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mb-16">
          <Card className="bg-primary/20 border-primary/30 backdrop-blur-sm">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold text-white mb-6">Ready to Join Our Server</h2>
              <p className="text-gray-300 text-lg mb-8 max-w-3xl mx-auto leading-relaxed">
                Your next spark of understanding and your next meaningful connection are one step away. At Al Ja‘fariyya,
                we learn together—reviving knowledge, refining character, and honoring the legacy of the Ahl al-Bayt (a).
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-accent hover:bg-accent/80 text-white px-8 py-3">
                  👥 Join Our Community
                </Button>
                <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/20 px-8 py-3">
                  📚 Explore Our Library
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center pt-8 border-t border-primary/30">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-red-500 rounded-full flex items-center justify-center border border-green-300">
              <div className="text-white text-xs">☪</div>
            </div>
            <span className="text-white font-semibold text-lg">𝘼𝙡 𝙅𝙖‘𝙛𝙖𝙧𝙞𝙮𝙮𝙖</span>
          </div>
          <p className="text-gray-300 italic">
            “May Allah have mercy on the one who revives our affair.” — Imām Ja‘far al-Ṣādiq (a)
          </p>
          <div className="flex justify-center gap-6 mt-4">
            <Button variant="ghost" size="sm" className="text-primary hover:text-white">
              Discord
            </Button>
            <Button variant="ghost" size="sm" className="text-primary hover:text-white">
              TikTok
            </Button>
            <Button variant="ghost" size="sm" className="text-primary hover:text-white">
              Instagram
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
