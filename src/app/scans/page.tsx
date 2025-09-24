import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// 🔎 Full list of topics from your screenshots
const scanTopics = [
  { id: 1, term: "mutah", arabic: "المتعة", description: "Scans on temporary marriage in Shi‘i fiqh.", category: "Fiqh" },
  { id: 2, term: "muawiya", arabic: "معاوية", description: "Scans about Mu‘āwiya ibn Abī Sufyān.", category: "History" },
  { id: 3, term: "nasibism", arabic: "النصب", description: "Scans refuting Nasibism and its claims.", category: "Refutations" },
  { id: 4, term: "pen-and-paper", arabic: "قلم وورق", description: "Scans on the ‘pen and paper’ incident before the Prophet’s (ﷺ) death.", category: "History" },
  { id: 5, term: "sahih-al-copium", arabic: "صحيح", description: "Critical scans on Sunni Ṣaḥīḥ collections.", category: "Hadith" },
  { id: 6, term: "shia-refutations", arabic: "الردود على الشيعة", description: "Scans addressing anti-Shī‘ī refutations.", category: "Debates" },
  { id: 7, term: "shia-salat", arabic: "صلاة الشيعة", description: "Scans proving the Shī‘ī format of ṣalāt.", category: "Fiqh" },
  { id: 8, term: "shia-states", arabic: "الدول الشيعية", description: "Scans on historical Shī‘ī states and dynasties.", category: "History" },
  { id: 9, term: "succession-of-ali", arabic: "خلافة علي", description: "Scans proving Imām ‘Alī’s rightful succession.", category: "Imamate" },
  { id: 10, term: "tabarra", arabic: "التبرأ", description: "Scans on the doctrine of tabarrā’ (disassociation).", category: "Aqidah" },
  { id: 11, term: "tabuk", arabic: "تبوك", description: "Scans about the expedition of Tabūk.", category: "History" },
  { id: 12, term: "tahrif", arabic: "التحريف", description: "Scans refuting Qur’an distortion claims.", category: "Aqidah" },
  { id: 13, term: "tajseem", arabic: "التجسيم", description: "Scans refuting anthropomorphism.", category: "Theology" },
  { id: 14, term: "tawassul", arabic: "التوسل", description: "Scans supporting tawassul through Ahl al-Bayt (a).", category: "Spirituality" },
  { id: 15, term: "tawhid", arabic: "التوحيد", description: "Scans affirming true monotheism.", category: "Aqidah" },
  { id: 16, term: "taqiyya", arabic: "التقية", description: "Scans on precautionary dissimulation (taqiyya).", category: "Theology" },
  { id: 17, term: "umar", arabic: "عمر", description: "Scans on the life and controversies of ‘Umar ibn al-Khaṭṭāb.", category: "History" },
  { id: 18, term: "muhammad", arabic: "محمد", description: "Scans about the Prophet Muḥammad ﷺ in Shī‘ī sources.", category: "Seerah" },
  { id: 19, term: "abu-bakr", arabic: "أبو بكر", description: "Scans on Abū Bakr and leadership after the Prophet.", category: "History" },
  { id: 20, term: "abu-hurayra", arabic: "أبو هريرة", description: "Scans evaluating Abū Hurayrah’s narrations.", category: "Hadith" },
  { id: 21, term: "adalat-al-sahaba", arabic: "عدالة الصحابة", description: "Scans critiquing the doctrine of universal justice of companions.", category: "Theology" },
  { id: 22, term: "aisha", arabic: "عائشة", description: "Scans on ‘Ā’isha’s role in history and politics.", category: "History" },
  { id: 23, term: "ali-b-abi-talib", arabic: "علي بن أبي طالب", description: "Scans on Imām ‘Alī ibn Abī Ṭālib (a).", category: "Imamate" },
  { id: 24, term: "maghazi", arabic: "المغازي", description: "Scans related to early battles and expeditions.", category: "History" },
  { id: 25, term: "ali-in-the-quran", arabic: "علي في القرآن", description: "Scans on verses of Qur’an proving ‘Alī’s wilayah.", category: "Quran" },
  { id: 26, term: "fatimiyya", arabic: "الفاطمية", description: "Scans on Sayyida Fāṭima (a) and Fadak issue.", category: "History" },
  { id: 27, term: "fiqh", arabic: "الفقه", description: "Scans covering jurisprudence (fiqh).", category: "Fiqh" },
  { id: 28, term: "gen-one", arabic: "الجيل الأول", description: "Scans on the first generation after the Prophet.", category: "History" },
  { id: 29, term: "gen-two", arabic: "الجيل الثاني", description: "Scans on the second generation of Muslims.", category: "History" },
  { id: 30, term: "hasan-b-ali", arabic: "الحسن بن علي", description: "Scans on Imām al-Ḥasan ibn ‘Alī (a).", category: "Imamate" },
  { id: 31, term: "husayn-b-ali", arabic: "الحسين بن علي", description: "Scans on Imām al-Ḥusayn (a) and Karbala.", category: "History" },
  { id: 32, term: "historians-narrators", arabic: "المؤرخون والرواة", description: "Scans evaluating historians and narrators.", category: "Hadith" },
  { id: 33, term: "ibn-taymiyya", arabic: "ابن تيمية", description: "Scans critiquing Ibn Taymiyyah’s views.", category: "Refutations" },
  { id: 34, term: "imamate", arabic: "الإمامة", description: "Scans proving Imamate as a fundamental of religion.", category: "Aqidah" },
  { id: 35, term: "imam-mahdi", arabic: "الإمام المهدي", description: "Scans on the awaited Imām al-Mahdī (a).", category: "Imamate" },
  { id: 36, term: "imams", arabic: "الأئمة", description: "Scans on the Twelve Imāms (a).", category: "Imamate" }
];

// TopicCard component
function TopicCard({ topic }: { topic: typeof scanTopics[0] }) {
  return (
    <Card className="bg-green-900/30 border-green-600/30 backdrop-blur-sm hover:bg-green-900/40 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="bg-green-600/40 text-green-200 text-xs px-2 py-1 rounded">Topic</span>
            <span className="bg-emerald-600/40 text-emerald-200 text-xs px-2 py-1 rounded">{topic.category}</span>
          </div>
        </div>
        <h3 className="text-white font-bold text-xl mb-2">
          {topic.term} • {topic.arabic}
        </h3>
        <p className="text-gray-300 text-sm mb-6 leading-relaxed">{topic.description}</p>
        <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-3">📖 Open Topic</Button>
      </CardContent>
    </Card>
  );
}

export default function ScansPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-emerald-950 to-black">
      <div className="container mx-auto px-6 py-8">
        {/* Main Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Scans</h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            A collection of scans regarding creed, fiqh, history, and refutations within Twelver Shi‘i scholarship.
          </p>
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {scanTopics.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>

        {/* Footer */}
        <div className="text-center pt-8 border-t border-green-600/30">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center border border-green-300">
              <div className="text-white text-xs">☪</div>
            </div>
            <span className="text-white font-semibold text-lg">𝘼𝙡 𝙅𝙖‘𝙛𝙖𝙧𝙞𝙮𝙮𝙖</span>
          </div>
          <p className="text-gray-300 italic">“May Allah have mercy on the one who revives our affair.” — Imām Ja‘far al-Ṣādiq (a)</p>
        </div>
      </div>
    </div>
  );
}
