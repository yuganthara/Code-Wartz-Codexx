
import { Link, useLocation } from 'react-router-dom';
import { Home, PieChart, TrendingUp, BarChart3, Settings, LogOut, Shield, Bell, Users, Bot, Image, Activity } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface NavigationProps {
  onLogout: () => void;
}

export const Navigation = ({ onLogout }: NavigationProps) => {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/portfolio', label: 'Portfolio', icon: PieChart },
    { path: '/trading', label: 'Trading', icon: TrendingUp },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/alerts', label: 'Alerts', icon: Bell },
    { path: '/social', label: 'Social', icon: Users },
    { path: '/security', label: 'Security', icon: Shield },
    { path: '/nft', label: 'NFT', icon: Image },
    { path: '/defi', label: 'DeFi', icon: Activity },
    { path: '/chatbot', label: 'Chatbot', icon: Bot },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <Card className="bg-slate-800/50 backdrop-blur-sm border-purple-500/20 p-4">
      <nav className="flex flex-wrap gap-2">
        {navItems.map(({ path, label, icon: Icon }) => (
          <Link
            key={path}
            to={path}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              location.pathname === path
                ? 'bg-purple-500/20 text-purple-200 border border-purple-500/30'
                : 'text-purple-300 hover:bg-purple-500/10 hover:text-purple-200'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="text-sm font-medium">{label}</span>
          </Link>
        ))}
      </nav>
    </Card>
  );
};
