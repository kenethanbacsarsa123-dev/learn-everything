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
  if (!process.env.PLUGSKY_API_KEY) {
    throw new Error("Missing PLUGSKY_API_KEY");
  }

  const response = await fetch("https://api.plugsky.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.PLUGSKY_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Topic: ${topic}` }
      ]
    })
  });

  const data = await response.json();

  const raw = data?.choices?.[0]?.message?.content;

  if (!raw) {
    throw new Error("No response from AI");
  }

  return JSON.parse(raw);
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
