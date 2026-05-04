const { getChatResponse, expandQuery, groq } = require('../services/aiService');
const Candidate = require('../models/Candidate');

// In-memory cache for CV texts (using file name/key)
const cvCache = new Map();

exports.chat = async (req, res) => {
    const { candidateId, message } = req.body;
    try {
        const candidate = await Candidate.findById(candidateId);
        if (!candidate) return res.status(404).json({ message: 'Candidate not found' });

        const aiResponse = await getChatResponse(candidate.chatHistory, message);
        
        candidate.chatHistory.push({ role: 'user', content: message });
        candidate.chatHistory.push({ role: 'ai', content: aiResponse });
        await candidate.save();

        res.json({ response: aiResponse, history: candidate.chatHistory });
    } catch (err) {
        res.status(500).json({ error: "Chat failed" });
    }
};

exports.expand = async (req, res) => {
    const { query } = req.query;
    try {
        const expanded = await expandQuery(query);
        res.json({ expanded });
    } catch (err) {
        res.status(500).json({ error: "Expansion failed" });
    }
};

exports.generateJD = async (req, res) => {
    const { title, experience, department, workMode, skills, requirements } = req.body;
    
    const prompt = `You are an expert HR and recruitment architect. Generate a highly professional, structured Job Description in JSON format.
    Include these keys: "responsibilities" (array of 5 strings), "requirements_list" (array of 5 strings), "description" (short paragraph).
    Role: ${title}
    Experience: ${experience}
    Department: ${department}
    Mode: ${workMode}
    Key Skills: ${(skills || []).join(', ')}
    Additional Requirements: ${requirements}`;

    if (!groq) {
        return res.status(503).json({ error: "AI Service Unavailable. Please add GROQ_API_KEY to .env" });
    }

    try {
        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" }
        });
        const content = JSON.parse(response.choices[0].message.content);
        res.json({ title, ...content });
    } catch (err) {
        console.error("JD Generation Error:", err);
        res.status(500).json({ error: "JD Generation failed" });
    }
};

exports.uploadCV = async (req, res) => {
    const { text } = req.body;
    const file = req.file;
    if (!text) return res.status(400).send("No text provided");
    
    const key = `cv_${Date.now()}`;
    cvCache.set(key, text);
    
    res.json({ key, message: "File uploaded and processed" });
};

exports.askCV = async (req, res) => {
    const { key, question } = req.body;
    const cvText = cvCache.get(key);
    if (!cvText) return res.status(404).send("CV content not found or session expired");

    const systemPrompt = "You are an expert HR Analyst. Analyze the provided resume and answer questions precisely. Use professional language.";
    const userPrompt = `Resume Content: ${cvText}\n\nQuestion: ${question}`;

    if (!groq) {
        return res.status(503).json({ error: "AI Service Unavailable. Please add GROQ_API_KEY to .env" });
    }

    try {
        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ]
        });
        res.json({ answer: response.choices[0].message.content });
    } catch (err) {
        console.error("CV Analysis Error:", err);
        res.status(500).json({ error: "Analysis failed" });
    }
};

exports.parseCV = async (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "No text provided" });

    if (!groq) {
        return res.status(503).json({ error: "AI Service Unavailable. Please add GROQ_API_KEY to .env" });
    }

    const prompt = `You are a professional resume parser. Extract the following information from the resume text in JSON format:
    - name: Full name of the candidate
    - email: Email address
    - role: The primary job title or specialization. MUST be a short, concise professional title (e.g. "Software Engineer", "Data Scientist"). DO NOT include sentences, summaries, or long descriptions.
    - skills: An array of technical skills (e.g. ["Python", "React"])
    - experience: Estimated years of experience as a number
    - phone: Contact phone number
    
    Resume Text:
    ${text}`;

    try {
        console.log("Calling Groq for parsing...");
        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" }
        });
        
        const rawContent = response.choices[0].message.content;
        console.log("AI Raw Response:", rawContent);
        
        // Helper to strip markdown code blocks if present
        const cleanJson = (str) => {
            return str.replace(/```json/g, '').replace(/```/g, '').trim();
        };

        try {
            const extracted = JSON.parse(cleanJson(rawContent));
            res.json(extracted);
        } catch (jsonErr) {
            console.error("JSON Parse Error:", jsonErr, "Raw Content:", rawContent);
            res.status(500).json({ error: "AI returned invalid data format." });
        }
    } catch (err) {
        console.error("Groq API Error:", err.message || err);
        res.status(500).json({ error: `AI Error: ${err.message || "Unknown error"}` });
    }
};
