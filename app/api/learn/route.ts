import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const SYSTEM_PROMPT = `
You are a helpful AI that generates structured study aids.

Return ONLY valid JSON in this format:

{
  "summary": "string",
  "mindmap": ["string"],
  "timeline": [{"year": "string", "event": "string"}],
  "flashcards": [{"question": "string", "answer": "string"}],
  "quiz": [{"question": "string", "options": ["string"], "answer": "string"}]
}
`;

async function generateStudyAids(topic: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: `Topic: ${topic}` }
    ],
    temperature: 0.7,
  });

  const raw = response.choices[0].message.content;
  return raw;
}

export async function POST(req: NextRequest) {
  try {
    const { topic } = await req.json();

    const raw = await generateStudyAids(topic);

    let parsed;

    try {
      parsed = JSON.parse(raw || "{}");
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON from AI", raw },
        { status: 500 }
      );
    }

    return NextResponse.json(parsed);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
