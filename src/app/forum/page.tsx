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
  arrayUnion,
  arrayRemove,
  deleteDoc,
  increment,
} from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

interface ForumPost {
  id: string;
  title: string;
  author: string;
  authorId: string;
  authorAvatar?: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: any;
  likes: string[];
  dislikes: string[];
  likedBy: string[];
  replies: number;
  isPinned: boolean;
  lastActivity: any;
}

interface Reply {
  id: string;
  postId: string;
  author: string;
  authorId: string;
  authorAvatar?: string;
  content: string;
  createdAt: any;
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

const normalizeIds = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.filter((entry): entry is string => typeof entry === "string");
  }
  if (value && typeof value === "object") {
    return Object.keys(value as Record<string, unknown>);
  }
  return [];
};

const normalizeNames = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.filter((entry): entry is string => typeof entry === "string");
  }
  if (value && typeof value === "object") {
    return Object.values(value as Record<string, unknown>)
      .map((entry) => (typeof entry === "string" ? entry : null))
      .filter((entry): entry is string => Boolean(entry));
  }
  return [];
};

function PostCard({
  post,
  onLike,
  onDislike,
  onReply,
  onEdit,
  onDelete,
}: {
  post: ForumPost;
  onLike: (postId: string) => void;
  onDislike: (postId: string) => void;
  onReply: (postId: string) => void;
  onEdit: (post: ForumPost) => void;
  onDelete: (postId: string) => void;
}) {
  const { user } = useAuth();
  const currentUserId = user?.email || user?.name || null;
  const likes = normalizeIds(post.likes);
  const dislikes = normalizeIds(post.dislikes);
  const likedBy = normalizeNames(post.likedBy);

  const authorAvatar =
    post.authorAvatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author)}`;

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
    <Card className="bg-green-900/30 border-green-700/30 hover:bg-green-900/40 transition-all">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {post.isPinned && <span className="text-yellow-400">📌</span>}
            <img src={authorAvatar} alt={post.author} className="w-10 h-10 rounded-full" />
            <div>
              <h3 className="text-white font-semibold text-lg">
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

          {currentUserId === post.authorId && (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onEdit(post)}
                className="text-yellow-400 hover:text-yellow-300"
              >
                ✏️
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete(post.id)}
                className="text-red-400 hover:text-red-300"
              >
                🗑
              </Button>
            </div>
          )}
        </div>

        {/* Content */}
        <p className="text-gray-300 mb-4">{post.content}</p>

        {/* Actions */}
        <div className="flex items-center gap-4 mb-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onLike(post.id)}
            className={`text-sm ${
              currentUserId && likes.includes(currentUserId)
                ? "text-red-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            ❤️ {likes.length}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDislike(post.id)}
            className={`text-sm ${
              currentUserId && dislikes.includes(currentUserId)
                ? "text-yellow-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            👎 {dislikes.length}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onReply(post.id)}
            className="text-gray-400 hover:text-white text-sm"
          >
            💬 {post.replies || 0} replies
          </Button>
        </div>

        {/* Show who liked */}
        {likedBy.length > 0 && (
          <p className="text-xs text-gray-400">
            Liked by {likedBy.join(", ")}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default function ForumPage() {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState("aqidah");
  const [editingPost, setEditingPost] = useState<ForumPost | null>(null);
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyDraft, setReplyDraft] = useState("");
  const [replies, setReplies] = useState<Record<string, Reply[]>>({});
  const { user, isAuthenticated } = useAuth();
  const userId = user?.email || user?.name || null;
  const userDisplayName = user?.name || "Anonymous";
  const userAvatar =
    user?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(userDisplayName)}`;

  // Load posts
  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setPosts(
        snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            likes: normalizeIds(data.likes),
            dislikes: normalizeIds(data.dislikes),
            likedBy: normalizeNames(data.likedBy),
            replies: typeof data.replies === "number" ? data.replies : 0,
          } as ForumPost;
        })
      );
    });
    return () => unsub();
  }, []);

  // Load replies for each post
  useEffect(() => {
    const unsubscribes = posts.map((post) => {
      const q = query(
        collection(db, "posts", post.id, "replies"),
        orderBy("createdAt", "asc")
      );
      return onSnapshot(q, (snapshot) => {
        setReplies((prev) => ({
          ...prev,
          [post.id]: snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Reply[],
        }));
      });
    });

    return () => {
      unsubscribes.forEach((unsub) => unsub());
    };
  }, [posts]);

  // Create Post
  const handleCreatePost = async () => {
    if (!user || !userId) return alert("Login first");
    if (!newTitle.trim() || !newContent.trim()) {
      alert("Title and content are required");
      return;
    }
    await addDoc(collection(db, "posts"), {
      title: newTitle,
      content: newContent,
      category: newCategory,
      tags: [],
      author: userDisplayName,
      authorAvatar: userAvatar,
      authorId: userId,
      likes: [],
      dislikes: [],
      likedBy: [],
      replies: 0,
      isPinned: false,
      createdAt: serverTimestamp(),
      lastActivity: serverTimestamp(),
    });
    setNewTitle("");
    setNewContent("");
    setNewCategory("aqidah");
    setShowNewPostModal(false);
  };

  // Like
  const handleLike = async (postId: string) => {
    if (!user || !userId) return alert("Login first");
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, {
      likes: arrayUnion(userId),
      dislikes: arrayRemove(userId),
      likedBy: arrayUnion(userDisplayName),
    });
  };

  // Dislike
  const handleDislike = async (postId: string) => {
    if (!user || !userId) return alert("Login first");
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, {
      dislikes: arrayUnion(userId),
      likes: arrayRemove(userId),
      likedBy: arrayRemove(userDisplayName),
    });
  };

  // Reply
  const handleReply = async (postId: string, replyText: string) => {
    if (!user || !userId) return alert("Login first");
    if (!replyText.trim()) return;
    const replyRef = collection(db, "posts", postId, "replies");
    await addDoc(replyRef, {
      postId,
      content: replyText,
      author: userDisplayName,
      authorId: userId,
      authorAvatar: userAvatar,
      createdAt: serverTimestamp(),
    });
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, {
      replies: increment(1),
      lastActivity: serverTimestamp(),
    });
    setReplyingTo(null);
    setReplyDraft("");
  };

  const handleStartReply = (postId: string) => {
    setReplyDraft("");
    setReplyingTo((prev) => (prev === postId ? null : postId));
  };

  const handleStartEdit = (post: ForumPost) => {
    setEditingPost(post);
    setNewContent(post.content);
  };

  // Edit
  const handleEdit = async () => {
    if (!editingPost) return;
    if (!newContent.trim()) {
      alert("Content cannot be empty");
      return;
    }
    const postRef = doc(db, "posts", editingPost.id);
    await updateDoc(postRef, {
      content: newContent,
      lastActivity: serverTimestamp(),
    });
    setEditingPost(null);
    setNewContent("");
  };

  // Delete
  const handleDelete = async (postId: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
      await deleteDoc(doc(db, "posts", postId));
    }
  };

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
          {filteredPosts.map((post) => (
            <div key={post.id}>
              <PostCard
                post={post}
                onLike={handleLike}
                onDislike={handleDislike}
                onReply={handleStartReply}
                onEdit={handleStartEdit}
                onDelete={handleDelete}
              />

              {/* Replies */}
              {replies[post.id]?.map((reply) => (
                <div
                  key={reply.id}
                  className="ml-12 mt-2 p-3 bg-green-900/20 rounded-lg border border-green-700/30"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <img
                      src=
                        {reply.authorAvatar ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(reply.author)}`}
                      alt={reply.author}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-sm text-white">{reply.author}</span>
                  </div>
                  <p className="text-gray-300 text-sm">{reply.content}</p>
                </div>
              ))}

              {/* Reply Input */}
              {replyingTo === post.id && (
                <div className="ml-12 mt-3">
                  <textarea
                    value={replyDraft}
                    onChange={(e) => setReplyDraft(e.target.value)}
                    placeholder="Write a reply..."
                    className="w-full px-3 py-2 rounded bg-green-900/30 border border-green-700/30 text-white"
                    rows={3}
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setReplyDraft("");
                        setReplyingTo(null);
                      }}
                      className="text-gray-400 hover:text-white"
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleReply(post.id, replyDraft)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Reply
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Edit Modal */}
        {editingPost && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-green-950 p-6 rounded-lg max-w-md w-full">
              <h2 className="text-white mb-4">Edit Post</h2>
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                className="w-full mb-3 p-2 rounded bg-green-900/30 border border-green-600 text-white"
                rows={5}
              />
              <div className="flex justify-end gap-3">
                <Button
                  onClick={() => {
                    setEditingPost(null);
                    setNewContent("");
                  }}
                  variant="ghost"
                >
                  Cancel
                </Button>
                <Button onClick={handleEdit} className="bg-green-600 text-white">
                  Save
                </Button>
              </div>
            </div>
          </div>
        )}

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
    </div>
  );
}
