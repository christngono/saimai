import { NextRequest } from "next/server";

const FASTAPI_URL = "http://localhost:8001/api/chat";
const OLLAMA_URL = "http://localhost:11434/api/chat";

const SYSTEM_PROMPT = `Tu es SAIM Fiscal, un assistant expert en fiscalité d'entreprise.
Tu aides les entrepreneurs et PME à comprendre et appliquer la réglementation fiscale en vigueur.
Tu calcules avec précision les impôts (TVA, IS, IRPP, taxes locales) selon le pays de l'utilisateur.
Tu réponds toujours en français avec des explications claires et des exemples chiffrés.
Tu cites les textes officiels pertinents quand tu expliques une règle fiscale.`;

export async function POST(req: NextRequest) {
  const { messages } = await req.json();
  const encoder = new TextEncoder();

  // ── Essayer FastAPI (RAG) en premier ────────────────────────────────────
  try {
    const fastapiRes = await fetch(FASTAPI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
      signal: AbortSignal.timeout(120000), // 2 min — RAG + Ollama peuvent prendre du temps
    });

    if (!fastapiRes.ok || !fastapiRes.body) throw new Error("FastAPI unavailable");

    // FastAPI répond → on streame directement (il gère RAG + Ollama)
    const stream = new ReadableStream({
      async start(controller) {
        const reader = fastapiRes.body!.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          controller.enqueue(value); // déjà du texte brut streamé par FastAPI
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-RAG-Source": "fastapi",
      },
    });
  } catch {
    // FastAPI pas disponible → fallback Ollama direct (sans RAG)
  }

  // ── Fallback : Ollama direct sans RAG ───────────────────────────────────
  try {
    const ollamaRes = await fetch(OLLAMA_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3.1",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
        stream: true,
      }),
    });

    if (!ollamaRes.ok || !ollamaRes.body) throw new Error("Ollama unavailable");

    const stream = new ReadableStream({
      async start(controller) {
        const reader = ollamaRes.body!.getReader();
        const decoder = new TextDecoder();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          for (const line of chunk.split("\n").filter(Boolean)) {
            try {
              const token = JSON.parse(line).message?.content ?? "";
              if (token) controller.enqueue(encoder.encode(token));
            } catch {}
          }
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch {
    // Dernier fallback : réponse démo
  }

  const demoReply = getDemoReply(messages[messages.length - 1]?.content ?? "");
  const stream = new ReadableStream({
    async start(controller) {
      for (const word of demoReply.split(" ")) {
        controller.enqueue(encoder.encode(word + " "));
        await new Promise((r) => setTimeout(r, 40));
      }
      controller.close();
    },
  });
  return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}

function getDemoReply(message: string): string {
  const msg = message.toLowerCase();
  if (msg.includes("tva"))
    return "La **TVA** (Taxe sur la Valeur Ajoutée) est un impôt indirect prélevé sur la consommation. Son taux varie selon votre pays. Précisez votre pays pour une réponse exacte.";
  if (msg.includes("irpp") || msg.includes("impôt sur le revenu"))
    return "L'**impôt sur le revenu des personnes physiques** est calculé sur un barème progressif. Les tranches et taux varient selon votre pays. Précisez votre pays pour un calcul exact.";
  if (msg.includes("regime") || msg.includes("régime"))
    return "Les **régimes fiscaux** (forfaitaire, simplifié, réel) dépendent du chiffre d'affaires et de votre pays. Quel est votre CA annuel et dans quel pays exercez-vous ?";
  if (msg.includes("is") || msg.includes("impôt sur les sociétés"))
    return "L'**IS (Impôt sur les Sociétés)** est un impôt sur les bénéfices de l'entreprise. Le taux standard varie selon les pays (généralement 25–33%). Précisez votre pays pour plus de détails.";
  return "Bonjour ! Je suis **SAIM Fiscal**. Posez-moi vos questions sur la fiscalité de votre entreprise (TVA, IS, IRPP, régimes fiscaux, optimisation fiscale...). Précisez votre pays pour des réponses adaptées.";
}
