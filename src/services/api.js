const API_URL = 'http://localhost:3001/api';

export const contatosApi = {
    getAll: async () => {
        const response = await fetch(`${API_URL}/contatos`);
        if (!response.ok) throw new Error("Erro ao buscar contatos");
        return response.json();
    },

    create: async (contato) => {
        const response = await fetch(`${API_URL}/contatos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contato)
        });
        if (!response.ok) throw new Error("Erro ao criar contato");
        return response.json();
    },

    update: async (id, contato) => {
        const response = await fetch(`${API_URL}/contatos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contato)
        });
        if (!response.ok) throw new Error("Erro ao atualizar contato");
        return response.json();
    },

    delete: async (id) => {
        const response = await fetch(`${API_URL}/contatos/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error("Erro ao deletar contato");
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

export const gruposApi = {
    getAll: async () => {
        const res = await fetch("http://localhost:3001/api/grupos");
        if (!res.ok) throw new Error("Erro ao buscar grupos");
        return res.json();
    },
    create: async (grupo) => {
        const res = await fetch("http://localhost:3001/api/grupos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(grupo)
        });
        return res.json();
    }
};

// TODO: MODULARIZAR SERVICES