import { useState, useEffect } from 'react';
import { Plus, Users, Search, User, Phone, ChevronLeft, ChevronRight, Eraser } from 'lucide-react';
import { contatosApi, gruposApi } from '../services/api';
import ContatosList from '../components/Contatos/ContatosList';
import ContatoModal from '../components/Contatos/ContatoModal';
import Loading from '../components/Common/Loading';
import EmptyState from '../components/Common/EmptyState';

export default function Contatos() {
    const [contatos, setContatos] = useState([]);
    const [grupos, setGrupos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [total, setTotal] = useState(0);
    const [formData, setFormData] = useState({
        id: null,
        nome: '',
        telefone: '',
        grupo: []
    });

    // Pesquisa
    const [searchBy, setSearchBy] = useState("nome");
    const [searchInput, setSearchInput] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    // Paginação
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        loadGrupos();
    }, []);

    useEffect(() => {
        loadContatos();
    }, [currentPage, searchTerm, searchBy]);

    const loadContatos = async () => {
        setLoading(true);
        try {
            const filters = {
                nome: searchBy === "nome" ? searchTerm : "",     
                telefone: searchBy === "telefone" ? searchTerm : "", 
                grupos: [],
                page: currentPage,
                limit: 8
            };

            const response = await contatosApi.search(filters);
            setContatos(response.data);
            setTotal(response.total);
        } catch (error) {
            console.error('Erro ao carregar contatos:', error);
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

    const handleNew = () => {
        setFormData({
            id: null,
            nome: "",
            telefone: "",
            grupo: []
        });
        setShowModal(true);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const payload = {
                nome: formData.nome,
                telefone: formData.telefone,
                grupo: formData.grupo
            };

            if (formData.id) {
                await contatosApi.update(formData.id, payload);
            } else {
                await contatosApi.create(payload);
            }

            setShowModal(false);
            loadContatos();
        } catch (err) {
            console.error("Erro ao salvar contato:", err);
            alert(err.response?.data?.error || "Erro ao salvar contato");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (contato) => {
        setFormData({
            id: contato.id,
            nome: contato.nome,
            telefone: contato.telefone,
            grupo: Array.isArray(contato.grupo)
                ? contato.grupo.map(g => g.id)
                : [],
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
            alert(error.response?.data?.error || "Erro ao deletar contato");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            setSearchTerm(searchInput);
            setCurrentPage(1);
        }
    };

    const clearSearch = () => {
        setSearchInput("");
        setSearchTerm("");
        setCurrentPage(1);
    };

    const limit = 8;
    const totalPages = Math.ceil(total / limit);

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const hasFilters = searchTerm;

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <Users size={32} className="text-orange-500" />
                    <h1 className="text-3xl font-bold text-gray-800">Contatos</h1>
                </div>

                <button
                    onClick={handleNew}
                    className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors shadow-md"
                >
                    <Plus size={20} />
                    Novo Contato
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <div className="flex items-center gap-6">
                    <div className="flex flex-col gap-2">
                        <button
                            onClick={() => setSearchBy("nome")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${searchBy === "nome"
                                ? "bg-orange-500 text-white shadow-md"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                        >
                            <User size={18} />
                            <span className="font-medium">Nome</span>
                        </button>

                        <button
                            onClick={() => setSearchBy("telefone")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${searchBy === "telefone"
                                ? "bg-orange-500 text-white shadow-md"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                        >
                            <Phone size={18} />
                            <span className="font-medium">Telefone</span>
                        </button>
                    </div>

                    <div className="flex-1">
                        <div className="relative flex items-center gap-2 pb-2 max-w-[380px] group">
                            <Search
                                size={20}
                                className="text-gray-400 transition-all duration-300 group-focus-within:scale-110 group-focus-within:text-orange-500"
                            />
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                onKeyDown={handleSearch}
                                placeholder={`Pesquisar por ${searchBy}...`}
                                className="flex-1 outline-none text-gray-700 placeholder-gray-400 pb-1"
                            />
                            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gray-300"></span>
                            <span className="absolute bottom-0 left-1/2 w-0 h-[2px] bg-orange-500 transition-all duration-300 group-focus-within:left-0 group-focus-within:w-full"></span>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => {
                                setSearchTerm(searchInput);
                                setCurrentPage(1);
                            }}
                            className="flex items-center justify-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors shadow-md"
                        >
                            <Search size={18} />
                            Pesquisar
                        </button>

                        <button
                            onClick={clearSearch}
                            className="flex items-center justify-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            <Eraser size={18} />
                            Limpar
                        </button>
                    </div>
                </div>
            </div>

            {loading ? (
                <Loading />
            ) : total === 0 ? (
                hasFilters ? (
                    <EmptyState
                        icon={Search}
                        title="Nenhum resultado encontrado"
                        description="Não encontramos contatos com os filtros aplicados"
                    />
                ) : (
                    <EmptyState
                        icon={Users}
                        title="Nenhum contato cadastrado"
                        description="Comece adicionando seu primeiro contato"
                    />
                )
            ) : (
                <>
                    <ContatosList
                        contatos={contatos}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />

                    {totalPages > 1 && (
                        <div className="bg-white rounded-lg shadow-md p-4 mt-4 flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                Mostrando página {currentPage} de {totalPages} (Total: {total} contatos)
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => goToPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronLeft size={20} />
                                </button>

                                <div className="flex gap-1">
                                    {[...Array(totalPages)].map((_, index) => {
                                        const page = index + 1;
                                        if (
                                            page === 1 ||
                                            page === totalPages ||
                                            (page >= currentPage - 1 && page <= currentPage + 1)
                                        ) {
                                            return (
                                                <button
                                                    key={page}
                                                    onClick={() => goToPage(page)}
                                                    className={`px-4 py-2 rounded-lg transition-colors ${currentPage === page
                                                        ? "bg-orange-500 text-white font-semibold"
                                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                        }`}
                                                >
                                                    {page}
                                                </button>
                                            );
                                        } else if (
                                            page === currentPage - 2 ||
                                            page === currentPage + 2
                                        ) {
                                            return <span key={page} className="px-2 text-gray-400">...</span>;
                                        }
                                        return null;
                                    })}
                                </div>

                                <button
                                    onClick={() => goToPage(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}

            <ContatoModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                formData={formData}
                onChange={setFormData}
                onSubmit={handleSubmit}
                grupos={grupos}
            />
        </div>
    );
}