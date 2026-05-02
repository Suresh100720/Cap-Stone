const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: String,
    role: String,
    location: String,
    skills: [String],
    experience: { type: Number, default: 0 },
    resumeText: String,
    summary: String,
    education: [String],
    aiScore: { type: Number, default: 0 },
    aiInsights: String,
    status: { 
        type: String, 
        enum: ['Active', 'Inactive', 'Hired', 'Interview', 'Screening', 'Rejected', 'Applied', 'Applied'], 
        default: 'Active' 
    },
    chatHistory: [{
        role: String,
        content: String,
        timestamp: { type: Date, default: Date.now }
    }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Candidate', CandidateSchema);
