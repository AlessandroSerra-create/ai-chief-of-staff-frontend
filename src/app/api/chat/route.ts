import Anthropic from "@anthropic-ai/sdk";

export async function POST(req: Request) {
  const { domanda, reportContesto, cliente = "aloe-vera-pilot" } = await req.json();
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  // Legge prompt e contesto da Supabase
  let systemPrompt = "";
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/configurazioni?cliente=eq.${cliente}&limit=1`,
      {
        headers: {
          apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
        },
      }
    );
    const rows = await res.json();
    if (rows.length) {
      const config = rows[0];
      const contesto = config.contesto_azienda ?? "";
      const promptTemplate = config.prompt_chat ?? "";
      systemPrompt = promptTemplate
        .replace("{contesto_azienda}", contesto)
        .replace("{reportContesto}", reportContesto ?? "");
    }
  } catch (_) {}

  // Fallback se Supabase non risponde
  if (!systemPrompt) {
    systemPrompt = `Você é o Chief of Staff de IA da Sorelle Brasil.
Responda SEMPRE no mesmo idioma da pergunta recebida.
RELATÓRIO ATUAL: ${reportContesto}
Seja direto e objetivo. Interprete os dados, não apenas os relate.`;
  }

  const risposta = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 500,
    system: systemPrompt,
    messages: [{ role: "user", content: domanda }],
  });

  return Response.json({ risposta: (risposta.content[0] as { text: string }).text });
}
