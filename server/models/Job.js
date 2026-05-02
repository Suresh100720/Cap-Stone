const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    requirements: [String],
    department: String,
    location: String,
    salaryRange: String,
    experienceRequired: Number,
    skills: [String],
    openings: { type: Number, default: 1 },
    status: { 
        type: String, 
        enum: ['Open', 'Closed', 'Actively Hiring', 'Urgently Hiring'], 
        default: 'Open' 
    },

    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Job', JobSchema);
