import { useState } from 'react';
import adminService from '../../../services/adminService';

const formatVND = (v) => Number(v || 0).toLocaleString('vi-VN') + ' ₫';

export default function AnalyticsSection({ analytics, loading, onRefresh }) {
    const [days, setDays] = useState(30);

    if (loading) return <div className="admin-loading"><div className="admin-spinner" />Đang tải...</div>;
    if (!analytics) return null;

    const { revenueByDay = [], revenueByMonth = [], topProducts = [], topCustomers = [] } = analytics;
    const maxDayRev = Math.max(...revenueByDay.map(d => Number(d.revenue) || 0), 1);
    const maxMonthRev = Math.max(...revenueByMonth.map(d => Number(d.revenue) || 0), 1);

    return (
        <>
            <div className="admin-section-header" style={{ background: 'transparent', border: 'none', padding: 0, marginBottom: '1rem' }}>
                <h2>📊 Báo Cáo & Thống Kê</h2>
                <div className="admin-filter-tabs">
                    {[7, 14, 30, 90].map(d => (
                        <button key={d} className={`admin-filter-tab ${days === d ? 'active' : ''}`} onClick={() => { setDays(d); onRefresh(d); }}>{d} ngày</button>
                    ))}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="admin-section-card">
                    <div className="admin-section-header"><h2>💰 Doanh Thu Theo Ngày</h2></div>
                    <div className="admin-section-body">
                        <div className="admin-chart-bars" style={{ height: 180 }}>
                            {revenueByDay.slice(-14).map((d, i) => (
                                <div key={i} className="admin-chart-bar">
                                    <div className="admin-chart-bar-value">{Number(d.revenue) > 0 ? (Number(d.revenue) / 1000).toFixed(0) + 'k' : ''}</div>
                                    <div className="admin-chart-bar-fill" style={{ height: `${(Number(d.revenue) / maxDayRev) * 140}px` }} />
                                    <div className="admin-chart-bar-label">{d.date?.slice(5)}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="admin-section-card">
                    <div className="admin-section-header"><h2>📅 Doanh Thu Theo Tháng</h2></div>
                    <div className="admin-section-body">
                        <div className="admin-chart-bars" style={{ height: 180 }}>
                            {revenueByMonth.map((d, i) => (
                                <div key={i} className="admin-chart-bar">
                                    <div className="admin-chart-bar-value">{Number(d.revenue) > 0 ? (Number(d.revenue) / 1000000).toFixed(1) + 'M' : ''}</div>
                                    <div className="admin-chart-bar-fill" style={{ height: `${(Number(d.revenue) / maxMonthRev) * 140}px` }} />
                                    <div className="admin-chart-bar-label">{d.month?.slice(5)}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
                <div className="admin-section-card">
                    <div className="admin-section-header"><h2>🏆 Sản Phẩm Bán Chạy</h2></div>
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead><tr><th>#</th><th>Sản phẩm</th><th>Đã bán</th><th>Doanh thu</th></tr></thead>
                            <tbody>
                                {topProducts.map((p, i) => (
                                    <tr key={p.id}><td style={{ fontWeight: 700, color: i < 3 ? 'var(--admin-warning)' : 'var(--admin-text-secondary)' }}>{i + 1}</td><td style={{ display: 'flex', alignItems: 'center', gap: 8 }}><img src={p.image} alt="" className="admin-product-thumb" style={{ width: 32, height: 32 }} />{p.name}</td><td>{p.sold}</td><td>{formatVND(p.revenue)}</td></tr>
                                ))}
                                {topProducts.length === 0 && <tr><td colSpan={4}><div className="admin-empty"><p>Chưa có dữ liệu</p></div></td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="admin-section-card">
                    <div className="admin-section-header"><h2>👑 Khách Hàng VIP</h2></div>
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead><tr><th>#</th><th>Tên</th><th>SĐT</th><th>Đơn</th><th>Tổng chi</th></tr></thead>
                            <tbody>
                                {topCustomers.map((c, i) => (
                                    <tr key={c.id}><td style={{ fontWeight: 700, color: i < 3 ? 'var(--admin-warning)' : 'var(--admin-text-secondary)' }}>{i + 1}</td><td><strong>{c.name}</strong></td><td>{c.phone}</td><td>{c.totalOrders}</td><td>{formatVND(c.totalSpent)}</td></tr>
                                ))}
                                {topCustomers.length === 0 && <tr><td colSpan={5}><div className="admin-empty"><p>Chưa có dữ liệu</p></div></td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
