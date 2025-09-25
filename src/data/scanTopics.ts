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
  scans?: Scan[];
}

export interface ScanCategory {
  id: string; // e.g. "fiqh", "history"
  name: string; // Human-readable category
  description: string;
  topics: ScanTopic[];
}

// ✅ Grouped categories
export const scanCategories: ScanCategory[] = [
  {
    id: "fiqh",
    name: "Fiqh",
    description: "Scans regarding Shi‘i jurisprudence and rulings.",
    topics: [
      { id: 1, term: "mutah", arabic: "المتعة", description: "Scans on temporary marriage in Shi‘i fiqh." },
      { id: 7, term: "shia-salat", arabic: "صلاة الشيعة", description: "Scans proving the Shī‘ī format of ṣalāt." },
      { id: 27, term: "fiqh", arabic: "الفقه", description: "Scans covering jurisprudence (fiqh)." },
    ],
  },
  {
    id: "history",
    name: "History",
    description: "Historical events and personalities in Shi‘i thought.",
    topics: [
      { id: 2, term: "muawiya", arabic: "معاوية", description: "Scans about Mu‘āwiya ibn Abī Sufyān." },
      { id: 4, term: "pen-and-paper", arabic: "قلم وورق", description: "Scans on the ‘pen and paper’ incident before the Prophet’s ﷺ death." },
      { id: 8, term: "shia-states", arabic: "الدول الشيعية", description: "Scans on historical Shī‘ī states and dynasties." },
      { id: 11, term: "tabuk", arabic: "تبوك", description: "Scans about the expedition of Tabūk." },
      { id: 17, term: "umar", arabic: "عمر", description: "Scans on the life and controversies of ‘Umar ibn al-Khaṭṭāb." },
      { id: 18, term: "muhammad", arabic: "محمد", description: "Scans about the Prophet Muḥammad ﷺ in Shī‘ī sources." },
      { id: 19, term: "abu-bakr", arabic: "أبو بكر", description: "Scans on Abū Bakr and leadership after the Prophet." },
      { id: 22, term: "aisha", arabic: "عائشة", description: "Scans on ‘Ā’isha’s role in history and politics." },
      { id: 24, term: "maghazi", arabic: "المغازي", description: "Scans related to early battles and expeditions." },
      { id: 26, term: "fatimiyya", arabic: "الفاطمية", description: "Scans on Sayyida Fāṭima (a) and Fadak issue." },
      { id: 28, term: "gen-one", arabic: "الجيل الأول", description: "Scans on the first generation after the Prophet." },
      { id: 29, term: "gen-two", arabic: "الجيل الثاني", description: "Scans on the second generation of Muslims." },
      { id: 31, term: "husayn-b-ali", arabic: "الحسين بن علي", description: "Scans on Imām al-Ḥusayn (a) and Karbala." },
    ],
  },
  {
    id: "refutations",
    name: "Refutations",
    description: "Responses to Nasibism and anti-Shi‘i claims.",
    topics: [
      { id: 3, term: "nasibism", arabic: "النصب", description: "Scans refuting Nasibism and its claims." },
      { id: 6, term: "shia-refutations", arabic: "الردود على الشيعة", description: "Scans addressing anti-Shī‘ī refutations." },
      { id: 33, term: "ibn-taymiyya", arabic: "ابن تيمية", description: "Scans critiquing Ibn Taymiyyah’s views." },
    ],
  },
  {
    id: "hadith",
    name: "Hadith",
    description: "Scans evaluating Sunni and Shi‘i ḥadīth traditions.",
    topics: [
      { id: 5, term: "sahih-al-copium", arabic: "صحيح", description: "Critical scans on Sunni Ṣaḥīḥ collections." },
      { id: 20, term: "abu-hurayra", arabic: "أبو هريرة", description: "Scans evaluating Abū Hurayrah’s narrations." },
      { id: 32, term: "historians-narrators", arabic: "المؤرخون والرواة", description: "Scans evaluating historians and narrators." },
    ],
  },
  {
    id: "imamate",
    name: "Imamate",
    description: "Scans proving Imamate and wilayah as fundamentals of religion.",
    topics: [
      { id: 9, term: "succession-of-ali", arabic: "خلافة علي", description: "Scans proving Imām ‘Alī’s rightful succession." },
      { id: 23, term: "ali-b-abi-talib", arabic: "علي بن أبي طالب", description: "Scans on Imām ‘Alī ibn Abī Ṭālib (a)." },
      { id: 30, term: "hasan-b-ali", arabic: "الحسن بن علي", description: "Scans on Imām al-Ḥasan ibn ‘Alī (a)." },
      { id: 35, term: "imam-mahdi", arabic: "الإمام المهدي", description: "Scans on the awaited Imām al-Mahdī (a)." },
      { id: 36, term: "imams", arabic: "الأئمة", description: "Scans on the Twelve Imāms (a)." },
    ],
  },
  {
    id: "aqidah",
    name: "Aqidah",
    description: "Scans on beliefs and theological principles.",
    topics: [
      { id: 10, term: "tabarra", arabic: "التبرأ", description: "Scans on the doctrine of tabarrā’ (disassociation)." },
      { id: 12, term: "tahrif", arabic: "التحريف", description: "Scans refuting Qur’an distortion claims." },
      { id: 15, term: "tawhid", arabic: "التوحيد", description: "Scans affirming true monotheism." },
      { id: 34, term: "imamate", arabic: "الإمامة", description: "Scans proving Imamate as a fundamental of religion." },
      { id: 21, term: "adalat-al-sahaba", arabic: "عدالة الصحابة", description: "Scans critiquing the doctrine of universal justice of companions." },
    ],
  },
  {
    id: "theology",
    name: "Theology",
    description: "Philosophical and theological discussions.",
    topics: [
      { id: 13, term: "tajseem", arabic: "التجسيم", description: "Scans refuting anthropomorphism." },
      { id: 16, term: "taqiyya", arabic: "التقية", description: "Scans on precautionary dissimulation (taqiyya)." },
    ],
  },
  {
    id: "spirituality",
    name: "Spirituality",
    description: "Scans on spirituality, supplication, and tawassul.",
    topics: [
      {
        id: 14,
        term: "tawassul",
        arabic: "التوسل",
        description: "Scans supporting tawassul through Ahl al-Bayt (a).",
        scans: [
          {
            img: "https://i.imgur.com/Ew9Q52J.jpg",
            caption: "Tawassul is a fiqhi matter",
            context:
              "Al-Shaykh Ali Ale Muhsin says in the Muqadima of Shaykh Ahmad Salman's Kitab al-Waseela, pg. 6, Although tawassul is a jurisprudential matter...",
          },
          {
            img: "https://i.imgur.com/SJ7h16c.jpg",
            caption: "Visiting the Prophet's grave",
            context:
              "Sahih b. Hibban Vol 12, pg. 506, Hadith # 5694... Usama ibn Zayd praying near the grave of the Messenger of Allah...",
          },
          {
            img: "https://i.imgur.com/d3LVAOk.jpg",
            caption: "Ibn Hanbal doing Istighatha",
            context:
              "Al-Jami’ li-’Ulum al-Imam Ahmad, vol. 8, pg. 74... ‘O servants of Allah, guide us to the path!’",
          },
          {
            img: "https://imgur.com/ZUG8lGj.jpg",
            caption: "The Departed Still Listen",
            context:
              "Majma’ Al-Fatawa Vol. 12, Pg 492 by Ibn Taymiyyah... companions denied the dead can hear the call of the living...",
          },
          {
            img: "https://imgur.com/U0FPWRb.jpg",
            caption: "Ibn Taymiyyah: The Dead Recognize Visitors and Respond",
            context:
              "Majma’ Al-Fatawa Vol. 24, Pg 185 by Ibn Taymiyyah... ‘No one passes by the grave of his believer brother... but the dead would recognise him and greet him back.’",
          },
        ],
      },
    ],
  },
];
