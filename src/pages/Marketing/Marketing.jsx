import React, { useState } from 'react';
import { FiTrendingUp, FiMail, FiTag, FiUsers, FiPlus, FiArrowRight, FiPieChart, FiSend, FiBarChart2, FiGlobe, FiFilter, FiDownload } from 'react-icons/fi';
import './Marketing.css';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const Marketing = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showCreateModal, setShowCreateModal] = useState(false);



  // State for Modals & Data
  const [showManageCampaignModal, setShowManageCampaignModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  const [showCouponModal, setShowCouponModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);

  const [showLeadModal, setShowLeadModal] = useState(false);

  // Mock Data for Campaigns
  const [campaigns, setCampaigns] = useState([
    { id: 1, name: 'Summer Bootcamp Sale', type: 'Email', status: 'Active', sent: 12500, clicks: 3400, conversions: 120, revenue: '$14,500' },
    { id: 2, name: 'Instagram Ad - React', type: 'Social', status: 'Paused', sent: 50000, clicks: 8900, conversions: 45, revenue: '$5,200' },
    { id: 3, name: 'New Year Early Bird', type: 'Email', status: 'Completed', sent: 8000, clicks: 2100, conversions: 310, revenue: '$35,000' },
  ]);

  // Mock Data for Coupons
  const [coupons, setCoupons] = useState([
    { id: 1, code: 'WELCOME50', type: 'Flat', value: 50, usage: 124, limit: 500, status: 'Active', expiry: '2025-12-31' },
    { id: 2, code: 'SUMMER20', type: 'Percent', value: 20, usage: 850, limit: 1000, status: 'Active', expiry: '2024-08-31' },
    { id: 3, code: 'FLASH100', type: 'Flat', value: 100, usage: 50, limit: 50, status: 'Expired', expiry: '2024-01-01' },
  ]);

  // Mock Data for Leads
  const [leads, setLeads] = useState([
    { id: 1, name: 'Alice Smith', email: 'alice@example.com', phone: '+1234567890', interest: 'React Course', status: 'New', date: '2024-03-10' },
    { id: 2, name: 'Bob Jones', email: 'bob@example.com', phone: '+1987654321', interest: 'Full Stack', status: 'Contacted', date: '2024-03-09' },
    { id: 3, name: 'Charlie Day', email: 'charlie@example.com', phone: '+1122334455', interest: 'Python', status: 'Converted', date: '2024-03-08' },
  ]);

  // Analytics Data
  const engagementData = [
    { name: 'Mon', clicks: 400, conversions: 24 },
    { name: 'Tue', clicks: 300, conversions: 18 },
    { name: 'Wed', clicks: 550, conversions: 35 },
    { name: 'Thu', clicks: 450, conversions: 28 },
    { name: 'Fri', clicks: 600, conversions: 42 },
    { name: 'Sat', clicks: 700, conversions: 50 },
    { name: 'Sun', clicks: 650, conversions: 45 },
  ];

  const sourceData = [
    { name: 'Email', value: 45 },
    { name: 'Social', value: 30 },
    { name: 'Organic', value: 15 },
    { name: 'Referral', value: 10 },
  ];
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8,"
      + "Campaign Name,Type,Status,Revenue\n"
      + campaigns.map(c => `${c.name},${c.type},${c.status},${c.revenue.replace(/,/g, '')}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "marketing_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="marketing-page">
      <header className="marketing-header">
        <div className="page-title">
          <h1>Marketing Hub</h1>
          <p>Promotion strategy, campaigns, and growth analytics.</p>
        </div>
        <div className="marketing-actions">
          <button className="btn-secondary" onClick={handleExport}><FiDownload /> Export Report</button>
          <button className="btn-primary" onClick={() => setShowCreateModal(true)}><FiPlus /> Create Campaign</button>
        </div>
      </header>

      {/* Tabs */}
      <div className="marketing-tabs">
        {['overview', 'campaigns', 'coupons', 'leads', 'analytics'].map(tab => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
            style={{ textTransform: 'capitalize' }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="tab-content" style={{ marginTop: 24 }}>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon-wrapper" style={{ background: '#eff6ff', color: '#3b82f6' }}><FiMail /></div>
                <div className="d-flex flex-column">
                  <span className="stat-label">Total Campaigns</span>
                  <span className="stat-value">24</span>
                  <span className="stat-trend trend-up"><FiTrendingUp /> +3 active</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon-wrapper" style={{ background: '#f0fdf4', color: '#16a34a' }}><FiUsers /></div>
                <div className="d-flex flex-column">
                  <span className="stat-label">Total Leads</span>
                  <span className="stat-value">8,432</span>
                  <span className="stat-trend trend-up"><FiTrendingUp /> +5.4% vs last mo</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon-wrapper" style={{ background: '#fff7ed', color: '#ea580c' }}><FiTag /></div>
                <div className="d-flex flex-column">
                  <span className="stat-label">Coupons Used</span>
                  <span className="stat-value">1,205</span>
                  <span className="stat-trend trend-down"><FiArrowRight style={{ transform: 'rotate(45deg)' }} /> -2.1%</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon-wrapper" style={{ background: '#fafaef', color: '#ca8a04' }}><FiPieChart /></div>
                <div className="d-flex flex-column">
                  <span className="stat-label">Conversion Rate</span>
                  <span className="stat-value">3.2%</span>
                  <span className="stat-trend trend-up"><FiTrendingUp /> +0.8%</span>
                </div>
              </div>
            </div>

            <div className="section-header mt-4">
              <h3>Active Campaigns</h3>
            </div>
            <div className="campaign-list">
              {/* Reusing campaign list logic or component */}
              {campaigns.slice(0, 2).map(camp => (
                <div className="campaign-card" key={camp.id}>
                  <div className="campaign-info">
                    <div className="campaign-icon"><FiSend size={20} /></div>
                    <div className="campaign-details">
                      <h4>{camp.name}</h4>
                      <span className="badge bg-light text-secondary border">{camp.type}</span>
                    </div>
                  </div>
                  <div className="campaign-stats">
                    <div className="c-stat"><span className="c-stat-val">{camp.clicks}</span><span className="c-stat-label">Clicks</span></div>
                    <div className="c-stat"><span className="c-stat-val">{camp.conversions}</span><span className="c-stat-label">Conv.</span></div>
                    <div className="c-stat"><span className="c-stat-val">{camp.revenue}</span><span className="c-stat-label">Revenue</span></div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* CAMPAIGNS TAB */}
        {activeTab === 'campaigns' && (
          <div className="table-responsive bg-white rounded shadow-sm border">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-4">Campaign Name</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Reach</th>
                  <th>Clicks</th>
                  <th>Revenue</th>
                  <th className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map(c => (
                  <tr key={c.id}>
                    <td className="ps-4 fw-bold text-dark">{c.name}</td>
                    <td>{c.type}</td>
                    <td><span className={`badge ${c.status === 'Active' ? 'bg-success bg-opacity-10 text-success' : 'bg-secondary bg-opacity-10 text-secondary'}`}>{c.status}</span></td>
                    <td>{c.sent.toLocaleString()}</td>
                    <td>{c.clicks.toLocaleString()}</td>
                    <td className="fw-bold">{c.revenue}</td>
                    <td className="text-end pe-4">
                      <button className="btn btn-sm btn-outline-primary" onClick={() => { setSelectedCampaign(c); setShowManageCampaignModal(true); }}>Manage</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* COUPONS TAB */}
        {activeTab === 'coupons' && (
          <div className="table-responsive bg-white rounded shadow-sm border">
            <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
              <h5 className="mb-0">All Coupons</h5>
              <button className="btn btn-primary btn-sm" onClick={() => { setEditingCoupon(null); setShowCouponModal(true); }}><FiPlus /> New Coupon</button>
            </div>
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-4">Code</th>
                  <th>Discount</th>
                  <th>Usage</th>
                  <th>Status</th>
                  <th>Expiry</th>
                  <th className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map(c => (
                  <tr key={c.id}>
                    <td className="ps-4 text-primary font-monospace fw-bold">{c.code}</td>
                    <td>{c.type === 'Flat' ? `$${c.value}` : `${c.value}%`}</td>
                    <td>{c.usage} / {c.limit}</td>
                    <td><span className={`badge ${c.status === 'Active' ? 'bg-success bg-opacity-10 text-success' : 'bg-secondary bg-opacity-10 text-secondary'}`}>{c.status}</span></td>
                    <td>{c.expiry}</td>
                    <td className="text-end pe-4">
                      <button className="btn btn-sm btn-outline-secondary" onClick={() => { setEditingCoupon(c); setShowCouponModal(true); }}>Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === 'analytics' && (
          <div className="analytics-dashboard">
            <div className="row g-4">
              <div className="col-md-8">
                <div className="bg-white p-4 rounded border shadow-sm h-100">
                  <h5 className="mb-4">Campaign Engagement</h5>
                  <div style={{ width: '100%', height: 350 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={engagementData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="clicks" fill="#3b82f6" name="Clicks" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="conversions" fill="#10b981" name="Conversions" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="bg-white p-4 rounded border shadow-sm h-100">
                  <h5 className="mb-4">Traffic Sources</h5>
                  <div style={{ width: '100%', height: 350 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={sourceData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {sourceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LEADS TAB */}
        {activeTab === 'leads' && (
          <div className="table-responsive bg-white rounded shadow-sm border">
            <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Lead Management</h5>
              <button className="btn btn-primary btn-sm" onClick={() => setShowLeadModal(true)}><FiPlus /> Add Lead</button>
            </div>
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-4">Name</th>
                  <th>Contact</th>
                  <th>Interest</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.map(l => (
                  <tr key={l.id}>
                    <td className="ps-4 fw-bold text-dark">{l.name}</td>
                    <td>
                      <div className="small text-muted">{l.email}</div>
                      <div className="small text-muted">{l.phone}</div>
                    </td>
                    <td><span className="badge bg-light text-dark border">{l.interest}</span></td>
                    <td>
                      <span className={`badge ${l.status === 'New' ? 'bg-primary bg-opacity-10 text-primary' :
                        l.status === 'Converted' ? 'bg-success bg-opacity-10 text-success' :
                          'bg-warning bg-opacity-10 text-warning'
                        }`}>{l.status}</span>
                    </td>
                    <td>{l.date}</td>
                    <td className="text-end pe-4">
                      <button className="btn btn-sm btn-outline-secondary">Contact</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* CREATE CAMPAIGN MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl" style={{ background: '#fff', borderRadius: 12, padding: 24, width: '100%', maxWidth: 500 }}>
            <h4 className="mb-4" style={{ marginTop: 0 }}>Create New Campaign</h4>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const newCampaign = {
                id: campaigns.length + 1,
                name: formData.get('name'),
                type: formData.get('type'),
                status: 'Active',
                sent: 0,
                clicks: 0,
                conversions: 0,
                revenue: '$0'
              };
              setCampaigns([...campaigns, newCampaign]);
              setShowCreateModal(false);
              // Switch to campaigns tab to see the new campaign
              setActiveTab('campaigns');
            }}>
              <div className="mb-3" style={{ marginBottom: '1rem' }}>
                <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Campaign Name</label>
                <input type="text" name="name" className="form-control" placeholder="e.g. Winter Special" required style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }} />
              </div>
              <div className="mb-3" style={{ marginBottom: '1rem' }}>
                <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Campaign Type</label>
                <select name="type" className="form-select" style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}>
                  <option value="Email">Email Marketing</option>
                  <option value="Social">Social Media Ad</option>
                  <option value="SMS">SMS Campaign</option>
                  <option value="Affiliate">Affiliate Program</option>
                </select>
              </div>
              <div className="d-flex justify-content-end gap-2 mt-4" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)} style={{ padding: '8px 16px', border: '1px solid #ddd', background: '#f8f9fa', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ padding: '8px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Create Campaign</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* MANAGE CAMPAIGN MODAL */}
      {showManageCampaignModal && selectedCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="bg-white rounded-lg p-6 w-full max-w-lg" style={{ background: '#fff', borderRadius: 12, padding: 24, width: '100%', maxWidth: 500 }}>
            <h4 className="mb-4" style={{ marginTop: 0 }}>Manage Campaign</h4>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const updatedCampaigns = campaigns.map(c => c.id === selectedCampaign.id ? { ...c, name: formData.get('name'), status: formData.get('status') } : c);
              setCampaigns(updatedCampaigns);
              setShowManageCampaignModal(false);
            }}>
              <div className="mb-3">
                <label className="form-label">Campaign Name</label>
                <input type="text" name="name" className="form-control" defaultValue={selectedCampaign.name} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }} />
              </div>
              <div className="mb-3">
                <label className="form-label">Status</label>
                <select name="status" className="form-select" defaultValue={selectedCampaign.status} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }}>
                  <option value="Active">Active</option>
                  <option value="Paused">Paused</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div className="d-flex justify-content-end gap-2 mt-4">
                <button type="button" className="btn btn-secondary" onClick={() => setShowManageCampaignModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* COUPON MODAL */}
      {showCouponModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="bg-white rounded-lg p-6 w-full max-w-lg" style={{ background: '#fff', borderRadius: 12, padding: 24, width: '100%', maxWidth: 500 }}>
            <h4 className="mb-4" style={{ marginTop: 0 }}>{editingCoupon ? 'Edit Coupon' : 'Create Coupon'}</h4>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const couponData = {
                id: editingCoupon ? editingCoupon.id : coupons.length + 1,
                code: formData.get('code'),
                type: formData.get('type'),
                value: parseFloat(formData.get('value')),
                limit: parseInt(formData.get('limit')),
                usage: editingCoupon ? editingCoupon.usage : 0,
                status: 'Active',
                expiry: formData.get('expiry')
              };

              if (editingCoupon) {
                setCoupons(coupons.map(c => c.id === editingCoupon.id ? couponData : c));
              } else {
                setCoupons([...coupons, couponData]);
              }
              setShowCouponModal(false);
            }}>
              <div className="row">
                <div className="col-12 mb-3">
                  <label className="form-label">Coupon Code</label>
                  <input type="text" name="code" className="form-control" defaultValue={editingCoupon?.code} placeholder="e.g. SAVE20" required style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }} />
                </div>
                <div className="col-6 mb-3">
                  <label className="form-label">Type</label>
                  <select name="type" className="form-select" defaultValue={editingCoupon?.type || 'Flat'} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }}>
                    <option value="Flat">Flat ($)</option>
                    <option value="Percent">Percent (%)</option>
                  </select>
                </div>
                <div className="col-6 mb-3">
                  <label className="form-label">Value</label>
                  <input type="number" name="value" className="form-control" defaultValue={editingCoupon?.value} required style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }} />
                </div>
                <div className="col-12 mb-3">
                  <label className="form-label">Usage Limit</label>
                  <input type="number" name="limit" className="form-control" defaultValue={editingCoupon?.limit || 100} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }} />
                </div>
                <div className="col-12 mb-3">
                  <label className="form-label">Expiry Date</label>
                  <input type="date" name="expiry" className="form-control" defaultValue={editingCoupon?.expiry} required style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }} />
                </div>
              </div>
              <div className="d-flex justify-content-end gap-2 mt-4">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCouponModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Coupon</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LEAD MODAL */}
      {showLeadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="bg-white rounded-lg p-6 w-full max-w-lg" style={{ background: '#fff', borderRadius: 12, padding: 24, width: '100%', maxWidth: 500 }}>
            <h4 className="mb-4" style={{ marginTop: 0 }}>Add New Lead</h4>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const newLead = {
                id: leads.length + 1,
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                interest: formData.get('interest'),
                status: 'New',
                date: new Date().toISOString().split('T')[0]
              };
              setLeads([newLead, ...leads]);
              setShowLeadModal(false);
            }}>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input type="text" name="name" className="form-control" required style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }} />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="email" name="email" className="form-control" required style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }} />
              </div>
              <div className="mb-3">
                <label className="form-label">Phone</label>
                <input type="text" name="phone" className="form-control" style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }} />
              </div>
              <div className="mb-3">
                <label className="form-label">Interest</label>
                <select name="interest" className="form-select" style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }}>
                  <option value="React Course">React Course</option>
                  <option value="Full Stack">Full Stack</option>
                  <option value="Python">Python</option>
                  <option value="Data Science">Data Science</option>
                </select>
              </div>
              <div className="d-flex justify-content-end gap-2 mt-4">
                <button type="button" className="btn btn-secondary" onClick={() => setShowLeadModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add Lead</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Marketing;