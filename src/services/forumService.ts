import { db } from "@/lib/firebaseConfig";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

export async function addReply(postId: string, user: any, content: string, parentReplyId?: string) {
  if (!db) {
    throw new Error("Firebase is not configured. Unable to add replies.");
  }
  const repliesRef = collection(db, "posts", postId, "replies");
  return await addDoc(repliesRef, {
    author: user.displayName || user.email,
    authorId: user.uid,
    content,
    parentReplyId: parentReplyId || null,
    createdAt: serverTimestamp(),
  });
}

export function subscribeToReplies(postId: string, callback: (replies: any[]) => void) {
  if (!db) {
    throw new Error("Firebase is not configured. Unable to subscribe to replies.");
  }
  const repliesRef = collection(db, "posts", postId, "replies");
  const q = query(repliesRef, orderBy("createdAt", "asc"));
  return onSnapshot(q, (snapshot) => {
    const replies = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(replies);
  });
}
