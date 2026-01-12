
// Simple in-memory storage for when MongoDB is offline
class MockStore {
    constructor() {
        this.users = [];
        this.feedbacks = [];
    }

    // User Methods
    async createUser(user) {
        const newUser = { ...user, _id: Date.now().toString(), createdAt: new Date() };
        this.users.push(newUser);
        return newUser;
    }

    async findUserByEmail(email) {
        return this.users.find(u => u.email === email);
    }

    async findUserById(id) {
        return this.users.find(u => u._id === id);
    }

    // Feedback Methods
    async createFeedback(feedback) {
        const newFeedback = { ...feedback, _id: Date.now().toString(), createdAt: new Date() };
        this.feedbacks.push(newFeedback);
        return newFeedback;
    }

    async getFeedbacks(filter = {}) {
        let results = [...this.feedbacks];
        if (filter.studentId) {
            results = results.filter(f => f.studentId === filter.studentId);
        }
        return results.sort((a, b) => b.createdAt - a.createdAt);
    }

    async countFeedbacks(filter = {}) {
        // primitive filter support
        if (filter.isCritical) return this.feedbacks.filter(f => f.isCritical).length;
        if (filter.sentiment) return this.feedbacks.filter(f => f.sentiment === filter.sentiment).length;
        return this.feedbacks.length;
    }

    async getDistinctStudents() {
        return [...new Set(this.feedbacks.map(f => f.studentId))];
    }
}

// Singleton instance
module.exports = new MockStore();
