import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `
You are a helpful study assistant.

Return ONLY JSON in this format:

{
  "summary": "short explanation",
  "keyPoints": ["point1", "point2"],
  "quiz": [
    {
      "question": "question here",
      "choices": ["A", "B", "C", "D"],
      "answer": "correct answer"
    }
  ]
}
`;

async function generateStudyAids(topic: string) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("Missing GROQ_API_KEY");
  }

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
model: "llama3-70b-8192",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Topic: ${topic}` }
      ],
      temperature: 0.7
    })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Groq error: ${text}`);
  }

  const data = await res.json();

  let raw = data?.choices?.[0]?.message?.content;

  if (!raw) {
    throw new Error("No AI response");
  }

  // 🔥 CLEAN RESPONSE (important)
  raw = raw
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error("RAW:", raw);
    throw new Error("Invalid JSON from AI");
  }
}

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();

    const result = await generateStudyAids(topic);

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
