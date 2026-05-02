exports.calculateMatch = (candidate, job) => {
    let score = 0;
    const reasons = [];

    // Skills match
    const candidateSkills = (candidate.skills || []).map(s => s.toLowerCase());
    const jobRequirements = (job.requirements || []).map(r => r.toLowerCase());
    
    const matchedSkills = jobRequirements.filter(req => 
        candidateSkills.some(skill => skill.includes(req) || req.includes(skill))
    );

    if (jobRequirements.length > 0) {
        const skillScore = (matchedSkills.length / jobRequirements.length) * 60; // 60% weight
        score += skillScore;
        reasons.push(`${matchedSkills.length} skills matched out of ${jobRequirements.length}`);
    }

    // Experience match
    if (candidate.experience >= job.experienceRequired) {
        score += 40; // 40% weight
        reasons.push(`Experience requirement met (${candidate.experience} years)`);
    } else if (candidate.experience > 0) {
        const expScore = (candidate.experience / job.experienceRequired) * 40;
        score += expScore;
        reasons.push(`Partial experience match`);
    }

    return {
        totalScore: Math.round(score),
        reasons
    };
};
