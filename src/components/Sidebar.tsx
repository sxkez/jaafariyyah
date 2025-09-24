"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "@/components/AuthModal";

// Discord invite link – replace with your real Jaafariyyah invite
const DISCORD_INVITE_URL = "https://discord.gg/jaafariyyah"; 

// Starfield background component for sidebar with deterministic positions
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

// Logo component
function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center border border-green-300">
        <div className="text-white text-xs">☪</div>
      </div>
      <span className="text-white font-semibold text-lg">𝘼𝙡 𝙅𝙖𝙖𝙛𝙖𝙧𝙞𝙮𝙮𝙖𝙝</span>
    </div>
  );
}

// User Profile Component
function UserProfile() {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-green-800/30 transition-colors"
      >
        <img
          src={user.avatar}
          alt={user.name}
          className="w-8 h-8 rounded-full"
        />
        <div className="flex-1 text-left">
          <p className="text-white text-sm font-medium">{user.name}</p>
          <p className="text-gray-400 text-xs">Community Member</p>
        </div>
        <span className="text-gray-400">▼</span>
      </button>

      {showDropdown && (
        <div className="absolute bottom-full left-0 right-0 mb-2 bg-green-900/90 rounded-lg border border-green-600/30 backdrop-blur-sm">
          <div className="p-3">
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
              className="w-full text-left justify-start text-green-300 hover:text-white hover:bg-green-800/50"
            >
              🚪 Logout
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

const navigationItems = [
  { href: "/", label: "Home", icon: "🏠", description: "Welcome & Community" },
  { href: "/books/", label: "Library", icon: "📚", description: "Curated Shi‘i Texts" },
  { href: "/videos/", label: "Lessons", icon: "🎥", description: "Featured Lectures" },
  { href: "/forum/", label: "Forum", icon: "💬", description: "Community Discussions" },
  { href: "/scans/", label: "Scans", icon: "📄", description: "Islamic Sciences" },
  { href: "/about/", label: "About Us", icon: "ℹ️", description: "Our Community" }
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const pathname = usePathname();
  const { user, login, isAuthenticated } = useAuth();

  const handleDiscordJoin = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    window.open(DISCORD_INVITE_URL, "_blank", "noopener,noreferrer");
    setIsOpen(false);
  };

  const handleAuth = (userData: { name: string; email: string }) => {
    login(userData);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-green-600 hover:bg-green-700 text-white"
        size="sm"
      >
        {isOpen ? "✕" : "☰"}
      </Button>

      {/* Sidebar */}
      <div
        className={`
          fixed md:static top-0 left-0 h-full w-80 bg-gradient-to-b from-green-950 via-green-900 to-gray-900
          transform transition-transform duration-300 ease-in-out z-40
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          border-r border-green-600/30 relative overflow-hidden
        `}
      >
        <SidebarStarField />

        <div className="relative z-10 p-6 h-full flex flex-col">
          {/* Logo */}
          <div className="mb-8">
            <Link href="/" onClick={() => setIsOpen(false)}>
              <Logo />
            </Link>
          </div>

          {/* User Profile or Login Prompt */}
          {isAuthenticated ? (
            <div className="mb-6">
              <UserProfile />
            </div>
          ) : (
            <div className="mb-6">
              <div className="bg-green-800/20 rounded-lg p-4 border border-green-600/30">
                <p className="text-white text-sm mb-3">
                  Join our community to access exclusive content and connect with fellow students of knowledge.
                </p>
                <Button
                  onClick={() => setShowAuthModal(true)}
                  size="sm"
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  Login / Sign Up
                </Button>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1">
            <ul className="space-y-4">
              {navigationItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href.replace(/\/$/, "")));
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`
                        block p-4 rounded-lg transition-all duration-300 group
                        ${
                          isActive
                            ? "bg-green-600/40 border border-green-400/50"
                            : "hover:bg-green-800/30 border border-transparent hover:border-green-600/30"
                        }
                      `}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{item.icon}</span>
                        <span className="text-white font-semibold text-lg">
                          {item.label}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm pl-9">
                        {item.description}
                      </p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Discord CTA */}
          <div className="mt-8">
            <Button
              onClick={handleDiscordJoin}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 transition-all duration-300"
            >
              👥 {isAuthenticated ? "Join Our Discord" : "Login to Join Discord"}
            </Button>
          </div>

          {/* Footer Quote */}
          <div className="mt-6 text-center">
            <p className="text-gray-300 text-sm italic leading-relaxed">
              “May Allah have mercy on the one who revives our affair.” — Imām Ja‘far al-Ṣādiq (a)
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
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
