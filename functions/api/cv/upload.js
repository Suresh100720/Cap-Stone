import { saveFile } from "../utils/r2Client";

export async function onRequestPost({ request, env }) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const text = formData.get("text");

    if (!file || typeof file === 'string') {
      throw new Error("No file uploaded or file is invalid");
    }

    if (!env.CV_STORAGE) {
      throw new Error("R2 bucket binding 'CV_STORAGE' is missing. Check wrangler.jsonc");
    }

    const key = Date.now().toString();
    await saveFile(env, key, file, text);

    return new Response(JSON.stringify({ key }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("[API Error]", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
