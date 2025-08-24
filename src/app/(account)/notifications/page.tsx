'use client';

import React, { useState } from 'react';
import { Bell, Package, Settings, Gift, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockNotifications, formatNotificationTime, getNotificationIcon, markNotificationAsRead, type Notification } from '@/data/mock-notifications';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const getNotificationTypeIcon = (type: Notification['type']) => {
  switch (type) {
    case 'order':
      return <Package className="h-5 w-5 text-blue-600" />;
    case 'system':
      return <Settings className="h-5 w-5 text-gray-600" />;
    case 'promotion':
      return <Gift className="h-5 w-5 text-green-600" />;
    default:
      return <Bell className="h-5 w-5 text-gray-600" />;
  }
};

const getNotificationTypeColor = (type: Notification['type']) => {
  switch (type) {
    case 'order':
      return 'bg-blue-50 border-blue-200';
    case 'system':
      return 'bg-gray-50 border-gray-200';
    case 'promotion':
      return 'bg-green-50 border-green-200';
    default:
      return 'bg-gray-50 border-gray-200';
  }
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread' | 'order' | 'system' | 'promotion'>('all');
  const router = useRouter();

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    markNotificationAsRead(notification.id);
    setNotifications(prev => 
      prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
    );

    // Navigate if there's an action URL
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
    }
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'unread':
        return !notification.read;
      case 'order':
      case 'system':
      case 'promotion':
        return notification.type === filter;
      default:
        return true;
    }
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-3 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Notifications</h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
              </p>
            </div>
            {unreadCount > 0 && (
              <Button onClick={markAllAsRead} variant="outline" className="w-full sm:w-auto">
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark all as read
              </Button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-1 sm:flex-nowrap sm:space-x-1 bg-white rounded-lg p-1 border">
            {[
              { key: 'all', label: 'All', count: notifications.length },
              { key: 'unread', label: 'Unread', count: unreadCount },
              { key: 'order', label: 'Orders', count: notifications.filter(n => n.type === 'order').length },
              { key: 'system', label: 'System', count: notifications.filter(n => n.type === 'system').length },
              { key: 'promotion', label: 'Promotions', count: notifications.filter(n => n.type === 'promotion').length },
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setFilter(key as 'all' | 'unread' | 'order' | 'system' | 'promotion')}
                className={`px-2 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors flex items-center space-x-1 sm:space-x-2 flex-1 sm:flex-initial justify-center ${
                  filter === key
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <span className="truncate">{label}</span>
                {count > 0 && (
                  <Badge variant={filter === key ? 'secondary' : 'outline'} className="text-xs">
                    {count}
                  </Badge>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3 sm:space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <Bell className="h-10 w-10 sm:h-12 sm:w-12 text-gray-300 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No notifications</h3>
              <p className="text-sm sm:text-base text-gray-500">
                {filter === 'unread' 
                  ? "You're all caught up! No unread notifications."
                  : `No ${filter === 'all' ? '' : filter + ' '}notifications found.`
                }
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-lg border p-4 sm:p-6 transition-all hover:shadow-md cursor-pointer ${
                  !notification.read ? 'border-l-4 border-l-blue-500' : ''
                } ${getNotificationTypeColor(notification.type)}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationTypeIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className={`text-base sm:text-lg font-semibold pr-2 ${
                        !notification.read ? 'text-gray-900' : 'text-gray-700'
                      }`}>
                        {notification.title}
                      </h3>
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <span className="text-xs sm:text-sm text-gray-500">
                          {formatNotificationTime(notification.timestamp)}
                        </span>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                    <p className={`text-xs sm:text-sm mb-3 ${
                      !notification.read ? 'text-gray-700' : 'text-gray-600'
                    }`}>
                      {notification.message}
                    </p>
                    
                    {/* Action buttons */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                        </Badge>
                        {notification.orderId && (
                          <Badge variant="outline" className="text-xs">
                            {notification.orderId}
                          </Badge>
                        )}
                      </div>
                      
                      {notification.actionUrl && (
                        <div className="flex items-center text-primary hover:text-primary-600 text-xs sm:text-sm font-medium">
                          <span className="hidden sm:inline">{notification.type === 'order' ? 'View Order' : 'View Details'}</span>
                          <span className="sm:hidden">View</span>
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Back to Dashboard */}
        <div className="mt-8 text-center">
          <Link href="/">
            <Button variant="outline">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}