const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const app = require('./app');
const connectDB = require('./config/db');
const { setupIndex } = require('./services/esService');

const PORT = process.env.PORT || 5000;

connectDB().then(async () => {
    console.log("MongoDB Connected. Skipping ES setup to ensure stability.");
    // try {
    //     await setupIndex();
    // } catch (e) {
    //     console.warn("ElasticSearch setup failed, search may be unavailable:", e.message);
    // }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
