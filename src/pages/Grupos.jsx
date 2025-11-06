import React, { useState, useEffect } from 'react';
import { Plus, Users } from 'lucide-react';
import { contatosApi } from '../services/api';
import ContatosList from '../components/Contatos/ContatosList';
import ContatoModal from '../components/Contatos/ContatoModal';
import Loading from '../components/Common/Loading';
import EmptyState from '../components/Common/EmptyState';

export default function Contatos() {
    const [contatos, setContatos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        nome: '',
        telefone: '',
        grupo: ''
    });

    useEffect(() => {
        loadContatos();
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
            await contatosApi.create(formData);
            setFormData({ nome: '', telefone: '', grupo: '' });
            setShowModal(false);
            loadContatos();
        } catch (error) {
            console.error('Erro ao salvar contato:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (contato) => {
        console.log('Editar:', contato);
        // implementar depois
    };

    const handleDelete = (id) => {
        console.log('Deletar:', id);
        // implementar depois
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Contatos</h1>
                    <p className="text-gray-600 mt-1">
                        Gerencie seus contatos do WhatsApp
                    </p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors shadow-md"
                >
                    <Plus size={20} />
                    Novo Contato
                </button>
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
                    contatos={contatos}
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
            />
        </div>
    );
}