import React from 'react';

export default function Dashboard() {
  const stats = [
    { icon:'👥', label:'Total Users', value:'91', color:'#3b82f6' },
    { icon:'🔑', label:'Active Roles', value:'5', color:'#8b5cf6' },
    { icon:'✅', label:'Active Sessions', value:'24', color:'#10b981' },
    { icon:'📋', label:'Audit Events', value:'142', color:'#f59e0b' },
  ];

  const activities = [
    { user:'Admin', action:'Created new user', module:'User Management', time:'2 mins ago', status:'Success' },
    { user:'Kasun', action:'Updated role', module:'Role Management', time:'15 mins ago', status:'Success' },
    { user:'Nimali', action:'Login attempt', module:'Auth', time:'32 mins ago', status:'Failed' },
    { user:'Ruwan', action:'Deleted user', module:'User Management', time:'1 hour ago', status:'Success' },
  ];

  return (
    <div>
      <div style={{ marginBottom:'28px' }}>
        <h1 style={{ color:'#0f172a', fontSize:'26px', fontWeight:'700', margin:'0 0 6px' }}>Dashboard 👋</h1>
        <p style={{ color:'#64748b', margin:0 }}>Welcome back, Admin!</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'16px', marginBottom:'28px' }}>
        {stats.map((s,i) => (
          <div key={i} style={{ background:'#fff', borderRadius:'16px', padding:'24px', boxShadow:'0 2px 15px rgba(0,0,0,0.06)', border:'1px solid #e2e8f0' }}>
            <div style={{ fontSize:'32px', marginBottom:'12px' }}>{s.icon}</div>
            <div style={{ color:'#64748b', fontSize:'12px', fontWeight:'600', marginBottom:'6px' }}>{s.label.toUpperCase()}</div>
            <div style={{ color:'#0f172a', fontSize:'28px', fontWeight:'700' }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ background:'#fff', borderRadius:'16px', boxShadow:'0 2px 15px rgba(0,0,0,0.06)', border:'1px solid #e2e8f0', overflow:'hidden' }}>
        <div style={{ padding:'20px 24px', borderBottom:'1px solid #f1f5f9' }}>
          <h2 style={{ color:'#0f172a', fontSize:'16px', fontWeight:'600', margin:0 }}>Recent Activity</h2>
        </div>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ background:'#f8fafc' }}>
              {['User','Action','Module','Time','Status'].map(h => (
                <th key={h} style={{ padding:'12px 16px', textAlign:'left', color:'#64748b', fontSize:'12px', fontWeight:'600' }}>{h.toUpperCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {activities.map((a,i) => (
              <tr key={i} style={{ borderBottom:'1px solid #f1f5f9' }}>
                <td style={{ padding:'14px 16px', color:'#0f172a', fontWeight:'600', fontSize:'14px' }}>{a.user}</td>
                <td style={{ padding:'14px 16px', color:'#475569', fontSize:'14px' }}>{a.action}</td>
                <td style={{ padding:'14px 16px', color:'#475569', fontSize:'14px' }}>{a.module}</td>
                <td style={{ padding:'14px 16px', color:'#94a3b8', fontSize:'13px' }}>{a.time}</td>
                <td style={{ padding:'14px 16px' }}>
                  <span style={{ padding:'4px 12px', borderRadius:'20px', fontSize:'12px', fontWeight:'600', background: a.status==='Success'?'#dcfce7':'#fee2e2', color: a.status==='Success'?'#16a34a':'#dc2626' }}>{a.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}