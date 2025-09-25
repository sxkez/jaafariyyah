// src/data/scanTopics.ts

export interface Scan {
  img: string;
  caption: string;
  context: string;
}

export interface ScanTopic {
  id: number;
  term: string;
  arabic: string;
  description: string;
  category: string;
  scans?: Scan[];
}

export const scanTopics: ScanTopic[] = [
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

  // ✅ Tawassul has scans for now
  {
    id: 14,
    term: "tawassul",
    arabic: "التوسل",
    description: "Scans supporting tawassul through Ahl al-Bayt (a).",
    category: "Spirituality",
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
          "Al-Jami’ li-’Ulum al-Imam Ahmad, vol. 8, pg. 74, Abdullah said: I heard my father say: “I performed five Hajj pilgrimages—two of them while riding and three while walking, or two while walking and three while riding. During one of the pilgrimages, I lost my way while walking, so I began saying: ‘O servants of Allah, guide us to the path!’ I kept saying that until I found the road.”",
      },
    ],
  },

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
  { id: 36, term: "imams", arabic: "الأئمة", description: "Scans on the Twelve Imāms (a).", category: "Imamate" },
];
