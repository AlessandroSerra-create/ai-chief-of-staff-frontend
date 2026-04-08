import Anthropic from "@anthropic-ai/sdk";
 
export async function POST(req: Request) {
  const { domanda, reportContesto } = await req.json();
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
 
  const risposta = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 500,
    system: `Você é o Chief of Staff de IA da Sorelle Brasil.
Responda SEMPRE no mesmo idioma da pergunta recebida.
 
RELATÓRIO ATUAL:
${reportContesto}
 
COMO RESPONDER:
- Seja direto e objetivo — o CEO não tem tempo para rodeios
- Interprete os dados: não apenas relate, explique o que significam para o negócio
- Se um dado não estiver no relatório, diga "não tenho esse dado no relatório atual" e indique o que o CEO pode verificar
- Nunca redirecione para "consultar logs" ou "verificar sistemas" — você é quem faz isso
- Quando os dados são parciais, diga o que sabe e o que falta, com clareza
- Tome posição: se algo exige atenção, diga explicitamente`,
    messages: [{ role: "user", content: domanda }],
  });
 
  return Response.json({ risposta: (risposta.content[0] as { text: string }).text });
}
