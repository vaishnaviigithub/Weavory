import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description?: string;
  bgColor?: string;
  iconColor?: string;
  isButton?: boolean;
  onClick?: () => void;
  trend?: string;
  trendUp?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  description,
  bgColor = 'bg-white',
  iconColor = 'text-amber-800',
  isButton = false,
  onClick,
  trend,
  trendUp
}) => {
  const CardComponent = isButton ? 'button' : 'div';
  const props = isButton ? { onClick, type: 'button' } : {};

  return (
    <CardComponent
      {...props}
      className={`${bgColor} rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-200 ${
        isButton ? 'cursor-pointer w-full text-left' : ''
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
          <div className="text-2xl font-bold text-gray-800 mb-1">{value}</div>
          {description && <p className="text-xs text-gray-500">{description}</p>}
          
          {trend && (
            <div className="flex items-center mt-2">
              {trendUp ? (
                <TrendingUp size={14} className="text-green-500 mr-1" />
              ) : (
                <TrendingDown size={14} className="text-red-500 mr-1" />
              )}
              <span className={`text-xs font-medium ${trendUp ? 'text-green-500' : 'text-red-500'}`}>
                {trend}
              </span>
            </div>
          )}
        </div>
        <div className={`${iconColor} bg-opacity-10 p-3 rounded-lg ${iconColor.replace('text', 'bg').replace('-800', '-100')}`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
      </div>
    </CardComponent>
  );
};

export default StatsCard;