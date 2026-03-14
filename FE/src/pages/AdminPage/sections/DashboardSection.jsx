import { ShoppingCart, DollarSign, Package, Users, TrendingUp, MessageSquare, Clock, CheckCircle } from 'lucide-react';

const formatVND = (v) => Number(v || 0).toLocaleString('vi-VN') + ' ₫';

export default function DashboardSection({ dashboard, loading }) {
    if (loading) return <div className="admin-loading"><div className="admin-spinner" />Đang tải...</div>;
    if (!dashboard) return null;

    const stats = [
        { icon: <ShoppingCart size={22} />, label: 'Tổng Đơn Hàng', value: dashboard.totalOrders, color: 'primary' },
        { icon: <Clock size={22} />, label: 'Chờ Xác Nhận', value: dashboard.pendingOrders, color: 'warning' },
        { icon: <DollarSign size={22} />, label: 'Tổng Doanh Thu', value: formatVND(dashboard.totalRevenue), color: 'success' },
        { icon: <Package size={22} />, label: 'Sản Phẩm', value: dashboard.totalProducts, color: 'purple' },
        { icon: <TrendingUp size={22} />, label: 'Đơn Hôm Nay', value: dashboard.todayOrders, color: 'info' },
        { icon: <DollarSign size={22} />, label: 'Doanh Thu Hôm Nay', value: formatVND(dashboard.todayRevenue), color: 'success' },
        { icon: <Users size={22} />, label: 'Khách Hàng', value: dashboard.totalCustomers || 0, color: 'info' },
        { icon: <MessageSquare size={22} />, label: 'Tin Nhắn Mới', value: dashboard.unreadContacts, color: 'danger' },
    ];

    const statusMap = [
        { key: 'pendingOrders', label: 'Chờ xác nhận', cls: 'pending' },
        { key: 'confirmedOrders', label: 'Đã xác nhận', cls: 'confirmed' },
        { key: 'shippingOrders', label: 'Đang giao', cls: 'shipping' },
        { key: 'deliveredOrders', label: 'Đã giao', cls: 'delivered' },
        { key: 'cancelledOrders', label: 'Đã hủy', cls: 'cancelled' },
    ];

    const chart = dashboard.revenueChart || [];
    const maxRevenue = Math.max(...chart.map(d => Number(d.revenue) || 0), 1);

    return (
        <>
            <div className="admin-stats-grid">
                {stats.map((s, i) => (
                    <div key={i} className="admin-stat-card">
                        <div className={`admin-stat-icon ${s.color}`}>{s.icon}</div>
                        <div className="admin-stat-info">
                            <h3>{s.value}</h3>
                            <p>{s.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="admin-section-card">
                    <div className="admin-section-header"><h2>📊 Doanh Thu 7 Ngày</h2></div>
                    <div className="admin-section-body">
                        <div className="admin-chart-bars">
                            {chart.map((d, i) => (
                                <div key={i} className="admin-chart-bar">
                                    <div className="admin-chart-bar-value">{Number(d.revenue) > 0 ? formatVND(d.revenue) : ''}</div>
                                    <div className="admin-chart-bar-fill" style={{ height: `${(Number(d.revenue) / maxRevenue) * 160}px` }} />
                                    <div className="admin-chart-bar-label">{d.date?.slice(5)}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="admin-section-card">
                    <div className="admin-section-header"><h2>📋 Phân Bổ Trạng Thái</h2></div>
                    <div className="admin-section-body">
                        {statusMap.map(s => (
                            <div key={s.key} className="admin-status-row">
                                <span className={`admin-badge ${s.cls}`}>{s.label}</span>
                                <span className="admin-status-count">{dashboard[s.key]}</span>
                                <span className="admin-status-pct">
                                    {dashboard.totalOrders > 0 ? Math.round((dashboard[s.key] / dashboard.totalOrders) * 100) : 0}%
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {dashboard.bestSellers?.length > 0 && (
                <div className="admin-section-card" style={{ marginTop: '1.5rem' }}>
                    <div className="admin-section-header"><h2>🏆 Sản Phẩm Bán Chạy</h2></div>
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead><tr><th>Sản phẩm</th><th>Giá</th><th>Đã bán</th><th>Tồn kho</th></tr></thead>
                            <tbody>
                                {dashboard.bestSellers.map(p => (
                                    <tr key={p.id}>
                                        <td style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <img src={p.image} alt="" className="admin-product-thumb" />
                                            {p.name}
                                        </td>
                                        <td>{formatVND(p.price)}</td>
                                        <td>{p.sold}</td>
                                        <td><span className={`admin-badge ${p.stock <= 0 ? 'out-of-stock' : p.stock < 10 ? 'low-stock' : 'in-stock'}`}>
                                            {p.stock}
                                        </span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </>
    );
}
