import { Order, OrderSummary } from '@/types/order';

export const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    serviceType: 'Plumbing',
    subService: 'Pipe Repair',
    status: 'in_progress',
    customerName: 'Ahmed Benali',
    customerPhone: '+212 6 12 34 56 78',
    customerEmail: 'ahmed.benali@email.com',
    technicianName: 'Youssef Alami',
    technicianPhone: '+212 6 87 65 43 21',
    scheduledDate: '2024-01-15',
    scheduledTime: '14:00',
    location: {
      address: '123 Rue Mohammed V',
      city: 'Casablanca',
      postalCode: '20000'
    },
    description: 'Kitchen sink pipe is leaking and needs immediate repair',
    estimatedDuration: 2,
    price: 350,
    createdAt: '2024-01-14T10:30:00Z',
    updatedAt: '2024-01-15T09:00:00Z'
  },
  {
    id: 'ORD-002',
    serviceType: 'Cleaning',
    subService: 'Deep Cleaning',
    status: 'confirmed',
    customerName: 'Fatima Zahra',
    customerPhone: '+212 6 98 76 54 32',
    customerEmail: 'fatima.zahra@email.com',
    technicianName: 'Aicha Bennani',
    technicianPhone: '+212 6 11 22 33 44',
    scheduledDate: '2024-01-16',
    scheduledTime: '09:00',
    location: {
      address: '456 Avenue Hassan II',
      city: 'Rabat',
      postalCode: '10000'
    },
    description: 'Full apartment deep cleaning before moving in',
    estimatedDuration: 4,
    price: 800,
    createdAt: '2024-01-13T15:45:00Z',
    updatedAt: '2024-01-14T08:30:00Z'
  },
  {
    id: 'ORD-003',
    serviceType: 'Electrical',
    subService: 'Installation',
    status: 'pending',
    customerName: 'Omar Idrissi',
    customerPhone: '+212 6 55 44 33 22',
    customerEmail: 'omar.idrissi@email.com',
    scheduledDate: '2024-01-17',
    scheduledTime: '16:00',
    location: {
      address: '789 Boulevard Zerktouni',
      city: 'Marrakech',
      postalCode: '40000'
    },
    description: 'Install new ceiling fan in living room',
    estimatedDuration: 1.5,
    price: 450,
    createdAt: '2024-01-14T12:00:00Z',
    updatedAt: '2024-01-14T12:00:00Z'
  },
  {
    id: 'ORD-004',
    serviceType: 'Moving',
    subService: 'Local Moving',
    status: 'completed',
    customerName: 'Laila Amrani',
    customerPhone: '+212 6 77 88 99 00',
    customerEmail: 'laila.amrani@email.com',
    technicianName: 'Hassan Tazi',
    technicianPhone: '+212 6 33 44 55 66',
    scheduledDate: '2024-01-12',
    scheduledTime: '08:00',
    location: {
      address: '321 Rue Allal Ben Abdellah',
      city: 'Fes',
      postalCode: '30000'
    },
    description: 'Move 2-bedroom apartment to new location',
    estimatedDuration: 6,
    price: 1200,
    createdAt: '2024-01-10T09:15:00Z',
    updatedAt: '2024-01-12T18:30:00Z',
    completedAt: '2024-01-12T18:30:00Z',
    rating: 5,
    review: 'Excellent service! Very professional and careful with my belongings.'
  },
  {
    id: 'ORD-005',
    serviceType: 'Painting',
    subService: 'Interior Painting',
    status: 'completed',
    customerName: 'Rachid Benjelloun',
    customerPhone: '+212 6 66 77 88 99',
    customerEmail: 'rachid.benjelloun@email.com',
    technicianName: 'Mustapha Alaoui',
    technicianPhone: '+212 6 22 33 44 55',
    scheduledDate: '2024-01-08',
    scheduledTime: '10:00',
    location: {
      address: '654 Avenue Mohammed VI',
      city: 'Tangier',
      postalCode: '90000'
    },
    description: 'Paint living room and bedroom walls',
    estimatedDuration: 8,
    price: 950,
    createdAt: '2024-01-05T14:20:00Z',
    updatedAt: '2024-01-08T19:45:00Z',
    completedAt: '2024-01-08T19:45:00Z',
    rating: 4,
    review: 'Good work, but took a bit longer than expected.'
  },
  {
    id: 'ORD-006',
    serviceType: 'Cleaning',
    subService: 'Regular Cleaning',
    status: 'cancelled',
    customerName: 'Nadia Chraibi',
    customerPhone: '+212 6 44 55 66 77',
    customerEmail: 'nadia.chraibi@email.com',
    scheduledDate: '2024-01-11',
    scheduledTime: '13:00',
    location: {
      address: '987 Rue Ibn Battuta',
      city: 'Agadir',
      postalCode: '80000'
    },
    description: 'Weekly house cleaning service',
    estimatedDuration: 3,
    price: 300,
    createdAt: '2024-01-09T11:30:00Z',
    updatedAt: '2024-01-11T07:00:00Z'
  }
];

export const mockOrderSummary: OrderSummary = {
  totalOrders: mockOrders.length,
  activeOrders: mockOrders.filter(order => ['pending', 'confirmed', 'in_progress'].includes(order.status)).length,
  completedOrders: mockOrders.filter(order => order.status === 'completed').length,
  cancelledOrders: mockOrders.filter(order => order.status === 'cancelled').length
};

export const getCurrentOrders = (): Order[] => {
  return mockOrders.filter(order => ['pending', 'confirmed', 'in_progress'].includes(order.status));
};

export const getPreviousOrders = (): Order[] => {
  return mockOrders.filter(order => ['completed', 'cancelled'].includes(order.status));
};