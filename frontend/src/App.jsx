import React, { useState, useEffect } from 'react';

const API_BASE = 'http://' + window.location.hostname + ':8080/api';

function App() {
  // Authentication & Session States
  const [token, setToken] = useState(localStorage.getItem('iswc_token') || '');
  const [username, setUsername] = useState(localStorage.getItem('iswc_username') || '');
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');

  // App Navigation state
  const [activeTab, setActiveTab] = useState('dashboard');

  // Business Data States
  const [rightsholders, setRightsholders] = useState([]);
  const [works, setWorks] = useState([]);
  
  // Selected Work & Split Sheet States
  const [selectedWork, setSelectedWork] = useState(null);
  const [splits, setSplits] = useState([]); // Array of { rightsholderId, role, mechanicalSplit, performanceSplit, publisherSplit }
  const [splitWorkDetails, setSplitWorkDetails] = useState(null);
  const [selectedAuthorPortfolio, setSelectedAuthorPortfolio] = useState(null);

  // Form Input States
  // Rightsholder Form
  const [ipiNameNumber, setIpiNameNumber] = useState('');
  const [isni, setIsni] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [rightsholderError, setRightsholderError] = useState('');

  // Musical Work Form
  const [iswc, setIswc] = useState('');
  const [workTitle, setWorkTitle] = useState('');
  const [languageCode, setLanguageCode] = useState('EN');
  const [musicalGenre, setMusicalGenre] = useState('');
  const [workStatus, setWorkStatus] = useState('ACTIVE');
  const [workError, setWorkError] = useState('');

  // Global Notification States
  const [successMsg, setSuccessMsg] = useState('');
  const [globalError, setGlobalError] = useState('');

  // Load Initial Public Data
  useEffect(() => {
    fetchRightsholders();
    fetchWorks();
  }, []);

  // Clear messages after timeout
  useEffect(() => {
    if (successMsg) {
      const t = setTimeout(() => setSuccessMsg(''), 5000);
      return () => clearTimeout(t);
    }
  }, [successMsg]);

  useEffect(() => {
    if (globalError) {
      const t = setTimeout(() => setGlobalError(''), 7000);
      return () => clearTimeout(t);
    }
  }, [globalError]);

  // API Call Helpers
  const getHeaders = (contentType = 'application/json') => {
    const headers = {};
    if (contentType) {
      headers['Content-Type'] = contentType;
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  const fetchRightsholders = async () => {
    try {
      const res = await fetch(`${API_BASE}/rightsholders`);
      if (res.ok) {
        const data = await res.json();
        setRightsholders(data);
      } else {
        setGlobalError('Failed to fetch rightsholders from backend.');
      }
    } catch (e) {
      setGlobalError('Backend connection error while fetching rightsholders.');
    }
  };

  const fetchWorks = async () => {
    try {
      const res = await fetch(`${API_BASE}/works`);
      if (res.ok) {
        const data = await res.json();
        setWorks(data);
      } else {
        setGlobalError('Failed to fetch works from backend.');
      }
    } catch (e) {
      setGlobalError('Backend connection error while fetching works.');
    }
  };

  const fetchWorkDetailsAndSplits = async (workId) => {
    try {
      const res = await fetch(`${API_BASE}/works/${workId}`);
      if (res.ok) {
        const data = await res.json();
        setSplitWorkDetails(data.work);
        
        // Populate splits list
        if (data.splits && data.splits.length > 0) {
          setSplits(data.splits.map(s => ({
            rightsholderId: s.rightsholder.id,
            role: s.role,
            mechanicalSplit: Number(s.mechanicalSplit),
            performanceSplit: Number(s.performanceSplit),
            publisherSplit: Number(s.publisherSplit)
          })));
        } else {
          // Initialize empty splits
          setSplits([{ rightsholderId: '', role: 'CA', mechanicalSplit: 0, performanceSplit: 0, publisherSplit: 0 }]);
        }
      }
    } catch (e) {
      setGlobalError('Failed to load split sheet details.');
    }
  };

  // Auth Operations
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUser, password: loginPass })
      });
      if (res.ok) {
        const data = await res.json();
        setToken(data.token);
        setUsername(data.username);
        localStorage.setItem('iswc_token', data.token);
        localStorage.setItem('iswc_username', data.username);
        setSuccessMsg('Successfully logged in!');
        setLoginUser('');
        setLoginPass('');
      } else {
        const err = await res.json();
        setLoginError(err.error || 'Invalid credentials');
      }
    } catch (e) {
      setLoginError('Authentication service unreachable.');
    }
  };

  const handleLogout = () => {
    setToken('');
    setUsername('');
    localStorage.removeItem('iswc_token');
    localStorage.removeItem('iswc_username');
    setSuccessMsg('Logged out.');
  };

  // Create Rightsholder Operation
  const handleCreateRightsholder = async (e) => {
    e.preventDefault();
    setRightsholderError('');
    
    // Live validation checks
    if (ipiNameNumber && !/^\d{11}$/.test(ipiNameNumber)) {
      setRightsholderError('IPI must be exactly 11 digits');
      return;
    }
    if (isni && !/^[0-9]{15}[0-9X]$/.test(isni)) {
      setRightsholderError('ISNI must be 16 characters (15 digits followed by digit/X)');
      return;
    }

    const payload = {
      fullName,
      email: email || null,
      ipiNameNumber: ipiNameNumber || null,
      isni: isni || null
    };

    try {
      const res = await fetch(`${API_BASE}/rightsholders`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload)
      });

      if (res.status === 201) {
        setSuccessMsg('Rightsholder registered successfully!');
        setFullName('');
        setEmail('');
        setIpiNameNumber('');
        setIsni('');
        fetchRightsholders();
      } else {
        const err = await res.json();
        setRightsholderError(err.error || 'Failed to create rightsholder.');
      }
    } catch (e) {
      setRightsholderError('Communication failure with backend.');
    }
  };

  // Create Musical Work Operation
  const handleCreateWork = async (e) => {
    e.preventDefault();
    setWorkError('');

    if (iswc && !/^T\d{9}\d$/.test(iswc)) {
      setWorkError('ISWC must match standard format (T + 10 digits)');
      return;
    }

    const payload = {
      title: workTitle,
      iswc: iswc || null,
      languageCode: languageCode.toUpperCase(),
      musicalGenre: musicalGenre || null,
      status: workStatus
    };

    try {
      const res = await fetch(`${API_BASE}/works`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload)
      });

      if (res.status === 201) {
        setSuccessMsg('Musical work registered successfully!');
        setWorkTitle('');
        setIswc('');
        setMusicalGenre('');
        fetchWorks();
      } else {
        const err = await res.json();
        setWorkError(err.error || 'Failed to create musical work.');
      }
    } catch (e) {
      setWorkError('Communication failure with backend.');
    }
  };

  // Split Sheet Editor Operations
  const handleOpenSplitSheet = (work) => {
    setSelectedWork(work);
    fetchWorkDetailsAndSplits(work.id);
    setActiveTab('splits');
  };

  const handleAddSplitRow = () => {
    setSplits([...splits, { rightsholderId: '', role: 'CA', mechanicalSplit: 0, performanceSplit: 0, publisherSplit: 0 }]);
  };

  const handleRemoveSplitRow = (index) => {
    const newSplits = [...splits];
    newSplits.splice(index, 1);
    setSplits(newSplits);
  };

  const handleSplitChange = (index, field, value) => {
    const newSplits = [...splits];
    
    if (field === 'mechanicalSplit' || field === 'performanceSplit' || field === 'publisherSplit') {
      newSplits[index][field] = Number(value);
    } else {
      newSplits[index][field] = value;
    }
    
    setSplits(newSplits);
  };

  const handleSaveSplits = async () => {
    if (!selectedWork) return;

    // Check that all rows have a selected rightsholder
    if (splits.some(s => !s.rightsholderId)) {
      setGlobalError('Please select a rightsholder for all split sheet entries.');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/works/${selectedWork.id}/splits`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(splits)
      });

      if (res.ok) {
        const data = await res.json();
        setSuccessMsg(`Split sheet saved. Work Status updated to: ${data.status}`);
        fetchWorks();
        fetchWorkDetailsAndSplits(selectedWork.id);
      } else {
        const err = await res.json();
        setGlobalError(err.error || 'Failed to save split sheet splits.');
      }
    } catch (e) {
      setGlobalError('Connection error while saving splits.');
    }
  };

  // Calculate Running Totals for GUI validation
  const totalMechanical = splits.reduce((acc, s) => acc + (s.mechanicalSplit || 0), 0);
  const totalPerformance = splits.reduce((acc, s) => acc + (s.performanceSplit || 0), 0);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACTIVE': return <span className="badge badge-active">ACTIVE</span>;
      case 'CONFLICT': return <span className="badge badge-conflict">CONFLICT</span>;
      case 'DRAFT': return <span className="badge badge-draft">DRAFT</span>;
      default: return null;
    }
  };

  return (
    <div className="app-container">
      {/* Global Header */}
      <header className="header">
        <div className="brand">
          <div className="brand-icon">🎧</div>
          <h1 className="brand-title">ISWC Global Rights Manager</h1>
        </div>
        
        <div className="auth-badge">
          {token ? (
            <>
              <div className="status-indicator"></div>
              <span>Logged as: <strong>{username}</strong></span>
              <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <span style={{ color: 'var(--text-muted)' }}>🔒 Protected Mode (Read-Only)</span>
          )}
        </div>
      </header>

      {/* Action Notification Messages */}
      {successMsg && <div className="alert alert-success">{successMsg}</div>}
      {globalError && <div className="alert alert-danger">{globalError}</div>}

      {/* Main Tabs Navigation */}
      <nav className="tabs">
        <button className={`tab ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
          Dashboard
        </button>
        <button className={`tab ${activeTab === 'rightsholders' ? 'active' : ''}`} onClick={() => setActiveTab('rightsholders')}>
          Rightsholders
        </button>
        <button className={`tab ${activeTab === 'works' ? 'active' : ''}`} onClick={() => setActiveTab('works')}>
          Musical Works
        </button>
        {selectedWork && (
          <button className={`tab ${activeTab === 'splits' ? 'active' : ''}`} onClick={() => setActiveTab('splits')}>
            Split Sheets: {selectedWork.title}
          </button>
        )}
      </nav>

      {/* Tab Panels */}
      <main>
        {/* TAB 1: DASHBOARD OVERVIEW */}
        {activeTab === 'dashboard' && (
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
        )}

        {/* TAB 2: RIGHTSHOLDER REGISTRY */}
        {activeTab === 'rightsholders' && (
          <div style={{ display: 'grid', gridTemplateColumns: token ? '1fr 350px' : '1fr', gap: '2rem' }}>
            <div className="card-glass">
              <h3>Writers & Publishers Registry</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>List of creators and interested parties with valid IPI Name Numbers and ISNI credentials.</p>
              
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
        )}

        {/* TAB 3: MUSICAL WORKS MANAGER */}
        {activeTab === 'works' && (
          <div style={{ display: 'grid', gridTemplateColumns: token ? '1fr 350px' : '1fr', gap: '2rem' }}>
            <div className="card-glass">
              <h3>Musical Works Catalog</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Global music metadata registry database. Click a work to manage co-author split sheets.</p>
              
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
                    <input className="form-input" type="text" placeholder="T0000000000" maxLength={11} value={iswc} onChange={e => setIswc(e.target.value)} />
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
        )}

        {/* TAB 4: INTERACTIVE SPLIT SHEETS */}
        {activeTab === 'splits' && selectedWork && (
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
                <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.85rem' }}>Assign authors/publishers, select their roles, and slide to set splits. Rules: Sum of mechanical & performance splits must total 100% for ACTIVE registry.</p>
                
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
        )}
      </main>

      {/* Rightsholder Visual Portfolio Overlay */}
      {selectedAuthorPortfolio && (
        <div className="portfolio-overlay" onClick={() => setSelectedAuthorPortfolio(null)} />
      )}

      {/* Rightsholder Visual Portfolio Drawer */}
      {selectedAuthorPortfolio && (
        <div className="portfolio-drawer">
          <button className="portfolio-close-btn" onClick={() => setSelectedAuthorPortfolio(null)}>✕</button>
          
          <div className="portfolio-body">
            <div className="portfolio-profile-header">
              <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Rightsholder Portfolio
              </span>
              <h2 className="portfolio-profile-name">{selectedAuthorPortfolio.fullName}</h2>
              
              <div className="portfolio-profile-meta">
                <div className="portfolio-meta-card">
                  <div className="portfolio-meta-label">IPI Name Number</div>
                  <div className="portfolio-meta-value">{selectedAuthorPortfolio.ipiNameNumber || 'N/A'}</div>
                </div>
                <div className="portfolio-meta-card">
                  <div className="portfolio-meta-label">ISNI</div>
                  <div className="portfolio-meta-value">{selectedAuthorPortfolio.isni || 'N/A'}</div>
                </div>
              </div>
              
              <div style={{ marginTop: '0.75rem', padding: '0.4rem 0.75rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: '6px', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Email: </span>
                <a href={`mailto:${selectedAuthorPortfolio.email}`} style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 500 }}>
                  {selectedAuthorPortfolio.email || 'no-email@domain.com'}
                </a>
              </div>
            </div>

            {/* Metrics Row */}
            <div className="portfolio-stats-grid">
              <div className="portfolio-stat-box">
                <div className="portfolio-stat-number">
                  {works.filter(w => w.splits && w.splits.some(s => s.rightsholder.id === selectedAuthorPortfolio.id)).length}
                </div>
                <div className="portfolio-stat-title">Catalog Works</div>
              </div>
              <div className="portfolio-stat-box">
                <div className="portfolio-stat-number green">
                  {(() => {
                    const authorSplits = works
                      .flatMap(w => w.splits || [])
                      .filter(s => s.rightsholder.id === selectedAuthorPortfolio.id);
                    if (authorSplits.length === 0) return '0%';
                    const avgMechanical = authorSplits.reduce((sum, s) => sum + Number(s.mechanicalSplit), 0) / authorSplits.length;
                    return `${avgMechanical.toFixed(0)}%`;
                  })()}
                </div>
                <div className="portfolio-stat-title">Avg Mech Share</div>
              </div>
            </div>

            {/* Works List Details */}
            <div>
              <h3 className="portfolio-section-title">Musical Work Stakes</h3>
              <div className="portfolio-works-list">
                {(() => {
                  const authorWorks = works.filter(w => w.splits && w.splits.some(s => s.rightsholder.id === selectedAuthorPortfolio.id));
                  
                  if (authorWorks.length === 0) {
                    return (
                      <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-dark)', background: 'rgba(255,255,255,0.01)', borderRadius: '8px', border: '1px dashed var(--border-glass)' }}>
                        No shares registered for this stakeholder.
                      </div>
                    );
                  }

                  return authorWorks.map(w => {
                    const share = w.splits.find(s => s.rightsholder.id === selectedAuthorPortfolio.id);
                    const roleName = share.role === 'CA' ? 'Composer/Author (CA)' : share.role === 'AR' ? 'Arranger (AR)' : share.role === 'E' ? 'Publisher (E)' : share.role;

                    return (
                      <div key={w.id} className="portfolio-work-card">
                        <div>
                          <div className="portfolio-work-title">
                            <span>{w.title}</span>
                            <span>{getStatusBadge(w.status)}</span>
                          </div>
                          <div className="portfolio-work-meta" style={{ marginTop: '0.2rem' }}>
                            <span>ISWC: <code>{w.iswc || 'N/A'}</code></span>
                            <span>•</span>
                            <span>Role: <strong>{roleName}</strong></span>
                          </div>
                        </div>

                        <div className="portfolio-splits-grid">
                          <div className="portfolio-split-bar-group">
                            <div className="portfolio-bar-header">
                              <span className="portfolio-bar-label">Mechanical Split</span>
                              <span className="portfolio-bar-value">{Number(share.mechanicalSplit).toFixed(2)}%</span>
                            </div>
                            <div className="portfolio-bar-track">
                              <div className="portfolio-bar-fill" style={{ width: `${share.mechanicalSplit}%` }}></div>
                            </div>
                          </div>

                          <div className="portfolio-split-bar-group">
                            <div className="portfolio-bar-header">
                              <span className="portfolio-bar-label">Performance Split</span>
                              <span className="portfolio-bar-value perf">{Number(share.performanceSplit).toFixed(2)}%</span>
                            </div>
                            <div className="portfolio-bar-track">
                              <div className="portfolio-bar-fill perf" style={{ width: `${share.performanceSplit}%` }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
