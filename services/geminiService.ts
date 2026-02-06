import { GoogleGenAI, Content, Part } from "@google/genai";
import { UserProfile, Message } from "../types";

// Helper to convert internal Message type to Gemini Content type
const mapMessagesToGeminiHistory = (messages: Message[]): Content[] => {
  return messages
    .filter(msg => !msg.isThinking) // Filter out UI-only thinking messages
    .map((msg) => {
      const parts: Part[] = [];
      
      if (msg.image) {
        // Extract base64 data and mime type from data URL
        // Format: data:image/png;base64,iVBORw0KGgo...
        const matches = msg.image.match(/^data:(.+);base64,(.+)$/);
        if (matches) {
          parts.push({
            inlineData: {
              mimeType: matches[1],
              data: matches[2],
            },
          });
        }
      }
      
      if (msg.content) {
        parts.push({ text: msg.content });
      }

      return {
        role: msg.role === 'user' ? 'user' : 'model',
        parts: parts,
      };
    })
    .filter(content => content.parts.length > 0); // Ensure no empty messages
};

export const generateMentorResponse = async (
  user: UserProfile,
  history: Message[],
  newMessage: string,
  image?: string,
  subject?: string
): Promise<string> => {
  if (!process.env.API_KEY) {
    return "Erreur de configuration: API Key manquante.";
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `
    Tu es EDUCTOME, un mentor pédagogique d'élite pour les élèves en classes d'examen (Côte d'Ivoire et International).
    
    PROFIL ÉLÈVE:
    Nom: ${user.name}
    Classe: ${user.gradeClass}
    Points Faibles: ${user.weaknesses.join(", ")}
    Matière actuelle: ${subject || "Général"}

    TA MISSION:
    Transformer l'élève en acteur de sa réussite. Ne jamais donner la réponse directement.

    TON PROTOCOLE STRICT (4 PHASES):
    Tu dois suivre ce cycle pour chaque nouvelle notion ou difficulté rencontrée. N'avance pas tant que l'élève n'a pas validé l'étape précédente.
    
    1. DIAGNOSTIC: Pose une question ciblée pour vérifier les bases ou l'origine du blocage. STOP. Attends la réponse.
    2. NOTION: Utilise une ANALOGIE CONCRÈTE (ex: FCFA, transport, football, vie quotidienne ivoirienne) pour expliquer le concept abstrait. Valide la compréhension. STOP.
    3. DÉMONSTRATION: Montre comment résoudre un exemple similaire étape par étape (utilise LaTeX pour les formules). STOP.
    4. PRATIQUE: Donne un petit exercice d'application. Donne des indices progressifs si l'élève bloque.

    RÈGLES D'OR:
    - Une seule question à la fois.
    - Utilise le format LaTeX pour les mathématiques (ex: $x^2 + y^2 = r^2$).
    - Sois encourageant mais exigeant (style bienveillant et professionnel).
    - Si l'élève demande la réponse, refuse poliment et donne un indice méthodologique.
    - Si l'élève envoie une image, analyse-la pour comprendre son erreur ou son exercice.
  `;

  try {
    const model = 'gemini-3-flash-preview'; 

    // Construct current prompt parts
    const currentParts: Part[] = [];
    if (image) {
      const matches = image.match(/^data:(.+);base64,(.+)$/);
      if (matches) {
        currentParts.push({
          inlineData: {
            mimeType: matches[1],
            data: matches[2],
          },
        });
      }
    }
    currentParts.push({ text: newMessage });

    // Separate history from current message to avoid duplication.
    // The history array passed in includes the current message at the end (from optimistic UI update).
    // We slice it off for the chat history context.
    const pastHistory = history.slice(0, -1);
    const geminiHistory = mapMessagesToGeminiHistory(pastHistory);

    const chat = ai.chats.create({
      model: model,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
      history: geminiHistory,
    });

    const result = await chat.sendMessage({
      message: currentParts
    });

    return result.text || "Je n'ai pas pu générer de réponse.";

  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Désolé, je rencontre une difficulté de connexion. Vérifions ta connexion internet ou réessayons.";
  }
};