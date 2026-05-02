export async function runAI(env, messages, model = "@cf/meta/llama-3.1-8b-instruct") {
  if (!env.AI) {
    throw new Error("AI binding is missing. Ensure you are running wrangler with the correct configuration.");
  }

  try {
    const response = await env.AI.run(model, {
      messages,
      max_tokens: 2000
    });

    // Cloudflare Workers AI returns response as an object with a 'response' property for chat models
    if (!response || (!response.response && !response.result)) {
      throw new Error("Cloudflare AI returned an empty or invalid response.");
    }

    return {
      response: response.response || response.result,
      raw: response
    };
  } catch (err) {
    console.error("Cloudflare AI Error:", err);
    throw new Error(`AI Generation failed: ${err.message}`);
  }
}

