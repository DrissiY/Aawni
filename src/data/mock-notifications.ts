export interface Notification {
  id: string;
  type: 'order' | 'system' | 'promotion';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  orderId?: string; // For order-related notifications
  actionUrl?: string;
}

export const mockNotifications: Notification[] = [
  {
    id: 'notif-001',
    type: 'order',
    title: 'Order Confirmed',
    message: 'Your plumbing service order has been confirmed and assigned to a technician.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    read: false,
    orderId: 'ORD-001',
    actionUrl: '/orders/ORD-001'
  },
  {
    id: 'notif-002',
    type: 'order',
    title: 'Technician En Route',
    message: 'Ahmed is on his way to your location. Estimated arrival: 15 minutes.',
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    read: false,
    orderId: 'ORD-002',
    actionUrl: '/orders/ORD-002'
  },
  {
    id: 'notif-003',
    type: 'order',
    title: 'Service Completed',
    message: 'Your electrical repair service has been completed. Please rate your experience.',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    read: true,
    orderId: 'ORD-003',
    actionUrl: '/orders/ORD-003'
  },
  {
    id: 'notif-004',
    type: 'system',
    title: 'Profile Updated',
    message: 'Your profile information has been successfully updated.',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    read: true,
    actionUrl: '/profile'
  },
  {
    id: 'notif-005',
    type: 'promotion',
    title: 'Special Offer',
    message: 'Get 20% off your next cleaning service. Limited time offer!',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    read: false,
    actionUrl: '/booking?service=cleaning'
  },
  {
    id: 'notif-006',
    type: 'order',
    title: 'Payment Processed',
    message: 'Payment of $85.00 for your painting service has been processed successfully.',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    read: true,
    orderId: 'ORD-004',
    actionUrl: '/orders/ORD-004'
  }
];

export function getUnreadNotifications(): Notification[] {
  return mockNotifications.filter(notification => !notification.read);
}

export function getNotificationsByType(type: Notification['type']): Notification[] {
  return mockNotifications.filter(notification => notification.type === type);
}

export function markNotificationAsRead(notificationId: string): void {
  const notification = mockNotifications.find(n => n.id === notificationId);
  if (notification) {
    notification.read = true;
  }
}

export function getNotificationIcon(type: Notification['type']): string {
  switch (type) {
    case 'order':
      return '📦';
    case 'system':
      return '⚙️';
    case 'promotion':
      return '🎉';
    default:
      return '🔔';
  }
}

export function formatNotificationTime(timestamp: Date): string {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) {
    return 'Just now';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  } else if (diffInMinutes < 1440) { // Less than 24 hours
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours}h ago`;
  } else {
    const days = Math.floor(diffInMinutes / 1440);
    return `${days}d ago`;
  }
}