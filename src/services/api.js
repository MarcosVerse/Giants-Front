import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3001/api'
});

// contatos
export const contatosApi = {

    search: (filters) => {
        return api.post('/contatos/search', filters).then(r => r.data);
    },

    create: (data) => {
        return api.post('/contatos', data).then(r => r.data);
    },

    update: (id, data) => {
        return api.put(`/contatos/${id}`, data).then(r => r.data);
    },

    delete: (id) => {
        return api.delete(`/contatos/${id}`).then(r => r.data);
    }
};

// grupos
export const gruposApi = {
    getAll: () => {
        return api.get('/grupos').then(r => r.data);
    },

    create: (data) => {
        return api.post('/grupos', data).then(r => r.data);
    },

    update: (id, data) => {
        return api.put(`/grupos/${id}`, data).then(r => r.data);
    },

    delete: (id) => {
        return api.delete(`/grupos/${id}`).then(r => r.data);
    }
};

export default api;