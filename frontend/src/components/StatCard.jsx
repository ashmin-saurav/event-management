import React from 'react';

export default function StatCard({ label, value, icon }) {
  return (
    <div className="stat-card">
      <span>
        {icon && <i className={`fas ${icon}`} style={{marginRight: '8px', color: '#b17afc'}}></i>}
        {label}
      </span>
      <strong>{value}</strong>
    </div>
  );
}