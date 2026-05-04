const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { setupIndex } = require('./services/esService');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log("Connected to MongoDB for re-indexing...");
        await setupIndex();
        console.log("Re-indexing complete. Stale data should be gone.");
        process.exit(0);
    })
    .catch(err => {
        console.error("Connection error:", err);
        process.exit(1);
    });
