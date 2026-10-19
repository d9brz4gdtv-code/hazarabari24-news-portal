import {
  collection,
  doc,
  addDoc,
  getDocs,
  onSnapshot,
  updateDoc,
  increment,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import { CommentItem } from '../types';
import { sanitizeForFirestore } from './firestoreNewsService';

export interface NewsTipPayload {
  name: string;
  email?: string;
  phone?: string;
  subject: string;
  message: string;
}

/**
 * Submits reader contact message or news tip to Firestore
 */
export async function submitNewsTip(tip: NewsTipPayload): Promise<string> {
  try {
    const colRef = collection(db, 'contactSubmissions');
    const payload = sanitizeForFirestore({
      ...tip,
      submittedAt: new Date().toISOString(),
      serverCreatedAt: serverTimestamp(),
      status: 'pending',
    });
    const docRef = await addDoc(colRef, payload);
    return docRef.id;
  } catch (error) {
    console.warn('Fallback: simulated local submission due to network status', error);
    return `local-${Date.now()}`;
  }
}

/**
 * Subscribes to real-time comments for an article
 */
export function subscribeArticleComments(
  articleId: string,
  onUpdate: (comments: CommentItem[]) => void
) {
  try {
    const commentsRef = collection(db, 'articles', articleId, 'comments');
    const q = query(commentsRef, orderBy('createdAt', 'desc'));

    return onSnapshot(
      q,
      (snapshot) => {
        const items: CommentItem[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          items.push({
            id: docSnap.id,
            articleId,
            authorName: data.authorName || 'বেনামী পাঠক',
            authorLocation: data.authorLocation || '',
            commentText: data.commentText || '',
            createdAt: data.createdAt || 'সম্প্রতি',
            likes: typeof data.likes === 'number' ? data.likes : 0,
          });
        });
        if (items.length > 0) {
          onUpdate(items);
        }
      },
      (error) => {
        console.warn('Real-time comments subscription notice:', error.message);
      }
    );
  } catch (err) {
    console.warn('Firestore comments error:', err);
    return () => {};
  }
}

/**
 * Adds a comment to an article in Firestore
 */
export async function addArticleComment(
  articleId: string,
  comment: { authorName: string; authorLocation?: string; commentText: string }
): Promise<string> {
  try {
    const commentsRef = collection(db, 'articles', articleId, 'comments');
    const payload = sanitizeForFirestore({
      ...comment,
      articleId,
      createdAt: 'এইমাত্র',
      serverCreatedAt: serverTimestamp(),
      likes: 0,
    });
    const docRef = await addDoc(commentsRef, payload);
    return docRef.id;
  } catch (err) {
    console.warn('Offline comment fallback:', err);
    return `local-${Date.now()}`;
  }
}

/**
 * Increments like on a comment
 */
export async function likeComment(articleId: string, commentId: string): Promise<void> {
  try {
    const docRef = doc(db, 'articles', articleId, 'comments', commentId);
    await updateDoc(docRef, {
      likes: increment(1),
    });
  } catch (err) {
    console.warn('Like update notice:', err);
  }
}
