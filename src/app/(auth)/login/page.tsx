'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';

type LoginStep = 'phone' | 'verification' | 'username';

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<LoginStep>('phone');
  const [phoneNumber, setPhoneNumber] = useState('+212 ');
  const [verificationCode, setVerificationCode] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userExists, setUserExists] = useState<boolean | null>(null);

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

  const validatePhone = (phone: string): boolean => {
    if (!phone.startsWith('+212 ')) return false;
    const phoneWithoutPrefix = phone.replace('+212 ', '').replace(/\s/g, '');
    if (phoneWithoutPrefix.length < 9) return false;
    const moroccanPhoneRegex = /^[5-7][0-9]{8}$/;
    return moroccanPhoneRegex.test(phoneWithoutPrefix);
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatMoroccanPhone(value);
    setPhoneNumber(formatted);
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePhone(phoneNumber)) return;
    
    setIsLoading(true);
    // Simulate API call for sending verification code
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    setStep('verification');
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode.trim()) return;
    
    setIsLoading(true);
    // Simulate API call for verifying code and checking if user exists
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate checking if user exists (random for demo)
    const exists = Math.random() > 0.5; // 50% chance user exists
    setUserExists(exists);
    
    setIsLoading(false);
    
    if (exists) {
      // User exists, redirect to home
      router.push('/');
    } else {
      // User doesn't exist, ask for username
      setStep('username');
    }
  };

  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    
    setIsLoading(true);
    // Simulate API call for registering user
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    
    // Redirect to landing page
    router.push('/');
  };

  const renderPhoneStep = () => (
    <form onSubmit={handlePhoneSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number (Morocco)</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+212 6 12 34 56 78"
          value={phoneNumber}
          onChange={(e) => handlePhoneChange(e.target.value)}
          className="text-center text-lg"
          maxLength={18}
          required
        />
      </div>
      <Button 
        type="submit" 
        className="w-full" 
        disabled={isLoading || !validatePhone(phoneNumber)}
      >
        {isLoading ? 'Sending...' : 'Send Verification Code'}
      </Button>
    </form>
  );

  const renderVerificationStep = () => (
    <form onSubmit={handleVerificationSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="code">Verification Code</Label>
        <p className="text-sm text-gray-600 mb-3">
          Enter the code sent to {phoneNumber}
        </p>
        <Input
          id="code"
          type="text"
          placeholder="Enter verification code"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          className="text-center text-lg tracking-widest"
          maxLength={6}
          required
        />
      </div>
      <Button 
        type="submit" 
        className="w-full" 
        disabled={isLoading || !verificationCode.trim()}
      >
        {isLoading ? 'Verifying...' : 'Verify Code'}
      </Button>
      <Button 
        type="button" 
        variant="ghost" 
        className="w-full" 
        onClick={() => setStep('phone')}
      >
        Back to Phone Number
      </Button>
    </form>
  );

  const renderUsernameStep = () => (
    <form onSubmit={handleUsernameSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <p className="text-sm text-gray-600 mb-3">
          We need to create an account for you. Choose a username.
        </p>
        <Input
          id="username"
          type="text"
          placeholder="Choose a username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="text-center text-lg"
          required
        />
      </div>
      <Button 
        type="submit" 
        className="w-full" 
        disabled={isLoading || !username.trim()}
      >
        {isLoading ? 'Creating Account...' : 'Complete Registration'}
      </Button>
    </form>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="mx-auto w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center mb-4">
            <Image
              src="/logo-blue.svg"
              alt="Logo"
              width={48}
              height={48}
              className="filter brightness-0 invert"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome to Aawni
          </h1>
          <p className="text-gray-600 mt-2">
            {step === 'phone' && 'Enter your phone number to get started'}
            {step === 'verification' && 'Verify your phone number'}
            {step === 'username' && 'Complete your registration'}
          </p>
        </div>

        {/* Login Card */}
        <Card className="shadow-lg">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center space-x-2 mb-4">
              <div className={`w-2 h-2 rounded-full ${
                step === 'phone' ? 'bg-primary-600' : 'bg-gray-300'
              }`} />
              <div className={`w-2 h-2 rounded-full ${
                step === 'verification' ? 'bg-primary-600' : 'bg-gray-300'
              }`} />
              <div className={`w-2 h-2 rounded-full ${
                step === 'username' ? 'bg-primary-600' : 'bg-gray-300'
              }`} />
            </div>
          </CardHeader>
          <CardContent>
            {step === 'phone' && renderPhoneStep()}
            {step === 'verification' && renderVerificationStep()}
            {step === 'username' && renderUsernameStep()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}