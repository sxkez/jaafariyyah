"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuth: (user: { name: string; email: string }) => void;
}

export function AuthModal({ isOpen, onClose, onAuth }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      alert("Please fill in all required fields");
      return;
    }
    if (!isLogin && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (!isLogin && !formData.name) {
      alert("Please enter your name");
      return;
    }
    onAuth({
      name: formData.name || formData.email.split("@")[0],
      email: formData.email,
    });
    onClose();
    setFormData({ name: "", email: "", password: "", confirmPassword: "" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gradient-to-br from-green-950 via-purple-950 to-indigo-950 border-green-700/40 backdrop-blur-sm">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">
              {isLogin ? "Login" : "Join Al Ja‘fariyya"}
            </h2>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-green-800/40"
            >
              ✕
            </Button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-green-200 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-green-900/30 border border-green-700/40 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
                  placeholder="Enter your full name"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-green-200 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-green-900/30 border border-green-700/40 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-green-200 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-green-900/30 border border-green-700/40 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
                placeholder="Enter your password"
                required
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-green-200 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-green-900/30 border border-green-700/40 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
                  placeholder="Confirm your password"
                />
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-green-700 hover:bg-green-800 text-white py-3"
            >
              {isLogin ? "Login" : "Create Account"}
            </Button>
          </form>

          {/* Switch login/signup */}
          <div className="mt-6 text-center">
            <p className="text-gray-300 text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </p>
            <Button
              variant="ghost"
              onClick={() => setIsLogin(!isLogin)}
              className="text-green-300 hover:text-white mt-2"
            >
              {isLogin ? "Create Account" : "Login"}
            </Button>
          </div>

          {/* OAuth */}
          <div className="mt-6 pt-6 border-t border-green-700/40">
            <div className="text-center">
              <p className="text-gray-400 text-xs mb-4">Or continue with</p>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full border-green-500 text-green-300 hover:bg-green-700/30"
                  onClick={() =>
                    alert("Discord OAuth integration — replace with real")
                  }
                >
                  👥 Continue with Discord
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-green-500 text-green-300 hover:bg-green-700/30"
                  onClick={() =>
                    alert("Google OAuth integration — replace with real")
                  }
                >
                  📧 Continue with Google
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
