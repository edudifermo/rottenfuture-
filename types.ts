export interface Entity {
  id: string;
  name: string;
}

export interface Workshop extends Entity {
  location?: string;
  contact?: string;
}

export interface Article extends Entity {
  sku: string;
  category: string;
}

export interface Task extends Entity {
  costPerUnit: number;
}

export interface Process extends Entity {
  description?: string;
}

export enum OrderStatus {
  PENDING = 'Pendiente',
  IN_PROGRESS = 'En Proceso',
  COMPLETED = 'Completado',
  CANCELLED = 'Cancelado'
}

export interface ProductionOrder {
  id: string;
  date: string;
  workshopId: string;
  articleId: string;
  processId: string;
  taskId: string;
  quantity: number;
  status: OrderStatus;
  notes?: string;
}

// Helper to represent the "Table" concept for the dynamic menu
export type TableType = 'workshops' | 'articles' | 'tasks' | 'processes' | 'production';

export interface AppData {
  workshops: Workshop[];
  articles: Article[];
  tasks: Task[];
  processes: Process[];
  production: ProductionOrder[];
}