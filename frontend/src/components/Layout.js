import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';

export default function Layout({ onLogout }) {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => { onLogout(); navigate('/login'); };

  const navItems = [
    { path:'/dashboard', icon:'📊', label:'Dashboard ' },
    { path:'/users', icon:'👥', label:'User Management' },
    { path:'/roles', icon:'🔑', label:'Role Management' },
    { path:'/audit-logs', icon:'📋', label:'Audit Logs' },
  ];

  return (
    <div style={{ display:'flex', minHeight:'100vh', fontFamily:'sans-serif', background:'#f0f4f8' }}>
      <aside style={{ width:open?'240px':'64px', background:'linear-gradient(160deg,#0f172a,#1e3a5f)', display:'flex', flexDirection:'column', transition:'width 0.3s', boxShadow:'4px 0 20px rgba(0,0,0,0.3)' }}>
        <div style={{ padding:'24px 16px', borderBottom:'1px solid rgba(255,255,255,0.1)', display:'flex', alignItems:'center', gap:'12px' }}>
          <span style={{ fontSize:'24px' }}>⚙️</span>
          {open && <div><div style={{ color:'#fff', fontWeight:'700', fontSize:'15px' }}>ERP Admin</div><div style={{ color:'#94a3b8', fontSize:'11px' }}>Management Portal</div></div>}
        </div>
        <nav style={{ padding:'16px 8px', flex:1 }}>
          {navItems.map(item => (
            <NavLink key={item.path} to={item.path} style={({ isActive }) => ({
              display:'flex', alignItems:'center', gap:'12px', padding:'12px', borderRadius:'10px',
              marginBottom:'4px', textDecoration:'none',
              background: isActive ? 'linear-gradient(135deg,#3b82f6,#06b6d4)' : 'transparent',
              color: isActive ? '#fff' : '#94a3b8',
            })}>
              <span style={{ fontSize:'18px', flexShrink:0 }}>{item.icon}</span>
              {open && <span style={{ fontSize:'14px', fontWeight:'500' }}>{item.label}</span>}
            </NavLink>
          ))}
        </nav>
        <div style={{ padding:'12px 8px', borderTop:'1px solid rgba(255,255,255,0.1)' }}>
          <button onClick={() => setOpen(!open)} style={{ width:'100%', padding:'10px', borderRadius:'10px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'#94a3b8', cursor:'pointer', marginBottom:'8px', fontSize:'14px' }}>
            {open ? '◀ Collapse' : '▶'}
          </button>
          <button onClick={handleLogout} style={{ width:'100%', padding:'10px', borderRadius:'10px', background:'rgba(239,68,68,0.15)', border:'1px solid rgba(239,68,68,0.3)', color:'#f87171', cursor:'pointer', fontSize:'14px', fontWeight:'500' }}>
            {open ? '🚪 Logout' : '🚪'}
          </button>
        </div>
      </aside>
      <main style={{ flex:1, padding:'32px', overflowY:'auto' }}>
        <Outlet />
      </main>
    </div>
  );
}