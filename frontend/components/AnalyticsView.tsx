
import React, { useMemo } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import { Feedback, Sentiment } from '../types';

interface AnalyticsViewProps {
    feedbacks: Feedback[];
    onBack: () => void;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
const SENTIMENT_COLORS = {
    Positive: '#4ade80', // green-400
    Neutral: '#94a3b8',  // slate-400
    Negative: '#f87171'  // red-400
};

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ feedbacks, onBack }) => {

    // Prepare Data: Sentiment Trend (Last 7 Days)
    const trendData = useMemo(() => {
        const data: Record<string, any> = {};
        // Initialize last 7 days
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const key = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
            data[key] = { date: key, Positive: 0, Negative: 0, Neutral: 0 };
        }

        feedbacks.forEach(f => {
            const dateKey = new Date(f.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
            if (data[dateKey]) {
                const s = f.analysis?.sentiment || 'Neutral';
                if (s === 'Positive' || s === 'Negative' || s === 'Neutral') {
                    data[dateKey][s]++;
                }
            }
        });
        return Object.values(data);
    }, [feedbacks]);

    // Prepare Data: Category Distribution
    const categoryData = useMemo(() => {
        const counts: Record<string, number> = {};
        feedbacks.forEach(f => {
            const cat = f.categoryGroup || 'Uncategorized';
            counts[cat] = (counts[cat] || 0) + 1;
        });
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [feedbacks]);

    return (
        <div className="w-full h-full flex flex-col overflow-y-auto custom-scrollbar p-6 md:p-12 animate-fade-in-up">

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="font-display italic text-4xl text-white mb-2">Detailed Analytics</h2>
                    <p className="font-mono text-xs uppercase tracking-widest text-white/40">Real-time Visualization Engine</p>
                </div>
                <button
                    onClick={onBack}
                    className="px-4 py-2 border border-white/10 hover:bg-white/5 rounded-sm flex items-center gap-2 transition-colors"
                >
                    <span className="material-symbols-outlined text-sm text-white/60">arrow_back</span>
                    <span className="font-mono text-xs uppercase text-white/80">Back to List</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

                {/* Sentiment Trend Chart */}
                <div className="bg-white/5 border border-white/5 rounded-sm p-6">
                    <h3 className="font-mono text-xs uppercase tracking-widest text-white/40 mb-6">7-Day Sentiment Trend</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} />
                                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)' }}
                                    itemStyle={{ fontSize: '12px' }}
                                />
                                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
                                <Line type="monotone" dataKey="Positive" stroke={SENTIMENT_COLORS.Positive} strokeWidth={2} dot={false} />
                                <Line type="monotone" dataKey="Neutral" stroke={SENTIMENT_COLORS.Neutral} strokeWidth={2} dot={false} />
                                <Line type="monotone" dataKey="Negative" stroke={SENTIMENT_COLORS.Negative} strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Category Distribution Chart */}
                <div className="bg-white/5 border border-white/5 rounded-sm p-6">
                    <h3 className="font-mono text-xs uppercase tracking-widest text-white/40 mb-6">Feedback Distribution by Source</h3>
                    <div className="h-[300px] w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                    stroke="none"
                                    fontSize={10}
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>

            {/* Volume Bar Chart */}
            <div className="bg-white/5 border border-white/5 rounded-sm p-6">
                <h3 className="font-mono text-xs uppercase tracking-widest text-white/40 mb-6">Total Feedback Volume</h3>
                <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={trendData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                            <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} />
                            <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} />
                            <Tooltip
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)' }}
                            />
                            <Bar dataKey="Positive" stackId="a" fill={SENTIMENT_COLORS.Positive} barSize={20} />
                            <Bar dataKey="Neutral" stackId="a" fill={SENTIMENT_COLORS.Neutral} barSize={20} />
                            <Bar dataKey="Negative" stackId="a" fill={SENTIMENT_COLORS.Negative} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </div>
    );
};
