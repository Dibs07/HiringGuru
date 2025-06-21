import { ProfileHeader } from '@/components/profile/profile-header';
import { ProfileStats } from '@/components/profile/profile-stats';
import { ProfileSettings } from '@/components/profile/profile-settings';
import { ProfileActivity } from '@/components/profile/profile-activity';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ProfileHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <ProfileStats />
            <ProfileActivity />
          </div>
          <div>
            <ProfileSettings />
          </div>
        </div>
      </main>
    </div>
  );
}
