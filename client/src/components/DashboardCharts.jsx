import React from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from "recharts";
import { Tag } from "antd";

const PALETTE = ["#7c3aed", "#22d3ee", "#f59e0b", "#10b981", "#f43f5e", "#a78bfa"];

/* ── Shared Tooltip ── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "rgba(15,23,42,0.92)", borderRadius: 10, padding: "8px 14px",
      color: "#f1f5f9", fontSize: 13, boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
      zIndex: 1000
    }}>
      {label && <p style={{ margin: 0, fontWeight: 700, color: "#a5b4fc" }}>{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ margin: 0 }}>
          <span style={{ color: p.color || "#6366f1" }}>●</span>{" "}
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  );
};

/* ── Stat badge ── */
const StatBadge = ({ label, value, color }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
    <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>{label}</span>
    <Tag color={color} style={{ margin: 0, fontWeight: 700, fontSize: 11, borderRadius: 4 }}>{value}</Tag>
  </div>
);

const cardStyle = {
  background: "#fff",
  borderRadius: 24,
  padding: "20px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
  border: "1px solid #f1f5f9",
  transition: "all .3s cubic-bezier(0.4, 0, 0.2, 1)",
};


const hoverOn = (e) => { 
    e.currentTarget.style.boxShadow = "0 20px 40px rgba(124,58,237,0.08)"; 
    e.currentTarget.style.transform = "translateY(-4px)"; 
};
const hoverOff = (e) => { 
    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.03)"; 
    e.currentTarget.style.transform = "translateY(0)"; 
};

const ChartLabel = ({ title, badge }) => (
  <div style={{ marginBottom: 16 }}>
    <p style={{ margin: "0 0 6px", fontSize: 11, fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>
      {title}
    </p>
    <StatBadge label={badge.label} value={badge.value} color={badge.color} />
  </div>
);

const DashboardCharts = ({ candidateRadarData = [], jobPieData = [], totalCandidates = 0, totalJobs = 0 }) => {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: 24 }}>
      
      {/* Chart 1: Candidate Talent Radar */}
      <div style={cardStyle} onMouseEnter={hoverOn} onMouseLeave={hoverOff}>
        <ChartLabel title="Pipeline Analytics" badge={{ label: "Talent Pool", value: totalCandidates, color: "purple" }} />
        <div style={{ padding: '0px' }}>
            <h4 style={{ color: '#1e293b', fontSize: '15px', fontWeight: 700, margin: '0 0 16px 0' }}>Talent Distribution</h4>
            <ResponsiveContainer width="100%" height={280}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={candidateRadarData}>
                <PolarGrid stroke="#f1f5f9" />
                <PolarAngleAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} />
                <PolarRadiusAxis angle={30} domain={[0, 'auto']} stroke="#f1f5f9" tick={{ fill: '#cbd5e1', fontSize: 9 }} />
                <Radar
                name="Candidates"
                dataKey="value"
                stroke="#7c3aed"
                fill="#7c3aed"
                fillOpacity={0.4}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: 10, fontSize: 11 }} />
            </RadarChart>
            </ResponsiveContainer>
        </div>
      </div>


      {/* Chart 2: Job Status Distribution */}
      <div style={cardStyle} onMouseEnter={hoverOn} onMouseLeave={hoverOff}>
        <ChartLabel title="Hiring Insights" badge={{ label: "Active Roles", value: totalJobs, color: "blue" }} />
        <div style={{ padding: '0px' }}>
            <h4 style={{ color: '#1e293b', fontSize: '15px', fontWeight: 700, margin: '0 0 16px 0' }}>Role Allocation</h4>
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
                  {jobPieData.map((entry, index) => <Cell key={index} fill={PALETTE[index % PALETTE.length]} strokeWidth={0} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default DashboardCharts;