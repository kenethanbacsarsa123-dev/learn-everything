import { NextResponse } from "next/server";

// 🔹 Your system prompt (you can tweak this if needed)
const SYSTEM_PROMPT = `
You are a helpful study assistant.

Always return your response in STRICT JSON format like this:

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

Do NOT include any text outside JSON.
`;

// 🔹 Main function that calls Plugsky API
async function generateStudyAids(topic: string) {
if (!process.env.PLUGSKY_API_KEY) {
throw new Error("Missing PLUGSKY_API_KEY in environment variables.");
}

const response = await fetch("https://api.plugsky.ai/v1/chat/completions", {
method: "POST",
headers: {
"Authorization": "Bearer ${process.env.PLUGSKY_API_KEY}",
"Content-Type": "application/json"
},
body: JSON.stringify({
model: "gpt-4o-mini", // free + fast model
messages: [
{
role: "system",
content: SYSTEM_PROMPT
},
{
role: "user",
content: "Topic: ${topic}"
}
],
temperature: 0.7
})
});

if (!response.ok) {
const errorText = await response.text();
throw new Error("Plugsky API error: ${errorText}");
}

const data = await response.json();

const raw = data?.choices?.[0]?.message?.content;

if (!raw) {
throw new Error("Empty response from AI.");
}

try {
return JSON.parse(raw);
} catch (err) {
console.error("JSON parse error:", raw);
throw new Error("AI did not return valid JSON.");
}
}

// 🔹 API Route handler (POST)
export async function POST(req: Request) {
try {
const body = await req.json();
const topic = body?.topic;

if (!topic) {
  return NextResponse.json(
    { error: "Topic is required." },
    { status: 400 }
  );
}

const result = await generateStudyAids(topic);

return NextResponse.json(result);

} catch (error: any) {
console.error("API ERROR:", error);

return NextResponse.json(
  { error: error.message || "Something went wrong." },
  { status: 500 }
);

}
}
