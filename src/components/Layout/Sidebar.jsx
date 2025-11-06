import React from 'react';
import { Users, Send, MessageSquare, Tags } from 'lucide-react';
import MenuItem from './MenuItem';
import giantsLogo from '../../assets/img/giants.png';


export default function Sidebar({ currentPage, onNavigate }) {
    return (
        <div className="w-64 bg-white shadow-lg flex flex-col">
            <div className="h-48 bg-gradient-to-br rounded-b-xl from-orange-500 to-orange-600 flex items-center justify-center">
                <img className="w-40 h-40 rounded-full flex items-center justify-center" src={giantsLogo} alt="Giants-Logo" />
                {/* <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">G</span>
                </div> */}
            </div>

            <nav className="flex-1 p-4 space-y-2">
                <MenuItem
                    icon={Users}
                    label="Contatos"
                    page="contatos"
                    currentPage={currentPage}
                    onClick={() => onNavigate('contatos')}
                />
                <MenuItem
                    icon={Send}
                    label="Enviar Mensagens"
                    page="enviar"
                    currentPage={currentPage}
                    onClick={() => onNavigate('enviar')}
                />
                <MenuItem
                    icon={MessageSquare}
                    label="Mensagens"
                    page="mensagens"
                    currentPage={currentPage}
                    onClick={() => onNavigate('mensagens')}
                />
                <MenuItem
                    icon={Tags}
                    label="Grupos"
                    page="grupos"
                    currentPage={currentPage}
                    onClick={() => onNavigate('grupos')}
                />

            </nav>

            <div className="p-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                    Giants Fitness © 2025
                </p>
            </div>
        </div>
    );
}
