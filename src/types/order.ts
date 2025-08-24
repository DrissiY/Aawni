export type OrderStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  serviceType: string;
  subService: string;
  status: OrderStatus;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  technicianName?: string;
  technicianPhone?: string;
  scheduledDate: string;
  scheduledTime: string;
  location: {
    address: string;
    city: string;
    postalCode: string;
  };
  description: string;
  estimatedDuration: number; // in hours
  price: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  rating?: number;
  review?: string;
}

export interface OrderSummary {
  totalOrders: number;
  activeOrders: number;
  completedOrders: number;
  cancelledOrders: number;
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled'
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
  in_progress: 'bg-purple-100 text-purple-800 border-purple-200',
  completed: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200'
};