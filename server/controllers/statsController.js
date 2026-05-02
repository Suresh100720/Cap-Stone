const Candidate = require('../models/Candidate');
const Job = require('../models/Job');

exports.getStats = async (req, res) => {
    try {
        const totalCandidates = await Candidate.countDocuments();
        const totalJobs = await Job.countDocuments();
        
        // Group candidates by status
        const candidatesByStatus = await Candidate.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);
        
        // Group jobs by status
        const jobsByStatusGroup = await Job.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        const byStatus = {};
        candidatesByStatus.forEach(item => {
            byStatus[item._id || 'new'] = item.count;
        });

        const jobsByStatus = {};
        jobsByStatusGroup.forEach(item => {
            jobsByStatus[item._id || 'open'] = item.count;
        });

        res.json({
            totalCandidates,
            totalJobs,
            byStatus,
            jobsByStatus
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
