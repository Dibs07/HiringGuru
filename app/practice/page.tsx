import { PracticeHeader } from '@/components/practice/practice-header';
import { PracticeCategories } from '@/components/practice/practice-categories';
import { RecommendedPractice } from '@/components/practice/recommended-practice';

export default function PracticePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PracticeHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <PracticeCategories />
          </div>
          <div>
            <RecommendedPractice />
          </div>
        </div>
      </main>
    </div>
  );
}
