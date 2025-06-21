'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Camera, Monitor, AlertTriangle, CheckCircle } from 'lucide-react';

interface CameraPermissionProps {
  onPermissionsGranted: () => void;
  assessment: any;
}

export function CameraPermission({
  onPermissionsGranted,
  assessment,
}: CameraPermissionProps) {
  const [cameraPermission, setCameraPermission] = useState<
    'pending' | 'granted' | 'denied'
  >('pending');
  const [loading, setLoading] = useState(false);

  const requestPermissions = async () => {
    setLoading(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      // Stop the stream immediately as we just needed permission
      stream.getTracks().forEach((track) => track.stop());

      setCameraPermission('granted');
      setTimeout(() => {
        onPermissionsGranted();
      }, 1000);
    } catch (error) {
      setCameraPermission('denied');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {assessment.configSnapshot.assessmentName}
          </CardTitle>
          <p className="text-gray-600">Assessment Setup</p>
        </CardHeader>

        <CardContent className="space-y-6">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              This assessment requires camera and microphone access for
              proctoring purposes. No video or audio will be recorded or stored.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <Camera className="h-6 w-6 text-blue-600" />
              <div>
                <h3 className="font-medium">Camera Access</h3>
                <p className="text-sm text-gray-600">
                  Required for identity verification
                </p>
              </div>
              {cameraPermission === 'granted' && (
                <CheckCircle className="h-5 w-5 text-green-600 ml-auto" />
              )}
            </div>

            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <Monitor className="h-6 w-6 text-blue-600" />
              <div>
                <h3 className="font-medium">Full Screen Mode</h3>
                <p className="text-sm text-gray-600">
                  Assessment will run in full screen
                </p>
              </div>
            </div>
          </div>

          {cameraPermission === 'denied' && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                Camera permission is required to proceed with the assessment.
                Please refresh the page and allow camera access.
              </AlertDescription>
            </Alert>
          )}

          <div className="text-center">
            {cameraPermission === 'pending' && (
              <Button
                size="lg"
                onClick={requestPermissions}
                disabled={loading}
                className="px-8"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Requesting Permissions...
                  </>
                ) : (
                  <>
                    <Camera className="mr-2 h-5 w-5" />
                    Grant Permissions & Start
                  </>
                )}
              </Button>
            )}

            {cameraPermission === 'granted' && (
              <div className="text-green-600 font-medium">
                <CheckCircle className="h-6 w-6 mx-auto mb-2" />
                Permissions granted! Starting assessment...
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
