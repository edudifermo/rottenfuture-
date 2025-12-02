import React, { useMemo } from 'react';
import { AppData, OrderStatus } from '../types';
import { Card, Button } from '../components/Shared';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { PlusCircle, Activity, Box, Archive } from 'lucide-react';

interface DashboardProps {
  data: AppData;
  onNavigate: (path: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ data, onNavigate }) => {
  const stats = useMemo(() => {
    const totalOrders = data.production.length;
    const activeOrders = data.production.filter(o => o.status === OrderStatus.IN_PROGRESS || o.status === OrderStatus.PENDING).length;
    const completedOrders = data.production.filter(o => o.status === OrderStatus.COMPLETED).length;
    
    // Simple calc for chart: Orders by Status
    const chartData = [
      { name: 'Pendiente', value: data.production.filter(o => o.status === OrderStatus.PENDING).length },
      { name: 'En Proceso', value: data.production.filter(o => o.status === OrderStatus.IN_PROGRESS).length },
      { name: 'Completado', value: data.production.filter(o => o.status === OrderStatus.COMPLETED).length },
    ];

    return { totalOrders, activeOrders, completedOrders, chartData };
  }, [data.production]);

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">RottenFuture ERP</h1>
          <p className="text-rf-gray">Panel de Control General</p>
        </div>
        <Button onClick={() => onNavigate('/production/new')} className="w-full md:w-auto shadow-lg shadow-orange-900/20">
          <PlusCircle size={20} />
          Nueva Orden
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="flex flex-col items-center justify-center p-6 border-l-4 border-l-rf-orange">
          <span className="text-3xl font-bold text-white">{stats.activeOrders}</span>
          <span className="text-xs text-rf-gray uppercase tracking-wider mt-1">Activas</span>
        </Card>
        <Card className="flex flex-col items-center justify-center p-6 border-l-4 border-l-zinc-600">
          <span className="text-3xl font-bold text-white">{stats.completedOrders}</span>
          <span className="text-xs text-rf-gray uppercase tracking-wider mt-1">Completadas</span>
        </Card>
        <Card className="flex flex-col items-center justify-center p-6 border-l-4 border-l-zinc-700">
          <span className="text-3xl font-bold text-white">{data.articles.length}</span>
          <span className="text-xs text-rf-gray uppercase tracking-wider mt-1">Artículos</span>
        </Card>
        <Card className="flex flex-col items-center justify-center p-6 border-l-4 border-l-zinc-700">
          <span className="text-3xl font-bold text-white">{data.workshops.length}</span>
          <span className="text-xs text-rf-gray uppercase tracking-wider mt-1">Talleres</span>
        </Card>
      </div>

      {/* Chart Section */}
      <Card title="Estado de Producción" className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={stats.chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <XAxis dataKey="name" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }}
              cursor={{ fill: '#27272a' }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
              {stats.chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index === 1 ? '#f97316' : '#3f3f46'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Recent Activity / Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <Card title="Acceso Rápido" className="flex flex-col gap-3">
             <Button variant="secondary" onClick={() => onNavigate('/articles')} className="justify-start">
               <Box size={18} className="text-rf-orange" />
               Gestionar Artículos
             </Button>
             <Button variant="secondary" onClick={() => onNavigate('/workshops')} className="justify-start">
               <Activity size={18} className="text-rf-orange" />
               Gestionar Talleres
             </Button>
             <Button variant="secondary" onClick={() => onNavigate('/production')} className="justify-start">
               <Archive size={18} className="text-rf-orange" />
               Ver Todas las Ordenes
             </Button>
         </Card>
         <Card title="Últimas Ordenes" className="overflow-hidden">
            <div className="flex flex-col gap-2">
              {data.production.slice(0, 3).map(order => {
                const article = data.articles.find(a => a.id === order.articleId);
                const workshop = data.workshops.find(w => w.id === order.workshopId);
                return (
                  <div key={order.id} className="flex justify-between items-center p-3 bg-rf-black rounded border border-rf-panel">
                    <div>
                      <div className="text-sm font-semibold text-white">{article?.name || 'Desconocido'}</div>
                      <div className="text-xs text-rf-gray">{workshop?.name}</div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === OrderStatus.IN_PROGRESS ? 'bg-rf-orange text-white' : 'bg-zinc-700 text-zinc-300'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                );
              })}
              {data.production.length === 0 && <p className="text-zinc-500 text-sm text-center py-4">Sin actividad reciente.</p>}
            </div>
         </Card>
      </div>
    </div>
  );
};

export default Dashboard;