import Anthropic from "@anthropic-ai/sdk";

export async function POST(req: Request) {
  const { domanda, reportContesto } = await req.json();
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const risposta = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 500,
    system: `Sei l'AI Chief of Staff. Hai accesso all'ultimo report aziendale.
Rispondi in italiano in modo diretto e manageriale.
REPORT: ${reportContesto}`,
    messages: [{ role: "user", content: domanda }],
  });
  return Response.json({ risposta: (risposta.content[0] as { text: string }).text });
}
