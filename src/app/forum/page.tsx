"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  updateDoc,
  doc,
  increment,
} from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

interface ForumPost {
  id: string;
  title: string;
  author: string;
  authorAvatar: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: any;
  likes: number;
  replies: number;
  isPinned: boolean;
  lastActivity: any;
}

const forumCategories = [
  { id: "all", name: "All Discussions", icon: "💬" },
  { id: "fiqh", name: "Ja‘farī Fiqh", icon: "⚖️" },
  { id: "aqidah", name: "‘Aqīdah & Imāmah", icon: "🕌" },
  { id: "hadith", name: "Ḥadīth & Rijāl", icon: "📜" },
  { id: "history", name: "History & Sirah", icon: "📖" },
  { id: "arabic", name: "Arabic Language", icon: "📝" },
  { id: "questions", name: "Questions & Answers", icon: "❓" },
];

function PostCard({
  post,
  onLike,
  onReply,
}: {
  post: ForumPost;
  onLike: (postId: string) => void;
  onReply: (postId: string) => void;
}) {
  const { user } = useAuth();

  const formatTimeAgo = (date: any) => {
    if (!date) return "just now";
    const now = new Date();
    const postDate = date.toDate ? date.toDate() : new Date(date);
    const diffMs = now.getTime() - postDate.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <Card className="bg-green-900/30 border-green-700/30 backdrop-blur-sm hover:bg-green-900/40 transition-all duration-300">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {post.isPinned && <span className="text-yellow-400 text-sm">📌</span>}
            <img
              src={post.authorAvatar}
              alt={post.author}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h3 className="text-white font-semibold text-lg hover:text-green-300 cursor-pointer">
                {post.title}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>by {post.author}</span>
                <span>•</span>
                <span>{formatTimeAgo(post.createdAt)}</span>
                <span>•</span>
                <span className="bg-green-700/40 text-green-200 px-2 py-1 rounded text-xs">
                  {forumCategories.find((c) => c.id === post.category)?.name}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mb-4">
          <p className="text-gray-300 leading-relaxed line-clamp-3">
            {post.content}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags?.map((tag) => (
            <span
              key={tag}
              className="bg-green-700/20 text-green-300 text-xs px-2 py-1 rounded hover:bg-green-700/30 cursor-pointer"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onLike(post.id)}
              className="text-sm text-gray-400 hover:text-white"
            >
              ❤️ {post.likes || 0}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onReply(post.id)}
              className="text-gray-400 hover:text-white text-sm"
            >
              💬 {post.replies || 0} replies
            </Button>

            <span className="text-gray-500 text-xs">
              Last activity {formatTimeAgo(post.lastActivity)}
            </span>
          </div>

          {user && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onReply(post.id)}
              className="border-green-400 text-green-300 hover:bg-green-500/20"
            >
              Reply
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function ForumPage() {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState("aqidah");
  const { user, isAuthenticated } = useAuth();

  // Load posts live from Firestore
  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setPosts(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as ForumPost[]
      );
    });
    return () => unsub();
  }, []);

  const filteredPosts = posts.filter((post) => {
    const categoryMatch =
      activeCategory === "all" || post.category === activeCategory;
    const searchMatch =
      searchQuery === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags?.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return categoryMatch && searchMatch;
  });

  // Create post
  const handleCreatePost = async () => {
    if (!user) return alert("Login first");

    await addDoc(collection(db, "posts"), {
      title: newTitle,
      content: newContent,
      category: newCategory,
      tags: [],
      author: user.displayName || user.email,
      authorAvatar:
        user.photoURL ||
        `https://ui-avatars.com/api/?name=${user.displayName || "User"}`,
      likes: 0,
      replies: 0,
      isPinned: false,
      createdAt: serverTimestamp(),
      lastActivity: serverTimestamp(),
    });

    setNewTitle("");
    setNewContent("");
    setShowNewPostModal(false);
  };

  // Like post
  const handleLike = async (postId: string) => {
    if (!user) return alert("Login first");
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, {
      likes: increment(1),
    });
  };

  // Reply placeholder
  const handleReply = (postId: string) => {
    if (!isAuthenticated) {
      alert("Please login to reply to posts");
      return;
    }
    alert(`Reply to post ${postId} — reply feature coming soon!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-gray-900 to-black">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Community Forum
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Ask, share, and learn together — centered on the Qur’an, Sunnah, and
            the teachings of the Ahl al-Bayt (a).
          </p>
        </div>

        {/* Search and New Post */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search discussions, topics, or tags..."
              className="w-full px-4 py-3 bg-green-900/30 border border-green-700/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
            />
          </div>
          {isAuthenticated && (
            <Button
              onClick={() => setShowNewPostModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3"
            >
              ✍️ Start Discussion
            </Button>
          )}
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          {forumCategories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(category.id)}
              className={
                activeCategory === category.id
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "border-green-400 text-green-300 hover:bg-green-500/20"
              }
            >
              {category.icon} {category.name}
            </Button>
          ))}
        </div>

        {/* Posts */}
        <div className="space-y-6">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-2xl font-bold text-white mb-2">
                No discussions found
              </h3>
              <p className="text-gray-300 mb-6">
                {searchQuery
                  ? "Try adjusting your search"
                  : "Be the first to start a discussion!"}
              </p>
              {isAuthenticated && (
                <Button
                  onClick={() => setShowNewPostModal(true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Start New Discussion
                </Button>
              )}
            </div>
          ) : (
            filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={handleLike}
                onReply={handleReply}
              />
            ))
          )}
        </div>

        {/* Login Prompt */}
        {!isAuthenticated && (
          <div className="text-center mt-12 p-8 bg-green-900/30 border border-green-700/30 rounded-lg">
            <h3 className="text-xl font-bold text-white mb-4">
              Join the Discussion
            </h3>
            <p className="text-gray-300 mb-6">
              Login to participate in discussions, ask questions, and share your
              knowledge
            </p>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              Login / Sign Up
            </Button>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-green-700/30">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center border border-green-300">
              <div className="text-white text-xs">☪</div>
            </div>
            <span className="text-white font-semibold text-lg">
              𝘼𝙡 𝙅𝙖‘𝙛𝙖𝙧𝙞𝙮𝙮𝙖
            </span>
          </div>
          <p className="text-gray-300 italic">
            “May Allah have mercy on the one who revives our affair.” — Imām
            Ja‘far al-Ṣādiq (a)
          </p>
        </div>
      </div>

      {/* New Post Modal */}
      {showNewPostModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-green-950 border border-green-700 rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold text-white mb-4">
              Start a New Discussion
            </h2>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Post title"
              className="w-full mb-3 px-3 py-2 bg-green-900/30 border border-green-700/30 rounded text-white"
            />
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Write your post..."
              className="w-full mb-3 px-3 py-2 bg-green-900/30 border border-green-700/30 rounded text-white"
              rows={5}
            />
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full mb-4 px-3 py-2 bg-green-900/30 border border-green-700/30 rounded text-white"
            >
              {forumCategories
                .filter((c) => c.id !== "all")
                .map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
            </select>
            <div className="flex justify-end gap-3">
              <Button
                onClick={() => setShowNewPostModal(false)}
                variant="ghost"
                className="text-gray-400 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreatePost}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Post
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
