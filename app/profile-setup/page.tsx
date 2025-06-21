import { ProfileSetupForm } from '@/components/auth/profile-setup-form';

export default function ProfileSetupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <ProfileSetupForm />
    </div>
  );
}
