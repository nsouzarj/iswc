

function DashboardTab({
  rightsholders,
  works,
  token,
  loginUser,
  setLoginUser,
  loginPass,
  setLoginPass,
  loginError,
  handleLogin
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
        <div className="card-glass">
          <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>TOTAL RIGHTS HOLDERS</h4>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-primary)' }}>{rightsholders.length}</div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-dark)' }}>Registered authors & publishers</p>
        </div>
        <div className="card-glass">
          <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>MUSICAL WORKS</h4>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-secondary)' }}>{works.length}</div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-dark)' }}>Total tracked compositions</p>
        </div>
        <div className="card-glass">
          <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>ACTIVE REGISTRIES</h4>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#22c55e' }}>
            {works.filter(w => w.status === 'ACTIVE').length}
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-dark)' }}>Verified 100% split balance</p>
        </div>
        <div className="card-glass">
          <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>CONFLICT DISCREPANCIES</h4>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-warning)' }}>
            {works.filter(w => w.status === 'CONFLICT').length}
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-dark)' }}>Awaiting split revisions</p>
        </div>
      </div>

      {/* Login Widget (Conditional) */}
      {!token && (
        <div className="card-glass" style={{ maxWidth: '450px', margin: '0 auto', width: '100%' }}>
          <h3 style={{ marginBottom: '1.25rem', textAlign: 'center' }}>🔒 Authenticate to Register & Edit</h3>
          {loginError && <div className="alert alert-danger" style={{ fontSize: '0.85rem' }}>{loginError}</div>}
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input className="form-input" type="text" placeholder="e.g. admin" value={loginUser} onChange={e => setLoginUser(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" placeholder="••••••••" value={loginPass} onChange={e => setLoginPass(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>Sign In</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default DashboardTab;
