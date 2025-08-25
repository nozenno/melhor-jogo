import admin from "firebase-admin";

// Inicializa Firebase Admin apenas uma vez
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      client_email: process.env.FIREBASE_CLIENT_EMAIL
    })
  });
}

const db = admin.firestore();
const docRef = db.collection("jogos").doc("ranking");

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { jogo } = req.body;

    try {
      // Verifica se o documento existe
      const doc = await docRef.get();
      if (!doc.exists) {
        // Cria documento com todos os jogos zerados
        await docRef.set({
          "Need For Speed: Most Wanted": 0,
          "Final Fantasy 7": 0,
          "GTA 5": 0,
          "GTA: San Andreas": 0,
          "Half-Life 1": 0,
          "Half-Life 2": 0,
          "Portal": 0,
          "Portal 2": 0,
          "Resident Evil 4": 0,
          "Resident Evil 5": 0
        });
      }

      // Incrementa +1 no jogo selecionado
      await docRef.update({
        [jogo]: admin.firestore.FieldValue.increment(1)
      });

      // Retorna os votos atualizados
      const snapshot = await docRef.get();
      res.status(200).json(snapshot.data());
    } catch (error) {
      console.error("Erro ao votar:", error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: "Método não permitido" });
  }
}
