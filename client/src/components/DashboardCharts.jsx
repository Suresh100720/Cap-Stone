import React from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";
import { Tag } from "antd";

const PALETTE = ["#7c3aed", "#22d3ee", "#f59e0b", "#10b981", "#f43f5e", "#a78bfa"];

/* ── Shared Tooltip ── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0f172ae0] rounded-xl px-3.5 py-2 text-[#f1f5f9] text-[13px] shadow-[0_8px_32px_rgba(0,0,0,0.25)] z-[1000] backdrop-blur-sm">
      {label && <p className="m-0 font-bold text-[#a5b4fc]">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} className="m-0">
          <span style={{ color: p.color || "#6366f1" }}>●</span>{" "}
          {p.name}: <strong className="font-bold">{p.value}</strong>
        </p>
      ))}
    </div>
  );
};

/* ── Stat badge ── */
const StatBadge = ({ label, value, color }) => (
  <div className="flex justify-between items-center mb-1.5">
    <span className="text-[11px] text-[#94a3b8] font-semibold">{label}</span>
    <Tag color={color} className="!m-0 !font-bold !text-[11px] !rounded !px-2">
      {value}
    </Tag>
  </div>
);

const cardClassName = "bg-white rounded-[24px] p-5 border border-[#f1f5f9] shadow-[0_4px_12px_rgba(0,0,0,0.03)] transition-all duration-300 hover:shadow-[0_20px_40px_rgba(124,58,237,0.08)] hover:-translate-y-1";

const ChartLabel = ({ title, badge }) => (
  <div className="mb-4">
    <p className="m-0 mb-1.5 text-[11px] font-extrabold text-[#64748b] uppercase tracking-wider">
      {title}
    </p>
    <StatBadge label={badge.label} value={badge.value} color={badge.color} />
  </div>
);

const DashboardCharts = ({ candidateRadarData = [], jobPieData = [], totalCandidates = 0, totalJobs = 0 }) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      
      {/* Chart 1: Candidate Talent Distribution (Simple Bar Chart) */}
      <div className={cardClassName}>
        <ChartLabel title="Pipeline Analytics" badge={{ label: "Talent Pool", value: totalCandidates, color: "purple" }} />
        <div>
          <h4 className="text-[#1e293b] text-[15px] font-bold m-0 mb-4">Talent Distribution</h4>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={candidateRadarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#cbd5e1' }} 
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
              <Bar 
                dataKey="value" 
                fill="#7c3aed" 
                radius={[6, 6, 0, 0]} 
                barSize={40}
              >
                {candidateRadarData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PALETTE[index % PALETTE.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Job Status Distribution */}
      <div className={cardClassName}>
        <ChartLabel title="Hiring Insights" badge={{ label: "Active Roles", value: totalJobs, color: "blue" }} />
        <div>
          <h4 className="text-[#1e293b] text-[15px] font-bold m-0 mb-4">Role Allocation</h4>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie 
                data={jobPieData} 
                cx="50%" 
                cy="50%" 
                labelLine={false}
                outerRadius={85} 
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {jobPieData.map((entry, index) => (
                  <Cell key={index} fill={PALETTE[index % PALETTE.length]} strokeWidth={0} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconType="circle" 
                iconSize={8} 
                wrapperStyle={{ fontSize: 11, paddingTop: '10px' }} 
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default DashboardCharts;