const Candidate = require('../models/Candidate');
const { enrichCV } = require('../services/aiService');
const { indexCandidate, removeCandidateFromES } = require('../services/esService');

exports.createCandidate = async (req, res) => {
    try {
        const { email } = req.body;
        const existingCandidate = await Candidate.findOne({ email });
        if (existingCandidate) {
            return res.status(400).json({ error: "A candidate with this email already exists." });
        }

        const candidate = new Candidate(req.body);
        await candidate.save();
        
        try {
            await indexCandidate(candidate);
        } catch (esErr) {
            console.warn("ElasticSearch indexing failed, but candidate saved to DB.");
        }

        res.status(201).json(candidate);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.enrichCandidate = async (req, res) => {
    const { resumeText } = req.body;
    try {
        const enrichedData = await enrichCV(resumeText);
        res.json(enrichedData);
    } catch (err) {
        res.status(500).json({ error: "Failed to enrich CV" });
    }
};

exports.getCandidates = async (req, res) => {
    try {
        const candidates = await Candidate.find().sort('-createdAt');
        res.json(candidates);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCandidateById = async (req, res) => {
    try {
        const candidate = await Candidate.findById(req.params.id);
        if (!candidate) return res.status(404).json({ message: 'Candidate not found' });
        res.json(candidate);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateCandidate = async (req, res) => {
    try {
        const { email } = req.body;
        if (email) {
            const existingCandidate = await Candidate.findOne({ email, _id: { $ne: req.params.id } });
            if (existingCandidate) {
                return res.status(400).json({ error: "This email is already in use by another candidate." });
            }
        }

        const candidate = await Candidate.findByIdAndUpdate(req.params.id, req.body, { new: true });
        
        try {
            await indexCandidate(candidate);
        } catch (esErr) {
            console.warn("ES Indexing failed during update.");
        }

        res.json(candidate);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteCandidate = async (req, res) => {
    try {
        await Candidate.findByIdAndDelete(req.params.id);
        try {
            await removeCandidateFromES(req.params.id);
        } catch (esErr) {
            console.warn("Failed to remove candidate from ES, but deleted from DB.");
        }
        res.json({ message: 'Candidate deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
