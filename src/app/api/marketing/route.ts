import { NextRequest } from "next/server";

const BACKEND_URL = "http://localhost:8001/api/marketing";

export async function POST(req: NextRequest) {
  let backendRes: Response;
  try {
    const body = await req.json();
    backendRes = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(60000),
    });
  } catch (err) {
    return Response.json({ error: `Backend inaccessible : ${err}` }, { status: 503 });
  }

  const text = await backendRes.text();
  try {
    return Response.json(JSON.parse(text), { status: backendRes.status });
  } catch {
    return Response.json(
      { error: `Erreur backend ${backendRes.status} : ${text.slice(0, 300)}` },
      { status: backendRes.status }
    );
  }
}
