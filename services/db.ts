import { AppData, Workshop, Article, Task, Process, ProductionOrder, OrderStatus } from '../types';

const STORAGE_KEY = 'rotten_future_erp_data_v1';

const generateId = () => Math.random().toString(36).substr(2, 9);

const INITIAL_DATA: AppData = {
  workshops: [
    { id: 'w1', name: 'Taller Central', location: 'Buenos Aires', contact: 'Juan Perez' },
    { id: 'w2', name: 'Confección Sur', location: 'Avellaneda', contact: 'Maria Lopez' },
  ],
  articles: [
    { id: 'a1', name: 'Remera Oversize Basic', sku: 'REM-OV-001', category: 'Remeras' },
    { id: 'a2', name: 'Hoodie Heavyweight', sku: 'HOO-HW-002', category: 'Abrigo' },
    { id: 'a3', name: 'Pantalón Cargo', sku: 'PAN-CA-003', category: 'Pantalones' },
  ],
  tasks: [
    { id: 't1', name: 'Corte', costPerUnit: 150 },
    { id: 't2', name: 'Confección', costPerUnit: 500 },
    { id: 't3', name: 'Estampado', costPerUnit: 200 },
    { id: 't4', name: 'Terminación', costPerUnit: 100 },
  ],
  processes: [
    { id: 'p1', name: 'Producción Standard', description: 'Flujo normal' },
    { id: 'p2', name: 'Producción Express', description: 'Prioridad alta' },
  ],
  production: [
    {
      id: 'o1',
      date: new Date().toISOString(),
      workshopId: 'w1',
      articleId: 'a1',
      processId: 'p1',
      taskId: 't2',
      quantity: 50,
      status: OrderStatus.IN_PROGRESS,
      notes: 'Entrega urgente para el viernes'
    }
  ]
};

export const getDb = (): AppData => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
    return INITIAL_DATA;
  }
  return JSON.parse(stored);
};

export const saveDb = (data: AppData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const dbService = {
  getAll: () => getDb(),
  
  addOrder: (order: Omit<ProductionOrder, 'id' | 'date' | 'status'>) => {
    const data = getDb();
    const newOrder: ProductionOrder = {
      ...order,
      id: generateId(),
      date: new Date().toISOString(),
      status: OrderStatus.PENDING
    };
    data.production.unshift(newOrder);
    saveDb(data);
    return newOrder;
  },

  updateOrder: (updatedOrder: ProductionOrder) => {
    const data = getDb();
    data.production = data.production.map(o => o.id === updatedOrder.id ? updatedOrder : o);
    saveDb(data);
  },

  deleteOrder: (id: string) => {
    const data = getDb();
    data.production = data.production.filter(o => o.id !== id);
    saveDb(data);
  },

  // Generic CRUD helpers
  addItem: <T extends { id: string }>(collection: keyof AppData, item: Omit<T, 'id'>) => {
    const data = getDb();
    const newItem = { ...item, id: generateId() } as T;
    (data[collection] as unknown as T[]).push(newItem);
    saveDb(data);
    return newItem;
  },

  updateItem: <T extends { id: string }>(collection: keyof AppData, item: T) => {
    const data = getDb();
    const list = data[collection] as unknown as T[];
    const index = list.findIndex(i => i.id === item.id);
    if (index !== -1) {
      list[index] = item;
      saveDb(data);
    }
  },

  deleteItem: (collection: keyof AppData, id: string) => {
    const data = getDb();
    (data[collection] as any[]) = (data[collection] as any[]).filter(i => i.id !== id);
    saveDb(data);
  }
};