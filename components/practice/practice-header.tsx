import { Card, CardContent } from '@/components/ui/card';
import { Target, Clock, TrendingUp } from 'lucide-react';

export function PracticeHeader() {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Practice Center</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Sharpen your skills with targeted practice sessions and improve your
            interview performance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-6 text-center">
              <Target className="h-8 w-8 mx-auto mb-3 text-white" />
              <h3 className="font-semibold mb-2">Skill-Based Practice</h3>
              <p className="text-sm text-blue-100">
                Focus on specific areas that need improvement
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 mx-auto mb-3 text-white" />
              <h3 className="font-semibold mb-2">Timed Sessions</h3>
              <p className="text-sm text-blue-100">
                Practice under real interview time constraints
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-3 text-white" />
              <h3 className="font-semibold mb-2">Progress Tracking</h3>
              <p className="text-sm text-blue-100">
                Monitor your improvement over time
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
