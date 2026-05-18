import React, { useState } from 'react';

const initialRoles = [
  { id: 1, name: 'Admin', description: 'Full system access', users: 1, permissions: ['All Modules', 'User Management', 'System Config'] },
  { id: 2, name: 'Finance Manager', description: 'Access to finance module', users: 3, permissions: ['Finance Module', 'Reports'] },
  { id: 3, name: 'HR Staff', description: 'Access to HR module', users: 8, permissions: ['HR Module', 'Employee Records'] },
  { id: 4, name: 'Procurement Staff', description: 'Access to procurement module', users: 5, permissions: ['Procurement Module', 'Vendor Management'] },
  { id: 5, name: 'Project Manager', description: 'Access to project module', users: 4, permissions: ['Project Module', 'Task Management'] },
];

const Roles = () => {
  const [roles, setRoles] = useState(initialRoles);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });

  const handleAdd = () => {
    if (!form.name) return;
    setRoles([...roles, { ...form, id: Date.now(), users: 0, permissions: [] }]);
    setForm({ name: '', description: '' });
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this role?')) setRoles(roles.filter(r => r.id !== id));
  };

  const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
        <div>
          <h1 style={{ color: '#0f172a', fontSize: '28px', fontWeight: '700', margin: '0 0 6px' }}>Role Management 🔑</h1>
          <p style={{ color: '#64748b', fontSize: '15px', margin: 0 }}>Define roles and control access permissions</p>
        </div>
        <button onClick={() => setShowModal(true)} style={{
          padding: '12px 24px', background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
          border: 'none', borderRadius: '12px', color: '#fff',
          fontWeight: '600', fontSize: '14px', cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(59,130,246,0.4)',
        }}>+ Add New Role</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {roles.map((role, i) => (
          <div key={role.id} style={{
            background: '#fff', borderRadius: '16px', padding: '24px',
            boxShadow: '0 2px 15px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0',
            transition: 'transform 0.2s',
          }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '14px',
                background: `${colors[i % colors.length]}20`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px',
              }}>🔐</div>
              <button onClick={() => handleDelete(role.id)} style={{
                padding: '6px 10px', borderRadius: '8px', fontSize: '12px',
                border: '1px solid #fee2e2', background: '#fff', cursor: 'pointer', color: '#ef4444',
              }}>🗑</button>
            </div>

            <h3 style={{ color: '#0f172a', fontSize: '16px', fontWeight: '700', margin: '0 0 6px' }}>{role.name}</h3>
            <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 16px' }}>{role.description}</p>

            <div style={{ marginBottom: '16px' }}>
              {role.permissions.map((p, j) => (
                <span key={j} style={{
                  display: 'inline-block', padding: '3px 10px', borderRadius: '20px',
                  background: `${colors[i % colors.length]}15`, color: colors[i % colors.length],
                  fontSize: '11px', fontWeight: '600', margin: '2px',
                }}>{p}</span>
              ))}
            </div>

            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 14px', background: '#f8fafc', borderRadius: '10px',
            }}>
              <span style={{ fontSize: '16px' }}>👤</span>
              <span style={{ color: '#475569', fontSize: '13px', fontWeight: '500' }}>{role.users} users assigned</span>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50,
          backdropFilter: 'blur(4px)',
        }}>
          <div style={{ background: '#fff', borderRadius: '20px', padding: '36px', width: '100%', maxWidth: '420px' }}>
            <h2 style={{ color: '#0f172a', fontSize: '20px', fontWeight: '700', margin: '0 0 24px' }}>Add New Role</h2>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ color: '#374151', fontSize: '13px', fontWeight: '500', display: 'block', marginBottom: '6px' }}>Role Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Asset Manager"
                style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ color: '#374151', fontSize: '13px', fontWeight: '500', display: 'block', marginBottom: '6px' }}>Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe what this role can do..."
                rows={3}
                style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none', resize: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: '13px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#fff', color: '#475569', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleAdd} style={{ flex: 1, padding: '13px', borderRadius: '12px', background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', border: 'none', color: '#fff', fontWeight: '600', cursor: 'pointer' }}>Add Role ✓</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Roles;
