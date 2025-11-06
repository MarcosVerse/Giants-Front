import React, { useEffect, useState } from 'react';
import { Plus, Layers } from 'lucide-react';
import { gruposApi } from '../services/api';
import Loading from '../components/Common/Loading';
import EmptyState from '../components/Common/EmptyState';

export default function Grupos() {
    const [grupos, setGrupos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [grupo, setGrupo] = useState("");

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
        setLoading(true);
        try {
            await gruposApi.create({ nome: grupo });
            setGrupo("");
            setShowModal(false);
            loadGrupos();
        } catch (error) {
            console.error("Erro ao criar grupo:", error);
        } finally {
            setLoading(false);
        }
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
                <ul className="bg-white shadow rounded-lg divide-y border">
                    {grupos.map(g => (
                        <li key={g.id} className="p-4 flex justify-between">
                            <span className="text-gray-800 font-medium">{g.nome}</span>
                        </li>
                    ))}
                </ul>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
                        <h2 className="text-xl font-semibold mb-4">Novo Grupo</h2>

                        <input
                            type="text"
                            placeholder="Nome do grupo"
                            value={grupo}
                            onChange={e => setGrupo(e.target.value)}
                            className="w-full border px-3 py-2 rounded mb-4"
                        />

                        <div className="flex justify-end gap-3">
                            <button className="px-4 py-2" onClick={() => setShowModal(false)}>
                                Cancelar
                            </button>
                            <button
                                disabled={loading}
                                onClick={handleSubmit}
                                className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
                            >
                                Salvar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
