import { useState } from 'react';
import adminService from '../../../services/adminService';

const formatVND = (v) => Number(v || 0).toLocaleString('vi-VN') + ' ₫';

export default function InventorySection({ inventory, loading, onRefresh }) {
    const [editId, setEditId] = useState(null);
    const [editStock, setEditStock] = useState(0);

    const handleSave = async (id) => {
        try { await adminService.updateInventory(id, editStock); setEditId(null); onRefresh(); } catch { alert('Lỗi'); }
    };

    if (loading) return <div className="admin-loading"><div className="admin-spinner" />Đang tải...</div>;
    const items = inventory || [];
    const outOfStock = items.filter(i => i.status === 'OUT_OF_STOCK').length;
    const lowStock = items.filter(i => i.status === 'LOW_STOCK').length;

    return (
        <>
            <div className="admin-stats-grid" style={{ marginBottom: '1rem' }}>
                <div className="admin-stat-card"><div className="admin-stat-icon danger">⚠️</div><div className="admin-stat-info"><h3>{outOfStock}</h3><p>Hết hàng</p></div></div>
                <div className="admin-stat-card"><div className="admin-stat-icon warning">📉</div><div className="admin-stat-info"><h3>{lowStock}</h3><p>Sắp hết</p></div></div>
                <div className="admin-stat-card"><div className="admin-stat-icon success">✅</div><div className="admin-stat-info"><h3>{items.length - outOfStock - lowStock}</h3><p>Đầy đủ</p></div></div>
            </div>
            <div className="admin-section-card">
                <div className="admin-section-header"><h2>📦 Quản Lý Kho</h2></div>
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead><tr><th>Hình</th><th>Sản phẩm</th><th>Danh mục</th><th>Giá</th><th>Tồn kho</th><th>Trạng thái</th><th>Cập nhật</th></tr></thead>
                        <tbody>
                            {items.map(p => (
                                <tr key={p.id} style={{ background: p.status === 'OUT_OF_STOCK' ? 'rgba(239,68,68,0.05)' : p.status === 'LOW_STOCK' ? 'rgba(245,158,11,0.05)' : 'transparent' }}>
                                    <td><img src={p.image} alt="" className="admin-product-thumb" /></td>
                                    <td><strong>{p.name}</strong></td>
                                    <td style={{ color: 'var(--admin-text-secondary)' }}>{p.category}</td>
                                    <td>{formatVND(p.price)}</td>
                                    <td>
                                        {editId === p.id ? (
                                            <input type="number" className="admin-input" value={editStock} onChange={e => setEditStock(parseInt(e.target.value) || 0)} style={{ width: 80 }} />
                                        ) : (
                                            <strong>{p.stock}</strong>
                                        )}
                                    </td>
                                    <td><span className={`admin-badge ${p.status === 'OUT_OF_STOCK' ? 'out-of-stock' : p.status === 'LOW_STOCK' ? 'low-stock' : 'in-stock'}`}>{p.status === 'OUT_OF_STOCK' ? 'Hết hàng' : p.status === 'LOW_STOCK' ? 'Sắp hết' : 'Đầy đủ'}</span></td>
                                    <td>
                                        {editId === p.id ? (
                                            <div style={{ display: 'flex', gap: '0.25rem' }}>
                                                <button className="admin-btn admin-btn-sm admin-btn-primary" onClick={() => handleSave(p.id)}>Lưu</button>
                                                <button className="admin-btn admin-btn-sm admin-btn-outline" onClick={() => setEditId(null)}>Hủy</button>
                                            </div>
                                        ) : (
                                            <button className="admin-btn admin-btn-sm admin-btn-outline" onClick={() => { setEditId(p.id); setEditStock(p.stock); }}>Sửa</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
