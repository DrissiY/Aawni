'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, User, Briefcase, Phone, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

type SignupStep = 'form' | 'phone' | 'code' | 'success'

interface Service {
  id: string
  name: string
  subservices: { id: string; name: string }[]
}

const services: Service[] = [
  {
    id: 'cleaning',
    name: 'Cleaning',
    subservices: [
      { id: 'house-cleaning', name: 'House Cleaning' },
      { id: 'office-cleaning', name: 'Office Cleaning' },
      { id: 'deep-cleaning', name: 'Deep Cleaning' },
      { id: 'carpet-cleaning', name: 'Carpet Cleaning' }
    ]
  },
  {
    id: 'electricity',
    name: 'Electricity',
    subservices: [
      { id: 'electrical-repair', name: 'Electrical Repair' },
      { id: 'wiring', name: 'Wiring' },
      { id: 'lighting-installation', name: 'Lighting Installation' },
      { id: 'electrical-maintenance', name: 'Electrical Maintenance' }
    ]
  },
  {
    id: 'plumbing',
    name: 'Plumbing',
    subservices: [
      { id: 'pipe-repair', name: 'Pipe Repair' },
      { id: 'drain-cleaning', name: 'Drain Cleaning' },
      { id: 'faucet-installation', name: 'Faucet Installation' },
      { id: 'bathroom-plumbing', name: 'Bathroom Plumbing' }
    ]
  },
  {
    id: 'moving',
    name: 'Moving',
    subservices: [
      { id: 'home-moving', name: 'Home Moving' },
      { id: 'office-moving', name: 'Office Moving' },
      { id: 'furniture-moving', name: 'Furniture Moving' },
      { id: 'packing-services', name: 'Packing Services' }
    ]
  },
  {
    id: 'outdoor-help',
    name: 'Outdoor Help',
    subservices: [
      { id: 'gardening', name: 'Gardening' },
      { id: 'lawn-care', name: 'Lawn Care' },
      { id: 'landscaping', name: 'Landscaping' },
      { id: 'outdoor-cleaning', name: 'Outdoor Cleaning' }
    ]
  },
  {
    id: 'painting',
    name: 'Painting',
    subservices: [
      { id: 'interior-painting', name: 'Interior Painting' },
      { id: 'exterior-painting', name: 'Exterior Painting' },
      { id: 'wall-painting', name: 'Wall Painting' },
      { id: 'furniture-painting', name: 'Furniture Painting' }
    ]
  }
]

export default function SignupPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<SignupStep>('form')
  const userRole = 'tasker' as const
  const [isLoading, setIsLoading] = useState(false)

  // Client form removed - only tasker signup

  // Tasker form state
  const [taskerForm, setTaskerForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    selectedServices: [] as string[],
    selectedSubservices: [] as string[],
    experience: '',
    description: '',
    hourlyRate: ''
  })

  // Phone verification state
  const [phoneNumber, setPhoneNumber] = useState('+212 ')
  const [verificationCode, setVerificationCode] = useState('')

  // Phone formatting functions
  const formatMoroccanPhone = (value: string): string => {
    const cleaned = value.replace(/\D/g, '')
    if (!cleaned.startsWith('212')) return '+212 '
    
    const number = cleaned.slice(3)
    if (number.length === 0) return '+212 '
    if (number.length <= 1) return `+212 ${number}`
    if (number.length <= 3) return `+212 ${number.slice(0, 1)} ${number.slice(1)}`
    if (number.length <= 5) return `+212 ${number.slice(0, 1)} ${number.slice(1, 3)} ${number.slice(3)}`
    if (number.length <= 7) return `+212 ${number.slice(0, 1)} ${number.slice(1, 3)} ${number.slice(3, 5)} ${number.slice(5)}`
    return `+212 ${number.slice(0, 1)} ${number.slice(1, 3)} ${number.slice(3, 5)} ${number.slice(5, 7)} ${number.slice(7, 9)}`
  }

  const validatePhone = (phone: string): boolean => {
    const cleaned = phone.replace(/\D/g, '')
    return cleaned.startsWith('212') && cleaned.length === 12 && ['6', '7'].includes(cleaned[3])
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatMoroccanPhone(e.target.value)
    setPhoneNumber(formatted)
  }

  // Role is always tasker, no selection needed

  const handleServiceToggle = (serviceId: string) => {
    setTaskerForm(prev => {
      const isSelected = prev.selectedServices.includes(serviceId)
      const newServices = isSelected 
        ? prev.selectedServices.filter(id => id !== serviceId)
        : [...prev.selectedServices, serviceId]
      
      // Remove subservices of deselected service
      const newSubservices = isSelected
        ? prev.selectedSubservices.filter(subId => {
            const service = services.find(s => s.id === serviceId)
            return !service?.subservices.some(sub => sub.id === subId)
          })
        : prev.selectedSubservices
      
      return {
        ...prev,
        selectedServices: newServices,
        selectedSubservices: newSubservices
      }
    })
  }

  const handleSubserviceToggle = (subserviceId: string) => {
    setTaskerForm(prev => ({
      ...prev,
      selectedSubservices: prev.selectedSubservices.includes(subserviceId)
        ? prev.selectedSubservices.filter(id => id !== subserviceId)
        : [...prev.selectedSubservices, subserviceId]
    }))
  }

  const handleFormSubmit = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setCurrentStep('phone')
    setIsLoading(false)
  }

  const handlePhoneSubmit = async () => {
    if (!validatePhone(phoneNumber)) return
    
    setIsLoading(true)
    // Simulate sending verification code
    await new Promise(resolve => setTimeout(resolve, 1000))
    setCurrentStep('code')
    setIsLoading(false)
  }

  const handleCodeSubmit = async () => {
    if (verificationCode.length !== 6) return
    
    setIsLoading(true)
    // Simulate code verification
    await new Promise(resolve => setTimeout(resolve, 1000))
    setCurrentStep('success')
    setIsLoading(false)
  }

  const isFormValid = taskerForm.firstName && taskerForm.lastName && taskerForm.email && 
    taskerForm.selectedServices.length > 0 && taskerForm.experience && taskerForm.description && taskerForm.hourlyRate

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
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
            Join Aawni as a Tasker
          </h1>
          <p className="text-gray-600 mt-2">
            {currentStep === 'form' && 'Tell us about your services and start earning'}
            {currentStep === 'phone' && 'Verify your phone number'}
            {currentStep === 'code' && 'Enter the verification code'}
            {currentStep === 'success' && 'Welcome to the Aawni community!'}
          </p>
        </div>

        {/* Signup Card */}
        <Card className="shadow-lg">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-between mb-4">
              {(currentStep === 'phone' || currentStep === 'code') && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (currentStep === 'phone') setCurrentStep('form')
                    else if (currentStep === 'code') setCurrentStep('phone')
                  }}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              )}
              <div className="flex-1" />
            </div>
            
            <div className="flex justify-center space-x-2 mb-4">
              <div className={`w-2 h-2 rounded-full ${
                currentStep === 'form' ? 'bg-primary-600' : 'bg-gray-300'
              }`} />
              <div className={`w-2 h-2 rounded-full ${
                currentStep === 'phone' ? 'bg-primary-600' : 'bg-gray-300'
              }`} />
              <div className={`w-2 h-2 rounded-full ${
                currentStep === 'code' ? 'bg-primary-600' : 'bg-gray-300'
              }`} />
            </div>
          
          </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Role selection removed - always tasker */}
          
          {/* Client form removed - only tasker form */}
          
          {/* Tasker Form */}
          {currentStep === 'form' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={taskerForm.firstName}
                    onChange={(e) => setTaskerForm(prev => ({ ...prev, firstName: e.target.value }))}
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={taskerForm.lastName}
                    onChange={(e) => setTaskerForm(prev => ({ ...prev, lastName: e.target.value }))}
                    placeholder="Enter your last name"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={taskerForm.email}
                  onChange={(e) => setTaskerForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email"
                />
              </div>
              
              <div>
                <Label>Services You Provide</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {services.map(service => (
                    <div key={service.id}>
                      <Badge
                        variant={taskerForm.selectedServices.includes(service.id) ? 'default' : 'outline'}
                        className="cursor-pointer w-full justify-center py-2"
                        onClick={() => handleServiceToggle(service.id)}
                      >
                        {service.name}
                      </Badge>
                      
                      {taskerForm.selectedServices.includes(service.id) && (
                        <div className="mt-2 space-y-1">
                          {service.subservices.map(sub => (
                            <Badge
                              key={sub.id}
                              variant={taskerForm.selectedSubservices.includes(sub.id) ? 'secondary' : 'outline'}
                              className="cursor-pointer text-xs mr-1"
                              onClick={() => handleSubserviceToggle(sub.id)}
                            >
                              {sub.name}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <Label htmlFor="experience">Years of Experience</Label>
                <Select onValueChange={(value) => setTaskerForm(prev => ({ ...prev, experience: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-1">0-1 years</SelectItem>
                    <SelectItem value="2-3">2-3 years</SelectItem>
                    <SelectItem value="4-5">4-5 years</SelectItem>
                    <SelectItem value="6-10">6-10 years</SelectItem>
                    <SelectItem value="10+">10+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="hourlyRate">Hourly Rate (MAD)</Label>
                <Input
                  id="hourlyRate"
                  type="number"
                  value={taskerForm.hourlyRate}
                  onChange={(e) => setTaskerForm(prev => ({ ...prev, hourlyRate: e.target.value }))}
                  placeholder="Enter your hourly rate"
                  min="50"
                  max="1000"
                />
              </div>
              
              <div>
                <Label htmlFor="description">About Your Services</Label>
                <Textarea
                  id="description"
                  value={taskerForm.description}
                  onChange={(e) => setTaskerForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your experience and what makes you stand out..."
                  rows={4}
                />
              </div>
              
              <Button 
                onClick={handleFormSubmit} 
                disabled={!isFormValid || isLoading}
                className="w-full"
              >
                {isLoading ? 'Processing...' : 'Continue'}
              </Button>
            </div>
          )}
          
          {/* Phone Verification */}
          {currentStep === 'phone' && (
            <div className="space-y-4">
              <div className="flex items-center justify-center mb-6">
                <Phone className="h-12 w-12 text-blue-600" />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number (Morocco)</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  placeholder="+212 6 12 34 56 78"
                  maxLength={18}
                />
              </div>
              
              <Button 
                onClick={handlePhoneSubmit} 
                disabled={!validatePhone(phoneNumber) || isLoading}
                className="w-full"
              >
                {isLoading ? 'Sending Code...' : 'Send Verification Code'}
              </Button>
            </div>
          )}
          
          {/* Code Verification */}
          {currentStep === 'code' && (
            <div className="space-y-4">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Phone className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              
              <div>
                <Label htmlFor="code">Verification Code</Label>
                <Input
                  id="code"
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  className="text-center text-lg tracking-widest"
                />
              </div>
              
              <Button 
                onClick={handleCodeSubmit} 
                disabled={verificationCode.length !== 6 || isLoading}
                className="w-full"
              >
                {isLoading ? 'Verifying...' : 'Verify Code'}
              </Button>
              
              <div className="text-center">
                <Button variant="link" className="text-sm text-gray-600">
                   Didn&apos;t receive the code? Resend
                 </Button>
              </div>
            </div>
          )}
          
          {/* Success */}
          {currentStep === 'success' && (
            <div className="text-center space-y-6">
              <div className="flex items-center justify-center mb-6">
                <CheckCircle className="h-16 w-16 text-green-600" />
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  Thank you for submitting!
                </h3>
                <p className="text-gray-600 text-lg">
                  We will contact you very soon to complete your registration and get you started on the Aawni platform.
                </p>
                <p className="text-sm text-gray-500">
                  Keep an eye on your phone and email for updates from our team.
                </p>
              </div>
              
              <Button 
                onClick={() => router.push('/')}
                className="w-full mt-6"
              >
                Go to Homepage
              </Button>
            </div>
          )}
          
          {currentStep === 'form' && (
            <div className="text-center pt-4">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="text-blue-600 hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      </div>
    </div>
  )
}