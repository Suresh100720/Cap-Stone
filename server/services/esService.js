const esClient = require('../config/es');
const Candidate = require('../models/Candidate');

const INDEX_NAME = 'candidates';

exports.indexCandidate = async (candidate) => {
    try {
        await esClient.index({
            index: INDEX_NAME,
            id: candidate._id.toString(),
            body: {
                name: candidate.name,
                email: candidate.email,
                phone: candidate.phone,
                role: candidate.role,
                skills: candidate.skills,
                summary: candidate.summary,
                experience: candidate.experience,
                location: candidate.location,
                status: candidate.status,
                education: candidate.education
            }
        });
        await esClient.indices.refresh({ index: INDEX_NAME });
    } catch (error) {
        console.error("ES Indexing Error:", error);
    }
};

exports.removeCandidateFromES = async (id) => {
    try {
        await esClient.delete({
            index: INDEX_NAME,
            id: id.toString()
        });
        await esClient.indices.refresh({ index: INDEX_NAME });
    } catch (error) {
        // 404 is fine, it means it's already gone from ES
        if (error.meta?.statusCode !== 404) {
            console.error("ES Deletion Error:", error);
        }
    }
};

exports.searchCandidates = async (queryText) => {
    try {
        const result = await esClient.search({
            index: INDEX_NAME,
            body: {
                query: {
                    multi_match: {
                        query: queryText,
                        fields: ['name^2', 'role^2', 'skills^3', 'summary', 'location', 'email', 'phone', 'education', 'status'],
                        fuzziness: 'AUTO'
                    }
                }
            }
        });
        return result.hits.hits.map(hit => ({
            _id: hit._id,
            ...hit._source,
            score: hit._score
        }));
    } catch (error) {
        console.error("ES Search Error:", error);
        return [];
    }
};

exports.setupIndex = async () => {
    try {
        const exists = await esClient.indices.exists({ index: INDEX_NAME });
        if (exists) {
            console.log("ES Index exists, deleting to clear sample data...");
            await esClient.indices.delete({ index: INDEX_NAME });
        }
        
        await esClient.indices.create({
            index: INDEX_NAME,
            body: {
                mappings: {
                    properties: {
                        name: { type: 'text' },
                        email: { type: 'keyword' },
                        phone: { type: 'keyword' },
                        role: { type: 'text' },
                        skills: { type: 'text', analyzer: 'standard' },
                        summary: { type: 'text' },
                        experience: { type: 'integer' },
                        location: { type: 'keyword' },
                        status: { type: 'keyword' },
                        education: { type: 'text' }
                    }
                }
            }
        });
        console.log("ES Index created fresh");

        // Re-index all candidates from MongoDB
        const candidates = await Candidate.find({});
        console.log(`Re-indexing ${candidates.length} candidates from MongoDB...`);
        for (const candidate of candidates) {
            await exports.indexCandidate(candidate);
        }
        console.log("ES Re-indexing complete");
    } catch (error) {
        console.error("ES Setup/Re-indexing Error:", error);
    }
};
