import React, { useState, useEffect } from 'react';
import { dbService } from './services/db';
import { AppData, TableType } from './types';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ProductionForm from './pages/ProductionForm';
import TableManager from './pages/TableManager';

const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState('/');
  const [data, setData] = useState<AppData | null>(null);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setData(dbService.getAll());
  };

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    window.scrollTo(0, 0);
  };

  if (!data) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">Cargando sistema...</div>;

  const renderContent = () => {
    switch (currentPath) {
      case '/':
        return <Dashboard data={data} onNavigate={handleNavigate} />;
      case '/production/new':
        return <ProductionForm data={data} onNavigate={handleNavigate} refreshData={loadData} />;
      case '/workshops':
        return <TableManager type="workshops" data={data} onNavigate={handleNavigate} refreshData={loadData} />;
      case '/articles':
        return <TableManager type="articles" data={data} onNavigate={handleNavigate} refreshData={loadData} />;
      case '/tasks':
        return <TableManager type="tasks" data={data} onNavigate={handleNavigate} refreshData={loadData} />;
      case '/processes':
        return <TableManager type="processes" data={data} onNavigate={handleNavigate} refreshData={loadData} />;
      case '/production':
        return <TableManager type="production" data={data} onNavigate={handleNavigate} refreshData={loadData} />;
      default:
        return <Dashboard data={data} onNavigate={handleNavigate} />;
    }
  };

  return (
    <Layout activePath={currentPath} onNavigate={handleNavigate}>
      {renderContent()}
    </Layout>
  );
};

export default App;