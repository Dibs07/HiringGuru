import { Card, CardContent } from '@/components/ui/card';
import { Target, Zap, Shield, Users } from 'lucide-react';

export function AboutSection() {
  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Why Choose Hiring Guru?
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            We revolutionize interview preparation with AI-powered simulations
            that mirror real company hiring processes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="pt-8">
              <div className="rounded-full bg-blue-100 p-3 w-16 h-16 mx-auto mb-4">
                <Target className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Realistic Simulations
              </h3>
              <p className="text-gray-600">
                Experience actual company hiring rounds with authentic questions
                and scenarios.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="pt-8">
              <div className="rounded-full bg-purple-100 p-3 w-16 h-16 mx-auto mb-4">
                <Zap className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                AI-Powered Feedback
              </h3>
              <p className="text-gray-600">
                Get instant, detailed feedback on your performance with
                actionable insights.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="pt-8">
              <div className="rounded-full bg-green-100 p-3 w-16 h-16 mx-auto mb-4">
                <Shield className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
              <p className="text-gray-600">
                Your data is protected with enterprise-grade security and
                privacy measures.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="pt-8">
              <div className="rounded-full bg-orange-100 p-3 w-16 h-16 mx-auto mb-4">
                <Users className="h-10 w-10 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Support</h3>
              <p className="text-gray-600">
                Get guidance from industry experts and career counselors.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
