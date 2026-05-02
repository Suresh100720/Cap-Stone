const Groq = require('groq-sdk');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

let groq = null;
if (process.env.GROQ_API_KEY) {
  console.log("Groq API Key found, initializing...");
  groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });
} else {
  console.warn("GROQ_API_KEY NOT FOUND in process.env");
}

exports.groq = groq;

/**
 * Enriches candidate data from raw resume text using Groq
 */
exports.enrichCV = async (text) => {
    const prompt = `You are an expert recruitment AI. Extract details from the following resume text.
    Return ONLY a valid JSON object with these keys: 
    "name", "email", "phone", "skills" (array), "experience" (number in years), "summary" (short paragraph), "education" (array).
    Resume Text: ${text}`;

    if (!groq) {
        console.warn("Groq API key missing. Enrichment skipped.");
        return { name: "AI Unavailable", skills: [], summary: "Please add GROQ_API_KEY to .env" };
    }
    try {
        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.1,
            response_format: { type: "json_object" }
        });
        
        const content = response.choices[0].message.content;
        return JSON.parse(content);
    } catch (error) {
        console.error("Groq CV Enrichment Error:", error);
        throw error;
    }
};

/**
 * Handles multi-turn chat for screening using Groq
 */
exports.getChatResponse = async (history, message) => {
    const systemPrompt = "You are a professional recruitment screening assistant. Ask structured questions about skills, projects, and experience. Be polite but thorough. Maintain history.";
    
    if (!groq) return "AI Screening is currently unavailable. Please check backend configuration.";
    try {
        const messages = history.map(h => ({ role: h.role === 'ai' ? 'assistant' : 'user', content: h.content }));
        messages.push({ role: "user", content: message });

        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: systemPrompt },
                ...messages
            ],
        });

        return response.choices[0].message.content;
    } catch (error) {
        console.error("Groq Chat Error:", error);
        throw error;
    }
};

/**
 * Expands search queries using Groq
 */
exports.expandQuery = async (query) => {
    const prompt = `Expand the following recruitment search query into related skills, technologies, and synonyms for an Elasticsearch search. 
    Return a comma-separated list of terms.
    Query: ${query}`;

    if (!groq) return query;
    try {
        const response = await groq.chat.completions.create({
            model: "llama3-8b-8192",
            messages: [{ role: "user", content: prompt }],
        });
        return response.choices[0].message.content;
    } catch (error) {
        console.error("Groq Query Expansion Error:", error);
        return query; // Fallback to original
    }
};
