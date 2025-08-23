'use client';

import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, AlertCircle, Shield, Check } from 'lucide-react';
import { useBookingStore } from '@/store/booking-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  verificationCode?: string;
}

export function CustomerInfoStep() {
  const { customerInfo, setCustomerInfo } = useBookingStore();
  const [formData, setFormData] = useState({
    name: customerInfo?.name || '',
    email: customerInfo?.email || '',
    phone: customerInfo?.phone || '+212 '
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [verificationState, setVerificationState] = useState<'idle' | 'sending' | 'sent' | 'verifying' | 'verified'>('idle');
  const [verificationCode, setVerificationCode] = useState('');
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  // Validation functions
  const validateName = (name: string): string | undefined => {
    if (!name.trim()) return 'Name is required';
    if (name.trim().length < 2) return 'Name must be at least 2 characters';
    return undefined;
  };

  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return undefined;
  };

  const validatePhone = (phone: string): string | undefined => {
    if (!phone.trim()) return 'Phone number is required';
    if (!phone.startsWith('+212 ')) return 'Phone number must start with +212';
    const phoneWithoutPrefix = phone.replace('+212 ', '').replace(/\s/g, '');
    if (phoneWithoutPrefix.length < 9) return 'Please enter a valid Moroccan phone number';
    const moroccanPhoneRegex = /^[5-7][0-9]{8}$/;
    if (!moroccanPhoneRegex.test(phoneWithoutPrefix)) return 'Please enter a valid Moroccan phone number (9 digits starting with 5, 6, or 7)';
    return undefined;
  };

  const validateVerificationCode = (code: string): string | undefined => {
    if (!code.trim()) return 'Verification code is required';
    if (code.length !== 6) return 'Verification code must be 6 digits';
    if (!/^[0-9]{6}$/.test(code)) return 'Verification code must contain only numbers';
    return undefined;
  };

  // Validate form
  const validateForm = () => {
    const newErrors: FormErrors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      phone: validatePhone(formData.phone)
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== undefined);
  };

  // Handle input changes
  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Handle input blur
  const handleInputBlur = (field: keyof typeof formData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    // Validate field on blur
    let error: string | undefined;
    switch (field) {
      case 'name':
        error = validateName(formData.name);
        break;
      case 'email':
        error = validateEmail(formData.email);
        break;
      case 'phone':
        error = validatePhone(formData.phone);
        break;
    }
    
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  // Format Moroccan phone number as user types
  const formatMoroccanPhone = (value: string) => {
    // Always ensure it starts with +212
    if (!value.startsWith('+212 ')) {
      value = '+212 ' + value.replace(/^(\+212\s?)?/, '');
    }
    
    // Extract the number part after +212
    const numberPart = value.replace('+212 ', '').replace(/[^\d]/g, '');
    
    // Limit to 9 digits for Moroccan numbers
    const limitedNumber = numberPart.slice(0, 9);
    
    // Format as +212 X XX XX XX XX
    let formatted = '+212 ';
    if (limitedNumber.length > 0) {
      formatted += limitedNumber[0];
      if (limitedNumber.length > 1) {
        formatted += ' ' + limitedNumber.slice(1, 3);
        if (limitedNumber.length > 3) {
          formatted += ' ' + limitedNumber.slice(3, 5);
          if (limitedNumber.length > 5) {
            formatted += ' ' + limitedNumber.slice(5, 7);
            if (limitedNumber.length > 7) {
              formatted += ' ' + limitedNumber.slice(7, 9);
            }
          }
        }
      }
    }
    
    return formatted;
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatMoroccanPhone(value);
    handleInputChange('phone', formatted);
    // Reset verification when phone changes
    if (isPhoneVerified) {
      setIsPhoneVerified(false);
      setVerificationState('idle');
      setVerificationCode('');
    }
  };

  // Handle phone verification
  const handleSendVerification = async () => {
    const phoneError = validatePhone(formData.phone);
    if (phoneError) {
      setErrors(prev => ({ ...prev, phone: phoneError }));
      setTouched(prev => ({ ...prev, phone: true }));
      return;
    }

    setVerificationState('sending');
    
    // Simulate sending SMS (replace with actual SMS service)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setVerificationState('sent');
    } catch (error) {
      setVerificationState('idle');
      // Handle error
    }
  };

  const handleVerifyCode = async () => {
    const codeError = validateVerificationCode(verificationCode);
    if (codeError) {
      setErrors(prev => ({ ...prev, verificationCode: codeError }));
      return;
    }

    setVerificationState('verifying');
    
    // Simulate code verification (replace with actual verification)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      // For demo, accept any 6-digit code
      setVerificationState('verified');
      setIsPhoneVerified(true);
      setErrors(prev => ({ ...prev, verificationCode: undefined }));
    } catch (error) {
      setVerificationState('sent');
      setErrors(prev => ({ ...prev, verificationCode: 'Invalid verification code' }));
    }
  };

  // Update store when form data changes and is valid
  useEffect(() => {
    if (validateForm() && isPhoneVerified && (formData.name || formData.email || formData.phone)) {
      setCustomerInfo({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim()
      });
    }
  }, [formData, isPhoneVerified, setCustomerInfo]);

  const isFormValid = !Object.values(errors).some(error => error !== undefined) && 
                     formData.name.trim() && formData.email.trim() && formData.phone.trim() && isPhoneVerified;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Contact Information</h2>
        <p className="text-gray-600">
          Please provide your contact details so we can reach you about your service appointment.
        </p>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Your Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="customer-name">Full Name *</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="customer-name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                onBlur={() => handleInputBlur('name')}
                className={`pl-10 ${
                  errors.name && touched.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                }`}
              />
            </div>
            {errors.name && touched.name && (
              <p className="text-sm text-red-600 flex items-center space-x-1">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.name}</span>
              </p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="customer-email">Email Address *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="customer-email"
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                onBlur={() => handleInputBlur('email')}
                className={`pl-10 ${
                  errors.email && touched.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                }`}
              />
            </div>
            {errors.email && touched.email && (
              <p className="text-sm text-red-600 flex items-center space-x-1">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.email}</span>
              </p>
            )}
          </div>

          {/* Phone Field */}
          <div className="space-y-2">
            <Label htmlFor="customer-phone">Phone Number (Morocco) *</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="customer-phone"
                type="tel"
                placeholder="+212 6 12 34 56 78"
                value={formData.phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                onBlur={() => handleInputBlur('phone')}
                className={`pl-10 ${
                  errors.phone && touched.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                } ${
                  isPhoneVerified ? 'border-green-500 bg-green-50' : ''
                }`}
                maxLength={18}
                disabled={isPhoneVerified}
              />
              {isPhoneVerified && (
                <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-600" />
              )}
            </div>
            {errors.phone && touched.phone && (
              <p className="text-sm text-red-600 flex items-center space-x-1">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.phone}</span>
              </p>
            )}
            
            {/* Verification Button */}
            {!isPhoneVerified && (
              <Button
                type="button"
                variant="outline"
                onClick={handleSendVerification}
                disabled={verificationState === 'sending' || !!errors.phone || !formData.phone.trim()}
                className="w-full mt-2"
              >
                <Shield className="h-4 w-4 mr-2" />
                {verificationState === 'sending' ? 'Sending Code...' : 'Verify Phone Number'}
              </Button>
            )}
            
            {/* Verification Code Input */}
             {(verificationState === 'sent' || verificationState === 'verifying') && (
               <div className="space-y-2 mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                 <Label htmlFor="verification-code">Enter Verification Code *</Label>
                 <p className="text-sm text-blue-600 mb-2">
                   We sent a 6-digit code to {formData.phone}
                 </p>
                 <div className="relative">
                   <Input
                     id="verification-code"
                     type="text"
                     placeholder="123456"
                     value={verificationCode}
                     onChange={(e) => {
                       const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
                       setVerificationCode(value);
                       if (errors.verificationCode) {
                         setErrors(prev => ({ ...prev, verificationCode: undefined }));
                       }
                     }}
                     className={`text-center text-lg tracking-widest ${
                       errors.verificationCode ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                     }`}
                     maxLength={6}
                     disabled={verificationState === 'verifying'}
                   />
                 </div>
                 {errors.verificationCode && (
                   <p className="text-sm text-red-600 flex items-center space-x-1">
                     <AlertCircle className="h-4 w-4" />
                     <span>{errors.verificationCode}</span>
                   </p>
                 )}
                 <Button
                   type="button"
                   onClick={handleVerifyCode}
                   disabled={verificationState === 'verifying' || verificationCode.length !== 6}
                   className="w-full mt-2"
                 >
                   {verificationState === 'verifying' ? 'Verifying...' : 'OK'}
                 </Button>
               </div>
             )}
            
            {/* Verification Success */}
            {isPhoneVerified && (
              <div className="mt-2 p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-2 text-green-700">
                  <Check className="h-4 w-4" />
                  <span className="text-sm font-medium">Phone number verified successfully!</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Privacy Notice */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Your personal information is secure and will only be used to contact you regarding your service appointment. 
          We do not share your information with third parties.
        </AlertDescription>
      </Alert>

      {/* Form Summary */}
      {isFormValid && (
        <Card className="bg-primary-50 border-primary-200">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <User className="h-5 w-5 text-primary-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-primary-900">Contact Information Confirmed</h4>
              <div className="mt-2 space-y-1 text-sm text-primary-700">
                  <p><strong>Name:</strong> {formData.name}</p>
                  <p><strong>Email:</strong> {formData.email}</p>
                  <p><strong>Phone:</strong> {formData.phone}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Validation Status */}
      {Object.keys(touched).length > 0 && !isFormValid && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please fill in all required fields with valid information to continue.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}