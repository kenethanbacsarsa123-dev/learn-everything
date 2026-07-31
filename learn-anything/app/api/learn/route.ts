import { NextRequest, NextResponse } from "next/server";
import type {
  LearnResponse,
  MindMap,
  TimelineEvent,
  Flashcard,
  QuizQuestion,
  WikipediaSummary,
  YouTubeVideo,
  GithubProject,
} from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const SYSTEM_PROMPT = `You are the content engine behind "Learn Anything", a one-page learning hub.
Given a single topic, you generate four structured study aids for it. Respond with ONLY raw JSON —
no markdown fences, no commentary before or after — matching exactly this shape:

{
  "mindMap": {
    "nodes": [{ "id": "1", "label": "string" }, ...],
    "edges": [{ "from": "1", "to": "2" }, ...]
  },
  "timeline": [{ "date": "string", "event": "string" }, ...],
  "flashcards": [{ "question": "string", "answer": "string" }, ...],
  "quiz": [{ "question": "string", "options": ["a","b","c","d"], "correctIndex": 0 }, ...]
}

Rules:
- mindMap: node "1" is always the root (the topic itself). Include 8-14 nodes total across up to 3 levels
  branching out from the root. Every edge must reference existing node ids. Keep labels short (2-6 words).
- timeline: 6-10 chronological entries. "date" can be a year, era, range, or relative label if the topic
  isn't historical (e.g. "Step 1", "Foundational era"). Order matters — earliest first.
- flashcards: 8-12 question/answer pairs, concise and testable, ordered from foundational to advanced.
- quiz: 5-8 multiple-choice questions, each with exactly 4 options and one correct answer (correctIndex 0-3).
  Vary difficulty and avoid trivial wording overlap between the question and the correct option.
- Ground everything in real, accurate information about the topic. If the topic is obscure, fictional, or
  ambiguous, do your best with what the label most plausibly refers to.`;

async function generateStudyAids(topic: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured on the server.");
  }

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: "user", parts: [{ text: `Topic: ${topic}` }] }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.7,
          maxOutputTokens: 4096,
        },
      }),
    }
  );

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Gemini API error (${res.status}): ${errBody.slice(0, 300)}`);
  }

  const json = await res.json();
  const raw: string = json?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  if (!raw) {
    throw new Error("Gemini returned an empty response — try a different topic.");
  }

  const parsed = JSON.parse(raw) as {
    mindMap: MindMap;
    timeline: TimelineEvent[];
    flashcards: Flashcard[];
    quiz: QuizQuestion[];
  };

  return parsed;
}

async function fetchWikipediaSummary(topic: string): Promise<WikipediaSummary | null> {
  try {
    const searchRes = await fetch(
      `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(
        topic
      )}&limit=1&namespace=0&format=json`
    );
    if (!searchRes.ok) return null;
    const searchJson = (await searchRes.json()) as [string, string[], string[], string[]];
    const bestTitle = searchJson[1]?.[0] ?? topic;

    const summaryRes = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(bestTitle)}`
    );
    if (!summaryRes.ok) return null;
    const summaryJson = await summaryRes.json();
    if (!summaryJson.extract) return null;

    return {
      title: summaryJson.title,
      extract: summaryJson.extract,
      url:
        summaryJson.content_urls?.desktop?.page ??
        `https://en.wikipedia.org/wiki/${encodeURIComponent(bestTitle)}`,
    };
  } catch {
    return null;
  }
}

async function fetchGithubProjects(topic: string): Promise<GithubProject[]> {
  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
    };
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }
    const res = await fetch(
      `https://api.github.com/search/repositories?q=${encodeURIComponent(
        topic
      )}&sort=stars&order=desc&per_page=6`,
      { headers }
    );
    if (!res.ok) return [];
    const json = await res.json();
    if (!Array.isArray(json.items)) return [];

    return json.items.map((item: any) => ({
      name: item.name,
      fullName: item.full_name,
      description: item.description ?? "No description provided.",
      url: item.html_url,
      stars: item.stargazers_count,
      language: item.language,
    }));
  } catch {
    return [];
  }
}

async function fetchYouTubeVideos(topic: string): Promise<YouTubeVideo[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) return [];
  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=6&q=${encodeURIComponent(
        topic
      )}&key=${apiKey}`
    );
    if (!res.ok) return [];
    const json = await res.json();
    if (!Array.isArray(json.items)) return [];

    return json.items
      .filter((item: any) => item.id?.videoId)
      .map((item: any) => ({
        videoId: item.id.videoId,
        title: item.snippet.title,
        channel: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails?.medium?.url ?? item.snippet.thumbnails?.default?.url,
      }));
  } catch {
    return [];
  }
}

export async function POST(req: NextRequest) {
  let topic: string;
  try {
    const body = await req.json();
    topic = (body?.topic ?? "").toString().trim();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!topic) {
    return NextResponse.json({ error: "A topic is required." }, { status: 400 });
  }
  if (topic.length > 120) {
    return NextResponse.json({ error: "Topic is too long." }, { status: 400 });
  }

  const warnings: string[] = [];

  const [studyAidsResult, wikipedia, github, youtube] = await Promise.allSettled([
    generateStudyAids(topic),
    fetchWikipediaSummary(topic),
    fetchGithubProjects(topic),
    fetchYouTubeVideos(topic),
  ]);

  if (studyAidsResult.status === "rejected") {
    return NextResponse.json(
      { error: studyAidsResult.reason?.message ?? "Failed to generate study aids." },
      { status: 502 }
    );
  }

  if (!process.env.YOUTUBE_API_KEY) {
    warnings.push("YouTube videos are unavailable — no YOUTUBE_API_KEY is configured.");
  }

  const response: LearnResponse = {
    topic,
    mindMap: studyAidsResult.value.mindMap ?? null,
    timeline: studyAidsResult.value.timeline ?? [],
    flashcards: studyAidsResult.value.flashcards ?? [],
    quiz: studyAidsResult.value.quiz ?? [],
    wikipedia: wikipedia.status === "fulfilled" ? wikipedia.value : null,
    github: github.status === "fulfilled" ? github.value : [],
    youtube: youtube.status === "fulfilled" ? youtube.value : [],
    warnings,
  };

  return NextResponse.json(response);
}
