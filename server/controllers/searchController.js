const { searchCandidates } = require('../services/esService');
const { expandQuery } = require('../services/aiService');
const Candidate = require('../models/Candidate');

exports.search = async (req, res) => {
    const { q, useAI, experience, skills, roles } = req.query;
    try {
        let finalQuery = q || "";
        if (useAI === 'true' && q) {
            finalQuery = await expandQuery(q);
        }
        
        // Construct filters for MongoDB
        const mongoFilter = {};
        if (q) {
            const regex = new RegExp(q, 'i');
            mongoFilter.$or = [
                { name: regex },
                { email: regex },
                { phone: regex },
                { role: regex },
                { skills: { $in: [regex] } },
                { summary: regex },
                { location: regex },
                { status: regex },
                { education: { $in: [regex] } }
            ];
        }

        if (experience) {
            const expList = experience.split(',');
            const expQuery = [];
            if (expList.includes('entry')) expQuery.push({ experience: { $gte: 0, $lte: 2 } });
            if (expList.includes('mid')) expQuery.push({ experience: { $gt: 2, $lte: 5 } });
            if (expList.includes('senior')) expQuery.push({ experience: { $gt: 5, $lte: 10 } });
            if (expList.includes('expert')) expQuery.push({ experience: { $gt: 10 } });
            
            if (expQuery.length > 0) {
                mongoFilter.$and = mongoFilter.$and || [];
                mongoFilter.$and.push({ $or: expQuery });
            }
        }

        if (skills) {
            const skillList = skills.split(',');
            const skillRegexes = skillList.map(s => new RegExp(s, 'i'));
            mongoFilter.$and = mongoFilter.$and || [];
            mongoFilter.$and.push({ skills: { $in: skillRegexes } });
        }

        if (roles) {
            const roleList = roles.split(',');
            const roleRegexes = roleList.map(r => new RegExp(r, 'i'));
            mongoFilter.$and = mongoFilter.$and || [];
            mongoFilter.$and.push({ role: { $in: roleRegexes } });
        }

        let results = [];
        // Only use ES if no filters or if we want to integrate it (for now, simplify to MongoDB if filtered or ES fails)
        if (!experience && !skills && q) {
            results = await searchCandidates(finalQuery);
        }

        // Fallback to MongoDB if ES returns nothing, or if filters are present
        if (!results || results.length === 0) {
            const mongoResults = await Candidate.find(mongoFilter).limit(50);
            
            results = mongoResults.map(c => ({
                _id: c._id,
                name: c.name,
                email: c.email,
                phone: c.phone,
                role: c.role,
                location: c.location,
                skills: c.skills,
                summary: c.summary,
                experience: `${c.experience} Years`,
                status: c.status,
                score: 0.5
            }));
        }

        res.json({ results, usedQuery: finalQuery });
    } catch (err) {
        console.error("Search API Error:", err);
        res.status(500).json({ error: "Search failed" });
    }
};
