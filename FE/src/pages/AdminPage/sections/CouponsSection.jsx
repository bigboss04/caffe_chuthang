import { useState } from 'react';
import { Edit2, Trash2, Plus, X } from 'lucide-react';
import adminService from '../../../services/adminService';

export default function CouponsSection({ coupons, loading, onRefresh }) {
    const [showModal, setShowModal] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [form, setForm] = useState({});
    const [saving, setSaving] = useState(false);

    const openCreate = () => { setEditItem(null); setForm({ code: '', description: '', discountPercent: 10, maxDiscount: '', minOrderValue: '', maxUses: 100, startDate: '', endDate: '', active: true }); setShowModal(true); };
    const openEdit = (c) => { setEditItem(c); setForm({ ...c, startDate: c.startDate?.slice(0, 16), endDate: c.endDate?.slice(0, 16) }); setShowModal(true); };

    const handleSave = async () => {
        setSaving(true);
        try {
            if (editItem) await adminService.updateCoupon(editItem.id, form);
            else await adminService.createCoupon(form);
            setShowModal(false); onRefresh();
        } catch (e) { alert(e.response?.data?.message || 'Lỗi'); }
        setSaving(false);
    };

    const handleDelete = async (id) => {
        if (!confirm('Xóa mã giảm giá?')) return;
        try { await adminService.deleteCoupon(id); onRefresh(); } catch (e) { alert('Lỗi'); }
    };

    if (loading) return <div className="admin-loading"><div className="admin-spinner" />Đang tải...</div>;

    const now = new Date();
    return (
        <>
            <div className="admin-section-card">
                <div className="admin-section-header">
                    <h2>🎫 Mã Khuyến Mãi ({(coupons || []).length})</h2>
                    <button className="admin-btn admin-btn-primary" onClick={openCreate}><Plus size={16} /> Tạo mã</button>
                </div>
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead><tr><th>Mã</th><th>Giảm</th><th>Đã dùng</th><th>Thời gian</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
                        <tbody>
                            {(coupons || []).map(c => {
                                const expired = c.endDate && new Date(c.endDate) < now;
                                return (
                                    <tr key={c.id}>
                                        <td><strong style={{ color: 'var(--admin-primary)', letterSpacing: 1 }}>{c.code}</strong><br /><span style={{ fontSize: '0.75rem', color: 'var(--admin-text-secondary)' }}>{c.description}</span></td>
                                        <td><span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--admin-success)' }}>{c.discountPercent}%</span></td>
                                        <td>{c.usedCount}/{c.maxUses}</td>
                                        <td style={{ fontSize: '0.75rem', color: 'var(--admin-text-secondary)' }}>{c.startDate?.slice(0, 10)} → {c.endDate?.slice(0, 10)}</td>
                                        <td><span className={`admin-badge ${expired ? 'cancelled' : c.active ? 'active' : 'inactive'}`}>{expired ? 'Hết hạn' : c.active ? 'Hoạt động' : 'Tắt'}</span></td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.25rem' }}>
                                                <button className="admin-btn-icon" onClick={() => openEdit(c)}><Edit2 size={14} /></button>
                                                <button className="admin-btn-icon danger" onClick={() => handleDelete(c.id)}><Trash2 size={14} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {(!coupons || coupons.length === 0) && <tr><td colSpan={6}><div className="admin-empty"><p>Chưa có mã giảm giá</p></div></td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
            {showModal && (
                <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="admin-modal" onClick={e => e.stopPropagation()}>
                        <div className="admin-modal-header"><h2>{editItem ? 'Sửa Mã' : 'Tạo Mã Giảm Giá'}</h2><button className="admin-modal-close" onClick={() => setShowModal(false)}><X size={16} /></button></div>
                        <div className="admin-modal-body">
                            <div className="admin-form-row">
                                <div className="admin-form-group"><label>Mã *</label><input className="admin-input" value={form.code || ''} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} style={{ textTransform: 'uppercase', letterSpacing: 2 }} /></div>
                                <div className="admin-form-group"><label>Giảm (%)</label><input type="number" className="admin-input" value={form.discountPercent || ''} onChange={e => setForm({ ...form, discountPercent: parseInt(e.target.value) || 0 })} /></div>
                            </div>
                            <div className="admin-form-group"><label>Mô tả</label><input className="admin-input" value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
                            <div className="admin-form-row">
                                <div className="admin-form-group"><label>Giảm tối đa (₫)</label><input type="number" className="admin-input" value={form.maxDiscount || ''} onChange={e => setForm({ ...form, maxDiscount: e.target.value })} /></div>
                                <div className="admin-form-group"><label>Đơn tối thiểu (₫)</label><input type="number" className="admin-input" value={form.minOrderValue || ''} onChange={e => setForm({ ...form, minOrderValue: e.target.value })} /></div>
                                <div className="admin-form-group"><label>Lượt dùng tối đa</label><input type="number" className="admin-input" value={form.maxUses || ''} onChange={e => setForm({ ...form, maxUses: parseInt(e.target.value) || 0 })} /></div>
                            </div>
                            <div className="admin-form-row">
                                <div className="admin-form-group"><label>Bắt đầu</label><input type="datetime-local" className="admin-input" value={form.startDate || ''} onChange={e => setForm({ ...form, startDate: e.target.value })} /></div>
                                <div className="admin-form-group"><label>Kết thúc</label><input type="datetime-local" className="admin-input" value={form.endDate || ''} onChange={e => setForm({ ...form, endDate: e.target.value })} /></div>
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
