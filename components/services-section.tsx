import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, MessageSquare, Code, Mic, FileText } from 'lucide-react';

export function ServicesSection() {
  const services = [
    {
      icon: FileText,
      title: 'Screening Round',
      description:
        'Skills assessment and eligibility check with targeted questions',
      features: [
        'Skills evaluation',
        'Experience matching',
        'Role suitability',
      ],
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: Brain,
      title: 'Aptitude Round',
      description:
        'Logical reasoning, quantitative, and analytical thinking tests',
      features: [
        'Logical reasoning',
        'Quantitative aptitude',
        'Pattern recognition',
      ],
      color: 'bg-purple-100 text-purple-600',
    },
    {
      icon: MessageSquare,
      title: 'Communication Round',
      description: 'Multi-format communication assessment with audio and text',
      features: [
        'Audio comprehension',
        'Verbal responses',
        'Written communication',
      ],
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: Code,
      title: 'Technical Assessment',
      description:
        'Coding challenges in a professional development environment',
      features: ['Live coding', 'Algorithm design', 'Code optimization'],
      color: 'bg-orange-100 text-orange-600',
    },
    {
      icon: Mic,
      title: 'Speech-to-Speech Interview',
      description: 'Real-time conversational interview with AI interviewer',
      features: [
        'Natural conversation',
        'Behavioral questions',
        'Real-time feedback',
      ],
      color: 'bg-red-100 text-red-600',
    },
  ];

  return (
    <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Complete Interview Simulation
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Experience all types of interview rounds that top companies use in
            their hiring process.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <CardHeader>
                  <div
                    className={`rounded-full p-3 w-16 h-16 mb-4 ${service.color}`}
                  >
                    <Icon className="h-10 w-10" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <Badge key={idx} variant="secondary" className="mr-2">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
