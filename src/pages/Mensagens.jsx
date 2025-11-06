import React from 'react';
import { MessageSquare } from 'lucide-react';
import EmptyState from '../components/Common/EmptyState';

export default function Mensagens() {
    return (
        <div className="p-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Templates de Mensagens</h1>
                <p className="text-gray-600 mt-1">
                    Gerencie seus templates de mensagens prontas
                </p>
            </div>
            <EmptyState
                icon={MessageSquare}
                title="Em desenvolvimento"
                description="Esta funcionalidade estará disponível em breve"
            />
        </div>
    );
}