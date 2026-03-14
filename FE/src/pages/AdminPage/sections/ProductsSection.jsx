import { useState } from 'react';
import { Edit2, Trash2, Plus, X, Eye, EyeOff } from 'lucide-react';
import adminService from '../../../services/adminService';

const formatVND = (v) => Number(v || 0).toLocaleString('vi-VN') + ' ₫';

export default function ProductsSection({ products, categories, loading, onRefresh }) {
    const [showModal, setShowModal] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [form, setForm] = useState({});
    const [saving, setSaving] = useState(false);
    const [search, setSearch] = useState('');

    const openCreate = () => { setEditItem(null); setForm({ stock: 0, featured: false, isNew: false, active: true, price: '', name: '', slug: '', image: '', description: '', unit: 'gói', categoryId: categories?.[0]?.id || '' }); setShowModal(true); };
    const openEdit = (p) => { setEditItem(p); setForm({ ...p, categoryId: p.category?.id || '' }); setShowModal(true); };

    const handleSave = async () => {
        setSaving(true);
        try {
            const payload = { ...form, category: { id: Number(form.categoryId) } };
            delete payload.categoryId;
            if (editItem) await adminService.updateProduct(editItem.id, payload);
            else await adminService.createProduct(payload);
            setShowModal(false);
            onRefresh();
        } catch (e) { alert(e.response?.data?.message || 'Lỗi'); }
        setSaving(false);
    };

    const handleDelete = async (id) => {
        if (!confirm('Xóa sản phẩm này?')) return;
        try { await adminService.deleteProduct(id); onRefresh(); } catch (e) { alert(e.response?.data?.message || 'Lỗi khi xóa sản phẩm'); }
    };

    const handleToggle = async (id) => {
        try { await adminService.toggleProduct(id); onRefresh(); } catch (e) { alert('Lỗi'); }
    };

    if (loading) return <div className="admin-loading"><div className="admin-spinner" />Đang tải...</div>;

    const filtered = (products || []).filter(p => p.name?.toLowerCase().includes(search.toLowerCase()));

    return (
        <>
            <div className="admin-section-card">
                <div className="admin-section-header">
                    <h2>📦 Quản Lý Sản Phẩm ({filtered.length})</h2>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <div className="admin-search">
                            <span className="admin-search-icon">🔍</span>
                            <input className="admin-input" placeholder="Tìm sản phẩm..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '2rem', width: 200 }} />
                        </div>
                        <button className="admin-btn admin-btn-primary" onClick={openCreate}><Plus size={16} /> Thêm SP</button>
                    </div>
                </div>
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead><tr><th>Hình</th><th>Tên</th><th>SKU</th><th>Danh mục</th><th>Giá</th><th>Tồn kho</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
                        <tbody>
                            {filtered.map(p => (
                                <tr key={p.id}>
                                    <td><img src={p.image} alt="" className="admin-product-thumb" /></td>
                                    <td><strong>{p.name}</strong></td>
                                    <td style={{ color: 'var(--admin-text-secondary)', fontSize: '0.8rem' }}>{p.sku || '—'}</td>
                                    <td>{p.category?.name || '—'}</td>
                                    <td>{formatVND(p.price)}{p.originalPrice ? <><br /><s style={{ color: 'var(--admin-text-secondary)', fontSize: '0.75rem' }}>{formatVND(p.originalPrice)}</s></> : null}</td>
                                    <td><span className={`admin-badge ${p.stock <= 0 ? 'out-of-stock' : p.stock < 10 ? 'low-stock' : 'in-stock'}`}>{p.stock}</span></td>
                                    <td><div className={`admin-toggle ${p.active !== false ? 'active' : ''}`} onClick={() => handleToggle(p.id)} /></td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                                            <button className="admin-btn-icon" onClick={() => openEdit(p)}><Edit2 size={14} /></button>
                                            <button className="admin-btn-icon danger" onClick={() => handleDelete(p.id)}><Trash2 size={14} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && <tr><td colSpan={8}><div className="admin-empty"><div className="admin-empty-icon">📦</div><p>Không có sản phẩm</p></div></td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="admin-modal admin-modal-lg" onClick={e => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h2>{editItem ? 'Sửa Sản Phẩm' : 'Thêm Sản Phẩm'}</h2>
                            <button className="admin-modal-close" onClick={() => setShowModal(false)}><X size={16} /></button>
                        </div>
                        <div className="admin-modal-body">
                            <div className="admin-form-row">
                                <div className="admin-form-group"><label>Tên sản phẩm *</label><input className="admin-input" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value, slug: e.target.value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') })} /></div>
                                <div className="admin-form-group"><label>SKU</label><input className="admin-input" value={form.sku || ''} onChange={e => setForm({ ...form, sku: e.target.value })} /></div>
                            </div>
                            <div className="admin-form-row">
                                <div className="admin-form-group"><label>Giá bán *</label><input type="number" className="admin-input" value={form.price || ''} onChange={e => setForm({ ...form, price: e.target.value })} /></div>
                                <div className="admin-form-group"><label>Giá gốc</label><input type="number" className="admin-input" value={form.originalPrice || ''} onChange={e => setForm({ ...form, originalPrice: e.target.value })} /></div>
                                <div className="admin-form-group"><label>Tồn kho</label><input type="number" className="admin-input" value={form.stock ?? 0} onChange={e => setForm({ ...form, stock: parseInt(e.target.value) || 0 })} /></div>
                            </div>
                            <div className="admin-form-row">
                                <div className="admin-form-group"><label>Danh mục *</label><select className="admin-select" value={form.categoryId || ''} onChange={e => setForm({ ...form, categoryId: e.target.value })}>{(categories || []).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                                <div className="admin-form-group"><label>Đơn vị</label><input className="admin-input" value={form.unit || ''} onChange={e => setForm({ ...form, unit: e.target.value })} /></div>
                            </div>
                            <div className="admin-form-group"><label>Hình ảnh URL *</label><input className="admin-input" value={form.image || ''} onChange={e => setForm({ ...form, image: e.target.value })} /></div>
                            <div className="admin-form-group"><label>Mô tả</label><textarea className="admin-textarea" value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
                            <div className="admin-form-group"><label>Badge</label><input className="admin-input" value={form.badge || ''} onChange={e => setForm({ ...form, badge: e.target.value })} placeholder="VD: Giảm 15%" /></div>
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
