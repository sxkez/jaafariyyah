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
    confirmPassword: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
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

    // Simulate authentication - replace with real auth logic
    const user = {
      name: formData.name || formData.email.split('@')[0],
      email: formData.email
    };

    onAuth(user);
    onClose();

    // Reset form
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-purple-900/90 border-purple-600/30 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">
              {isLogin ? "Login" : "Join Al Hanafiyya"}
            </h2>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-purple-800"
            >
              ✕
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-purple-900/30 border border-purple-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                  placeholder="Enter your full name"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-purple-900/30 border border-purple-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-purple-900/30 border border-purple-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                placeholder="Enter your password"
                required
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-purple-900/30 border border-purple-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                  placeholder="Confirm your password"
                />
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3"
            >
              {isLogin ? "Login" : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-300 text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </p>
            <Button
              variant="ghost"
              onClick={() => setIsLogin(!isLogin)}
              className="text-purple-300 hover:text-white mt-2"
            >
              {isLogin ? "Create Account" : "Login"}
            </Button>
          </div>

          <div className="mt-6 pt-6 border-t border-purple-600/30">
            <div className="text-center">
              <p className="text-gray-400 text-xs mb-4">Or continue with</p>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full border-purple-400 text-purple-300 hover:bg-purple-500/20"
                  onClick={() => alert("Discord OAuth integration - replace with real Discord OAuth")}
                >
                  👥 Continue with Discord
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-purple-400 text-purple-300 hover:bg-purple-500/20"
                  onClick={() => alert("Google OAuth integration - replace with real Google OAuth")}
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
