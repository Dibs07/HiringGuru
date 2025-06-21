'use client';

import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Crown, Edit, MapPin, Calendar, Mail } from 'lucide-react';
import { getUserProfile, isPrimeEnabled } from '@/lib/mock-data';
import { ProfileEditModal } from '@/components/profile/profile-edit-modal';

export function ProfileHeader() {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const isPrime = isPrimeEnabled();

  useEffect(() => {
    const profile = getUserProfile();
    setUserProfile(profile);
  }, []);

  if (!userProfile) {
    return (
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-blue-100">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  const fullName =
    `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.trim() ||
    'User';
  const initials = fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <>
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src="/placeholder.svg?height=96&width=96" />
                  <AvatarFallback className="text-2xl">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold text-white">
                      {fullName}
                    </h1>
                    {isPrime && (
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                        <Crown className="h-3 w-3 mr-1" />
                        Prime Member
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-blue-100">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>{userProfile.email || 'No email provided'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{userProfile.location || 'Location not set'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Joined Jan 2024</span>
                    </div>
                  </div>

                  <p className="text-blue-100 max-w-2xl">
                    {userProfile.bio ||
                      'No bio provided. Click edit to add your professional summary.'}
                  </p>

                  {userProfile.currentRole && (
                    <div className="text-blue-100">
                      <strong>Current Role:</strong> {userProfile.currentRole}
                      {userProfile.targetRole && (
                        <span>
                          {' '}
                          → <strong>Target:</strong> {userProfile.targetRole}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <Button
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  onClick={() => setShowEditModal(true)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ProfileEditModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        userProfile={userProfile}
        onProfileUpdate={setUserProfile}
      />
    </>
  );
}
