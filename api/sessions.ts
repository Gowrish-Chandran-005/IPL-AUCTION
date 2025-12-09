import apiClient from './client';

export const sessionsAPI = {
    getAll: async () => {
        const response = await apiClient.get('/sessions');
        return response.data.sessions;
    },

    create: async (name: string) => {
        const response = await apiClient.post('/sessions', { name });
        return response.data.session;
    },

    getDetails: async (sessionId: string) => {
        const response = await apiClient.get(`/sessions/${sessionId}`);
        return response.data;
    },

    join: async (sessionId: string, teamId: string) => {
        const response = await apiClient.post(`/sessions/${sessionId}/join`, { teamId });
        return response.data.participant;
    },

    start: async (sessionId: string) => {
        const response = await apiClient.post(`/sessions/${sessionId}/start`);
        return response.data;
    },

    getResults: async (sessionId: string) => {
        const response = await apiClient.get(`/sessions/${sessionId}/results`);
        return response.data.results;
    },
};
