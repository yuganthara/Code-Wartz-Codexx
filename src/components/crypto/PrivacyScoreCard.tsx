import { ShieldCheck, ShieldAlert, ShieldX, Info } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface PrivacyScoreCardProps {
  score: number; // 0-100
}

export const PrivacyScoreCard = ({ score }: PrivacyScoreCardProps) => {
  let level = 'Good';
  let color = 'text-green-400';
  let pieGradient = 'url(#privacy-gradient-good)';
  let Icon = ShieldCheck;
  let description = 'Your privacy settings are strong. Keep it up!';
  let badgeBg = 'bg-green-900/60';

  if (score < 70 && score >= 40) {
    level = 'Moderate';
    color = 'text-yellow-400';
    pieGradient = 'url(#privacy-gradient-moderate)';
    Icon = ShieldAlert;
    description = 'Some privacy improvements are recommended.';
    badgeBg = 'bg-yellow-900/60';
  } else if (score < 40) {
    level = 'Low';
    color = 'text-red-400';
    pieGradient = 'url(#privacy-gradient-low)';
    Icon = ShieldX;
    description = 'Your privacy is at risk. Please review your settings.';
    badgeBg = 'bg-red-900/60';
  }

  // Pie chart calculations (bigger)
  const radius = 90;
  const stroke = 18;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const progress = Math.max(0, Math.min(score, 100));
  const offset = circumference - (progress / 100) * circumference;

  return (
    <Card className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 shadow-xl border-0 rounded-2xl">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-white text-xl font-semibold">Privacy Score</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-4 h-4 text-purple-300 cursor-pointer" />
                </TooltipTrigger>
                <TooltipContent>
                  <span>This score reflects the strength of your privacy and security settings.</span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className={`flex items-center gap-1 ${color}`}>
            <Icon className="w-5 h-5" />
            <span className="text-base font-semibold">{level}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-8">
          <div className="relative w-60 h-60 mb-8 flex items-center justify-center">
            <svg width={radius * 2} height={radius * 2} className="rotate-[-90deg]">
              <defs>
                <linearGradient id="privacy-gradient-good" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#4ade80" />
                  <stop offset="100%" stopColor="#22d3ee" />
                </linearGradient>
                <linearGradient id="privacy-gradient-moderate" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#facc15" />
                  <stop offset="100%" stopColor="#fbbf24" />
                </linearGradient>
                <linearGradient id="privacy-gradient-low" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#f87171" />
                  <stop offset="100%" stopColor="#f43f5e" />
                </linearGradient>
              </defs>
              <circle
                cx={radius}
                cy={radius}
                r={normalizedRadius}
                fill="none"
                stroke="#475569"
                strokeWidth={stroke}
              />
              <circle
                cx={radius}
                cy={radius}
                r={normalizedRadius}
                fill="none"
                stroke={pieGradient}
                strokeWidth={stroke}
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1s' }}
                filter="url(#shadow)"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-extrabold text-white leading-none mb-1 drop-shadow-lg">
                {score}<span className="text-xl font-semibold text-slate-400">/100</span>
              </span>
            </div>
          </div>
          <span className={`inline-block px-5 py-2 rounded-full text-lg font-bold ${color} ${badgeBg} mb-6 shadow-sm`}>{level}</span>
          <div className={`text-base ${color} text-center font-medium mt-2 max-w-xs`}>{description}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrivacyScoreCard; 