import { NextRequest } from "next/server";
const BACKEND = "http://localhost:8001/api/projects";
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await fetch(BACKEND, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), signal: AbortSignal.timeout(60000) });
    const text = await res.text();
    try { return Response.json(JSON.parse(text), { status: res.status }); }
    catch { return Response.json({ error: `Backend ${res.status}: ${text.slice(0, 300)}` }, { status: res.status }); }
  } catch (err) { return Response.json({ error: `Backend inaccessible: ${err}` }, { status: 503 }); }
}
