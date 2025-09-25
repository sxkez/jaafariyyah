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
} from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

interface ForumPost {
  id: string;
  title: string;
  author: string;
  authorId: string;
  authorAvatar: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: any;
  likes: string[];
  dislikes: string[];
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
            <img
              src={post.authorAvatar}
              alt={post.author}
              className="w-10 h-10 rounded-full"
            />
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

          {user?.uid === post.authorId && (
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
              user && post.likes.includes(user.uid)
                ? "text-red-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            ❤️ {post.likes.length}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDislike(post.id)}
            className={`text-sm ${
              user && post.dislikes.includes(user.uid)
                ? "text-yellow-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            👎 {post.dislikes.length}
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
        {post.likes.length > 0 && (
          <p className="text-xs text-gray-400">
            Liked by {post.likes.length} user(s)
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
  const { user, isAuthenticated } = useAuth();

useEffect(() => {
  const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
  const unsub = onSnapshot(q, (snapshot) => {
    setPosts(
      snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          likes: data.likes || [],
          dislikes: data.dislikes || [],
          replies: data.replies || 0,
          ...data,
        } as ForumPost;
      })
    );
  });
  return () => unsub();
}, []);

  // Create Post
  const handleCreatePost = async () => {
    if (!user) return alert("Login first");
    await addDoc(collection(db, "posts"), {
      title: newTitle,
      content: newContent,
      category: newCategory,
      tags: [],
      author: user.displayName || "Anonymous",
      authorAvatar:
        user.photoURL ||
        `https://ui-avatars.com/api/?name=${user.displayName || "User"}`,
      authorId: user.uid,
      likes: [],
      dislikes: [],
      replies: 0,
      isPinned: false,
      createdAt: serverTimestamp(),
      lastActivity: serverTimestamp(),
    });
    setNewTitle("");
    setNewContent("");
  };

  // Like
  const handleLike = async (postId: string) => {
    if (!user) return alert("Login first");
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, {
      likes: arrayUnion(user.uid),
      dislikes: arrayRemove(user.uid),
    });
  };

  // Dislike
  const handleDislike = async (postId: string) => {
    if (!user) return alert("Login first");
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, {
      dislikes: arrayUnion(user.uid),
      likes: arrayRemove(user.uid),
    });
  };

  // Edit
  const handleEdit = async () => {
    if (!editingPost) return;
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

  return (
    <div className="p-6">
      {/* New Post */}
      {isAuthenticated && (
        <div className="mb-6">
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Post title"
            className="w-full mb-2 p-2 rounded bg-green-900/30 border border-green-600 text-white"
          />
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Write something..."
            className="w-full mb-2 p-2 rounded bg-green-900/30 border border-green-600 text-white"
          />
          <Button onClick={handleCreatePost} className="bg-green-600 text-white">
            Post
          </Button>
        </div>
      )}

      {/* Posts */}
      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onLike={handleLike}
            onDislike={handleDislike}
            onReply={() => alert("Reply feature WIP")}
            onEdit={setEditingPost}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Edit Modal */}
      {editingPost && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-green-950 p-6 rounded-lg max-w-md w-full">
            <h2 className="text-white mb-4">Edit Post</h2>
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="w-full mb-3 p-2 rounded bg-green-900/30 border border-green-600 text-white"
              rows={5}
            />
            <div className="flex justify-end gap-3">
              <Button onClick={() => setEditingPost(null)} variant="ghost">
                Cancel
              </Button>
              <Button onClick={handleEdit} className="bg-green-600 text-white">
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
