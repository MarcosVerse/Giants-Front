const API_URL = 'http://localhost:3001/api';

export const contatosApi = {
    getAll: async () => {
        const response = await fetch(`${API_URL}/contatos`);
        return response.json();
    },

    create: async (contato) => {
        const response = await fetch(`${API_URL}/contatos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contato)
        });
        return response.json();
    },

    update: async (id, contato) => {
        const response = await fetch(`${API_URL}/contatos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contato)
        });
        return response.json();
    },

    delete: async (id) => {
        const response = await fetch(`${API_URL}/contatos/${id}`, {
            method: 'DELETE'
        });
        return response.json();
    }
};

export const mensagensApi = {
    enviar: async (grupo, mensagem) => {
        const response = await fetch(`${API_URL}/enviar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ grupo, mensagem })
        });
        return response.json();
    }
};