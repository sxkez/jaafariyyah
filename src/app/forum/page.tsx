"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

interface ForumPost {
  id: string;
  title: string;
  author: string;
  authorAvatar: string;
  content: string;
  category: string;
  tags: string[];
  timestamp: Date;
  likes: number;
  replies: number;
  isLiked: boolean;
  isPinned: boolean;
  lastActivity: Date;
  replies_data?: ForumReply[];
}

interface ForumReply {
  id: string;
  postId: string;
  author: string;
  authorAvatar: string;
  content: string;
  timestamp: Date;
  likes: number;
  isLiked: boolean;
  parentReplyId?: string;
}

const forumCategories = [
  { id: 'all', name: 'All Discussions', icon: '💬' },
  { id: 'fiqh', name: 'Ja‘farī Fiqh', icon: '⚖️' },
  { id: 'aqidah', name: '‘Aqīdah & Imāmah', icon: '🕌' },
  { id: 'hadith', name: 'Ḥadīth & Rijāl', icon: '📜' },
  { id: 'history', name: 'History & Sirah', icon: '📖' },
  { id: 'arabic', name: 'Arabic Language', icon: '📝' },
  { id: 'questions', name: 'Questions & Answers', icon: '❓' }
];

const samplePosts: ForumPost[] = [
  {
    id: '1',
    title: 'Proofs for Imāmah after Ghadīr: What are your go‑to sources?',
    author: 'Zayn_Student',
    authorAvatar: 'https://ui-avatars.com/api/?name=Zayn+Student&background=7c3aed&color=fff',
    content:
      'Salām everyone. Beyond the famous khutbah of Ghadīr, which narrations and works do you cite first when explaining Imāmah to newcomers? Do you prefer primary ḥadīth citations (e.g., al‑Kāfī) or thematic works (e.g., al‑Mufīd, al‑‘Allāma)? Share what resonates most in da‘wah and study circles.',
    category: 'aqidah',
    tags: ['Imāmah', 'Ghadīr', 'Dalīl'],
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    likes: 42,
    replies: 15,
    isLiked: false,
    isPinned: true,
    lastActivity: new Date(Date.now() - 1000 * 60 * 5)
  },
  {
    id: '2',
    title: 'Beginner pathway in Ja‘farī fiqh (ṭahārah → ṣalāh → ṣawm)',
    author: 'FatimaH',
    authorAvatar: 'https://ui-avatars.com/api/?name=Fatima+H&background=059669&color=fff',
    content:
      'Looking for a sequenced study path: which primers for ṭahārah and ṣalāh are best before moving to siyām and khums? Also, tips on using your marja‘’s risālah effectively.',
    category: 'fiqh',
    tags: ['Fiqh', 'Beginner', 'Marja‘iyyah'],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    likes: 28,
    replies: 19,
    isLiked: true,
    isPinned: false,
    lastActivity: new Date(Date.now() - 1000 * 60 * 12)
  },
  {
    id: '3',
    title: 'Reconciling ḥadīth variants: example from wudūʾ wording',
    author: 'RijalNotes',
    authorAvatar: 'https://ui-avatars.com/api/?name=Rijal+Notes&background=dc2626&color=fff',
    content:
      'Working through differing wordings on washing limbs vs. masḥ sequence. Which rijāl and fiqh sources do you consult first for tarjīḥ? Any notes on Shaykh al‑Ṭūsī’s approach in Tahdhīb/Istibṣār?',
    category: 'hadith',
    tags: ['Rijāl', 'Tarjīḥ', 'Wudūʾ'],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
    likes: 33,
    replies: 9,
    isLiked: false,
    isPinned: false,
    lastActivity: new Date(Date.now() - 1000 * 60 * 40)
  },
  {
    id: '4',
    title: 'Weekly Arabic Circle: Ajurrūmiyya — al‑Mubtadaʾ wa‑l‑Khabar',
    author: 'ArabicTeacher',
    authorAvatar: 'https://ui-avatars.com/api/?name=Arabic+Teacher&background=7c2d12&color=fff',
    content:
      'This week we tackle mubtadaʾ/khabar, with practice parsing examples from Nahj al‑Balāgha and al‑Ṣaḥīfa al‑Sajjādiyya. Bring your favorite sentences to parse!',
    category: 'arabic',
    tags: ['Arabic', 'Grammar', 'Ajurrūmiyya'],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
    likes: 17,
    replies: 6,
    isLiked: false,
    isPinned: false,
    lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 2)
  }
];

function PostCard({ post, onLike, onReply }: {
  post: ForumPost;
  onLike: (postId: string) => void;
  onReply: (postId: string) => void;
}) {
  const { user } = useAuth();

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <Card className="bg-purple-900/30 border-purple-600/30 backdrop-blur-sm hover:bg-purple-900/40 transition-all duration-300">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {post.isPinned && <span className="text-yellow-400 text-sm">📌</span>}
            <img src={post.authorAvatar} alt={post.author} className="w-10 h-10 rounded-full" />
            <div>
              <h3 className="text-white font-semibold text-lg hover:text-purple-300 cursor-pointer">{post.title}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>by {post.author}</span>
                <span>•</span>
                <span>{formatTimeAgo(post.timestamp)}</span>
                <span>•</span>
                <span className="bg-purple-600/40 text-purple-200 px-2 py-1 rounded text-xs">
                  {forumCategories.find(c => c.id === post.category)?.name}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mb-4">
          <p className="text-gray-300 leading-relaxed line-clamp-3">{post.content}</p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag) => (
            <span key={tag} className="bg-purple-600/20 text-purple-300 text-xs px-2 py-1 rounded hover:bg-purple-600/30 cursor-pointer">
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
              className={`text-sm ${post.isLiked ? 'text-red-400 hover:text-red-300' : 'text-gray-400 hover:text-white'}`}
            >
              {post.isLiked ? '❤️' : '🤍'} {post.likes}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onReply(post.id)}
              className="text-gray-400 hover:text-white text-sm"
            >
              💬 {post.replies} replies
            </Button>

            <span className="text-gray-500 text-xs">Last activity {formatTimeAgo(post.lastActivity)}</span>
          </div>

          {user && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onReply(post.id)}
              className="border-purple-400 text-purple-300 hover:bg-purple-500/20"
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
  const [posts, setPosts] = useState<ForumPost[]>(samplePosts);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const filteredPosts = posts.filter(post => {
    const categoryMatch = activeCategory === 'all' || post.category === activeCategory;
    const searchMatch =
      searchQuery === '' ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return categoryMatch && searchMatch;
  });

  const handleLike = (postId: string) => {
    if (!isAuthenticated) return;
    setPosts(prev =>
      prev.map(post =>
        post.id === postId
          ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
          : post
      )
    );
  };

  const handleReply = (postId: string) => {
    if (!isAuthenticated) {
      alert('Please login to reply to posts');
      return;
    }
    alert(`Reply to post ${postId} — Feature coming soon!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-indigo-950 to-blue-950">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Community Forum</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Ask, share, and learn together — centered on the Qur’an, Sunnah, and the teachings of the Ahl al‑Bayt (a).
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
              className="w-full px-4 py-3 bg-purple-900/30 border border-purple-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
            />
          </div>
          {isAuthenticated && (
            <Button onClick={() => setShowNewPostModal(true)} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3">
              ✍️ Start Discussion
            </Button>
          )}
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          {forumCategories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveCategory(category.id)}
              className={activeCategory === category.id ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'border-purple-400 text-purple-300 hover:bg-purple-500/20'}
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
              <h3 className="text-2xl font-bold text-white mb-2">No discussions found</h3>
              <p className="text-gray-300 mb-6">{searchQuery ? 'Try adjusting your search' : 'Be the first to start a discussion!'}</p>
              {isAuthenticated && <Button onClick={() => setShowNewPostModal(true)} className="bg-purple-600 hover:bg-purple-700">Start New Discussion</Button>}
            </div>
          ) : (
            filteredPosts.map((post) => <PostCard key={post.id} post={post} onLike={handleLike} onReply={handleReply} />)
          )}
        </div>

        {/* Login Prompt */}
        {!isAuthenticated && (
          <div className="text-center mt-12 p-8 bg-purple-900/30 border border-purple-600/30 rounded-lg">
            <h3 className="text-xl font-bold text-white mb-4">Join the Discussion</h3>
            <p className="text-gray-300 mb-6">Login to participate in discussions, ask questions, and share your knowledge</p>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">Login / Sign Up</Button>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-purple-600/30">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center border border-purple-300">
              <div className="text-white text-xs">☪</div>
            </div>
            <span className="text-white font-semibold text-lg">𝘼𝙡 𝙅𝙖‘𝙛𝙖𝙧𝙞𝙮𝙮𝙖</span>
          </div>
          <p className="text-gray-300 italic">“May Allah have mercy on the one who revives our affair.” — Imām Ja‘far al‑Ṣādiq (a)</p>
        </div>
      </div>
    </div>
  );
}