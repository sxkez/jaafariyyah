"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { addReply } from "@/services/forumService";
import { useAuth } from "@/contexts/AuthContext";

export function ReplyModal({ postId, isOpen, onClose }: { postId: string, isOpen: boolean, onClose: () => void }) {
  const [content, setContent] = useState("");
  const { user } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!content.trim()) return;
    await addReply(postId, user, content);
    setContent("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-green-950/90 border-green-700/40">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold text-white mb-4">Write a Reply</h2>
          <textarea
            className="w-full h-24 px-3 py-2 bg-green-900/30 border border-green-700/40 rounded-lg text-white"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type your reply..."
          />
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={handleSubmit}>
              Reply
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
