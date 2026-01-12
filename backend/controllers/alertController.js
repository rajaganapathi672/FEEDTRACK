const Alert = require('../models/Alert');
const Action = require('../models/Action');

// @desc    Get all alerts (Staff/Admin)
// @route   GET /api/alerts
const getAlerts = async (req, res) => {
    try {
        const { status } = req.query;
        const query = status ? { status } : {}; // status=open
        const alerts = await Alert.find(query).sort({ created_at: -1 });
        res.status(200).json(alerts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Respond to an alert (Create Action)
// @route   POST /api/alerts/:id/actions
const createAction = async (req, res) => {
    try {
        const { id } = req.params; // Alert ID
        const { suggested_action, staff_response } = req.body;

        const alert = await Alert.findById(id);
        if (!alert) {
            return res.status(404).json({ message: 'Alert not found' });
        }

        const action = await Action.create({
            alert_id: id,
            staff_id: req.user.id,
            suggested_action,
            staff_response,
            status: 'planned'
        });

        // Optionally update alert status
        alert.status = 'acknowledged';
        await alert.save();

        res.status(201).json(action);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAlerts,
    createAction
};
