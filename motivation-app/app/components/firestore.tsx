import { getFirestore, doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

const db = getFirestore();

export const getLikedQuotes = async (userId: string): Promise<number[]> => {
  const userDoc = doc(db, "users", userId);
  const docSnapshot = await getDoc(userDoc);
  if (docSnapshot.exists()) {
    return docSnapshot.data().likedQuotes || [];
  }
  return [];
};

export const addLikedQuote = async (userId: string, quoteId: number): Promise<void> => {
  const userDoc = doc(db, "users", userId);
  await updateDoc(userDoc, {
    likedQuotes: arrayUnion(quoteId),
  });
};

export const removeLikedQuote = async (userId: string, quoteId: number): Promise<void> => {
  const userDoc = doc(db, "users", userId);
  await updateDoc(userDoc, {
    likedQuotes: arrayRemove(quoteId),
  });
};

export const initializeUser = async (userId: string): Promise<void> => {
  const userDoc = doc(db, "users", userId);
  const docSnapshot = await getDoc(userDoc);
  if (!docSnapshot.exists()) {
    await setDoc(userDoc, { likedQuotes: [] });
  }
};