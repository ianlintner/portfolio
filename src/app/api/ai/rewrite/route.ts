import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { text, mode } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Missing OpenAI API key" },
        { status: 500 },
      );
    }

    const prompt =
      mode === "rewrite"
        ? `Rewrite the following blog post to improve clarity and style:\n\n${text}`
        : `Write a new blog post based on the following idea:\n\n${text}`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 800,
      }),
    });

    const data = await response.json();

    if (data.error) {
      return NextResponse.json({ error: data.error.message }, { status: 500 });
    }

    const aiText = data.choices?.[0]?.message?.content ?? "";

    return NextResponse.json({ result: aiText });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
