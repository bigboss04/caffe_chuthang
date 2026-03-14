import { useState } from 'react';
import { Eye, Printer, X, ChevronLeft, ChevronRight } from 'lucide-react';
import adminService from '../../../services/adminService';

const formatVND = (v) => Number(v || 0).toLocaleString('vi-VN') + ' ₫';
const formatDate = (d) => d ? new Date(d).toLocaleString('vi-VN') : '—';
const STATUS_OPTIONS = ['PENDING', 'CONFIRMED', 'SHIPPING', 'DELIVERED', 'CANCELLED'];
const STATUS_LABELS = { PENDING: 'Chờ xác nhận', CONFIRMED: 'Đã xác nhận', SHIPPING: 'Đang giao', DELIVERED: 'Đã giao', CANCELLED: 'Đã hủy' };

export default function OrdersSection({ orders, loading, onRefresh }) {
    const [filter, setFilter] = useState('ALL');
    const [page, setPage] = useState(0);
    const [viewOrder, setViewOrder] = useState(null);
    const [showInvoice, setShowInvoice] = useState(false);

    const fetchOrders = (p, s) => { setPage(p); onRefresh({ page: p, status: s || filter }); };

    const handleUpdateStatus = async (orderId, status) => {
        try { await adminService.updateOrderStatus(orderId, status); onRefresh({ page, status: filter }); if (viewOrder?.orderId === orderId) setViewOrder(prev => ({ ...prev, status })); } catch (e) { alert('Lỗi'); }
    };

    const handleViewOrder = async (orderId) => {
        try { const data = await adminService.getOrderDetail(orderId); setViewOrder(data); } catch (e) { alert('Lỗi'); }
    };

    if (loading) return <div className="admin-loading"><div className="admin-spinner" />Đang tải...</div>;

    const content = orders?.content || [];
    const totalPages = orders?.totalPages || 0;

    return (
        <>
            <div className="admin-section-card">
                <div className="admin-section-header">
                    <h2>🛒 Quản Lý Đơn Hàng</h2>
                    <div className="admin-filter-tabs">
                        {['ALL', ...STATUS_OPTIONS].map(s => (
                            <button key={s} className={`admin-filter-tab ${filter === s ? 'active' : ''}`} onClick={() => { setFilter(s); fetchOrders(0, s); }}>
                                {s === 'ALL' ? 'Tất cả' : STATUS_LABELS[s]}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead><tr><th>Mã đơn</th><th>Khách hàng</th><th>SĐT</th><th>Tổng tiền</th><th>Trạng thái</th><th>Ngày đặt</th><th>Thao tác</th></tr></thead>
                        <tbody>
                            {content.map(o => (
                                <tr key={o.id}>
                                    <td><strong style={{ color: 'var(--admin-primary)' }}>{o.orderId}</strong></td>
                                    <td>{o.fullName}</td>
                                    <td>{o.phone}</td>
                                    <td>{formatVND(o.grandTotal)}</td>
                                    <td>
                                        <select className="admin-select" value={o.status} onChange={e => handleUpdateStatus(o.orderId, e.target.value)} style={{ width: 130, padding: '0.3rem 0.5rem', fontSize: '0.75rem' }}>
                                            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                                        </select>
                                    </td>
                                    <td style={{ color: 'var(--admin-text-secondary)', fontSize: '0.8rem' }}>{formatDate(o.createdAt)}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                                            <button className="admin-btn-icon" onClick={() => handleViewOrder(o.orderId)}><Eye size={14} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {content.length === 0 && <tr><td colSpan={7}><div className="admin-empty"><p>Không có đơn hàng</p></div></td></tr>}
                        </tbody>
                    </table>
                </div>
                {totalPages > 1 && (
                    <div className="admin-pagination">
                        <button disabled={page === 0} onClick={() => fetchOrders(page - 1)}><ChevronLeft size={14} /></button>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button key={i} className={page === i ? 'active' : ''} onClick={() => fetchOrders(i)}>{i + 1}</button>
                        ))}
                        <button disabled={page >= totalPages - 1} onClick={() => fetchOrders(page + 1)}><ChevronRight size={14} /></button>
                    </div>
                )}
            </div>

            {viewOrder && (
                <div className="admin-modal-overlay" onClick={() => { setViewOrder(null); setShowInvoice(false); }}>
                    <div className="admin-modal admin-modal-lg" onClick={e => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h2>{showInvoice ? '🧾 Hóa Đơn' : '📋 Chi Tiết Đơn'} #{viewOrder.orderId}</h2>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button className="admin-btn admin-btn-sm admin-btn-outline" onClick={() => setShowInvoice(!showInvoice)}>
                                    <Printer size={14} /> {showInvoice ? 'Chi tiết' : 'In hóa đơn'}
                                </button>
                                <button className="admin-modal-close" onClick={() => { setViewOrder(null); setShowInvoice(false); }}><X size={16} /></button>
                            </div>
                        </div>
                        <div className="admin-modal-body">
                            {showInvoice ? (
                                <div className="admin-invoice">
                                    <div className="admin-invoice-header">
                                        <h2>NÔNG SẢN PHÚ YÊN</h2>
                                        <p>Hóa đơn #{viewOrder.orderId}</p>
                                        <p>{formatDate(viewOrder.createdAt)}</p>
                                    </div>
                                    <p><strong>Khách:</strong> {viewOrder.fullName} - {viewOrder.phone}</p>
                                    <p><strong>Địa chỉ:</strong> {viewOrder.address}, {viewOrder.district}, {viewOrder.city}</p>
                                    <table className="admin-invoice-table">
                                        <thead><tr><th>Sản phẩm</th><th>SL</th><th>Đơn giá</th><th>Thành tiền</th></tr></thead>
                                        <tbody>
                                            {(viewOrder.items || []).map((it, i) => (
                                                <tr key={i}><td>{it.productName}</td><td>{it.quantity}</td><td>{formatVND(it.price)}</td><td>{formatVND(it.subtotal)}</td></tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div className="admin-invoice-total">
                                        <p>Tạm tính: {formatVND(viewOrder.subtotal)}</p>
                                        <p>Phí ship: {formatVND(viewOrder.shippingFee)}</p>
                                        <p style={{ fontSize: '1.2rem' }}>TỔNG: {formatVND(viewOrder.grandTotal)}</p>
                                    </div>
                                    <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                                        <button className="admin-btn admin-btn-primary" onClick={() => window.print()}>🖨️ In</button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="admin-form-row">
                                        <div><strong>Khách:</strong> {viewOrder.fullName}</div>
                                        <div><strong>SĐT:</strong> {viewOrder.phone}</div>
                                        <div><strong>Email:</strong> {viewOrder.email || '—'}</div>
                                    </div>
                                    <div style={{ marginTop: '0.75rem' }}><strong>Địa chỉ:</strong> {viewOrder.address}, {viewOrder.district}, {viewOrder.city}</div>
                                    <div style={{ marginTop: '0.75rem' }}><strong>Ghi chú:</strong> {viewOrder.note || '—'}</div>
                                    <div style={{ marginTop: '0.75rem' }}><strong>Thanh toán:</strong> {viewOrder.paymentMethod}</div>
                                    <div style={{ marginTop: '0.75rem' }}><strong>Trạng thái:</strong> <span className={`admin-badge ${viewOrder.status?.toLowerCase()}`}>{STATUS_LABELS[viewOrder.status]}</span></div>
                                    <div className="admin-table-wrapper" style={{ marginTop: '1rem' }}>
                                        <table className="admin-table">
                                            <thead><tr><th>Sản phẩm</th><th>ĐV</th><th>SL</th><th>Giá</th><th>Thành tiền</th></tr></thead>
                                            <tbody>
                                                {(viewOrder.items || []).map((it, i) => (
                                                    <tr key={i}><td>{it.productName}</td><td>{it.variant || '—'}</td><td>{it.quantity}</td><td>{formatVND(it.price)}</td><td>{formatVND(it.subtotal)}</td></tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div style={{ textAlign: 'right', marginTop: '1rem', fontSize: '1.1rem', fontWeight: 700 }}>
                                        Tổng: {formatVND(viewOrder.grandTotal)}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
