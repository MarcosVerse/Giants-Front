import React, { useState, useEffect } from 'react';
import { Plus, Users } from 'lucide-react';
import { contatosApi } from '../services/api';
import ContatosList from '../components/Contatos/ContatosList';
import ContatoModal from '../components/Contatos/ContatoModal';
import Loading from '../components/Common/Loading';
import EmptyState from '../components/Common/EmptyState';
import { gruposApi } from '../services/api';

export default function Contatos() {
    const [contatos, setContatos] = useState([]);
    const [grupos, setGrupos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        nome: '',
        telefone: '',
        grupo: []
    });

    // pesquisa
    const [searchBy, setSearchBy] = useState("nome");
    const [search, setSearch] = useState("");


    useEffect(() => {
        loadContatos();
        loadGrupos();
    }, []);

    const loadContatos = async () => {
        setLoading(true);
        try {
            const data = await contatosApi.getAll();
            setContatos(data);
        } catch (error) {
            console.error('Erro ao carregar contatos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);

        try {
            if (formData.id) {
                await contatosApi.update(formData.id, formData); //edita
            } else {
                await contatosApi.create(formData); //cria
            }

            setFormData({ nome: '', telefone: '', grupo: [] });
            setShowModal(false);
            loadContatos();

        } catch (error) {
            console.error('Erro ao salvar contato:', error);
        } finally {
            setLoading(false);
        }
    };


    const handleEdit = (contato) => {
        setFormData({
            ...contato,
            grupo: Array.isArray(contato.grupo)
                ? contato.grupo
                : contato.grupo
                    ? [contato.grupo]
                    : []
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!confirm("Tem certeza que deseja excluir esse contato?")) return;

        setLoading(true);
        try {
            await contatosApi.delete(id);
            loadContatos();
        } catch (error) {
            console.error('Erro ao deletar contato:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadGrupos = async () => {
        try {
            const data = await gruposApi.getAll();
            setGrupos(data);
        } catch (error) {
            console.error('Erro ao carregar grupos:', error);
        }
    };

    const filteredContatos = contatos.filter((contato) =>
        contato.nome.toLowerCase().includes(search.toLowerCase()) ||
        contato.telefone.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Contatos</h1>
                    <p className="text-gray-600 mt-1">Gerencie seus contatos do WhatsApp</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <select
                            value={searchBy}
                            onChange={(e) => setSearchBy(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-orange-400 focus:border-orange-400 transition"
                        >
                            <option value="nome">Nome</option>
                            <option value="telefone">Telefone</option>
                        </select>

                        <div className="relative">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-400 focus:border-orange-400 transition w-64"
                            />
                            <svg
                                className="absolute left-3 top-2.5 text-gray-400"
                                width="18"
                                height="18"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <circle cx="11" cy="11" r="8" strokeWidth="2"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2"></line>
                            </svg>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors shadow-md"
                    >
                        <Plus size={20} />
                        Novo Contato
                    </button>
                </div>
            </div>


            {loading ? (
                <Loading />
            ) : contatos.length === 0 ? (
                <EmptyState
                    icon={Users}
                    title="Nenhum contato cadastrado"
                    description="Comece adicionando seu primeiro contato"
                />
            ) : (
                <ContatosList
                    contatos={filteredContatos}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}

            <ContatoModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                formData={formData}
                onChange={setFormData}
                onSubmit={handleSubmit}
                loading={loading}
                grupos={grupos}
            />
        </div>
    );
}