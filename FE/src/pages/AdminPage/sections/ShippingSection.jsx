import { useState } from 'react';
import { Edit2, Trash2, Plus, X } from 'lucide-react';
import adminService from '../../../services/adminService';

const formatVND = (v) => Number(v || 0).toLocaleString('vi-VN') + ' ₫';

export default function ShippingSection({ zones, loading, onRefresh }) {
    const [showModal, setShowModal] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [form, setForm] = useState({});
    const [saving, setSaving] = useState(false);

    const openCreate = () => { setEditItem(null); setForm({ name: '', fee: '', minFreeShip: '', active: true, sortOrder: 0 }); setShowModal(true); };
    const openEdit = (z) => { setEditItem(z); setForm({ ...z }); setShowModal(true); };

    const handleSave = async () => {
        setSaving(true);
        try {
            if (editItem) await adminService.updateShippingZone(editItem.id, form);
            else await adminService.createShippingZone(form);
            setShowModal(false); onRefresh();
        } catch (e) { alert('Lỗi'); }
        setSaving(false);
    };

    const handleDelete = async (id) => {
        if (!confirm('Xóa khu vực?')) return;
        try { await adminService.deleteShippingZone(id); onRefresh(); } catch { alert('Lỗi'); }
    };

    if (loading) return <div className="admin-loading"><div className="admin-spinner" />Đang tải...</div>;

    return (
        <>
            <div className="admin-section-card">
                <div className="admin-section-header">
                    <h2>🚚 Quản Lý Giao Hàng</h2>
                    <button className="admin-btn admin-btn-primary" onClick={openCreate}><Plus size={16} /> Thêm khu vực</button>
                </div>
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead><tr><th>Khu vực</th><th>Phí ship</th><th>Miễn phí từ</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
                        <tbody>
                            {(zones || []).map(z => (
                                <tr key={z.id}>
                                    <td><strong>{z.name}</strong></td>
                                    <td>{formatVND(z.fee)}</td>
                                    <td>{z.minFreeShip ? formatVND(z.minFreeShip) : '—'}</td>
                                    <td><span className={`admin-badge ${z.active ? 'active' : 'inactive'}`}>{z.active ? 'Hoạt động' : 'Tắt'}</span></td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                                            <button className="admin-btn-icon" onClick={() => openEdit(z)}><Edit2 size={14} /></button>
                                            <button className="admin-btn-icon danger" onClick={() => handleDelete(z.id)}><Trash2 size={14} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {(!zones || zones.length === 0) && <tr><td colSpan={5}><div className="admin-empty"><p>Chưa có khu vực giao hàng</p></div></td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
            {showModal && (
                <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="admin-modal" onClick={e => e.stopPropagation()}>
                        <div className="admin-modal-header"><h2>{editItem ? 'Sửa Khu Vực' : 'Thêm Khu Vực'}</h2><button className="admin-modal-close" onClick={() => setShowModal(false)}><X size={16} /></button></div>
                        <div className="admin-modal-body">
                            <div className="admin-form-group"><label>Tên khu vực *</label><input className="admin-input" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                            <div className="admin-form-row">
                                <div className="admin-form-group"><label>Phí ship (₫) *</label><input type="number" className="admin-input" value={form.fee || ''} onChange={e => setForm({ ...form, fee: e.target.value })} /></div>
                                <div className="admin-form-group"><label>Miễn phí từ (₫)</label><input type="number" className="admin-input" value={form.minFreeShip || ''} onChange={e => setForm({ ...form, minFreeShip: e.target.value })} placeholder="Để trống = không miễn phí" /></div>
                            </div>
                        </div>
                        <div className="admin-modal-footer">
                            <button className="admin-btn admin-btn-outline" onClick={() => setShowModal(false)}>Hủy</button>
                            <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu'}</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
