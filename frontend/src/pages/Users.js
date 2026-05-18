import React, { useState } from 'react';

const initialUsers = [
  { id: 1, name: 'Admin User', email: 'admin@erp.com', role: 'Admin', status: 'Active', created: '2024-01-01' },
  { id: 2, name: 'Kasun Perera', email: 'kasun@erp.com', role: 'Finance Manager', status: 'Active', created: '2024-01-05' },
  { id: 3, name: 'Nimali Silva', email: 'nimali@erp.com', role: 'HR Staff', status: 'Inactive', created: '2024-01-08' },
  { id: 4, name: 'Ruwan Fernando', email: 'ruwan@erp.com', role: 'Procurement Staff', status: 'Active', created: '2024-01-10' },
  { id: 5, name: 'Amaya Jayawardena', email: 'amaya@erp.com', role: 'Project Manager', status: 'Active', created: '2024-01-12' },
];

const Users = () => {
  const [users, setUsers] = useState(initialUsers);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ name: '', email: '', role: 'Admin', status: 'Active' });
  const [errors, setErrors] = useState({});

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!validateEmail(form.email)) newErrors.email = 'Invalid email format';
    return newErrors;
  };

  const handleAdd = () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const newUser = { ...form, id: Date.now(), created: new Date().toISOString().split('T')[0] };
    setUsers([...users, newUser]);
    setForm({ name: '', email: '', role: 'Admin', status: 'Active' });
    setErrors({});
    setShowModal(false);
  };

  const handleOpenModal = () => {
    setForm({ name: '', email: '', role: 'Admin', status: 'Active' });
    setErrors({});
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setForm({ name: '', email: '', role: 'Admin', status: 'Active' });
    setErrors({});
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const toggleStatus = (id) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u));
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
        <div>
          <h1 style={{ color: '#0f172a', fontSize: '28px', fontWeight: '700', margin: '0 0 6px' }}>User Management 👥</h1>
          <p style={{ color: '#64748b', fontSize: '15px', margin: 0 }}>Manage all system users and their access</p>
        </div>
        <button onClick={handleOpenModal} style={{
          padding: '12px 24px', background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
          border: 'none', borderRadius: '12px', color: '#fff',
          fontWeight: '600', fontSize: '14px', cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(59,130,246,0.4)',
        }}>+ Add New User</button>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text" placeholder="🔍  Search users by name or email..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: '13px 18px', borderRadius: '12px',
            border: '1px solid #e2e8f0', fontSize: '14px',
            width: '320px', outline: 'none', background: '#fff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
        />
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 2px 15px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['User', 'Email', 'Role', 'Status', 'Created', 'Actions'].map(h => (
                <th key={h} style={{ padding: '14px 16px', textAlign: 'left', color: '#64748b', fontSize: '12px', fontWeight: '600', letterSpacing: '0.5px' }}>{h.toUpperCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(user => (
              <tr key={user.id} style={{ borderBottom: '1px solid #f1f5f9' }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '38px', height: '38px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontWeight: '700', fontSize: '15px', flexShrink: 0,
                    }}>{user.name[0]}</div>
                    <span style={{ color: '#0f172a', fontWeight: '600', fontSize: '14px' }}>{user.name}</span>
                  </div>
                </td>
                <td style={{ padding: '14px 16px', color: '#475569', fontSize: '14px' }}>{user.email}</td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{
                    padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                    background: '#eff6ff', color: '#3b82f6',
                  }}>{user.role}</span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{
                    padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                    background: user.status === 'Active' ? '#dcfce7' : '#fee2e2',
                    color: user.status === 'Active' ? '#16a34a' : '#dc2626',
                  }}>{user.status}</span>
                </td>
                <td style={{ padding: '14px 16px', color: '#94a3b8', fontSize: '13px' }}>{user.created}</td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => toggleStatus(user.id)} style={{
                      padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '500',
                      border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', color: '#475569',
                    }}>
                      {user.status === 'Active' ? '⏸ Disable' : '▶ Enable'}
                    </button>
                    <button onClick={() => handleDelete(user.id)} style={{
                      padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '500',
                      border: '1px solid #fee2e2', background: '#fff', cursor: 'pointer', color: '#ef4444',
                    }}>🗑 Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ padding: '14px 16px', background: '#f8fafc', color: '#64748b', fontSize: '13px' }}>
          Showing {filtered.length} of {users.length} users
        </div>
      </div>

      {/* Add User Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50,
          backdropFilter: 'blur(4px)',
        }}>
          <div style={{
            background: '#fff', borderRadius: '20px', padding: '36px',
            width: '100%', maxWidth: '460px', boxShadow: '0 25px 60px rgba(0,0,0,0.2)',
          }}>
            <h2 style={{ color: '#0f172a', fontSize: '20px', fontWeight: '700', margin: '0 0 24px' }}>Add New User</h2>
            
            {[
              { label: 'Full Name', key: 'name', type: 'text', placeholder: 'e.g. Kasun Perera' },
              { label: 'Email Address', key: 'email', type: 'email', placeholder: 'e.g. kasun@erp.com' },
            ].map(field => (
              <div key={field.key} style={{ marginBottom: '16px' }}>
                <label style={{ color: '#374151', fontSize: '13px', fontWeight: '500', display: 'block', marginBottom: '6px' }}>{field.label}</label>
                <input
                  type={field.type} placeholder={field.placeholder}
                  value={form[field.key]} onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  style={{
                    width: '100%', padding: '12px 14px', borderRadius: '10px',
                    border: errors[field.key] ? '1px solid #ef4444' : '1px solid #e2e8f0', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
                  }}
                />
                {errors[field.key] && (
                  <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', margin: '4px 0 0 0' }}>{errors[field.key]}</p>
                )}
              </div>
            ))}

            <div style={{ marginBottom: '16px' }}>
              <label style={{ color: '#374151', fontSize: '13px', fontWeight: '500', display: 'block', marginBottom: '6px' }}>Role</label>
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
                style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none' }}>
                {['Admin', 'Finance Manager', 'HR Staff', 'Procurement Staff', 'Project Manager', 'Asset Manager'].map(r => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button onClick={handleCloseModal} style={{
                flex: 1, padding: '13px', borderRadius: '12px',
                border: '1px solid #e2e8f0', background: '#fff',
                color: '#475569', fontWeight: '600', cursor: 'pointer', fontSize: '14px',
              }}>Cancel</button>
              <button onClick={handleAdd} style={{
                flex: 1, padding: '13px', borderRadius: '12px',
                background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
                border: 'none', color: '#fff', fontWeight: '600', cursor: 'pointer', fontSize: '14px',
              }}>Add User ✓</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
