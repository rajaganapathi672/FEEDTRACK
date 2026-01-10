
import { Feedback, StaffInsight, User, UserRole } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const apiService = {
  getAuthHeaders() {
    const userStr = localStorage.getItem('feedtrack_user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.token) {
        return {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        };
      }
    }
    return { 'Content-Type': 'application/json' }; // Fallback
  },

  /**
   * Real Auth: Signup
   */
  async signup(name: string, email: string, role: UserRole, password?: string, institution_id?: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        role: role.toLowerCase(),
        password,
        institution_id,
        rollNumber: role === 'STUDENT' ? `R-${Math.floor(Math.random() * 100000)}` : undefined
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Signup failed');
    }

    const data = await response.json();
    return { ...data, id: data._id, role: (data.role || 'student').toUpperCase() };
  },

  /**
   * Real Auth: Signin
   */
  async signin(email: string, password?: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Login failed');
    }

    const data = await response.json();
    return { ...data, id: data._id, role: (data.role || 'student').toUpperCase() };
  },

  /**
   * Submits feedback. Tries the backend first; if it fails, 
   * falls back to browser-side Gemini analysis and local storage.
   */
  async submitFeedback(text: string, categoryGroup: string, categoryType: string, studentId: string, studentName: string, anonymous: boolean = false): Promise<Feedback> {
    try {
      const response = await fetch(`${API_BASE_URL}/feedback`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          raw_text: text,
          category_group: categoryGroup,
          category_type: categoryType,
          anonymous
        }),
      });

      if (response.ok) {
        const item = await response.json();
        // Map Backend Schema to Frontend Interface
        return {
          id: item._id,
          studentId: item.user_id,
          studentName: item.studentName || 'Student',
          text: item.raw_text,
          timestamp: item.createdAt || item.created_at || new Date().toISOString(),
          categoryGroup: item.category_group,
          categoryType: item.category_type,
          analysis: item.status === 'analyzed' ? {
            category: item.category,
            sentiment: item.sentiment ? (item.sentiment.charAt(0).toUpperCase() + item.sentiment.slice(1).toLowerCase()) : 'Pending',
            confidence: item.confidence || 0,
            highlights: [],
            summary: item.summary
          } : null
        } as any;
      }
      throw new Error('Server returned error');
    } catch (err) {
      console.error("Backend error:", err);
      throw err;
    }
  },

  /**
   * Fetches all feedback. Tries backend, then localStorage.
   */
  async getAllFeedbacks(): Promise<Feedback[]> {
    try {
      // Determine endpoint based on role
      let endpoint = `${API_BASE_URL}/feedback`;
      const userStr = localStorage.getItem('feedtrack_user');
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user.role === 'STUDENT') {
          endpoint = `${API_BASE_URL}/feedback/mine`;
        }
      }

      const response = await fetch(endpoint, {
        headers: this.getAuthHeaders()
      });

      if (response.status === 401) {
        const errData = await response.json().catch(() => ({}));
        console.error("Auth Error Detail:", errData);
        localStorage.removeItem('feedtrack_user');
        window.location.reload();
        throw new Error(errData.message || 'Session expired. Please login again.');
      }

      if (response.ok) {
        const data = await response.json();
        return data.map((item: any) => ({
          id: item._id,
          studentId: item.user_id,
          studentName: item.studentName || 'Student',
          text: item.raw_text,
          timestamp: item.createdAt || item.created_at || new Date().toISOString(),
          categoryGroup: item.category_group,
          categoryType: item.category_type,
          analysis: item.status === 'analyzed' ? {
            category: item.category,
            sentiment: item.sentiment ? (item.sentiment.charAt(0).toUpperCase() + item.sentiment.slice(1).toLowerCase()) : 'Pending',
            confidence: item.confidence || 0,
            highlights: [],
            summary: item.summary
          } : null
        }));
      }
      throw new Error('Server returned error');
    } catch (err) {
      console.error("Failed to fetch feedbacks", err);
      // Don't return empty array if it's a critical auth error, let UI handle it? 
      // For now, logging and returning empty is safer for UI not to crash, but 401 handling above handles the flow.
      return [];
    }
  },

  /**
   * Generates insights. Tries backend.
   */
  async getStaffInsights(): Promise<StaffInsight> {
    const response = await fetch(`${API_BASE_URL}/insights`, {
      method: 'POST',
      headers: this.getAuthHeaders()
    });
    if (response.ok) return await response.json();
    throw new Error('Server returned error');
  }
};
