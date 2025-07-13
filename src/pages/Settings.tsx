
import { AuthenticatedLayout } from '@/components/layout/AuthenticatedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Shield, Clock, Database, Bell } from 'lucide-react';
import { SessionManager } from '@/utils/sessionManager';

const Settings = () => {
  const session = SessionManager.getSession();

  return (
    <AuthenticatedLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="bg-slate-800/50 backdrop-blur-sm border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Security Settings
            </CardTitle>
            <CardDescription className="text-purple-200">
              Manage your account security and privacy preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium">Session Timeout</h3>
                <p className="text-purple-300 text-sm">Automatically log out after 30 minutes of inactivity</p>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator className="bg-purple-500/20" />

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium">Session Lock</h3>
                <p className="text-purple-300 text-sm">Lock wallet after 5 minutes of inactivity</p>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator className="bg-purple-500/20" />

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium">Privacy Mode</h3>
                <p className="text-purple-300 text-sm">Clear sensitive data when session ends</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 backdrop-blur-sm border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Database className="w-5 h-5 mr-2" />
              Data Management
            </CardTitle>
            <CardDescription className="text-purple-200">
              Control how your data is stored and managed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-purple-900/20 rounded-lg border border-purple-500/20">
              <div className="flex items-center space-x-2 text-purple-200 mb-2">
                <Clock className="w-4 h-4" />
                <span className="font-medium">Temporary Storage Active</span>
              </div>
              <p className="text-purple-300 text-sm">
                All transaction history and sensitive data is stored temporarily and cleared when you log out.
              </p>
            </div>

            <Button
              variant="outline"
              className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10"
            >
              Clear All Temporary Data
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 backdrop-blur-sm border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white">Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-purple-300 text-sm">Email Address</label>
              <p className="text-white font-medium">{session?.email}</p>
            </div>
            <div>
              <label className="text-purple-300 text-sm">Session Started</label>
              <p className="text-white font-medium">
                {session ? new Date(session.loginTime).toLocaleString() : 'N/A'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
};

export default Settings;
