

function RightsholdersTab({
  rightsholders,
  token,
  rightsholderError,
  handleCreateRightsholder,
  fullName,
  setFullName,
  email,
  setEmail,
  ipiNameNumber,
  setIpiNameNumber,
  isni,
  setIsni,
  setSelectedAuthorPortfolio
}) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: token ? '1fr 350px' : '1fr', gap: '2rem' }}>
      <div className="card-glass">
        <h3>Writers & Publishers Registry</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          List of creators and interested parties with valid IPI Name Numbers and ISNI credentials.
        </p>
        
        {rightsholders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-dark)' }}>No rightsholders registered.</div>
        ) : (
          <div className="table-container">
            <table className="premium-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>IPI Name Number</th>
                  <th>ISNI</th>
                  <th style={{ textAlign: 'center' }}>Portfolio</th>
                </tr>
              </thead>
              <tbody>
                {rightsholders.map(r => (
                  <tr key={r.id}>
                    <td><strong>{r.fullName}</strong></td>
                    <td>{r.email || <span style={{ color: 'var(--text-dark)' }}>n/a</span>}</td>
                    <td>{r.ipiNameNumber || <span style={{ color: 'var(--text-dark)' }}>n/a</span>}</td>
                    <td>{r.isni || <span style={{ color: 'var(--text-dark)' }}>n/a</span>}</td>
                    <td style={{ textAlign: 'center' }}>
                      <button className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }} onClick={() => setSelectedAuthorPortfolio(r)}>
                        📂 View Catalog
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {token && (
        <div className="card-glass" style={{ height: 'fit-content' }}>
          <h3>Add Rightsholder</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem', fontSize: '0.85rem' }}>Insert CISAC-compliant identifiers.</p>
          {rightsholderError && <div className="alert alert-danger" style={{ fontSize: '0.85rem' }}>{rightsholderError}</div>}
          
          <form onSubmit={handleCreateRightsholder} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input className="form-input" type="text" placeholder="John Doe" value={fullName} onChange={e => setFullName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" placeholder="john.doe@domain.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">IPI Name Number (11 digits)</label>
              <input className="form-input" type="text" placeholder="00012345678" maxLength={11} value={ipiNameNumber} onChange={e => setIpiNameNumber(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">ISNI (16 chars)</label>
              <input className="form-input" type="text" placeholder="0000000123456789" maxLength={16} value={isni} onChange={e => setIsni(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>Register Party</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default RightsholdersTab;
