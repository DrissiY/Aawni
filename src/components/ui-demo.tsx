"use client";

import React from "react";
import {
  Button,
  IconButton,
  Input,
  Label,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui";
import {
  Home,
  Calendar,
  Users,
  Settings,
  Droplets,
  Wind,
} from "lucide-react";
import { Navbar } from "./layout/navbar";

export function UIDemo() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Navbar Demo Section */}
      <div className="mb-8">
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Navbar Component Demo</h2>
            <p className="text-sm text-gray-600 mb-4">
              The navbar component automatically handles authentication states using NextAuth.js session management.
            </p>
          </div>
        </div>
        
        {/* Actual Navbar Component */}
        <Navbar />
      </div>

      <div className="p-8 space-y-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            UI Components Demo
          </h1>

        {/* Buttons Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Buttons</CardTitle>
            <CardDescription>
              Various button styles and variants
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 mb-6">
              <Button>Primary Button</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="link">Link</Button>
            </div>
            <div className="flex flex-wrap gap-4 mb-6">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
            </div>
            <div className="flex flex-wrap gap-4">
              <IconButton icon={<Home />} />
              <IconButton icon={<Calendar />} selected />
              <IconButton icon={<Users />} />
              <IconButton icon={<Settings />} />
              <IconButton icon={<Droplets />} />
              <IconButton icon={<Wind />} />
            </div>
          </CardContent>
        </Card>

        {/* Form Elements Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Form Elements</CardTitle>
            <CardDescription>
              Input fields, labels, and select components
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-w-md">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Enter your name" />
              </div>
              <div>
                <Label htmlFor="home-size">How big is your home?</Label>
                <Select>
                  <SelectTrigger id="home-size">
                    <SelectValue placeholder="Small home • 2 bedrooms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small home • 2 bedrooms</SelectItem>
                    <SelectItem value="medium">Medium home • 3 bedrooms</SelectItem>
                    <SelectItem value="large">Large home • 4+ bedrooms</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Badges Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Badges</CardTitle>
            <CardDescription>Various badge styles and colors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="cyan">Cyan</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Booking Card Example */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>One Time Booking</CardTitle>
            <CardDescription>Add details about your booking</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="home-size-demo">How big is your home?</Label>
              <Select>
                <SelectTrigger id="home-size-demo">
                  <SelectValue placeholder="Small home • 2 bedrooms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small home • 2 bedrooms</SelectItem>
                  <SelectItem value="medium">Medium home • 3 bedrooms</SelectItem>
                  <SelectItem value="large">Large home • 4+ bedrooms</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium mb-3 block">Extra Tasks</Label>
              <div className="grid grid-cols-3 gap-3">
                <IconButton icon={<Home />} label="Inside Fridge" />
                <IconButton icon={<Calendar />} label="Inside Oven" selected />
                <IconButton icon={<Users />} label="Inside Cabinets" />
                <IconButton icon={<Settings />} label="Inside Windows" />
                <IconButton icon={<Droplets />} label="Laundry" />
                <IconButton icon={<Wind />} label="Carpet Clean" />
              </div>
            </div>

            <div>
              <Label htmlFor="duration">Booking Duration</Label>
              <Select>
                <SelectTrigger id="duration">
                  <SelectValue placeholder="3" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 hours</SelectItem>
                  <SelectItem value="3">3 hours</SelectItem>
                  <SelectItem value="4">4 hours</SelectItem>
                  <SelectItem value="5">5 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Back</Button>
            <Button>Find Worker</Button>
          </CardFooter>
        </Card>
        </div>
      </div>
    </div>
  );
}