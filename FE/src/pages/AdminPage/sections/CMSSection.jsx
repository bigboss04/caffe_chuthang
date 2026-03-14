import { useState } from 'react';
import { Edit2, Trash2, Plus, X } from 'lucide-react';
import adminService from '../../../services/adminService';

export default function CMSSection({ banners, loading, onRefresh }) {
    const [showModal, setShowModal] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [form, setForm] = useState({});
    const [saving, setSaving] = useState(false);

    const openCreate = () => { setEditItem(null); setForm({ title: '', subtitle: '', imageUrl: '', link: '', position: 'hero', sortOrder: 0, active: true }); setShowModal(true); };
    const openEdit = (b) => { setEditItem(b); setForm({ ...b }); setShowModal(true); };

    const handleSave = async () => {
        setSaving(true);
        try {
            if (editItem) await adminService.updateBanner(editItem.id, form);
            else await adminService.createBanner(form);
            setShowModal(false); onRefresh();
        } catch (e) { alert('Lỗi'); }
        setSaving(false);
    };

    const handleDelete = async (id) => {
        if (!confirm('Xóa banner?')) return;
        try { await adminService.deleteBanner(id); onRefresh(); } catch { alert('Lỗi'); }
    };

    if (loading) return <div className="admin-loading"><div className="admin-spinner" />Đang tải...</div>;
    const posLabels = { hero: 'Hero', promo: 'Quảng cáo', sidebar: 'Sidebar' };

    return (
        <>
            <div className="admin-section-card">
                <div className="admin-section-header">
                    <h2>🎨 Quản Lý Nội Dung ({(banners || []).length})</h2>
                    <button className="admin-btn admin-btn-primary" onClick={openCreate}><Plus size={16} /> Thêm Banner</button>
                </div>
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead><tr><th>Hình</th><th>Tiêu đề</th><th>Vị trí</th><th>Link</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
                        <tbody>
                            {(banners || []).map(b => (
                                <tr key={b.id}>
                                    <td><img src={b.imageUrl} alt="" className="admin-product-thumb" style={{ width: 80, height: 45, borderRadius: 6 }} /></td>
                                    <td><strong>{b.title}</strong>{b.subtitle && <><br /><span style={{ fontSize: '0.75rem', color: 'var(--admin-text-secondary)' }}>{b.subtitle}</span></>}</td>
                                    <td><span className="admin-badge info">{posLabels[b.position] || b.position}</span></td>
                                    <td style={{ fontSize: '0.8rem', color: 'var(--admin-text-secondary)', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.link || '—'}</td>
                                    <td><div className={`admin-toggle ${b.active ? 'active' : ''}`} /></td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                                            <button className="admin-btn-icon" onClick={() => openEdit(b)}><Edit2 size={14} /></button>
                                            <button className="admin-btn-icon danger" onClick={() => handleDelete(b.id)}><Trash2 size={14} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {(!banners || banners.length === 0) && <tr><td colSpan={6}><div className="admin-empty"><p>Chưa có banner</p></div></td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
            {showModal && (
                <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="admin-modal" onClick={e => e.stopPropagation()}>
                        <div className="admin-modal-header"><h2>{editItem ? 'Sửa Banner' : 'Thêm Banner'}</h2><button className="admin-modal-close" onClick={() => setShowModal(false)}><X size={16} /></button></div>
                        <div className="admin-modal-body">
                            <div className="admin-form-group"><label>Tiêu đề *</label><input className="admin-input" value={form.title || ''} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
                            <div className="admin-form-group"><label>Phụ đề</label><input className="admin-input" value={form.subtitle || ''} onChange={e => setForm({ ...form, subtitle: e.target.value })} /></div>
                            <div className="admin-form-group"><label>URL Hình ảnh *</label><input className="admin-input" value={form.imageUrl || ''} onChange={e => setForm({ ...form, imageUrl: e.target.value })} /></div>
                            {form.imageUrl && <div style={{ marginBottom: '1rem' }}><img src={form.imageUrl} alt="" style={{ maxWidth: '100%', maxHeight: 150, borderRadius: 8 }} /></div>}
                            <div className="admin-form-row">
                                <div className="admin-form-group"><label>Link</label><input className="admin-input" value={form.link || ''} onChange={e => setForm({ ...form, link: e.target.value })} /></div>
                                <div className="admin-form-group"><label>Vị trí</label><select className="admin-select" value={form.position || 'hero'} onChange={e => setForm({ ...form, position: e.target.value })}><option value="hero">Hero</option><option value="promo">Quảng cáo</option><option value="sidebar">Sidebar</option></select></div>
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
