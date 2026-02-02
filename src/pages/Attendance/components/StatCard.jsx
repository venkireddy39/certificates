import React, { useId } from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const StatCard = ({ title, value, subValue, trendData = [], color = 'primary', icon: Icon }) => {
    const gradientId = useId();
    const COLORS = {
        success: { stroke: '#22c55e', fill: '#dcfce7', text: 'text-success', bg: 'bg-success' },
        danger: { stroke: '#ef4444', fill: '#fee2e2', text: 'text-danger', bg: 'bg-danger' },
        warning: { stroke: '#f59e0b', fill: '#fef3c7', text: 'text-warning', bg: 'bg-warning' },
        primary: { stroke: '#3b82f6', fill: '#dbeafe', text: 'text-primary', bg: 'bg-primary' },
        info: { stroke: '#06b6d4', fill: '#cffafe', text: 'text-info', bg: 'bg-info' }
    };

    const theme = COLORS[color] || COLORS.primary;

    return (
        <div className="card border-0 shadow-sm h-100 position-relative overflow-hidden">
            <div className="card-body p-3">
                <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                        <p className="text-muted fw-bold text-uppercase mb-1" style={{ fontSize: 11, letterSpacing: '0.5px' }}>
                            {title}
                        </p>
                        <h3 className="fw-bolder mb-0 text-dark">{value}</h3>
                        {subValue && <p className="text-muted small mb-0 mt-1">{subValue}</p>}
                    </div>
                    {Icon && (
                        <div className={`p-2 rounded-circle ${theme.bg} bg-opacity-10 ${theme.text}`}>
                            <Icon size={18} />
                        </div>
                    )}
                </div>
                {trendData && trendData.length > 0 && (
                    <div style={{ width: '100%', height: 60, marginTop: 'auto' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData}>
                                <defs>
                                    <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={theme.fill} stopOpacity={0.8} />
                                        <stop offset="95%" stopColor={theme.fill} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke={theme.stroke}
                                    strokeWidth={2}
                                    fill={`url(#${gradientId})`}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatCard;
