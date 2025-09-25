"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "@/components/AuthModal";

const INSTAGRAM_URL = "https://instagram.com/jaafariyyah";

// 🌌 Starfield background
function SidebarStarField() {
  const stars = Array.from({ length: 50 }, (_, i) => {
    const x = (i * 73 + 23) % 100;
    const y = (i * 137 + 47) % 100;
    const size = ((i * 19) % 10) > 8 ? 2 : 1;
    const opacity = 0.3 + ((i * 29) % 30) / 100;
    const delay = (i * 43) % 3;
    const duration = 2 + ((i * 17) % 20) / 10;
    return { x, y, size, opacity, delay, duration };
  });

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
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

// 🌙 Logo
function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center border border-green-300 shadow-lg shadow-green-500/30">
        <span className="text-white text-sm">☪</span>
      </div>
      <span className="text-white font-bold text-lg tracking-wide drop-shadow">
        Al Jaʿfariyyah
      </span>
    </div>
  );
}

// 👤 User Profile
function UserProfile() {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-3 w-full p-3 rounded-lg bg-green-800/20 hover:bg-green-700/30 transition-all border border-green-600/40 shadow-inner"
      >
        <img
          src={user.avatar}
          alt={user.name}
          className="w-10 h-10 rounded-full ring-2 ring-green-400 shadow-lg"
        />
        <div className="flex-1 text-left">
          <p className="text-white text-sm font-medium">{user.name}</p>
          <p className="text-gray-400 text-xs">Community Member</p>
        </div>
        <span className="text-gray-400">▼</span>
      </button>

      {showDropdown && (
        <div className="absolute bottom-full left-0 right-0 mb-2 bg-green-950/90 rounded-lg border border-green-600/30 backdrop-blur-sm shadow-lg">
          <div className="p-4">
            <p className="text-white text-sm font-medium mb-1">{user.name}</p>
            <p className="text-gray-400 text-xs mb-2">{user.email}</p>
            {user.joinedDate && (
              <p className="text-gray-500 text-xs mb-3">
                Joined {new Date(user.joinedDate).toLocaleDateString()}
              </p>
            )}
            <Button
              onClick={() => {
                logout();
                setShowDropdown(false);
              }}
              variant="ghost"
              size="sm"
              className="w-full text-left justify-start text-green-300 hover:text-white hover:bg-green-800/40"
            >
              🚪 Logout
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// 📂 Nav items
const navigationItems = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/books/", label: "Library", icon: "📚" },
  { href: "/videos/", label: "Lessons", icon: "🎥" },
  { href: "/forum/", label: "Forum", icon: "💬" },
  { href: "/scans/", label: "Scans", icon: "📄" },
  { href: "/about/", label: "About Us", icon: "ℹ️" },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, login } = useAuth();

  const handleAuth = (userData: { name: string; email: string }) => {
    login(userData);
  };

  const handleInstagramFollow = () => {
    window.open(INSTAGRAM_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      {/* Mobile Toggle */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-green-600 hover:bg-green-700 text-white shadow-lg"
        size="sm"
      >
        {isOpen ? "✕" : "☰"}
      </Button>

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-screen w-72
          bg-gradient-to-b from-green-950 via-green-900/95 to-gray-900/90
          border-r border-green-700/40 backdrop-blur-md
          flex flex-col z-40 transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <SidebarStarField />

        <div className="relative z-10 h-full flex flex-col">
          {/* Content that scrolls */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Logo */}
            <div className="mb-8 border-b border-green-700/40 pb-4">
              <Link href="/" onClick={() => setIsOpen(false)}>
                <Logo />
              </Link>
            </div>

            {/* Auth / Profile */}
            {isAuthenticated ? (
              <div className="mb-6">
                <UserProfile />
              </div>
            ) : (
              <div className="mb-6">
                <div className="bg-green-800/20 rounded-lg p-4 border border-green-600/30 shadow-inner">
                  <p className="text-white text-sm mb-3">
                    Join our community to connect with seekers of knowledge.
                  </p>
                  <Button
                    onClick={() => setShowAuthModal(true)}
                    size="sm"
                    className="w-full bg-green-600 hover:bg-green-700 text-white shadow"
                  >
                    Login / Sign Up
                  </Button>
                </div>
              </div>
            )}

            {/* Navigation */}
            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href.replace(/\/$/, "")));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 p-3 rounded-md transition-all duration-300 ${
                      isActive
                        ? "bg-green-700/30 border-l-4 border-green-400 text-white shadow-md"
                        : "hover:bg-green-800/30 text-gray-300 hover:text-white"
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Footer stays pinned bottom */}
          <div className="p-6 border-t border-green-700/40">
            <Button
              onClick={handleInstagramFollow}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 text-white py-3 shadow-lg"
            >
              📸 Follow us on Instagram
            </Button>
            <p className="text-gray-400 text-xs italic text-center mt-4">
              “May Allah have mercy on the one who revives our affair.” — Imām Jaʿfar al-Ṣādiq (a)
            </p>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuth={handleAuth}
      />
    </>
  );
}
