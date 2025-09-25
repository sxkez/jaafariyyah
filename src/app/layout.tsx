import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "𝘼𝙡 𝙅𝙖‘𝙛𝙖𝙧𝙞𝙮𝙮𝙖 (الجعفرية)",
  description: "Ja‘farī (Twelver Shi‘i) scholarship that meets the inquisitive heart.",
  openGraph: {
    title: "Al Ja‘fariyya – Twelver Shi‘i Community",
    description:
      "Learn, share, and connect around the teachings of the Ahl al-Bayt (a). A hub for students and seekers of Shi‘i knowledge.",
    url: "https://your-domain.com",
    siteName: "Al Ja‘fariyya",
    images: [
      {
        url: "https://i.imgur.com/a/ySl8qpG",
        width: 1200,
        height: 630,
        alt: "Al Ja‘fariyya Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Al Ja‘fariyya – Twelver Shi‘i Community",
    description:
      "Explore resources on Shi‘i theology, fiqh, hadith, and spirituality with fellow students of knowledge.",
    images: ["https://i.imgur.com/a/ySl8qpG"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" className="dark">
      <body className="antialiased bg-gradient-to-br from-green-950 via-emerald-950 to-black font-sans">
        <AuthProvider>
          <div className="flex min-h-screen">
            {/* Sidebar (fixed width on desktop, overlay on mobile) */}
            <Sidebar />

            {/* Page content */}
            <main className="flex-1 md:ml-72 px-6 py-6 transition-all duration-300">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
