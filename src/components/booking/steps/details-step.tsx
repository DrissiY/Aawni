'use client';

import React from 'react';
import { FileText, Plus, X } from 'lucide-react';
import { useBookingStore } from '@/store/booking-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function DetailsStep() {
  const { details, setDetails } = useBookingStore();

  const handleDescriptionChange = (description: string) => {
    setDetails({
      ...details,
      description
    });
  };

  const handleRequirementAdd = (requirement: string) => {
    if (requirement.trim()) {
      setDetails({
        ...details,
        requirements: [...(details?.requirements || []), requirement.trim()]
      });
    }
  };

  const handleRequirementRemove = (index: number) => {
    const updatedRequirements = details?.requirements?.filter((_, i) => i !== index) || [];
    setDetails({
      ...details,
      requirements: updatedRequirements
    });
  };

  const handleNotesChange = (notes: string) => {
    setDetails({
      ...details,
      notes
    });
  };

  const [newRequirement, setNewRequirement] = React.useState('');

  const addRequirement = () => {
    handleRequirementAdd(newRequirement);
    setNewRequirement('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addRequirement();
    }
  };

  return (
    <div className="space-y-6">
      {/* Service Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Service Description</Label>
        <Textarea
          id="description"
          placeholder="Please describe what you need help with in detail..."
          value={details?.description || ''}
          onChange={(e) => handleDescriptionChange(e.target.value)}
          className="min-h-[120px] resize-none"
          maxLength={1000}
        />
        <div className="text-xs text-gray-500 text-right">
          {(details?.description || '').length}/1000 characters
        </div>
      </div>

      {/* Special Requirements */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Special Requirements</span>
          </CardTitle>
          <p className="text-sm text-gray-600">
            Add any specific requirements, tools needed, or special considerations
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add Requirement Input */}
          <div className="flex space-x-2">
            <Input
              placeholder="e.g., Bring specific tools, Access restrictions, etc."
              value={newRequirement}
              onChange={(e) => setNewRequirement(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button
              type="button"
              onClick={addRequirement}
              disabled={!newRequirement.trim()}
              size="sm"
              className="bg-cyan-600 hover:bg-cyan-700"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Requirements List */}
          {details?.requirements && details.requirements.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Added Requirements:</Label>
              <div className="flex flex-wrap gap-2">
                {details.requirements.map((requirement, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center space-x-1 px-3 py-1 bg-cyan-50 text-cyan-700 border border-cyan-200"
                  >
                    <span className="text-sm">{requirement}</span>
                    <button
                      onClick={() => handleRequirementRemove(index)}
                      className="ml-1 hover:bg-cyan-200 rounded-full p-0.5"
                      type="button"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Additional Notes (Optional)</Label>
        <Textarea
          id="notes"
          placeholder="Any additional information that might be helpful for the technician..."
          value={details?.notes || ''}
          onChange={(e) => handleNotesChange(e.target.value)}
          className="min-h-[80px] resize-none"
          maxLength={500}
        />
        <div className="text-xs text-gray-500 text-right">
          {(details?.notes || '').length}/500 characters
        </div>
      </div>

      {/* Summary Card */}
      {(details?.description || details?.requirements?.length || details?.notes) && (
        <Card className="bg-gray-50 border-gray-200">
          <CardHeader>
            <CardTitle className="text-base">Service Details Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {details?.description && (
              <div>
                <Label className="text-sm font-medium text-gray-700">Description:</Label>
                <p className="text-sm text-gray-600 mt-1">{details.description}</p>
              </div>
            )}
            
            {details?.requirements && details.requirements.length > 0 && (
              <div>
                <Label className="text-sm font-medium text-gray-700">Requirements:</Label>
                <ul className="text-sm text-gray-600 mt-1 space-y-1">
                  {details.requirements.map((req, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-cyan-600 mt-1">•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {details?.notes && (
              <div>
                <Label className="text-sm font-medium text-gray-700">Additional Notes:</Label>
                <p className="text-sm text-gray-600 mt-1">{details.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}