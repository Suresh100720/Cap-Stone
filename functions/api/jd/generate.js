import { runAI } from "../utils/aiClient";

export async function onRequestPost({ request, env }) {
  try {
    const data = await request.json();

    const systemPrompt = `You are an expert HR assistant. Your task is to generate a professional job description in JSON format.
    Return ONLY valid JSON. No markdown blocks, no preamble.
    Structure:
    {
      "title": "Exact job title",
      "responsibilities": ["list of 5 key responsibilities"],
      "requirements": ["list of 5 key requirements"]
    }`;

    const userPrompt = `Generate a job description for:
    Title: ${data.title}
    Department: ${data.department}
    Context/Skills: ${data.requirements}`;

    const aiResult = await runAI(env, [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ]);

    const rawText = aiResult.response;
    console.log("[JD Generator] AI RAW RESPONSE:", rawText);
    
    // Robust JSON extraction
    let parsed;
    try {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      const cleanJson = jsonMatch ? jsonMatch[0] : rawText;
      parsed = JSON.parse(cleanJson);
    } catch (parseErr) {
      console.error("JSON Parse Error:", parseErr);
      // Fallback for simple text response
      parsed = {
        title: data.title,
        responsibilities: [rawText.substring(0, 500)],
        requirements: ["Extraction failed, please review raw output."]
      };
    }
    
    return new Response(JSON.stringify(parsed), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    console.error("JD Generate Error:", e);
    return new Response(JSON.stringify({ 
      error: "Failed to generate job description",
      details: e.message 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

