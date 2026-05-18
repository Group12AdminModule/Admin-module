import React, { useState } from 'react';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTimeout(() => {
      if (username === 'admin' && password === 'admin123') {
        onLogin('mock-jwt-token-12345');
      } else {
        setError('Wrong credentials! Use admin / admin123');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#0f172a,#1e3a5f)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'sans-serif' }}>
      <div style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'24px', padding:'48px 40px', width:'100%', maxWidth:'400px', boxShadow:'0 25px 60px rgba(0,0,0,0.5)' }}>
        <div style={{ textAlign:'center', marginBottom:'36px' }}>
          <div style={{ fontSize:'48px', marginBottom:'16px' }}>⚙️</div>
          <h1 style={{ color:'#fff', fontSize:'24px', fontWeight:'700', margin:'0 0 8px' }}>ERP Admin Portal</h1>
          <p style={{ color:'#64748b', fontSize:'14px', margin:0 }}>Sign in to manage your system</p>
        </div>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom:'16px' }}>
            <label style={{ color:'#94a3b8', fontSize:'13px', display:'block', marginBottom:'8px' }}>USERNAME</label>
            <input type="text" value={username} onChange={e=>setUsername(e.target.value)} placeholder="Enter username" required
              style={{ width:'100%', padding:'14px', background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'12px', color:'#fff', fontSize:'15px', outline:'none', boxSizing:'border-box' }} />
          </div>
          <div style={{ marginBottom:'24px' }}>
            <label style={{ color:'#94a3b8', fontSize:'13px', display:'block', marginBottom:'8px' }}>PASSWORD</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter password" required
              style={{ width:'100%', padding:'14px', background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'12px', color:'#fff', fontSize:'15px', outline:'none', boxSizing:'border-box' }} />
          </div>
          {error && <div style={{ background:'rgba(239,68,68,0.15)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:'10px', padding:'12px', marginBottom:'16px', color:'#f87171', fontSize:'13px' }}>⚠️ {error}</div>}
          <button type="submit" disabled={loading}
            style={{ width:'100%', padding:'15px', background:'linear-gradient(135deg,#3b82f6,#06b6d4)', border:'none', borderRadius:'12px', color:'#fff', fontSize:'16px', fontWeight:'600', cursor:'pointer' }}>
            {loading ? '⏳ Signing in...' : 'Sign In →'}
          </button>
        </form>
        <p style={{ textAlign:'center', color:'#475569', fontSize:'12px', marginTop:'20px' }}>Demo: admin / admin123</p>
      </div>
    </div>
  );
}