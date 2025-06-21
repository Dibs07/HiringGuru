import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Settings, Bell, Shield, Crown } from 'lucide-react';
import { isPrimeEnabled } from '@/lib/mock-data';

export function ProfileSettings() {
  const isPrime = isPrimeEnabled();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Quick Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="notifications">Email Notifications</Label>
            <Switch id="notifications" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="reminders">Practice Reminders</Label>
            <Switch id="reminders" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="analytics">Share Analytics</Label>
            <Switch id="analytics" />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="camera">Camera Permissions</Label>
            <Switch id="camera" defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            Assessment Reminders
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Weekly Progress Report
          </Button>
          <Button variant="outline" className="w-full justify-start">
            New Features Updates
          </Button>
        </CardContent>
      </Card>

      {!isPrime && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <Crown className="h-5 w-5" />
              Upgrade to Prime
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-yellow-700 text-sm mb-4">
              Unlock unlimited assessments, advanced analytics, and priority
              support.
            </p>
            <Button className="w-full bg-yellow-600 hover:bg-yellow-700">
              <Crown className="h-4 w-4 mr-2" />
              Upgrade Now
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            Change Password
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Privacy Settings
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Download Data
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start text-red-600 hover:text-red-700"
          >
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
