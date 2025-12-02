import React, { useState } from 'react';
import { AppData, TableType, ProductionOrder } from '../types';
import { dbService } from '../services/db';
import { Button, Card, Input, Badge, Select } from '../components/Shared';
import { ArrowLeft, Trash2, Edit2, Plus, Search } from 'lucide-react';

interface TableManagerProps {
  type: TableType;
  data: AppData;
  onNavigate: (path: string) => void;
  refreshData: () => void;
}

const TableManager: React.FC<TableManagerProps> = ({ type, data, onNavigate, refreshData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  // Very simplified generic form state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<Record<string, any>>({});

  // Configuration map for the generic table
  const config = {
    workshops: { title: 'Talleres', fields: ['name', 'location', 'contact'] },
    articles: { title: 'Artículos', fields: ['name', 'sku', 'category'] },
    tasks: { title: 'Tareas', fields: ['name', 'costPerUnit'] },
    processes: { title: 'Procesos', fields: ['name', 'description'] },
    production: { title: 'Ordenes de Producción', fields: ['id', 'status', 'quantity', 'date'] } // Read only basically here
  };

  const currentConfig = config[type];
  const listData = (data[type] as any[]).filter(item => 
    JSON.stringify(item).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setFormValues(item);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este registro?')) {
       if (type === 'production') {
         dbService.deleteOrder(id);
       } else {
         dbService.deleteItem(type as keyof AppData, id);
       }
       refreshData();
    }
  };

  const handleSave = () => {
    // Simple validation
    if (!formValues.name && type !== 'production') return;

    if (editingId) {
      // Update
      if (type === 'production') {
        // Special case for production status update only in this view for simplicity
        const order = data.production.find(p => p.id === editingId);
        if (order) {
           dbService.updateOrder({ ...order, ...formValues });
        }
      } else {
        dbService.updateItem(type as keyof AppData, { ...formValues, id: editingId });
      }
    } else {
      // Create
      if (type !== 'production') {
        dbService.addItem(type as keyof AppData, formValues);
      }
    }
    setModalOpen(false);
    setEditingId(null);
    setFormValues({});
    refreshData();
  };

  const renderCell = (item: any, field: string) => {
    if (field === 'costPerUnit') return `$${item[field]}`;
    if (field === 'date') return new Date(item[field]).toLocaleDateString();
    if (field === 'status') {
       const color = item[field] === 'Completado' ? 'bg-green-600' : item[field] === 'En Proceso' ? 'bg-rf-orange' : 'bg-zinc-600';
       return <Badge color={color}>{item[field]}</Badge>;
    }
    return item[field];
  };

  return (
    <div className="pb-20">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button onClick={() => onNavigate('/')} className="text-rf-gray hover:text-white transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold text-white capitalize">{currentConfig.title}</h1>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-2.5 text-zinc-500" size={16} />
            <input 
              className="w-full bg-rf-black border border-rf-panel text-white pl-9 pr-3 py-2 rounded-md focus:border-rf-orange focus:outline-none"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {type !== 'production' && (
            <Button onClick={() => { setEditingId(null); setFormValues({}); setModalOpen(true); }}>
              <Plus size={18} /> <span className="hidden md:inline">Nuevo</span>
            </Button>
          )}
        </div>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-rf-panel border-b border-zinc-700">
                {currentConfig.fields.map(f => (
                  <th key={f} className="p-4 text-xs font-semibold text-rf-gray uppercase tracking-wider">{f}</th>
                ))}
                <th className="p-4 text-xs font-semibold text-rf-gray uppercase tracking-wider text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {listData.map((item) => (
                <tr key={item.id} className="hover:bg-zinc-800/50 transition-colors">
                  {currentConfig.fields.map(f => (
                    <td key={f} className="p-4 text-sm text-zinc-300">{renderCell(item, f)}</td>
                  ))}
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleEdit(item)} className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-full">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-900/30 rounded-full">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {listData.length === 0 && (
                <tr>
                  <td colSpan={currentConfig.fields.length + 1} className="p-8 text-center text-zinc-500">
                    No se encontraron datos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-rf-dark border border-rf-panel rounded-lg w-full max-w-md p-6 relative">
            <h2 className="text-xl font-bold text-white mb-4">
              {editingId ? 'Editar Registro' : 'Nuevo Registro'}
            </h2>
            
            <div className="space-y-4">
              {currentConfig.fields.map(field => {
                if (field === 'id' || field === 'date') return null; // Skip readonly generic fields
                if (type === 'production' && field !== 'status') return null; // Only allow status edit for production here

                return (
                   <div key={field}>
                     {field === 'status' && type === 'production' ? (
                       <Select 
                         label="Estado"
                         options={['Pendiente', 'En Proceso', 'Completado', 'Cancelado'].map(s => ({ value: s, label: s }))}
                         value={formValues[field] || ''}
                         onChange={(e) => setFormValues(prev => ({ ...prev, [field]: e.target.value }))}
                       />
                     ) : (
                       <Input 
                         label={field.charAt(0).toUpperCase() + field.slice(1)}
                         value={formValues[field] || ''}
                         type={field.includes('cost') || field.includes('quantity') ? 'number' : 'text'}
                         onChange={(e) => setFormValues(prev => ({ ...prev, [field]: e.target.value }))}
                       />
                     )}
                   </div>
                )
              })}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancelar</Button>
              <Button onClick={handleSave}>Guardar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableManager;