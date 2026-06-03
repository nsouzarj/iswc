

function SplitSheetTab({
  selectedWork,
  splits,
  rightsholders,
  token,
  splitWorkDetails,
  getStatusBadge,
  handleAddSplitRow,
  handleRemoveSplitRow,
  handleSplitChange,
  handleSaveSplits,
  totalMechanical,
  totalPerformance,
  setActiveTab
}) {
  return (
    <div className="card-glass">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>SPLIT SHEET CALCULATOR</span>
          <h2 style={{ fontSize: '1.8rem', marginTop: '0.2rem' }}>{selectedWork.title}</h2>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', alignItems: 'center' }}>
            {splitWorkDetails && getStatusBadge(splitWorkDetails.status)}
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>ISWC: <code>{selectedWork.iswc || 'NOT ASSIGNED'}</code></span>
          </div>
        </div>
        <button className="btn btn-secondary" onClick={() => setActiveTab('works')}>← Return to Catalog</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem' }}>
        {/* Splits Matrix Editor */}
        <div>
          <h3>Cotenant Splits Allocations</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.85rem' }}>
            Assign authors/publishers, select their roles, and slide to set splits. Rules: Sum of mechanical & performance splits must total 100% for ACTIVE registry.
          </p>
          
          <div className="split-matrix">
            {splits.map((s, idx) => (
              <div className="split-row" key={idx}>
                <div className="form-group" style={{ flex: 2, marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Rightsholder</label>
                  <select className="form-input" value={s.rightsholderId} onChange={e => handleSplitChange(idx, 'rightsholderId', e.target.value)} disabled={!token}>
                    <option value="">-- Choose Rightsholder --</option>
                    {rightsholders.map(rh => (
                      <option key={rh.id} value={rh.id}>{rh.fullName} ({rh.ipiNameNumber || 'No IPI'})</option>
                    ))}
                  </select>
                </div>

                <div className="form-group" style={{ width: '80px', marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Role</label>
                  <select className="form-input" value={s.role} onChange={e => handleSplitChange(idx, 'role', e.target.value)} disabled={!token}>
                    <option value="CA">CA</option>
                    <option value="AR">AR</option>
                    <option value="E">E</option>
                  </select>
                </div>

                <div className="form-group" style={{ flex: 3, marginBottom: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Mechanical Split</label>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-primary)' }}>{s.mechanicalSplit.toFixed(2)}%</span>
                  </div>
                  <input className="split-slider" type="range" min="0" max="100" step="0.5" value={s.mechanicalSplit} onChange={e => handleSplitChange(idx, 'mechanicalSplit', e.target.value)} disabled={!token} />
                </div>

                <div className="form-group" style={{ flex: 3, marginBottom: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Performance Split</label>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-secondary)' }}>{s.performanceSplit.toFixed(2)}%</span>
                  </div>
                  <input className="split-slider" type="range" min="0" max="100" step="0.5" value={s.performanceSplit} onChange={e => handleSplitChange(idx, 'performanceSplit', e.target.value)} disabled={!token} />
                </div>

                {token && (
                  <button className="btn btn-danger" style={{ alignSelf: 'flex-end', height: '2.5rem', padding: '0.5rem 1rem' }} onClick={() => handleRemoveSplitRow(idx)}>
                    🗑️
                  </button>
                )}
              </div>
            ))}
          </div>

          {token && (
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
              <button className="btn btn-secondary" onClick={handleAddSplitRow}>+ Add Stakeholder</button>
              <button className="btn btn-primary" onClick={handleSaveSplits}>💾 Save Split Sheet</button>
            </div>
          )}
        </div>

        {/* Status Board */}
        <div className="card-glass" style={{ height: 'fit-content', background: 'rgba(2, 6, 23, 0.4)' }}>
          <h3>Integrity Status Board</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.85rem' }}>Real-time verification of CWR requirements.</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Mechanical Splits Total:</span>
                <strong style={{ color: totalMechanical === 100 ? '#22c55e' : 'var(--accent-warning)' }}>{totalMechanical.toFixed(2)}%</strong>
              </div>
              <div style={{ width: '100%', height: '8px', background: '#020617', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(totalMechanical, 100)}%`, height: '100%', background: totalMechanical === 100 ? '#22c55e' : 'var(--accent-warning)' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Performance Splits Total:</span>
                <strong style={{ color: totalPerformance === 100 ? '#22c55e' : 'var(--accent-warning)' }}>{totalPerformance.toFixed(2)}%</strong>
              </div>
              <div style={{ width: '100%', height: '8px', background: '#020617', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(totalPerformance, 100)}%`, height: '100%', background: totalPerformance === 100 ? '#22c55e' : 'var(--accent-warning)' }}></div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '1rem', marginTop: '0.5rem' }}>
              <h5 style={{ marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>DECISION CONSEQUENCES</h5>
              {totalMechanical === 100 && totalPerformance === 100 ? (
                <div style={{ fontSize: '0.85rem', color: '#86efac' }}>
                  ✅ **Ready for Submissions**: The splits add up to exactly 100%. The work will be marked as **ACTIVE** and ready to compile into a CWR flat file block!
                </div>
              ) : (
                <div style={{ fontSize: '0.85rem', color: '#fde047' }}>
                  ⚠️ **Discrepancy Warning**: Current allocations do not sum to 100.00%. Saving this will set the work status to **CONFLICT**, preventing direct CWR batch generation until re-balanced.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SplitSheetTab;
