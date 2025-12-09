import apiClient from './client';

export const playersAPI = {
    getAll: async () => {
        const response = await apiClient.get('/players');
        return response.data.players;
    },

    getById: async (playerId: string) => {
        const response = await apiClient.get(`/players/${playerId}`);
        return response.data.player;
    },
};
