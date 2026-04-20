import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const KPICard = ({ title, value, trend, trendValue, icon, color }) => {
    const isPositive = trend === 'up';

    return (
        <div className="card hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className={twMerge("p-3 rounded-xl", color)}>
                    {icon}
                </div>
                <div className={clsx(
                    "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold",
                    isPositive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                )}>
                    {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {trendValue}%
                </div>
            </div>
            <div>
                <p className="text-gray-500 text-sm font-medium">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
            </div>
            <div className="mt-4 flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={twMerge("h-full rounded-full transition-all duration-1000", isPositive ? "bg-green-500 w-2/3" : "bg-red-500 w-1/3")}></div>
                </div>
                <span className="text-[10px] text-gray-400 font-semibold uppercase">Goal</span>
            </div>
        </div>
    );
};

export default KPICard;
