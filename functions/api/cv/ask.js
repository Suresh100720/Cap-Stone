import { getFileText } from "../utils/r2Client";
import { runAI } from "../utils/aiClient";

export async function onRequestPost({ request, env }) {
  try {
    const { key, question } = await request.json();

    if (!key || !question) {
      return new Response(JSON.stringify({ error: "Missing key or question" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const cvText = await getFileText(env, key);

    const systemPrompt = `You are an expert HR assistant and talent acquisition specialist.
You have been given a candidate's CV/Resume below.
Your job is to answer questions about this candidate accurately and professionally.
Always base your answers on the provided CV content. Be specific and cite relevant details.`;

    const userContent = `CANDIDATE CV/RESUME:
---
${cvText.substring(0, 8000)}
---

QUESTION: ${question}

Please provide a detailed, professional answer based strictly on the CV content above.`;

    console.log("[ask-cv] Calling AI with CV text length:", cvText.length);

    const aiResult = await runAI(env, [
      { role: "system", content: systemPrompt },
      { role: "user", content: userContent }
    ]);

    console.log("[ask-cv] AI response received:", aiResult.response?.substring(0, 100));

    return new Response(JSON.stringify({ 
      answer: aiResult.response,
      debug: {
        cvTextLength: cvText.length,
        key
      }
    }), {
      headers: { "Content-Type": "application/json" }
    });


  } catch (err) {
    console.error("[ask-cv] Error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
