"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { login, signup, googleLogin } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        if (!formData.name) throw new Error("Name is required");
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Passwords do not match");
        }
        await signup(formData.name, formData.email, formData.password);
      }
      onClose();
      setFormData({ name: "", email: "", password: "", confirmPassword: "" });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
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
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
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
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
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
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
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
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-green-900/30 border border-green-700/40 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
                  placeholder="Confirm your password"
                />
              </div>
            )}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-green-700 hover:bg-green-800 text-white py-3"
            >
              {loading
                ? "Please wait..."
                : isLogin
                ? "Login"
                : "Create Account"}
            </Button>
          </form>

          {/* Switch */}
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
          <div className="mt-6 pt-6 border-t border-green-700/40 text-center">
            <p className="text-gray-400 text-xs mb-4">Or continue with</p>
            <Button
              variant="outline"
              className="w-full border-green-500 text-green-300 hover:bg-green-700/30"
              onClick={googleLogin}
            >
              📧 Continue with Google
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
