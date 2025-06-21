'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Play, Star, Users, Award, TrendingUp } from 'lucide-react';
import { CheckoutModal } from '@/components/checkout-modal';

export function HeroSection() {
  const [showCheckout, setShowCheckout] = useState(false);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-20 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="text-center">
          <Badge variant="secondary" className="mb-4 px-4 py-2">
            <Star className="mr-2 h-4 w-4" />
            Trusted by 10,000+ Job Seekers
          </Badge>

          <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
            Master Your
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {' '}
              Dream Job{' '}
            </span>
            Interview
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600 sm:text-xl">
            Experience realistic company hiring rounds with AI-powered
            simulations. Practice with Amazon, Google, Microsoft and more
            top-tier companies.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="px-8 py-4 text-lg"
              onClick={() => setShowCheckout(true)}
            >
              Get Hiring Guru Prime
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-blue-100 p-3">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">50+ Companies</h3>
              <p className="text-gray-600">Real hiring processes</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="rounded-full bg-purple-100 p-3">
                <Award className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">5 Round Types</h3>
              <p className="text-gray-600">Complete simulation</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="rounded-full bg-green-100 p-3">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">95% Success Rate</h3>
              <p className="text-gray-600">Job placement success</p>
            </div>
          </div>
        </div>
      </div>

      <CheckoutModal open={showCheckout} onOpenChange={setShowCheckout} />
    </section>
  );
}
