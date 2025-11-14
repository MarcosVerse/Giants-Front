import { useState, useEffect } from 'react';
import { Plus, Users, Search, User, Phone, ChevronLeft, ChevronRight, Eraser, Filter, X } from 'lucide-react';
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


    // pesquisa
    const [searchBy, setSearchBy] = useState("nome");
    const [searchInput, setSearchInput] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    // filtro de grupos
    const [selectedGrupos, setSelectedGrupos] = useState([]);
    const [showGruposDropdown, setShowGruposDropdown] = useState(false);

    // paginação
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        loadGrupos();
    }, []);

    useEffect(() => {
        loadContatos();
    }, [currentPage, searchTerm]);


    const loadContatos = async () => {
        setLoading(true);
        try {
            const response = await contatosApi.getPaginated(currentPage, searchTerm);

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
            // Converter nomes dos grupos para IDs
            const gruposSelecionados = grupos
                .filter(g => formData.grupo.includes(g.nome))
                .map(g => g.id);

            const payload = {
                nome: formData.nome,
                telefone: formData.telefone,
                grupo: gruposSelecionados
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
                ? contato.grupo.map(g => g.nome)
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
        setSelectedGrupos([]);
        setCurrentPage(1);
    };

    const toggleGrupo = (grupoNome) => {
        setSelectedGrupos(prev => {
            if (prev.includes(grupoNome)) {
                return prev.filter(nome => nome !== grupoNome);
            } else {
                return [...prev, grupoNome];
            }
        });
        setCurrentPage(1);
    };

    const removeGrupo = (grupoNome) => {
        setSelectedGrupos(prev => prev.filter(nome => nome !== grupoNome));
        setCurrentPage(1);
    };

    const limit = 8;
    const totalPages = Math.ceil(total / limit);

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

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

                    <div className="relative">
                        <button
                            onClick={() => setShowGruposDropdown(!showGruposDropdown)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all border-2 ${selectedGrupos.length > 0
                                ? "bg-orange-500 text-white border-orange-500 shadow-md"
                                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                }`}
                        >
                            <Filter size={18} />
                            <span className="font-medium">Grupos</span>
                            {selectedGrupos.length > 0 && (
                                <span className="bg-white text-orange-500 text-xs font-bold px-2 py-0.5 rounded-full">
                                    {selectedGrupos.length}
                                </span>
                            )}
                        </button>

                        {showGruposDropdown && (
                            <>
                                {/* Overlay para fechar o dropdown ao clicar fora */}
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setShowGruposDropdown(false)}
                                />

                                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-20">
                                    <div className="p-3 border-b border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold text-gray-700">Filtrar por Grupos</span>
                                            <button
                                                onClick={() => setShowGruposDropdown(false)}
                                                className="text-gray-400 hover:text-gray-600 transition-colors"
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="max-h-64 overflow-y-auto">
                                        {grupos.length === 0 ? (
                                            <div className="p-4 text-center text-gray-500 text-sm">
                                                Nenhum grupo cadastrado
                                            </div>
                                        ) : (
                                            grupos.map(grupo => (
                                                <label
                                                    key={grupo.id}
                                                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedGrupos.includes(grupo.nome)}
                                                        onChange={() => toggleGrupo(grupo.nome)}
                                                        className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500 cursor-pointer"
                                                    />
                                                    <span className="text-gray-700 flex-1">{grupo.nome}</span>
                                                </label>
                                            ))
                                        )}
                                    </div>

                                    {selectedGrupos.length > 0 && (
                                        <div className="p-3 border-t border-gray-200">
                                            <button
                                                onClick={() => {
                                                    setSelectedGrupos([]);
                                                    setCurrentPage(1);
                                                }}
                                                className="w-full text-sm text-orange-500 hover:text-orange-600 font-medium transition-colors"
                                            >
                                                Limpar filtros
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
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

                {selectedGrupos.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
                        <span className="text-sm text-gray-600 font-medium">Filtrando por:</span>
                        {selectedGrupos.map(grupoNome => (
                            <span
                                key={grupoNome}
                                className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium"
                            >
                                {grupoNome}
                                <button
                                    onClick={() => removeGrupo(grupoNome)}
                                    className="hover:bg-orange-200 rounded-full p-0.5 transition-colors"
                                >
                                    <X size={14} />
                                </button>
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {loading ? (
                <Loading />
            ) : total === 0 ? (
                searchTerm ? (
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