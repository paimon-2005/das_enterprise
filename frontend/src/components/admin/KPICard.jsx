import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { clsx } from 'clsx';

/**
 * KPICard — enterprise summary card
 * Props: title, value, trend ('up'|'down'), trendValue, icon (ReactNode), accent (tailwind bg color class)
 */
const KPICard = ({ title, value, trend, trendValue, icon, accent = 'bg-primary-50', iconColor = 'text-primary-600' }) => {
    const isPositive = trend === 'up';

    return (
        <div className="card-hover">
            {/* Icon + trend badge */}
            <div className="flex items-start justify-between mb-4">
                <div className={clsx('w-10 h-10 rounded-lg flex items-center justify-center', accent)}>
                    <span className={iconColor}>{icon}</span>
                </div>

                {trendValue !== undefined && (
                    <span className={clsx(
                        'inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md',
                        isPositive
                            ? 'bg-green-50 text-green-700'
                            : 'bg-red-50 text-red-600',
                    )}>
                        {isPositive
                            ? <TrendingUp  size={11} />
                            : <TrendingDown size={11} />}
                        {trendValue}%
                    </span>
                )}
            </div>

            {/* Value + label */}
            <p className="text-txt-secondary text-xs font-medium uppercase tracking-wide mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-txt-primary">{value}</h3>

            {/* Progress bar */}
            <div className="mt-4 h-1 bg-gray-100 rounded-full overflow-hidden">
                <div
                    className={clsx(
                        'h-full rounded-full transition-all duration-700',
                        isPositive ? 'bg-primary-600 w-2/3' : 'bg-red-400 w-1/3',
                    )}
                />
            </div>
        </div>
    );
};

export default KPICard;
