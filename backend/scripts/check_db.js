
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const Feedback = require('../models/Feedback');
const Analysis = require('../models/Analysis');

const checkDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const recentFeedbacks = await Feedback.find().sort({ createdAt: -1 }).limit(5);
        console.log('\n--- Recent Feedbacks ---');
        for (const fb of recentFeedbacks) {
            console.log(`ID: ${fb._id}`);
            console.log(`Text: ${fb.raw_text.substring(0, 50)}...`);
            console.log(`Status: ${fb.status}`);
            console.log(`Sentiment: ${fb.sentiment}`);
            console.log(`Analysis Object:`, fb.analysis);
            console.log('------------------------');
        }

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.connection.close();
    }
};

checkDB();
