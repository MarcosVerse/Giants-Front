import React from 'react';
import { Send } from 'lucide-react';
import EmptyState from '../components/Common/EmptyState';

export default function EnviarMensagens() {
    return (
        <div className="p-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Enviar Mensagens</h1>
                <p className="text-gray-600 mt-1">
                    Envie mensagens em massa para grupos de contatos
                </p>
            </div>
            <EmptyState
                icon={Send}
                title="Em desenvolvimento"
                description="Esta funcionalidade estará disponível em breve"
            />
        </div>
    );
}