import Anthropic from "@anthropic-ai/sdk";

export async function POST(req: Request) {
  const { domanda, reportContesto } = await req.json();
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const risposta = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 500,
    system: `Sei l'AI Chief of Staff. Hai accesso all'ultimo report aziendale.
Rispondi SEMPRE nella stessa lingua della domanda ricevuta.
Rispondi in modo diretto e manageriale.
REGOLA CRITICA: Riporta SOLO informazioni esplicitamente presenti nei dati forniti. Non fare inferenze, non aggiungere contesto esterno, non ipotizzare. Se un'informazione non è nei dati, scrivi esplicitamente nella lingua della domanda che il dato non è disponibile.
REPORT: ${reportContesto}`,
    messages: [{ role: "user", content: domanda }],
  });
  return Response.json({ risposta: (risposta.content[0] as { text: string }).text });
}
