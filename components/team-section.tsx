import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Linkedin, Twitter } from 'lucide-react';

export function TeamSection() {
  const team = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Co-founder',
      image: '/placeholder.svg?height=300&width=300',
      bio: 'Former Google recruiter with 10+ years in tech hiring',
      badges: ['Leadership', 'Strategy'],
    },
    {
      name: 'Michael Chen',
      role: 'CTO & Co-founder',
      image: '/placeholder.svg?height=300&width=300',
      bio: 'Ex-Microsoft engineer, AI and machine learning expert',
      badges: ['AI/ML', 'Engineering'],
    },
    {
      name: 'Emily Rodriguez',
      role: 'Head of Product',
      image: '/placeholder.svg?height=300&width=300',
      bio: 'Product leader from Amazon, specializing in user experience',
      badges: ['Product', 'UX'],
    },
    {
      name: 'David Kim',
      role: 'Head of Engineering',
      image: '/placeholder.svg?height=300&width=300',
      bio: 'Full-stack architect with expertise in scalable systems',
      badges: ['Architecture', 'Scalability'],
    },
  ];

  return (
    <section id="team" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Meet Our Team
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Industry experts from top tech companies working to revolutionize
            interview preparation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <Card
              key={index}
              className="border-0 shadow-lg hover:shadow-xl transition-shadow text-center"
            >
              <CardContent className="pt-8">
                <img
                  src={member.image || '/placeholder.svg'}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm mb-4">{member.bio}</p>
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  {member.badges.map((badge, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {badge}
                    </Badge>
                  ))}
                </div>
                <div className="flex justify-center gap-3">
                  <Linkedin className="h-5 w-5 text-gray-400 hover:text-blue-600 cursor-pointer" />
                  <Twitter className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
