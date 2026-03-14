import { Eye, EyeOff, Trash2 } from 'lucide-react';
import adminService from '../../../services/adminService';

const formatDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN') : '—';

export default function ReviewsSection({ reviews, loading, onRefresh }) {
    const handleToggle = async (id) => { try { await adminService.toggleReviewVisibility(id); onRefresh(); } catch { alert('Lỗi'); } };
    const handleDelete = async (id) => { if (!confirm('Xóa review?')) return; try { await adminService.deleteReview(id); onRefresh(); } catch { alert('Lỗi'); } };

    if (loading) return <div className="admin-loading"><div className="admin-spinner" />Đang tải...</div>;
    const content = reviews?.content || [];

    return (
        <div className="admin-section-card">
            <div className="admin-section-header"><h2>⭐ Quản Lý Đánh Giá</h2></div>
            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead><tr><th>Sản phẩm</th><th>Khách</th><th>Sao</th><th>Nội dung</th><th>Ngày</th><th>Hiển thị</th><th>Thao tác</th></tr></thead>
                    <tbody>
                        {content.map(r => (
                            <tr key={r.id}>
                                <td>{r.product?.name || '—'}</td>
                                <td><strong>{r.customerName}</strong></td>
                                <td>{'⭐'.repeat(r.rating)}</td>
                                <td style={{ maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.comment}</td>
                                <td style={{ fontSize: '0.8rem', color: 'var(--admin-text-secondary)' }}>{formatDate(r.createdAt)}</td>
                                <td><div className={`admin-toggle ${r.visible ? 'active' : ''}`} onClick={() => handleToggle(r.id)} /></td>
                                <td><button className="admin-btn-icon danger" onClick={() => handleDelete(r.id)}><Trash2 size={14} /></button></td>
                            </tr>
                        ))}
                        {content.length === 0 && <tr><td colSpan={7}><div className="admin-empty"><div className="admin-empty-icon">⭐</div><p>Chưa có đánh giá</p></div></td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
