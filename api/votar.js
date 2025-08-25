import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      project_id: process.env.FIREBASE_PROJECT_ID,
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
    })
  });
}

const db = admin.firestore();

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { jogo } = req.body;
    const docRef = db.collection("jogos").doc("ranking");

    try {
      // Incremento atômico seguro
      await docRef.update({ [jogo]: admin.firestore.FieldValue.increment(1) });

      const updatedDoc = await docRef.get();
      res.status(200).json(updatedDoc.data());
    } catch (err) {
      console.error("Erro ao votar:", err);
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(405).json({ error: "Método não permitido" });
  }
}
