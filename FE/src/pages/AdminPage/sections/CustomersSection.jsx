import { useState } from 'react';
import { Eye, Lock, Unlock, ChevronLeft, ChevronRight } from 'lucide-react';
import adminService from '../../../services/adminService';

const formatVND = (v) => Number(v || 0).toLocaleString('vi-VN') + ' ₫';
const formatDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN') : '—';

export default function CustomersSection({ customers, loading, onRefresh }) {
    const [page, setPage] = useState(0);
    const [search, setSearch] = useState('');
    const [detail, setDetail] = useState(null);

    const fetchData = (p, s) => { setPage(p); onRefresh({ page: p, search: s ?? search }); };

    const handleLock = async (id) => {
        try { await adminService.toggleLockCustomer(id); onRefresh({ page, search }); } catch (e) { alert('Lỗi'); }
    };

    const handleViewDetail = async (id) => {
        try { const data = await adminService.getCustomerDetail(id); setDetail(data); } catch (e) { alert('Lỗi'); }
    };

    if (loading) return <div className="admin-loading"><div className="admin-spinner" />Đang tải...</div>;

    const content = customers?.content || [];
    const totalPages = customers?.totalPages || 0;

    return (
        <>
            <div className="admin-section-card">
                <div className="admin-section-header">
                    <h2>👥 Quản Lý Khách Hàng</h2>
                    <div className="admin-search">
                        <span className="admin-search-icon">🔍</span>
                        <input className="admin-input" placeholder="Tìm khách..." value={search} onChange={e => { setSearch(e.target.value); fetchData(0, e.target.value); }} style={{ paddingLeft: '2rem', width: 220 }} />
                    </div>
                </div>
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead><tr><th>Tên</th><th>SĐT</th><th>Email</th><th>Tổng đơn</th><th>Tổng chi</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
                        <tbody>
                            {content.map(c => (
                                <tr key={c.id}>
                                    <td><strong>{c.fullName}</strong></td>
                                    <td>{c.phone}</td>
                                    <td style={{ color: 'var(--admin-text-secondary)' }}>{c.email || '—'}</td>
                                    <td>{c.totalOrders}</td>
                                    <td>{formatVND(c.totalSpent)}</td>
                                    <td><span className={`admin-badge ${c.locked ? 'cancelled' : 'active'}`}>{c.locked ? 'Đã khóa' : 'Hoạt động'}</span></td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                                            <button className="admin-btn-icon" onClick={() => handleViewDetail(c.id)}><Eye size={14} /></button>
                                            <button className="admin-btn-icon danger" onClick={() => handleLock(c.id)} title={c.locked ? 'Mở khóa' : 'Khóa'}>
                                                {c.locked ? <Unlock size={14} /> : <Lock size={14} />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {content.length === 0 && <tr><td colSpan={7}><div className="admin-empty"><p>Chưa có khách hàng</p></div></td></tr>}
                        </tbody>
                    </table>
                </div>
                {totalPages > 1 && (
                    <div className="admin-pagination">
                        <button disabled={page === 0} onClick={() => fetchData(page - 1)}><ChevronLeft size={14} /></button>
                        {Array.from({ length: totalPages }, (_, i) => <button key={i} className={page === i ? 'active' : ''} onClick={() => fetchData(i)}>{i + 1}</button>)}
                        <button disabled={page >= totalPages - 1} onClick={() => fetchData(page + 1)}><ChevronRight size={14} /></button>
                    </div>
                )}
            </div>

            {detail && (
                <div className="admin-modal-overlay" onClick={() => setDetail(null)}>
                    <div className="admin-modal admin-modal-lg" onClick={e => e.stopPropagation()}>
                        <div className="admin-modal-header"><h2>👤 {detail.customer?.fullName}</h2><button className="admin-modal-close" onClick={() => setDetail(null)}>✕</button></div>
                        <div className="admin-modal-body">
                            <div className="admin-form-row">
                                <div><strong>SĐT:</strong> {detail.customer?.phone}</div>
                                <div><strong>Email:</strong> {detail.customer?.email || '—'}</div>
                                <div><strong>Ngày tham gia:</strong> {formatDate(detail.customer?.createdAt)}</div>
                            </div>
                            <div style={{ marginTop: '0.5rem' }}><strong>Địa chỉ:</strong> {detail.customer?.address || '—'}</div>
                            <h3 style={{ marginTop: '1.5rem', fontSize: '1rem' }}>📋 Lịch sử đơn hàng ({detail.orders?.length || 0})</h3>
                            <div className="admin-table-wrapper">
                                <table className="admin-table">
                                    <thead><tr><th>Mã đơn</th><th>Ngày</th><th>Tổng</th><th>Trạng thái</th></tr></thead>
                                    <tbody>
                                        {(detail.orders || []).map(o => (
                                            <tr key={o.id}><td>{o.orderId}</td><td>{formatDate(o.createdAt)}</td><td>{formatVND(o.grandTotal)}</td><td><span className={`admin-badge ${o.status?.toLowerCase()}`}>{o.status}</span></td></tr>
                                        ))}
                                        {(!detail.orders || detail.orders.length === 0) && <tr><td colSpan={4}><div className="admin-empty"><p>Chưa có đơn hàng</p></div></td></tr>}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
