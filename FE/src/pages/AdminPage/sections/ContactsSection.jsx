import { Eye, Trash2 } from 'lucide-react';
import adminService from '../../../services/adminService';

const formatDate = (d) => d ? new Date(d).toLocaleString('vi-VN') : '—';

export default function ContactsSection({ contacts, loading, onRefresh, page, setPage }) {
    const handleMarkRead = async (id) => { try { await adminService.markContactRead(id); onRefresh(); } catch { alert('Lỗi'); } };
    const handleDelete = async (id) => { if (!confirm('Xóa tin nhắn?')) return; try { await adminService.deleteContact(id); onRefresh(); } catch { alert('Lỗi'); } };

    if (loading) return <div className="admin-loading"><div className="admin-spinner" />Đang tải...</div>;
    const content = contacts?.content || [];

    return (
        <div className="admin-section-card">
            <div className="admin-section-header"><h2>💬 Tin Nhắn Liên Hệ</h2></div>
            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead><tr><th>Tên</th><th>Email</th><th>SĐT</th><th>Nội dung</th><th>Ngày</th><th>Đọc</th><th>Thao tác</th></tr></thead>
                    <tbody>
                        {content.map(c => (
                            <tr key={c.id} style={{ background: c.read ? 'transparent' : 'rgba(99,102,241,0.05)' }}>
                                <td><strong>{c.name}</strong></td>
                                <td style={{ color: 'var(--admin-text-secondary)' }}>{c.email}</td>
                                <td>{c.phone || '—'}</td>
                                <td style={{ maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.message}</td>
                                <td style={{ fontSize: '0.8rem', color: 'var(--admin-text-secondary)' }}>{formatDate(c.createdAt)}</td>
                                <td>{c.read ? <span className="admin-badge active">Đã đọc</span> : <span className="admin-badge pending">Mới</span>}</td>
                                <td>
                                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                                        {!c.read && <button className="admin-btn-icon" onClick={() => handleMarkRead(c.id)}><Eye size={14} /></button>}
                                        <button className="admin-btn-icon danger" onClick={() => handleDelete(c.id)}><Trash2 size={14} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {content.length === 0 && <tr><td colSpan={7}><div className="admin-empty"><p>Chưa có tin nhắn</p></div></td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
