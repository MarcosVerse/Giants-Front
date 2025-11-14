import { X } from 'lucide-react';

export default function ContatoModal({
    isOpen,
    onClose,
    formData,
    onChange,
    onSubmit,
    loading,
    grupos
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800">
                        {formData.id ? "Editar Contato" : "Novo Contato"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nome
                        </label>
                        <input
                            type="text"
                            value={formData.nome}
                            onChange={(e) => onChange({ ...formData, nome: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="Digite o nome"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Telefone
                        </label>
                        <input
                            type="text"
                            value={formData.telefone}
                            onChange={(e) => onChange({ ...formData, telefone: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="+55 (41) 9999-9999"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Grupos
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {grupos.map((g) => {
                                const ativo = Array.isArray(formData.grupo) && formData.grupo.includes(g.nome);

                                return (
                                    <button
                                        key={g.id}
                                        type="button"
                                        onClick={() => {
                                            const grupoAtual = formData.grupo || [];
                                            const jaTem = grupoAtual.includes(g.nome);
                                            const novos = jaTem
                                                ? grupoAtual.filter(x => x !== g.nome)
                                                : [...grupoAtual, g.nome];
                                            onChange({ ...formData, grupo: novos });
                                        }}
                                        className={`px-3 py-1 rounded-full text-sm  transition shadow-md
                        ${ativo
                                                ? "bg-orange-500 text-white border-orange-500 shadow-orange-500/50"
                                                : "bg-gray-50 text-gray-700 hover:bg-gray-200"
                                            }`}
                                    >
                                        {g.nome}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={onSubmit}
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Salvando...' : 'Salvar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}