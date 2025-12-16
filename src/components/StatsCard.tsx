import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  color: 'info' | 'warning' | 'destructive' | 'success' | 'orange';
  active?: boolean;
  onClick?: () => void;
}

const StatsCard: React.FC<StatsCardProps> = ({
  label,
  value,
  icon: Icon,
  color,
  active,
  onClick,
}) => {
  const colorClasses = {
    info: 'bg-info/10 text-info border-info/20',
    warning: 'bg-warning/10 text-warning border-warning/20',
    destructive: 'bg-destructive/10 text-destructive border-destructive/20',
    success: 'bg-success/10 text-success border-success/20',
    orange: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  };

  const activeClasses = {
    info: 'ring-2 ring-info shadow-lg',
    warning: 'ring-2 ring-warning shadow-lg',
    destructive: 'ring-2 ring-destructive shadow-lg',
    success: 'ring-2 ring-success shadow-lg',
    orange: 'ring-2 ring-orange-500 shadow-lg',
  };

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all duration-200 hover:scale-105 border',
        colorClasses[color],
        active && activeClasses[color]
      )}
      onClick={onClick}
    >
      <CardContent className="p-3 md:p-4">
        <div className="flex items-center gap-3">
          <div className={cn('p-2 rounded-lg', colorClasses[color])}>
            <Icon className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-2xl md:text-3xl font-bold">{value}</p>
            <p className="text-xs md:text-sm opacity-80 truncate">{label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
