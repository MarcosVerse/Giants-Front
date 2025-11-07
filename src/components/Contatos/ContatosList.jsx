import { Edit2, Trash2 } from 'lucide-react';

export default function ContatosList({ contatos, onEdit, onDelete }) {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
                <thead className="bg-gray-100 border-b border-gray-200">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nome
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Telefone
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Grupos
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ações
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {contatos.map((contato) => {
                        const grupos = Array.isArray(contato.grupo) 
                            ? contato.grupo 
                            : contato.grupo?.split(',').map(g => g.trim()) || [];

                        return (
                            <tr key={contato.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                        {contato.nome}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-600">
                                        {contato.telefone}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {grupos.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {grupos.map((g, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800"
                                                >
                                                    {g}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="text-sm text-gray-400 italic">Sem grupos</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <button
                                        onClick={() => onEdit(contato)}
                                        className="text-gray-500 hover:text-gray-800 mr-3 transition-colors"
                                        title="Editar contato"
                                    >
                                        <Edit2 size={20} />
                                    </button>
                                    <button
                                        onClick={() => onDelete(contato.id)}
                                        className="text-red-600 hover:text-red-800 transition-colors"
                                        title="Excluir contato"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}