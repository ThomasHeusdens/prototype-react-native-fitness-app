import { getFirestore, doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

const db = getFirestore();

// Get a user's liked quotes
export const getLikedQuotes = async (userId: string): Promise<number[]> => {
  const userDoc = doc(db, "users", userId);
  const docSnapshot = await getDoc(userDoc);
  if (docSnapshot.exists()) {
    return docSnapshot.data().likedQuotes || [];
  }
  return [];
};

// Add a liked quote
export const addLikedQuote = async (userId: string, quoteId: number): Promise<void> => {
  const userDoc = doc(db, "users", userId);
  await updateDoc(userDoc, {
    likedQuotes: arrayUnion(quoteId),
  });
};

// Remove a liked quote
export const removeLikedQuote = async (userId: string, quoteId: number): Promise<void> => {
  const userDoc = doc(db, "users", userId);
  await updateDoc(userDoc, {
    likedQuotes: arrayRemove(quoteId),
  });
};

// Initialize a user's document in Firestore (if it doesn't exist)
export const initializeUser = async (userId: string): Promise<void> => {
  const userDoc = doc(db, "users", userId);
  const docSnapshot = await getDoc(userDoc);
  if (!docSnapshot.exists()) {
    await setDoc(userDoc, { likedQuotes: [] });
  }
};