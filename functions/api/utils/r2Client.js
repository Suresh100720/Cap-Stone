export async function saveFile(env, key, file, text) {
  if (!env.CV_STORAGE) throw new Error("R2 Binding CV_STORAGE is missing. Check your wrangler.toml configuration.");
  
  console.log(`[R2] Attempting to save file: ${key}`);
  
  try {
    // 1. Save the raw file stream
    await env.CV_STORAGE.put(key, file.stream());
    
    // 2. Save the extracted text content
    const textContent = typeof text === 'string' ? text : String(text || '');
    await env.CV_STORAGE.put(`${key}.txt`, textContent);
    
    console.log(`[R2] Successfully saved ${key} and ${key}.txt`);
  } catch (err) {
    console.error(`[R2 Error] Failed to put objects:`, err);
    throw err;
  }
}

export async function getFileText(env, key) {
  if (!env.CV_STORAGE) throw new Error("R2 Binding CV_STORAGE is missing.");
  const obj = await env.CV_STORAGE.get(`${key}.txt`);
  if (!obj) throw new Error(`CV text not found in storage for key: ${key}`);
  return await obj.text();
}
