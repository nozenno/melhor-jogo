import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const app = initializeApp({
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
});

const db = getFirestore(app);

export default async function handler(req, res) {
  const docRef = doc(db, "jogos", "ranking");
  try {
    const snapshot = await getDoc(docRef);
    res.status(200).json(snapshot.data());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao obter ranking" });
  }
}
