
import { useState } from 'react';
import { Shield, Lock, Key, Smartphone, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';

interface SecurityFeature {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  icon: React.ComponentType<any>;
}

export const SecurityCenter = () => {
  const [securityFeatures, setSecurityFeatures] = useState<SecurityFeature[]>([
    {
      id: '2fa',
      name: '2-Factor Authentication',
      description: 'Add an extra layer of security with authenticator app',
      enabled: true,
      icon: Smartphone
    },
    {
      id: 'biometric',
      name: 'Biometric Lock',
      description: 'Use fingerprint or face recognition to unlock wallet',
      enabled: false,
      icon: Lock
    },
    {
      id: 'hardware',
      name: 'Hardware Wallet',
      description: 'Connect to Ledger or Trezor for maximum security',
      enabled: false,
      icon: Key
    },
    {
      id: 'multisig',
      name: 'Multi-Signature',
      description: 'Require multiple signatures for large transactions',
      enabled: false,
      icon: Shield
    }
  ]);

  const securityScore = securityFeatures.filter(f => f.enabled).length * 25;

  const toggleFeature = (featureId: string) => {
    setSecurityFeatures(prev => prev.map(feature =>
      feature.id === featureId ? { ...feature, enabled: !feature.enabled } : feature
    ));
  };

  return (
    <div className="space-y-6">
      {/* Security Score */}
      <Card className="bg-slate-800/50 backdrop-blur-sm border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Security Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-4">
            <div className="text-4xl font-bold text-white mb-2">{securityScore}/100</div>
            <Progress value={securityScore} className="h-3" />
          </div>
          <div className={`text-center p-3 rounded-lg ${
            securityScore >= 75 ? 'bg-green-500/20 text-green-400' :
            securityScore >= 50 ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-red-500/20 text-red-400'
          }`}>
            {securityScore >= 75 && <CheckCircle className="w-5 h-5 mx-auto mb-1" />}
            {securityScore < 75 && <AlertTriangle className="w-5 h-5 mx-auto mb-1" />}
            <div className="font-medium">
              {securityScore >= 75 ? 'Excellent Security' :
               securityScore >= 50 ? 'Good Security' : 'Improve Security'}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Features */}
      <Card className="bg-slate-800/50 backdrop-blur-sm border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white">Security Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {securityFeatures.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <div key={feature.id} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{feature.name}</h3>
                      <p className="text-purple-200 text-sm">{feature.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Switch
                      checked={feature.enabled}
                      onCheckedChange={() => toggleFeature(feature.id)}
                    />
                    {feature.enabled && <CheckCircle className="w-5 h-5 text-green-400" />}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Backup & Recovery */}
      <Card className="bg-slate-800/50 backdrop-blur-sm border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white">Backup & Recovery</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button className="w-full bg-purple-600 hover:bg-purple-700">
            Export Seed Phrase
          </Button>
          <Button variant="outline" className="w-full border-purple-500/30 text-purple-200 hover:bg-purple-500/10">
            Test Recovery Process
          </Button>
          <div className="p-3 bg-yellow-500/20 rounded-lg">
            <div className="flex items-center space-x-2 text-yellow-400">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">Important</span>
            </div>
            <p className="text-yellow-200 text-xs mt-1">
              Store your seed phrase securely offline. Never share it with anyone.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
