'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Crown, Zap, Star } from 'lucide-react';
import { useSubscriptionStore } from '@/lib/stores/subscription-store';
import { apiService } from '@/lib/services/api-service';

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reason?: string;
}

export function UpgradeModal({
  open,
  onOpenChange,
  reason,
}: UpgradeModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { setPlan } = useSubscriptionStore();

  const plans = [
    {
      id: 'monthly',
      name: 'Prime Monthly',
      price: 999,
      originalPrice: 1499,
      period: 'month',
      popular: false,
      features: [
        'Unlimited Assessments',
        'Custom Assessment Builder',
        'Advanced Analytics',
        'Interview Recording',
        'All Company Simulations',
        'Priority Support',
        'AI Mentorship',
        'Export Results',
      ],
    },
    {
      id: 'annual',
      name: 'Prime Annual',
      price: 7999,
      originalPrice: 11999,
      period: 'year',
      popular: true,
      savings: '33% OFF',
      features: [
        'Everything in Monthly',
        '2 Months Free',
        'Personalized Preparation Plans',
        'Advanced Interview Insights',
        'Career Guidance Sessions',
        'Resume Review',
        'Mock Interview Scheduling',
        'Industry Benchmarking',
      ],
    },
  ];

  const handleUpgrade = async (planId: string) => {
    setIsLoading(true);

    try {
      const plan = plans.find((p) => p.id === planId);
      if (!plan) return;

      // Create Razorpay order
      const orderData = await apiService.createPaymentOrder(planId);

      // Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: plan.price * 100, // Convert to paise
        currency: 'INR',
        name: 'Hiring Guru',
        description: `${plan.name} Subscription`,
        order_id: orderData.orderId,
        handler: async (response: any) => {
          try {
            // Verify payment
            await apiService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              plan: planId,
            });

            // Update subscription state
            setPlan(planId as 'monthly' | 'annual');

            onOpenChange(false);

            // Show success message
            alert('Subscription activated successfully!');
          } catch (error) {
            console.error('Payment verification failed:', error);
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: 'User Name',
          email: 'user@example.com',
        },
        theme: {
          color: '#3B82F6',
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment initiation failed:', error);
      alert('Failed to initiate payment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Load Razorpay script */}
      <script src="https://checkout.razorpay.com/v1/checkout.js" />

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">
              <Crown className="inline h-6 w-6 text-yellow-500 mr-2" />
              Upgrade to Prime
            </DialogTitle>
            {reason && (
              <p className="text-center text-gray-600 mt-2">{reason}</p>
            )}
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative ${plan.popular ? 'border-blue-500 border-2' : ''}`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600">
                    <Star className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                )}

                <CardHeader className="text-center">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-3xl font-bold">₹{plan.price}</span>
                      <span className="text-gray-500">/{plan.period}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-sm text-gray-500 line-through">
                        ₹{plan.originalPrice}
                      </span>
                      {plan.savings && (
                        <Badge variant="secondary" className="text-green-600">
                          {plan.savings}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={isLoading}
                    className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 mr-2" />
                        Upgrade Now
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>✓ 7-day money-back guarantee</p>
            <p>✓ Cancel anytime</p>
            <p>✓ Secure payment with Razorpay</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
