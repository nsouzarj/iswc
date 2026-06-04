

function WorksTab({
  works,
  token,
  workError,
  handleCreateWork,
  workTitle,
  setWorkTitle,
  iswc,
  setIswc,
  languageCode,
  setLanguageCode,
  musicalGenre,
  setMusicalGenre,
  workStatus,
  setWorkStatus,
  getStatusBadge,
  handleOpenSplitSheet,
  validateIswcChecksum
}) {
  const cleanIswc = iswc.replace(/[-.\s]/g, '').toUpperCase();
  const iswcInputEmpty = !iswc;
  const iswcFormatValid = /^T\d{10}$/.test(cleanIswc);
  const iswcChecksumValid = iswcInputEmpty || (iswcFormatValid && validateIswcChecksum(cleanIswc));

  return (
    <div style={{ display: 'grid', gridTemplateColumns: token ? '1fr 350px' : '1fr', gap: '2rem' }}>
      <div className="card-glass">
        <h3>Musical Works Catalog</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          Global music metadata registry database. Click a work to manage co-author split sheets.
        </p>
        
        {works.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-dark)' }}>No works registered.</div>
        ) : (
          <div className="table-container">
            <table className="premium-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>ISWC</th>
                  <th>Writers & Splits</th>
                  <th>Lang</th>
                  <th>Genre</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {works.map(w => (
                  <tr key={w.id}>
                    <td><strong>{w.title}</strong></td>
                    <td><code>{w.iswc || 'n/a'}</code></td>
                    <td>
                      <div className="shares-cell">
                        {w.splits && w.splits.length > 0 ? (
                          w.splits.map((s, idx) => (
                            <div key={idx} className="share-tag">
                              <span className="share-tag-name" title={s.rightsholder.fullName}>
                                {s.rightsholder.fullName}
                              </span>
                              <span className="share-tag-info">
                                <span className="share-badge-role">{s.role}</span>
                                <span className="share-badge-split" title="Mechanical Split">
                                  M:{Number(s.mechanicalSplit).toFixed(0)}%
                                </span>
                                <span className="share-badge-split perf" title="Performance Split">
                                  P:{Number(s.performanceSplit).toFixed(0)}%
                                </span>
                              </span>
                            </div>
                          ))
                        ) : (
                          <span style={{ color: 'var(--text-dark)', fontSize: '0.8rem' }}>No splits assigned</span>
                        )}
                      </div>
                    </td>
                    <td>{w.languageCode}</td>
                    <td>{w.musicalGenre || <span style={{ color: 'var(--text-dark)' }}>n/a</span>}</td>
                    <td>{getStatusBadge(w.status)}</td>
                    <td>
                      <button className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }} onClick={() => handleOpenSplitSheet(w)}>
                        📊 {token ? 'Manage Splits' : 'View Splits'}
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
          <h3>Add Musical Work</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem', fontSize: '0.85rem' }}>Create a new composition profile.</p>
          {workError && <div className="alert alert-danger" style={{ fontSize: '0.85rem' }}>{workError}</div>}
          
          <form onSubmit={handleCreateWork} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Work Title *</label>
              <input className="form-input" type="text" placeholder="Title (max 60 chars)" maxLength={60} value={workTitle} onChange={e => setWorkTitle(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">ISWC (T9000000000)</label>
              <input className="form-input" type="text" placeholder="T0000000000" maxLength={11} value={iswc} onChange={e => setIswc(e.target.value)} style={{ borderColor: !iswcInputEmpty && !iswcChecksumValid ? 'var(--accent-warning)' : '' }} />
              {!iswcInputEmpty && !iswcChecksumValid && (
                <span style={{ color: 'var(--accent-warning)', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                  ⚠️ Invalid ISWC checksum or format.
                </span>
              )}
            </div>
            <div className="form-group">
              <label className="form-label">Language Code (ISO 639-1)</label>
              <input className="form-input" type="text" placeholder="EN" maxLength={2} value={languageCode} onChange={e => setLanguageCode(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Musical Genre (CISAC 3 letters)</label>
              <input className="form-input" type="text" placeholder="POP" maxLength={3} value={musicalGenre} onChange={e => setMusicalGenre(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Initial Status</label>
              <select className="form-input" value={workStatus} onChange={e => setWorkStatus(e.target.value)}>
                <option value="ACTIVE">ACTIVE</option>
                <option value="CONFLICT">CONFLICT</option>
                <option value="DRAFT">DRAFT</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>Create Work</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default WorksTab;
