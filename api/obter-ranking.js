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
  if (req.method === "GET") {
    try {
      const docRef = db.collection("jogos").doc("ranking");
      const doc = await docRef.get();

      if (!doc.exists) {
        // Cria ranking com zeros se não existir
        const zeros = {
          Half_Life_1: 0,
          GTA_5: 0,
          GTA_San_Andreas: 0,
          Need_For_Speed: 0,
          Final_Fantasy_7: 0,
          Half_Life_2: 0,
          Portal: 0,
          Portal_2: 0,
          Resident_Evil_4: 0,
          Resident_Evil_5: 0
        };
        await docRef.set(zeros);
        return res.status(200).json(zeros);
      }

      res.status(200).json(doc.data());
    } catch (err) {
      console.error("Erro ao obter ranking:", err);
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(405).json({ error: "Método não permitido" });
  }
}
