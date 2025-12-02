import React, { useState } from 'react';
import { AppData } from '../types';
import { dbService } from '../services/db';
import { Button, Card, Input, Select } from '../components/Shared';
import { ArrowLeft, Save, CheckCircle } from 'lucide-react';

interface ProductionFormProps {
  data: AppData;
  onNavigate: (path: string) => void;
  refreshData: () => void;
}

const ProductionForm: React.FC<ProductionFormProps> = ({ data, onNavigate, refreshData }) => {
  const [formData, setFormData] = useState({
    workshopId: '',
    articleId: '',
    taskId: '',
    processId: '',
    quantity: 0,
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.workshopId || !formData.articleId || !formData.quantity) return;

    setIsSubmitting(true);
    
    // Simulate network delay for effect
    setTimeout(() => {
      dbService.addOrder({
        workshopId: formData.workshopId,
        articleId: formData.articleId,
        taskId: formData.taskId,
        processId: formData.processId,
        quantity: Number(formData.quantity),
        notes: formData.notes
      });
      refreshData();
      onNavigate('/production');
    }, 600);
  };

  const articleOptions = data.articles.map(a => ({ value: a.id, label: `${a.sku} - ${a.name}` }));
  const workshopOptions = data.workshops.map(w => ({ value: w.id, label: w.name }));
  const taskOptions = data.tasks.map(t => ({ value: t.id, label: `${t.name} ($${t.costPerUnit})` }));
  const processOptions = data.processes.map(p => ({ value: p.id, label: p.name }));

  return (
    <div className="max-w-2xl mx-auto pb-20">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => onNavigate('/')} className="text-rf-gray hover:text-white transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-white">Nueva Orden de Producción</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select 
              label="Taller" 
              options={workshopOptions} 
              value={formData.workshopId}
              onChange={(e) => handleChange('workshopId', e.target.value)}
              required
            />
            <Select 
              label="Artículo" 
              options={articleOptions}
              value={formData.articleId}
              onChange={(e) => handleChange('articleId', e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select 
              label="Proceso" 
              options={processOptions}
              value={formData.processId}
              onChange={(e) => handleChange('processId', e.target.value)}
              required
            />
            <Select 
              label="Tarea Principal" 
              options={taskOptions}
              value={formData.taskId}
              onChange={(e) => handleChange('taskId', e.target.value)}
              required
            />
          </div>

          <Input 
            label="Cantidad" 
            type="number" 
            min="1"
            placeholder="0"
            value={formData.quantity || ''}
            onChange={(e) => handleChange('quantity', e.target.value)}
            required
          />

          <div className="flex flex-col gap-1">
             <label className="text-sm text-rf-gray font-medium">Observaciones</label>
             <textarea 
                className="bg-rf-black border border-rf-panel text-white px-3 py-2 rounded-md focus:border-rf-orange focus:outline-none focus:ring-1 focus:ring-rf-orange placeholder-zinc-600 min-h-[100px]"
                placeholder="Detalles adicionales..."
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
             />
          </div>

          <div className="pt-4 border-t border-rf-panel flex justify-end gap-3">
             <Button type="button" variant="ghost" onClick={() => onNavigate('/')}>
               Cancelar
             </Button>
             <Button type="submit" disabled={isSubmitting}>
               {isSubmitting ? 'Guardando...' : <><Save size={18} /> Crear Orden</>}
             </Button>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default ProductionForm;