import { runAI } from "../utils/aiClient";

export async function onRequestPost({ request, env }) {
  try {
    const { text } = await request.json();

    if (!text || text.length < 50) {
      throw new Error("Insufficient text content for parsing.");
    }

    const systemPrompt = `You are a professional resume parser. Extract information in JSON format.
    Return ONLY valid JSON.
    Fields: name, email, phone, role (specialization), skills (array), experience (number in years).`;

    const userPrompt = `Resume text to parse:\n${text}`;

    const aiResult = await runAI(env, [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ]);

    const rawText = aiResult.response;
    console.log("[CV Parser] AI RAW RESPONSE:", rawText);
    
    // Robust JSON extraction
    let parsed = {};
    try {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      const cleanJson = jsonMatch ? jsonMatch[0] : rawText;
      parsed = JSON.parse(cleanJson);
    } catch (e) {
      console.error("JSON Parse Error. Raw:", rawText);
      // Fallback: search for keys manually if JSON.parse fails
      parsed = {
        name: (rawText.match(/"name":\s*"([^"]+)"/) || [])[1],
        email: (rawText.match(/"email":\s*"([^"]+)"/) || [])[1],
        phone: (rawText.match(/"phone":\s*"([^"]+)"/) || [])[1],
        role: (rawText.match(/"role":\s*"([^"]+)"/) || [])[1],
        skills: [],
        experience: 0
      };
    }

    return new Response(JSON.stringify(parsed), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("[Parse Error]", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
