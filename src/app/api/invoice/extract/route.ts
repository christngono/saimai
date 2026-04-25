import { NextRequest } from "next/server";

const BACKEND_URL = "http://localhost:8001/api/invoice/extract";

export async function POST(req: NextRequest) {
  let backendRes: Response;
  try {
    const body = await req.json();
    backendRes = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(60000), // 60s pour le vision model
    });
  } catch (err) {
    return Response.json(
      { error: `Backend inaccessible (port 8001). Démarrez-le avec : uvicorn main:app --port 8001\n\nDétail : ${err}` },
      { status: 503 }
    );
  }

  const text = await backendRes.text();
  try {
    const data = JSON.parse(text);
    return Response.json(data, { status: backendRes.status });
  } catch {
    // Le backend a retourné du texte non-JSON (HTML d'erreur FastAPI, traceback…)
    return Response.json(
      { error: `Erreur backend ${backendRes.status} — réponse non-JSON : ${text.slice(0, 400)}` },
      { status: backendRes.status }
    );
  }
}
