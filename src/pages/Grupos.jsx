import React, { useEffect, useState } from 'react';
import { Plus, Layers, Edit2, Trash2, X } from 'lucide-react';
import { gruposApi } from '../services/api';
import Loading from '../components/Common/Loading';
import EmptyState from '../components/Common/EmptyState';

export default function Grupos() {
    const [grupos, setGrupos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [grupo, setGrupo] = useState("");
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        loadGrupos();
    }, []);

    const loadGrupos = async () => {
        setLoading(true);
        try {
            const data = await gruposApi.getAll();
            setGrupos(data);
        } catch (error) {
            console.error("Erro ao carregar grupos:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!grupo.trim()) return;
        
        setLoading(true);
        try {
            if (editingId) {
                // TODO: implementar update na API
                console.log("Editar grupo:", editingId);
            } else {
                await gruposApi.create({ nome: grupo });
            }
            setGrupo("");
            setEditingId(null);
            setShowModal(false);
            loadGrupos();
        } catch (error) {
            console.error("Erro ao salvar grupo:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (g) => {
        setGrupo(g.nome);
        setEditingId(g.id);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!confirm("Tem certeza que deseja excluir este grupo?")) return;
        
        // TODO: implementar delete na API
        console.log("Deletar grupo:", id);
    };

    const closeModal = () => {
        setShowModal(false);
        setGrupo("");
        setEditingId(null);
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Grupos</h1>
                    <p className="text-gray-600 mt-1">
                        Organize seus contatos em grupos
                    </p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors shadow-md"
                >
                    <Plus size={20} />
                    Novo Grupo
                </button>
            </div>

            {loading ? (
                <Loading />
            ) : grupos.length === 0 ? (
                <EmptyState
                    icon={Layers}
                    title="Nenhum grupo criado"
                    description="Comece adicionando seu primeiro grupo"
                />
            ) : (
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-100 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nome do Grupo
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {grupos.map(g => (
                                <tr key={g.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Layers size={18} className="text-orange-500" />
                                            <span className="text-sm font-medium text-gray-900">
                                                {g.nome}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <button
                                            onClick={() => handleEdit(g)}
                                            className="text-blue-600 hover:text-blue-800 mr-3 transition-colors"
                                            title="Editar grupo"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(g.id)}
                                            className="text-red-600 hover:text-red-800 transition-colors"
                                            title="Excluir grupo"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                        <div className="flex justify-between items-center p-6 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-800">
                                {editingId ? "Editar Grupo" : "Novo Grupo"}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nome do Grupo
                            </label>
                            <input
                                type="text"
                                placeholder="Ex: Musculação, Crossfit..."
                                value={grupo}
                                onChange={e => setGrupo(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                autoFocus
                            />

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={closeModal}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    disabled={loading || !grupo.trim()}
                                    onClick={handleSubmit}
                                    className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Salvando...' : 'Salvar'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}