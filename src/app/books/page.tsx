"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PDFViewer } from "@/components/PDFViewer";
import { BookRecommendationsWidget } from "@/components/BookRecommendationsWidget";

// 📚 Your full sampleBooks stays exactly as you had it
const sampleBooks = [
  {
    id: 1,
    title: "Al-Kāfī (Uṣūl al-Kāfī)",
    titleArabic: "الكافي – أصول الكافي",
    author: "Shaykh al-Kulaynī (d. 329 AH)",
    description:
      "Foundational ḥadīth collection of Twelver Shi‘ism. Uṣūl covers creed, virtue, and ethics transmitted from the Ahl al-Bayt (a).",
    rating: 5,
    tags: ["Hadith", "Ahl al-Bayt", "Classical"],
    language: "AR/EN",
    cover: "https://images.arabicbookshop.net/132-313.jpg",
    category: "hadith",
    pdfUrl: "https://dn720003.ca.archive.org/0/items/20210905_20210905_1356/%20%20%D8%A7%D9%84%D9%83%D8%A7%D9%81%D9%8A.pdf"
  },
  {
    id: 2,
    title: "Nahj al-Balāgha",
    titleArabic: "نهج البلاغة",
    author: "Sharīf al-Raḍī (comp.)",
    description:
      "Sermons, letters, and aphorisms of Imām ‘Alī (a), central to Shi‘i ethics, theology, and eloquence.",
    rating: 5,
    tags: ["Ethics", "Theology", "Sermons"],
    language: "AR/EN",
    cover: "https://arabicbookslondon.com/wp-content/uploads/2015/07/ABL786000015_Sharh-Nahj-al-Balaghah-e1437388044196-scaled.jpg",
    category: "creed",
    pdfUrl: "https://ia902801.us.archive.org/6/items/Nahjul-Balagha/NahjulBalaghavol.1-TranslatedByYasinAlJibouri.pdf"
  },
  {
    id: 3,
    title: "Al-Ṣaḥīfa al-Sajjādiyya",
    titleArabic: "الصحيفة السجادية",
    author: "Imām ‘Alī Zayn al-‘Ābidīn (a)",
    description:
      "A devotional masterpiece of supplications that shape Shi‘i spirituality and akhlāq.",
    rating: 5,
    tags: ["Du‘ā’", "Spirituality", "Devotion"],
    language: "AR/EN",
    cover: "https://www.shiabooks99p.com/wp-content/uploads/2022/05/m_Al-sahifat-Al-Sajjadiyya-Copy.jpg",
    category: "creed",
    pdfUrl: "https://www.duas.org/pdfs/Sahifa-Sajjadiya-simple-english.pdf"
  },
  {
    id: 4,
    title: "Man Lā Yaḥḍuruhu al-Faqīh",
    titleArabic: "من لا يحضره الفقيه",
    author: "Shaykh al-Ṣadūq (d. 381 AH)",
    description:
      "One of the Four Books of Shi‘i ḥadīth focusing on practical rulings and everyday jurisprudence.",
    rating: 5,
    tags: ["Hadith", "Fiqh", "Classical"],
    language: "AR",
    cover: "https://almurtaza.co.uk/wp-content/uploads/2016/02/00350-1.jpg",
    category: "jurisprudence",
    pdfUrl: "https://alkarbala.org/team/uploads/Man%20La%20Yahduruhu%20Al%20Faqih%20Vol.1.pdf"
  },
  {
    id: 5,
    title: "Tahdhīb al-Aḥkām",
    titleArabic: "تهذيب الأحكام",
    author: "Shaykh al-Ṭūsī (d. 460 AH)",
    description:
      "Major ḥadīth compendium arranged by fiqh chapters, foundational for Ja‘farī law.",
    rating: 5,
    tags: ["Hadith", "Fiqh", "Ja‘farī"],
    language: "AR",
    cover: "https://commons.wikishia.net/w/images/c/c5/%D8%AA%D9%87%D8%B0%DB%8C%D8%A8%E2%80%8C%D8%A7%D9%84%D8%A7%D8%AD%DA%A9%D8%A7%D9%85.jpg",
    category: "jurisprudence",
    pdfUrl: "https://dn721908.ca.archive.org/0/items/umairastro90_yahoo_05_201905/%D8%AA%D9%87%D8%B0%D9%8A%D8%A8%20%D8%A7%D9%84%D8%A3%D8%AD%D9%83%D8%A7%D9%85%20%D9%81%D9%8A%20%D8%B4%D8%B1%D8%AD%20%D8%A7%D9%84%D9%85%D9%82%D9%86%D8%B9%D8%A9%20-%20%D8%B4%D9%8A%D8%AE%20%D8%A7%D9%84%D8%B7%D8%A7%D8%A6%D9%81%D8%A9%20%D9%85%D8%AD%D9%85%D8%AF%20%D8%A8%D9%86%20%D8%A7%D9%84%D8%AD%D8%B3%D9%86%20%D8%A7%D9%84%D8%B7%D9%88%D8%B3%D9%8A%20-%20%D8%AC01.pdf"
  },
  {
    id: 6,
    title: "Al-Istibṣār",
    titleArabic: "الاستبصار",
    author: "Shaykh al-Ṭūsī (d. 460 AH)",
    description:
      "Companion to Tahdhīb, addressing apparently conflicting narrations and their reconciliation.",
    rating: 5,
    tags: ["Hadith", "Reconciliation", "Classical"],
    language: "AR",
    cover: "https://ext.same-assets.com/4138622892/4100104006.png",
    category: "hadith",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  },
  {
    id: 7,
    title: "‘Aqā’id al-Ṣadūq (al-I‘tiqādāt)",
    titleArabic: "عقائد الصدوق / الاعتقادات",
    author: "Shaykh al-Ṣadūq",
    description:
      "A concise exposition of Shi‘i creed covering tawḥīd, nubuwwa, imāma, and ma‘ād.",
    rating: 4,
    tags: ["Creed", "Theology", "Classical"],
    language: "AR/EN",
    cover: "https://ext.same-assets.com/4138622892/4100104007.png",
    category: "creed",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  },
  {
    id: 8,
    title: "Kashf al-Murād fī Sharḥ Tajrīd al-I‘tiqād",
    titleArabic: "كشف المراد في شرح تجريد الاعتقاد",
    author: "‘Allāma al-Ḥillī",
    description:
      "A classic commentary on Naṣīr al-Dīn al-Ṭūsī’s Tajrīd, central to kalām in the Shi‘i tradition.",
    rating: 5,
    tags: ["Kalām", "Philosophy", "Commentary"],
    language: "AR",
    cover: "https://ext.same-assets.com/4138622892/4100104008.png",
    category: "creed",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  },
  {
    id: 9,
    title: "Tafsīr al-Mīzān (Selections)",
    titleArabic: "الميزان في تفسير القرآن (مختارات)",
    author: "‘Allāma Ṭabāṭabā’ī",
    description:
      "A seminal thematic exegesis blending tradition and reason. Selections suitable for study circles.",
    rating: 5,
    tags: ["Tafsir", "Thematic", "Modern"],
    language: "AR/EN",
    cover: "https://ext.same-assets.com/4138622892/4100104009.png",
    category: "search",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  },
  {
    id: 10,
    title: "Mafātīḥ al-Jinān (Selections)",
    titleArabic: "مفاتيح الجنان (مختارات)",
    author: "Shaykh ‘Abbās al-Qummī",
    description:
      "A beloved compilation of supplications and ziyārāt used widely in devotional life.",
    rating: 5,
    tags: ["Du‘ā’", "Ziyārah", "Devotion"],
    language: "AR/EN",
    cover: "https://ext.same-assets.com/4138622892/4100104010.png",
    category: "creed",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  },
  {
    id: 11,
    title: "Farā’id al-Uṣūl (al-Rasā’il)",
    titleArabic: "فرائد الأصول (الرسائل)",
    author: "Shaykh al-Ansārī",
    description:
      "Monumental work in uṣūl al-fiqh shaping modern Ja‘farī legal theory; advanced students’ staple.",
    rating: 5,
    tags: ["Usul al-Fiqh", "Ijtihād", "Advanced"],
    language: "AR",
    cover: "https://ext.same-assets.com/4138622892/4100104011.png",
    category: "usul",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  },
  {
    id: 12,
    title: "Sharā’i‘ al-Islām",
    titleArabic: "شرائع الإسلام",
    author: "al-Muḥaqqiq al-Ḥillī",
    description:
      "A structured manual of Ja‘farī jurisprudence; widely taught and referenced across ḥawza curricula.",
    rating: 5,
    tags: ["Fiqh", "Manual", "Classical"],
    language: "AR",
    cover: "https://ext.same-assets.com/4138622892/4100104012.png",
    category: "jurisprudence",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  }
];

const filterTabs = [
  { id: "all", label: "All" },
  { id: "jurisprudence", label: "Jurisprudence" },
  { id: "creed", label: "Creed / Spirituality" },
  { id: "grammar", label: "Grammar" },
  { id: "hadith", label: "Hadith" },
  { id: "search", label: "Tafsir" },
  { id: "usul", label: "Usul al-Fiqh" }
];

// ⭐ StarRating
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1 mb-3">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`text-sm ${
            star <= rating ? "text-yellow-400" : "text-gray-600"
          }`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

// 📖 BookCard
function BookCard({
  book,
  onRead,
}: {
  book: typeof sampleBooks[0];
  onRead: (book: typeof sampleBooks[0]) => void;
}) {
  return (
    <Card className="bg-green-900/30 border-green-600/30 backdrop-blur-sm hover:bg-green-900/40 transition-all duration-300 overflow-hidden">
      <CardContent className="p-0">
        <div className="aspect-[3/4] bg-gradient-to-br from-green-800/50 to-red-800/50 relative overflow-hidden">
          <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
          <div className="absolute top-2 left-2">
            <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">
              {book.language}
            </span>
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-white font-semibold text-lg mb-1 line-clamp-2">{book.title}</h3>
          {book.titleArabic && (
            <h4 className="text-green-300 text-sm mb-2 font-arabic">
              {book.titleArabic}
            </h4>
          )}
          <p className="text-green-200 text-sm mb-2">{book.author}</p>

          <StarRating rating={book.rating} />

          <p className="text-gray-300 text-sm mb-4 line-clamp-3">
            {book.description}
          </p>

          <div className="flex flex-wrap gap-1 mb-4">
            {book.tags.map((tag) => (
              <span
                key={tag}
                className="bg-green-600/40 text-green-200 text-xs px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => onRead(book)}
              className="bg-red-600 hover:bg-red-700 text-white flex-1"
            >
              Read
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open(book.pdfUrl, "_blank")}
              className="border-green-400 text-green-300 hover:bg-green-500/20 flex-1"
            >
              📥 PDF
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function BooksPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedBook, setSelectedBook] = useState<typeof sampleBooks[0] | null>(null);
  const [isPDFViewerOpen, setIsPDFViewerOpen] = useState(false);

  const filteredBooks = useMemo(() => {
    let filtered = sampleBooks;

    if (activeFilter !== "all") {
      filtered = filtered.filter((book) => book.category === activeFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query) ||
          book.description.toLowerCase().includes(query) ||
          book.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          (book.titleArabic && book.titleArabic.includes(searchQuery))
      );
    }

    return filtered;
  }, [searchQuery, activeFilter]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-emerald-900 to-black">
      <div className="container mx-auto px-6 py-8">
        {/* Main Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Library</h1>
          <p className="text-lg text-gray-300">
            Showing {filteredBooks.length} of {sampleBooks.length} books
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {filterTabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeFilter === tab.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(tab.id)}
              className={
                activeFilter === tab.id
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "border-green-400 text-green-300 hover:bg-green-500/20"
              }
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Search Bar */}
        <form onSubmit={(e) => e.preventDefault()} className="max-w-md mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, author, or tag..."
              className="w-full px-4 py-3 bg-green-900/30 border border-green-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
            />
            <Button
              type="submit"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-red-600 hover:bg-red-700"
            >
              🔍
            </Button>
          </div>
        </form>

        {/* Recommendations Widget */}
        <div className="mb-8">
          <BookRecommendationsWidget
            currentCategory={activeFilter === "all" ? undefined : activeFilter}
            onBookSelect={(bookId) => {
              const book = sampleBooks.find((b) => b.id.toString() === bookId);
              if (book) setSelectedBook(book), setIsPDFViewerOpen(true);
            }}
          />
        </div>

        {/* Results */}
        {filteredBooks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-bold text-white mb-2">No books found</h3>
            <p className="text-gray-300 mb-6">Try adjusting your search or filter criteria</p>
            <Button
              onClick={() => {
                setSearchQuery("");
                setActiveFilter("all");
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} onRead={(b) => {setSelectedBook(b); setIsPDFViewerOpen(true);}} />
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-green-600/30">
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
            <Button variant="ghost" size="sm" className="text-green-300 hover:text-white">
              Discord
            </Button>
            <Button variant="ghost" size="sm" className="text-green-300 hover:text-white">
              TikTok
            </Button>
            <Button variant="ghost" size="sm" className="text-green-300 hover:text-white">
              Instagram
            </Button>
          </div>
        </div>
      </div>

      {/* PDF Viewer Modal */}
      {selectedBook && (
        <PDFViewer
          bookTitle={selectedBook.title}
          pdfUrl={selectedBook.pdfUrl}
          isOpen={isPDFViewerOpen}
          onClose={() => setIsPDFViewerOpen(false)}
          bookId={selectedBook.id.toString()}
        />
      )}
    </div>
  );
}
