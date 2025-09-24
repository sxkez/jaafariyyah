import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Sample topic data based on the scraped content
const scanTopics = [
  {
    id: 1,
    term: "istiwā",
    arabic: "الاستواء",
    description: "Open scans related to istiwā.",
    category: "Aqidah"
  },
  {
    id: 2,
    term: "tafwīd",
    arabic: "التفويض",
    description: "Open scans related to tafwīd.",
    category: "Aqidah"
  },
  {
    id: 3,
    term: "mutashābihāt",
    arabic: "المتشابهات",
    description: "Open scans related to mutashābihāt.",
    category: "Aqidah"
  },
  {
    id: 4,
    term: "makān",
    arabic: "المكان",
    description: "Open scans related to makān.",
    category: "Aqidah"
  },
  {
    id: 5,
    term: "jihah",
    arabic: "الجهة",
    description: "Open scans related to jihah.",
    category: "Aqidah"
  },
  {
    id: 6,
    term: "kalāmullāh",
    arabic: "كلام الله",
    description: "Open scans related to kalāmullāh.",
    category: "Aqidah"
  },
  {
    id: 7,
    term: "īmān",
    arabic: "الإيمان",
    description: "Open scans related to īmān.",
    category: "Aqidah"
  },
  {
    id: 8,
    term: "'ulūww",
    arabic: "العلو",
    description: "Open scans related to 'ulūww.",
    category: "Aqidah"
  },
  {
    id: 9,
    term: "ṣifāt",
    arabic: "الصفات",
    description: "Open scans related to ṣifāt.",
    category: "Aqidah"
  },
  {
    id: 10,
    term: "jism",
    arabic: "الجسم",
    description: "Open scans related to jism.",
    category: "Aqidah"
  }
];

// TopicCard component
function TopicCard({ topic }: { topic: typeof scanTopics[0] }) {
  return (
    <Card className="bg-purple-900/30 border-purple-600/30 backdrop-blur-sm hover:bg-purple-900/40 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="bg-purple-600/40 text-purple-200 text-xs px-2 py-1 rounded">
              Topic
            </span>
            <span className="bg-blue-600/40 text-blue-200 text-xs px-2 py-1 rounded">
              {topic.category}
            </span>
          </div>
        </div>

        <h3 className="text-white font-bold text-xl mb-2">
          {topic.term} • {topic.arabic}
        </h3>

        <p className="text-gray-300 text-sm mb-6 leading-relaxed">
          {topic.description}
        </p>

        <Button
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3"
        >
          📖 Open Topic
        </Button>
      </CardContent>
    </Card>
  );
}

export default function ScansPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-indigo-950 to-blue-950">
      <div className="container mx-auto px-6 py-8">
        {/* Main Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Scans
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Scans regarding Aqidah, Fiqh and other Islamic Sciences which can be used
            to prove the Deen of the Ahlus Sunnah Wal Jama'ah
          </p>
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {scanTopics.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>

        {/* Footer */}
        <div className="text-center pt-8 border-t border-purple-600/30">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center border border-purple-300">
              <div className="text-white text-xs">☪</div>
            </div>
            <span className="text-white font-semibold text-lg">𝘼𝙡 𝙃𝙖𝙣𝙖𝙛𝙞𝙮𝙮𝙖</span>
          </div>
          <p className="text-gray-300 italic">
            "When a hadith is authentic, then that is my madhab."
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
