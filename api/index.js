const app = require('../backend/index.js');
const connectDB = require('../backend/config/db.js');

module.exports = async (req, res) => {
    try {
        await connectDB();
        app(req, res);
    } catch (e) {
        console.error("Serverless Connection Error:", e);
        res.status(500).json({
            message: `DB Connect Error: ${e.message}`,
            error: e.message
        });
    }
};
