const API_URL = 'http://localhost:3001/api';

export const contatosApi = {
    getPaginated: async (page = 1, search = "", searchBy = "nome") => {
        const response = await fetch(
            `${API_URL}/contatos?${searchBy}=${search}&page=${page}&limit=8`
        );
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
        const response = await fetch(`${API_URL}/contatos/${id}`, { method: 'DELETE' });
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
        const res = await fetch(`${API_URL}/grupos`);
        if (!res.ok) throw new Error("Erro ao carregar grupos");
        return res.json();
    },

    create: async (data) => {
        const res = await fetch(`${API_URL}/grupos`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Erro ao criar grupo");
        return res.json();
    },

    update: async (id, data) => {
        const res = await fetch(`${API_URL}/grupos/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Erro ao atualizar grupo");
        return res.json();
    },

    delete: async (id) => {
        const res = await fetch(`${API_URL}/grupos/${id}`, {
            method: "DELETE",
        });
        if (!res.ok) throw new Error("Erro ao excluir grupo");
        return res.json();
    },
};
