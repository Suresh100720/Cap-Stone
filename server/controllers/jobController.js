const Job = require('../models/Job');
const Candidate = require('../models/Candidate');
const { calculateMatch } = require('../services/scoringService');

exports.createJob = async (req, res) => {
    try {
        const job = new Job(req.body);
        await job.save();
        res.status(201).json(job);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getJobs = async (req, res) => {
    try {
        const jobs = await Job.find().sort('-createdAt');
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.matchCandidate = async (req, res) => {
    const { candidateId, jobId } = req.params;
    try {
        const candidate = await Candidate.findById(candidateId);
        const job = await Job.findById(jobId);
        
        if (!candidate || !job) return res.status(404).json({ message: 'Not found' });

        const matching = calculateMatch(candidate, job);
        res.json(matching);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateJob = async (req, res) => {
    try {
        const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!job) return res.status(404).json({ message: 'Job not found' });
        res.json(job);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteJob = async (req, res) => {
    try {
        const job = await Job.findByIdAndDelete(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found' });
        res.json({ message: 'Job deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
