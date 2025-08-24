'use client';

import { Order, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/types/order';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Phone, User, Star, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface OrderCardProps {
  order: Order;
  onViewDetails?: (orderId: string) => void;
  onContactTechnician?: (phone: string) => void;
}

export function OrderCard({ order, onViewDetails, onContactTechnician }: OrderCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0
    }).format(price);
  };

  const isActive = ['pending', 'confirmed', 'in_progress'].includes(order.status);
  const isCompleted = order.status === 'completed';
  const isCancelled = order.status === 'cancelled';

  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-md",
      isActive && "border-l-4 border-l-gray-400 bg-blue-50/30",
      isCancelled && "opacity-75 bg-gray-50",
      isCompleted && "bg-green-50/30"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold">
              {order.serviceType} - {order.subService}
            </CardTitle>
          </div>
          <Badge 
            className={cn(
              "border font-medium",
              ORDER_STATUS_COLORS[order.status]
            )}
            variant="outline"
          >
            {ORDER_STATUS_LABELS[order.status]}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex justify-between items-start">
          {/* Left side - Main info */}
          <div className="flex-1 space-y-2">
            {/* Technician Info */}
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-gray-400" />
              <span className="font-medium">{order.technicianName || 'Technician TBD'}</span>
            </div>

            {/* Schedule Info */}
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(order.scheduledDate)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{order.scheduledTime}</span>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>{order.location.city}</span>
            </div>

            {/* Price */}
            <div className="font-semibold text-lg text-primary">
              {formatPrice(order.price)}
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex flex-col gap-2 ml-4">
            <Link href={`/orders/${order.id}`}>
              <Button variant="outline" size="sm" className="w-full gap-2">
                <Eye className="h-4 w-4" />
                Details
              </Button>
            </Link>
            
            {isActive && order.technicianPhone && onContactTechnician && (
               <Button
                 variant="primary"
                 size="sm"
                 onClick={() => onContactTechnician(order.technicianPhone!)}
                 className="w-full gap-2 bg-green-600 hover:bg-green-700"
               >
                 <Phone className="h-4 w-4" />
                 Call
               </Button>
             )}
          </div>
        </div>

        {/* Rating for completed orders */}
        {isCompleted && order.rating && (
          <div className="flex items-center gap-2 pt-2 border-t">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-4 w-4",
                    i < order.rating! ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                  )}
                />
              ))}
            </div>
            <span className="text-sm font-medium">{order.rating}/5</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}