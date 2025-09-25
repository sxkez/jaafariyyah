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

// ------------ Types ------------
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

interface Reply {
  id: string;
  content: string;
  author: string;
  authorAvatar: string;
  createdAt: any;
}

// ------------ Categories ------------
const forumCategories = [
  { id: "all", name: "All Discussions", icon: "💬" },
  { id: "fiqh", name: "Ja‘farī Fiqh", icon: "⚖️" },
  { id: "aqidah", name: "‘Aqīdah & Imāmah", icon: "🕌" },
  { id: "hadith", name: "Ḥadīth & Rijāl", icon: "📜" },
  { id: "history", name: "History & Sirah", icon: "📖" },
  { id: "arabic", name: "Arabic Language", icon: "📝" },
  { id: "questions", name: "Questions & Answers", icon: "❓" },
];

// ------------ Post Card ------------
function PostCard({ post, onLike }: { post: ForumPost; onLike: (postId: string) => void }) {
  const { user, isAuthenticated } = useAuth();
  const [replies, setReplies] = useState<Reply[]>([]);
  const [showReplies, setShowReplies] = useState(false);
  const [replyContent, setReplyContent] = useState("");

  // load replies when thread is opened
  useEffect(() => {
    if (!showReplies) return;
    const q = query(collection(db, "posts", post.id, "replies"), orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setReplies(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Reply[]);
    });
    return () => unsub();
  }, [showReplies, post.id]);

  const formatTimeAgo = (date: any) => {
    if (!date) return "just now";
    const now = new Date();
    const d = date.toDate ? date.toDate() : new Date(date);
    const diff = now.getTime() - d.getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const submitReply = async () => {
    if (!replyContent.trim()) return;
    const repliesRef = collection(db, "posts", post.id, "replies");
    await addDoc(repliesRef, {
      content: replyContent,
      author: user?.displayName || user?.email,
      authorAvatar:
        user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName || "User"}`,
      createdAt: serverTimestamp(),
    });
    await updateDoc(doc(db, "posts", post.id), {
      replies: increment(1),
      lastActivity: serverTimestamp(),
    });
    setReplyContent("");
  };

  return (
    <Card className="bg-green-900/30 border-green-700/30 backdrop-blur-sm hover:bg-green-900/40 transition-all duration-300">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          {post.isPinned && <span className="text-yellow-400 text-sm">📌</span>}
          <img src={post.authorAvatar} alt={post.author} className="w-10 h-10 rounded-full" />
          <div>
            <h3 className="text-white font-semibold text-lg">{post.title}</h3>
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

        {/* Content */}
        <p className="text-gray-300 mb-4">{post.content}</p>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <span key={tag} className="bg-green-700/20 text-green-300 text-xs px-2 py-1 rounded">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            <Button variant="ghost" size="sm" onClick={() => onLike(post.id)} className="text-gray-400 hover:text-white">
              ❤️ {post.likes || 0}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReplies((prev) => !prev)}
              className="text-gray-400 hover:text-white"
            >
              💬 {post.replies || 0} replies
            </Button>
          </div>
        </div>

        {/* Replies */}
        {showReplies && (
          <div className="mt-6 pl-6 border-l border-green-800 space-y-4">
            {replies.length === 0 && <p className="text-gray-400 text-sm">No replies yet.</p>}
            {replies.map((r) => (
              <div key={r.id} className="flex gap-3">
                <img src={r.authorAvatar} alt={r.author} className="w-8 h-8 rounded-full" />
                <div>
                  <p className="text-sm text-white">
                    <span className="font-semibold">{r.author}</span>{" "}
                    <span className="text-gray-400 text-xs">{formatTimeAgo(r.createdAt)}</span>
                  </p>
                  <p className="text-gray-300 text-sm">{r.content}</p>
                </div>
              </div>
            ))}
            {isAuthenticated && (
              <div className="flex gap-2">
                <input
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write a reply..."
                  className="flex-1 px-3 py-2 bg-green-900/30 border border-green-700/30 rounded text-white"
                />
                <Button onClick={submitReply} className="bg-green-600 hover:bg-green-700 text-white" size="sm">
                  Reply
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ------------ Forum Page ------------
export default function ForumPage() {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as ForumPost[]);
    });
  }, []);

  const filtered = posts.filter((p) => {
    const cat = activeCategory === "all" || p.category === activeCategory;
    const search =
      !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.content.toLowerCase().includes(searchQuery.toLowerCase());
    return cat && search;
  });

  const handleLike = async (id: string) => {
    await updateDoc(doc(db, "posts", id), { likes: increment(1) });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-gray-900 to-black">
      <div className="container mx-auto px-6 py-8 space-y-6">
        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          {forumCategories.map((c) => (
            <Button
              key={c.id}
              size="sm"
              onClick={() => setActiveCategory(c.id)}
              className={
                activeCategory === c.id
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "border-green-400 text-green-300 hover:bg-green-500/20"
              }
            >
              {c.icon} {c.name}
            </Button>
          ))}
        </div>

        {/* Posts */}
        {filtered.length > 0 ? (
          filtered.map((p) => <PostCard key={p.id} post={p} onLike={handleLike} />)
        ) : (
          <p className="text-gray-400 text-center">No discussions found.</p>
        )}

        {!isAuthenticated && (
          <div className="text-center py-8 text-gray-400">Login to reply & like posts.</div>
        )}
      </div>
    </div>
  );
}
