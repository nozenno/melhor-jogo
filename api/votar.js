import { initializeApp } from "firebase/app";
import { getFirestore, doc, updateDoc, increment, getDoc } from "firebase/firestore";

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
  if (req.method === "POST") {
    const { jogo } = req.body;
    const docRef = doc(db, "jogos", "ranking");
    try {
      await updateDoc(docRef, { [jogo]: increment(1) });
      const snapshot = await getDoc(docRef);
      res.status(200).json(snapshot.data());
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao votar" });
    }
  } else {
    res.status(405).json({ error: "Método não permitido" });
  }
}
