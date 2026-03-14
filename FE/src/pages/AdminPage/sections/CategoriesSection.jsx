import { useState } from 'react';
import { Edit2, Trash2, Plus, X } from 'lucide-react';
import adminService from '../../../services/adminService';

export default function CategoriesSection({ categories, loading, onRefresh }) {
    const [showModal, setShowModal] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [form, setForm] = useState({});
    const [saving, setSaving] = useState(false);

    const openCreate = () => { setEditItem(null); setForm({ name: '', slug: '', icon: '', image: '', description: '' }); setShowModal(true); };
    const openEdit = (c) => { setEditItem(c); setForm({ ...c }); setShowModal(true); };

    const handleSave = async () => {
        setSaving(true);
        try {
            if (editItem) await adminService.updateCategory(editItem.id, form);
            else await adminService.createCategory(form);
            setShowModal(false); onRefresh();
        } catch (e) { alert('Lỗi'); }
        setSaving(false);
    };

    const handleDelete = async (id) => {
        if (!confirm('Xóa danh mục này? Sản phẩm trong danh mục sẽ bị ảnh hưởng.')) return;
        try { await adminService.deleteCategory(id); onRefresh(); } catch (e) { alert(e.response?.data?.message || 'Lỗi khi xóa danh mục'); }
    };

    if (loading) return <div className="admin-loading"><div className="admin-spinner" />Đang tải...</div>;

    return (
        <>
            <div className="admin-section-card">
                <div className="admin-section-header">
                    <h2>🏷️ Quản Lý Danh Mục ({(categories || []).length})</h2>
                    <button className="admin-btn admin-btn-primary" onClick={openCreate}><Plus size={16} /> Thêm</button>
                </div>
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead><tr><th>Icon</th><th>Tên</th><th>Slug</th><th>Mô tả</th><th>Thao tác</th></tr></thead>
                        <tbody>
                            {(categories || []).map(c => (
                                <tr key={c.id}>
                                    <td style={{ fontSize: '1.5rem' }}>{c.icon || '📁'}</td>
                                    <td><strong>{c.name}</strong></td>
                                    <td style={{ color: 'var(--admin-text-secondary)' }}>{c.slug}</td>
                                    <td style={{ color: 'var(--admin-text-secondary)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.description || '—'}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                                            <button className="admin-btn-icon" onClick={() => openEdit(c)}><Edit2 size={14} /></button>
                                            <button className="admin-btn-icon danger" onClick={() => handleDelete(c.id)}><Trash2 size={14} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {(!categories || categories.length === 0) && <tr><td colSpan={5}><div className="admin-empty"><p>Chưa có danh mục</p></div></td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="admin-modal" onClick={e => e.stopPropagation()}>
                        <div className="admin-modal-header"><h2>{editItem ? 'Sửa Danh Mục' : 'Thêm Danh Mục'}</h2><button className="admin-modal-close" onClick={() => setShowModal(false)}><X size={16} /></button></div>
                        <div className="admin-modal-body">
                            <div className="admin-form-group"><label>Tên *</label><input className="admin-input" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value, slug: e.target.value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') })} /></div>
                            <div className="admin-form-group"><label>Slug</label><input className="admin-input" value={form.slug || ''} onChange={e => setForm({ ...form, slug: e.target.value })} /></div>
                            <div className="admin-form-group"><label>Icon (emoji)</label><input className="admin-input" value={form.icon || ''} onChange={e => setForm({ ...form, icon: e.target.value })} placeholder="☕" /></div>
                            <div className="admin-form-group"><label>Mô tả</label><textarea className="admin-textarea" value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
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
