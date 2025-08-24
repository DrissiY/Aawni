'use client';

import { useState } from 'react';
import { OrderCard } from '@/components/orders/order-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  mockOrders, 
  mockOrderSummary, 
  getCurrentOrders, 
  getPreviousOrders 
} from '@/data/mock-orders';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Activity,
  Plus,
  Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';

type TabType = 'current' | 'previous';

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<TabType>('current');

  const currentOrders = getCurrentOrders();
  const previousOrders = getPreviousOrders();
  const summary = mockOrderSummary;

  const handleViewDetails = (orderId: string) => {
    console.log('View details for order:', orderId);
    // TODO: Navigate to order details page or open modal
  };

  const handleContactTechnician = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const handleNewOrder = () => {
    window.location.href = '/';
  };

  const filteredOrders = activeTab === 'current' ? currentOrders : previousOrders;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
                <p className="mt-2 text-gray-600">
                  Track and manage your service orders
                </p>
              </div>
              <Button onClick={handleNewOrder} className="gap-2">
                <Plus className="h-4 w-4" />
                New Order
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{summary.totalOrders}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Orders</p>
                  <p className="text-2xl font-bold text-orange-600">{summary.activeOrders}</p>
                </div>
                <Activity className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{summary.completedOrders}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Cancelled</p>
                  <p className="text-2xl font-bold text-red-600">{summary.cancelledOrders}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs and Filters */}
        <div className="bg-white rounded-lg border  border-gray-200">
          <div className="border-b  border-gray-200">
            <div className="flex items-center justify-between p-6">
              <div className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('current')}
                  className={cn(
                    "pb-4 px-1 border-b-2 font-medium text-sm transition-colors",
                    activeTab === 'current'
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  )}
                >
                  Current Orders
                  {currentOrders.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {currentOrders.length}
                    </Badge>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('previous')}
                  className={cn(
                    "pb-4 px-1 border-b-2 font-medium text-sm transition-colors",
                    activeTab === 'previous'
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  )}
                >
                  Previous Orders
                </button>
              </div>
              
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>

          {/* Orders List */}
          <div className="p-6">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {activeTab === 'current' ? 'No current orders' : 'No previous orders'}
                </h3>
                <p className="text-gray-500 mb-6">
                  {activeTab === 'current' 
                    ? 'You don\'t have any active orders at the moment.' 
                    : 'You haven\'t completed any orders yet.'}
                </p>
                {activeTab === 'current' && (
                  <Button onClick={handleNewOrder} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Book a Service
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {filteredOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onViewDetails={handleViewDetails}
                    onContactTechnician={handleContactTechnician}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}