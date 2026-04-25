import { NextRequest } from "next/server";

const FASTAPI_URL = "http://localhost:8001/api/chat";
const OLLAMA_URL = "http://localhost:11434/api/chat";

const SYSTEM_PROMPT = `Tu es SAIM Conseil, un assistant expert en fiscalité camerounaise.
Tu aides les entrepreneurs et particuliers à comprendre et appliquer les lois fiscales du Cameroun.
Tu calcules avec précision : IRPP, TVA (19,25%), IS, Patente, et autres taxes.
Tu réponds toujours en français avec des explications claires et des exemples chiffrés.
Tu cites les articles de loi pertinents quand tu expliques une règle fiscale.`;

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
    return "La **TVA au Cameroun** est fixée à **19,25%** (16,5% TVA + 2,75% CAC). Seuil d'assujettissement : 50 millions FCFA de CA annuel HT (article 125 du CGI).";
  if (msg.includes("irpp"))
    return "L'**IRPP** est calculé sur un barème progressif : 10% jusqu'à 2M, 15% de 2M à 3M, 25% de 3M à 5M, 35% au-delà.";
  if (msg.includes("regime") || msg.includes("régime"))
    return "Trois régimes fiscaux au Cameroun :\n- **Libératoire** : CA < 10M FCFA\n- **Simplifié** : CA entre 10M et 50M FCFA\n- **Réel** : CA > 50M FCFA";
  return "Bonjour ! Je suis **SAIM Conseil**. Posez-moi vos questions sur la fiscalité camerounaise (TVA, IRPP, IS, Patente, régimes fiscaux...).";
}
