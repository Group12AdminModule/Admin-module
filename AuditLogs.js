import React, { useState } from 'react';

const logs = [
  { id: 1, user: 'Admin', action: 'CREATE_USER', module: 'User Management', details: 'Created user: Kasun Perera', time: '2024-03-15 09:12:34', status: 'Success' },
  { id: 2, user: 'Admin', action: 'UPDATE_ROLE', module: 'Role Management', details: 'Updated role: Finance Manager permissions', time: '2024-03-15 09:45:11', status: 'Success' },
  { id: 3, user: 'Nimali', action: 'LOGIN_FAILED', module: 'Authentication', details: 'Invalid password attempt', time: '2024-03-15 10:02:55', status: 'Failed' },
  { id: 4, user: 'Admin', action: 'DELETE_USER', module: 'User Management', details: 'Deleted user: Old Employee', time: '2024-03-15 10:30:00', status: 'Success' },
  { id: 5, user: 'Kasun', action: 'LOGIN', module: 'Authentication', details: 'Successful login from 192.168.1.5', time: '2024-03-15 11:00:22', status: 'Success' },
  { id: 6, user: 'Ruwan', action: 'UPDATE_CONFIG', module: 'System Config', details: 'Changed session timeout to 30 mins', time: '2024-03-15 11:15:44', status: 'Success' },
  { id: 7, user: 'Amaya', action: 'CHANGE_PASSWORD', module: 'Authentication', details: 'Password changed successfully', time: '2024-03-15 12:00:01', status: 'Success' },
  { id: 8, user: 'Unknown', action: 'LOGIN_FAILED', module: 'Authentication', details: 'Brute force attempt detected', time: '2024-03-15 12:30:00', status: 'Failed' },
];

const actionColors = {
  CREATE_USER: { bg: '#dcfce7', color: '#16a34a' },
  UPDATE_ROLE: { bg: '#dbeafe', color: '#2563eb' },
  LOGIN_FAILED: { bg: '#fee2e2', color: '#dc2626' },
  DELETE_USER: { bg: '#fee2e2', color: '#dc2626' },
  LOGIN: { bg: '#dcfce7', color: '#16a34a' },
  UPDATE_CONFIG: { bg: '#fef9c3', color: '#ca8a04' },
  CHANGE_PASSWORD: { bg: '#f3e8ff', color: '#9333ea' },
};

const AuditLogs = () => {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = logs.filter(l =>
    (filter === 'All' || l.status === filter) &&
    (l.user.toLowerCase().includes(search.toLowerCase()) || l.action.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ color: '#0f172a', fontSize: '28px', fontWeight: '700', margin: '0 0 6px' }}>Audit Logs 📋</h1>
        <p style={{ color: '#64748b', fontSize: '15px', margin: 0 }}>Track all system events and user actions</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input
          type="text" placeholder="🔍  Search by user or action..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', width: '280px', outline: 'none' }}
        />
        {['All', 'Success', 'Failed'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '12px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer',
            border: filter === f ? 'none' : '1px solid #e2e8f0',
            background: filter === f ? 'linear-gradient(135deg, #3b82f6, #06b6d4)' : '#fff',
            color: filter === f ? '#fff' : '#475569',
          }}>{f}</button>
        ))}
      </div>

      {/* Logs Table */}
      <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 2px 15px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['User', 'Action', 'Module', 'Details', 'Time', 'Status'].map(h => (
                <th key={h} style={{ padding: '14px 16px', textAlign: 'left', color: '#64748b', fontSize: '12px', fontWeight: '600', letterSpacing: '0.5px' }}>{h.toUpperCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(log => {
              const ac = actionColors[log.action] || { bg: '#f1f5f9', color: '#475569' };
              return (
                <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '32px', height: '32px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontWeight: '700', fontSize: '13px',
                      }}>{log.user[0]}</div>
                      <span style={{ color: '#0f172a', fontWeight: '600', fontSize: '13px' }}>{log.user}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', background: ac.bg, color: ac.color, letterSpacing: '0.5px' }}>
                      {log.action}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#475569', fontSize: '13px' }}>{log.module}</td>
                  <td style={{ padding: '14px 16px', color: '#64748b', fontSize: '12px', maxWidth: '220px' }}>{log.details}</td>
                  <td style={{ padding: '14px 16px', color: '#94a3b8', fontSize: '12px', whiteSpace: 'nowrap' }}>{log.time}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                      background: log.status === 'Success' ? '#dcfce7' : '#fee2e2',
                      color: log.status === 'Success' ? '#16a34a' : '#dc2626',
                    }}>{log.status}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div style={{ padding: '14px 16px', background: '#f8fafc', color: '#64748b', fontSize: '13px' }}>
          Showing {filtered.length} of {logs.length} events
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;
