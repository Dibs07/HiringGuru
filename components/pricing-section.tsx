'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Check, Crown, Zap, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: 'Free',
      price: 0,
      period: 'forever',
      description: 'Perfect for getting started',
      features: [
        '3 assessments per month',
        '5 company simulations',
        'Basic analytics',
        'Progress tracking',
        'Community support',
      ],
      limitations: [
        'Limited company access',
        'Basic feedback only',
        'No custom assessments',
      ],
      cta: 'Get Started',
      popular: false,
    },
    {
      name: 'Prime',
      price: isAnnual ? 7999 : 999,
      originalPrice: isAnnual ? 11999 : 1499,
      period: isAnnual ? 'year' : 'month',
      description: 'Everything you need to ace interviews',
      features: [
        'Unlimited assessments',
        'All company simulations',
        'Custom assessment builder',
        'Advanced analytics & insights',
        'Interview recording & playback',
        'AI-powered feedback',
        'Priority support',
        'Export results',
        'Personalized preparation plans',
        'Career guidance sessions',
      ],
      savings: isAnnual ? 'Save ₹4000' : null,
      cta: 'Upgrade to Prime',
      popular: true,
    },
  ];

  return (
    <section
      id="pricing"
      className="py-24 bg-gradient-to-br from-blue-50 to-purple-50"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Choose the plan that fits your interview preparation needs
          </p>

          <div className="flex items-center justify-center gap-4">
            <span
              className={`text-sm ${!isAnnual ? 'font-semibold' : 'text-gray-500'}`}
            >
              Monthly
            </span>
            <Switch
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
              className="data-[state=checked]:bg-blue-600"
            />
            <span
              className={`text-sm ${isAnnual ? 'font-semibold' : 'text-gray-500'}`}
            >
              Annual
            </span>
            {isAnnual && (
              <Badge className="bg-green-100 text-green-800 border-green-200">
                Save 33%
              </Badge>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card
                className={`relative h-full ${plan.popular ? 'border-blue-500 border-2 shadow-xl' : 'shadow-lg'}`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600">
                    <Star className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                )}

                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
                    {plan.name === 'Prime' && (
                      <Crown className="h-6 w-6 text-yellow-500" />
                    )}
                    {plan.name}
                  </CardTitle>
                  <p className="text-gray-600">{plan.description}</p>

                  <div className="mt-4">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-4xl font-bold">₹{plan.price}</span>
                      <span className="text-gray-500">/{plan.period}</span>
                    </div>
                    {plan.originalPrice && (
                      <div className="flex items-center justify-center gap-2 mt-1">
                        <span className="text-lg text-gray-400 line-through">
                          ₹{plan.originalPrice}
                        </span>
                        {plan.savings && (
                          <Badge variant="secondary" className="text-green-600">
                            {plan.savings}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.limitations && (
                    <div className="pt-4 border-t">
                      <p className="text-sm font-medium text-gray-500 mb-2">
                        Limitations:
                      </p>
                      <ul className="space-y-1">
                        {plan.limitations.map((limitation, limitIndex) => (
                          <li
                            key={limitIndex}
                            className="text-sm text-gray-500"
                          >
                            • {limitation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Button
                    className={`w-full mt-8 ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    {plan.name === 'Prime' && <Zap className="h-4 w-4 mr-2" />}
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 mb-4">
            ✓ 7-day money-back guarantee • ✓ Cancel anytime • ✓ Secure payments
          </p>
          <p className="text-sm text-gray-500">
            All prices are in Indian Rupees (INR) and include applicable taxes
          </p>
        </motion.div>
      </div>
    </section>
  );
}
