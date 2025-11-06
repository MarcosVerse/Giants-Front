import React, { useState } from 'react';
import Sidebar from './components/Layout/Sidebar';
import Contatos from './pages/Contatos';
import EnviarMensagens from './pages/EnviarMensagens';
import Mensagens from './pages/Mensagens';
import Grupos from './pages/Grupos'

function App() {
  const [currentPage, setCurrentPage] = useState('contatos');

  const renderPage = () => {
    switch (currentPage) {
      case 'contatos':
        return <Contatos />;
      case 'enviar':
        return <EnviarMensagens />;
      case 'mensagens':
        return <Mensagens />;
      case 'grupos':
        return <Grupos />;
      default:
        return <Contatos />;

    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <div className="flex-1 overflow-auto">
        {renderPage()}
      </div>
    </div>
  );
}

export default App;