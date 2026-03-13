import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
    LayoutDashboard, ShoppingCart, Package, MessageSquare,
    ChevronLeft, ChevronRight, Eye, Truck, CheckCircle,
    XCircle, Clock, ArrowUpRight, X, Mail, MailOpen,
    Trash2, RefreshCcw, TrendingUp, Users, DollarSign,
    AlertCircle, Home
} from 'lucide-react';
import adminService from '../../services/adminService';
import './AdminPage.css';

const STATUS_MAP = {
    PENDING: { label: 'Chờ xác nhận', icon: Clock },
    CONFIRMED: { label: 'Đã xác nhận', icon: CheckCircle },
    SHIPPING: { label: 'Đang giao', icon: Truck },
    DELIVERED: { label: 'Đã giao', icon: CheckCircle },
    CANCELLED: { label: 'Đã hủy', icon: XCircle },
};

const STATUS_OPTIONS = ['PENDING', 'CONFIRMED', 'SHIPPING', 'DELIVERED', 'CANCELLED'];

function formatVND(v) {
    if (!v && v !== 0) return '0 ₫';
    return Number(v).toLocaleString('vi-VN') + ' ₫';
}

function formatDate(d) {
    if (!d) return '-';
    const date = new Date(d);
    return date.toLocaleString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
}

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [loading, setLoading] = useState(true);

    // Dashboard
    const [dashboard, setDashboard] = useState(null);

    // Orders
    const [orders, setOrders] = useState({ content: [], totalPages: 0, totalElements: 0 });
    const [orderPage, setOrderPage] = useState(0);
    const [orderFilter, setOrderFilter] = useState('ALL');
    const [selectedOrder, setSelectedOrder] = useState(null);

    // Contacts
    const [contacts, setContacts] = useState({ content: [], totalPages: 0, totalElements: 0 });
    const [contactPage, setContactPage] = useState(0);

    // Products
    const [products, setProducts] = useState([]);

    // ==================== DATA FETCHING ====================

    const fetchDashboard = useCallback(async () => {
        setLoading(true);
        try {
            const data = await adminService.getDashboard();
            setDashboard(data);
        } catch (err) {
            console.error('Dashboard fetch error:', err);
        }
        setLoading(false);
    }, []);

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            const data = await adminService.getOrders({
                page: orderPage,
                size: 15,
                status: orderFilter,
            });
            setOrders(data);
        } catch (err) {
            console.error('Orders fetch error:', err);
        }
        setLoading(false);
    }, [orderPage, orderFilter]);

    const fetchContacts = useCallback(async () => {
        setLoading(true);
        try {
            const data = await adminService.getContacts({ page: contactPage, size: 20 });
            setContacts(data);
        } catch (err) {
            console.error('Contacts fetch error:', err);
        }
        setLoading(false);
    }, [contactPage]);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const data = await adminService.getProducts();
            setProducts(data);
        } catch (err) {
            console.error('Products fetch error:', err);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        if (activeTab === 'dashboard') fetchDashboard();
        if (activeTab === 'orders') fetchOrders();
        if (activeTab === 'contacts') fetchContacts();
        if (activeTab === 'products') fetchProducts();
    }, [activeTab, fetchDashboard, fetchOrders, fetchContacts, fetchProducts]);

    // ==================== ACTIONS ====================

    const handleUpdateOrderStatus = async (orderId, status) => {
        try {
            await adminService.updateOrderStatus(orderId, status);
            fetchOrders();
            if (selectedOrder?.orderId === orderId) {
                setSelectedOrder(prev => ({ ...prev, status }));
            }
            fetchDashboard();
        } catch (err) {
            console.error('Update status error:', err);
        }
    };

    const handleMarkRead = async (id) => {
        try {
            await adminService.markContactRead(id);
            fetchContacts();
            fetchDashboard();
        } catch (err) {
            console.error('Mark read error:', err);
        }
    };

    const handleDeleteContact = async (id) => {
        if (!confirm('Xóa tin nhắn này?')) return;
        try {
            await adminService.deleteContact(id);
            fetchContacts();
            fetchDashboard();
        } catch (err) {
            console.error('Delete contact error:', err);
        }
    };

    // ==================== RENDER SECTIONS ====================

    const tabTitles = {
        dashboard: 'Tổng Quan',
        orders: 'Quản Lý Đơn Hàng',
        contacts: 'Tin Nhắn Liên Hệ',
        products: 'Quản Lý Sản Phẩm',
    };

    return (
        <div className="admin-layout">
            {/* SIDEBAR */}
            <aside className="admin-sidebar">
                <div className="admin-sidebar-header">
                    <div className="admin-sidebar-logo">☕</div>
                    <div className="admin-sidebar-title">
                        <h2>Nông Sản</h2>
                        <span>Admin Panel</span>
                    </div>
                </div>

                <nav className="admin-nav">
                    <div className="admin-nav-section">Tổng Quan</div>

                    <button
                        className={`admin-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                        onClick={() => setActiveTab('dashboard')}
                    >
                        <LayoutDashboard size={18} />
                        Dashboard
                    </button>

                    <div className="admin-nav-section">Quản Lý</div>

                    <button
                        className={`admin-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('orders'); setOrderPage(0); }}
                    >
                        <ShoppingCart size={18} />
                        Đơn Hàng
                        {dashboard?.pendingOrders > 0 && (
                            <span className="admin-nav-badge">{dashboard.pendingOrders}</span>
                        )}
                    </button>

                    <button
                        className={`admin-nav-item ${activeTab === 'contacts' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('contacts'); setContactPage(0); }}
                    >
                        <MessageSquare size={18} />
                        Tin Nhắn
                        {dashboard?.unreadContacts > 0 && (
                            <span className="admin-nav-badge">{dashboard.unreadContacts}</span>
                        )}
                    </button>

                    <button
                        className={`admin-nav-item ${activeTab === 'products' ? 'active' : ''}`}
                        onClick={() => setActiveTab('products')}
                    >
                        <Package size={18} />
                        Sản Phẩm
                    </button>
                </nav>

                <div className="admin-sidebar-footer">
                    <Link to="/" className="admin-back-link">
                        <Home size={16} />
                        Về trang chủ
                    </Link>
                </div>
            </aside>

            {/* MAIN */}
            <main className="admin-main">
                <div className="admin-topbar">
                    <div>
                        <div className="admin-topbar-breadcrumb">Admin / {tabTitles[activeTab]}</div>
                        <h1>{tabTitles[activeTab]}</h1>
                    </div>
                    <div className="admin-topbar-actions">
                        <div className="admin-topbar-time">
                            {new Date().toLocaleDateString('vi-VN', {
                                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                            })}
                        </div>
                    </div>
                </div>

                <div className="admin-content">
                    {activeTab === 'dashboard' && <DashboardSection dashboard={dashboard} loading={loading} />}
                    {activeTab === 'orders' && (
                        <OrdersSection
                            orders={orders}
                            loading={loading}
                            filter={orderFilter}
                            setFilter={(f) => { setOrderFilter(f); setOrderPage(0); }}
                            page={orderPage}
                            setPage={setOrderPage}
                            onViewOrder={setSelectedOrder}
                            onUpdateStatus={handleUpdateOrderStatus}
                        />
                    )}
                    {activeTab === 'contacts' && (
                        <ContactsSection
                            contacts={contacts}
                            loading={loading}
                            page={contactPage}
                            setPage={setContactPage}
                            onMarkRead={handleMarkRead}
                            onDelete={handleDeleteContact}
                        />
                    )}
                    {activeTab === 'products' && <ProductsSection products={products} loading={loading} />}
                </div>
            </main>

            {/* ORDER DETAIL MODAL */}
            {selectedOrder && (
                <OrderDetailModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    onUpdateStatus={handleUpdateOrderStatus}
                />
            )}
        </div>
    );
}

// ==================== DASHBOARD SECTION ====================

function DashboardSection({ dashboard, loading }) {
    if (loading || !dashboard) {
        return (
            <div className="admin-loading">
                <div className="admin-loading-spinner" />
                <span className="admin-loading-text">Đang tải dữ liệu...</span>
            </div>
        );
    }

    const stats = [
        { value: dashboard.totalOrders, label: 'Tổng đơn hàng', icon: ShoppingCart, color: 'blue' },
        { value: dashboard.pendingOrders, label: 'Chờ xác nhận', icon: Clock, color: 'amber' },
        { value: formatVND(dashboard.totalRevenue), label: 'Doanh thu', icon: DollarSign, color: 'green' },
        { value: dashboard.totalProducts, label: 'Sản phẩm', icon: Package, color: 'purple' },
    ];

    const stats2 = [
        { value: dashboard.todayOrders, label: 'Đơn hôm nay', icon: TrendingUp, color: 'rose' },
        { value: formatVND(dashboard.todayRevenue), label: 'Doanh thu hôm nay', icon: DollarSign, color: 'green' },
        { value: dashboard.unreadContacts, label: 'Tin nhắn mới', icon: MessageSquare, color: 'amber' },
        { value: dashboard.deliveredOrders, label: 'Đã giao', icon: CheckCircle, color: 'green' },
    ];

    return (
        <>
            <div className="admin-stats-grid">
                {stats.map((s, i) => (
                    <div className="admin-stat-card" key={i}>
                        <div className={`admin-stat-icon ${s.color}`}>
                            <s.icon size={24} />
                        </div>
                        <div>
                            <div className="admin-stat-value">{s.value}</div>
                            <div className="admin-stat-label">{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="admin-stats-grid">
                {stats2.map((s, i) => (
                    <div className="admin-stat-card" key={i}>
                        <div className={`admin-stat-icon ${s.color}`}>
                            <s.icon size={24} />
                        </div>
                        <div>
                            <div className="admin-stat-value">{s.value}</div>
                            <div className="admin-stat-label">{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Order status overview */}
            <div className="admin-table-container">
                <div className="admin-table-header">
                    <span className="admin-table-title">Phân Bổ Trạng Thái Đơn Hàng</span>
                </div>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Trạng thái</th>
                            <th>Số lượng</th>
                            <th>Tỷ lệ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            { key: 'pendingOrders', status: 'PENDING' },
                            { key: 'confirmedOrders', status: 'CONFIRMED' },
                            { key: 'shippingOrders', status: 'SHIPPING' },
                            { key: 'deliveredOrders', status: 'DELIVERED' },
                            { key: 'cancelledOrders', status: 'CANCELLED' },
                        ].map(({ key, status }) => (
                            <tr key={status}>
                                <td>
                                    <span className={`status-badge status-${status}`}>
                                        {STATUS_MAP[status].label}
                                    </span>
                                </td>
                                <td style={{ fontWeight: 700 }}>{dashboard[key]}</td>
                                <td>
                                    {dashboard.totalOrders > 0
                                        ? ((dashboard[key] / dashboard.totalOrders) * 100).toFixed(0) + '%'
                                        : '0%'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

// ==================== ORDERS SECTION ====================

function OrdersSection({ orders, loading, filter, setFilter, page, setPage, onViewOrder, onUpdateStatus }) {
    const filterOptions = ['ALL', ...STATUS_OPTIONS];

    return (
        <div className="admin-table-container">
            <div className="admin-table-header">
                <span className="admin-table-title">
                    Danh sách đơn hàng ({orders.totalElements || 0})
                </span>
                <div className="admin-table-filters">
                    {filterOptions.map((f) => (
                        <button
                            key={f}
                            className={`admin-filter-btn ${filter === f ? 'active' : ''}`}
                            onClick={() => setFilter(f)}
                        >
                            {f === 'ALL' ? 'Tất cả' : STATUS_MAP[f]?.label}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="admin-loading">
                    <div className="admin-loading-spinner" />
                    <span className="admin-loading-text">Đang tải...</span>
                </div>
            ) : !orders.content?.length ? (
                <div className="admin-empty">
                    <div className="admin-empty-icon">📦</div>
                    <div className="admin-empty-text">Chưa có đơn hàng nào</div>
                </div>
            ) : (
                <>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Mã đơn</th>
                                <th>Khách hàng</th>
                                <th>SĐT</th>
                                <th>Tổng tiền</th>
                                <th>Trạng thái</th>
                                <th>Ngày tạo</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.content.map((order) => (
                                <tr key={order.id}>
                                    <td style={{ fontWeight: 700, color: '#c8a96e' }}>
                                        #{order.orderId}
                                    </td>
                                    <td style={{ fontWeight: 600 }}>{order.fullName}</td>
                                    <td>{order.phone}</td>
                                    <td className="admin-price">{formatVND(order.grandTotal)}</td>
                                    <td>
                                        <span className={`status-badge status-${order.status}`}>
                                            {STATUS_MAP[order.status]?.label || order.status}
                                        </span>
                                    </td>
                                    <td>{formatDate(order.createdAt)}</td>
                                    <td>
                                        <div className="admin-actions-group">
                                            <button
                                                className="admin-action-btn primary"
                                                onClick={() => onViewOrder(order)}
                                                title="Xem chi tiết"
                                            >
                                                <Eye size={14} />
                                            </button>
                                            {order.status === 'PENDING' && (
                                                <button
                                                    className="admin-action-btn success"
                                                    onClick={() => onUpdateStatus(order.orderId, 'CONFIRMED')}
                                                    title="Xác nhận"
                                                >
                                                    <CheckCircle size={14} />
                                                </button>
                                            )}
                                            {order.status === 'CONFIRMED' && (
                                                <button
                                                    className="admin-action-btn"
                                                    onClick={() => onUpdateStatus(order.orderId, 'SHIPPING')}
                                                    title="Giao hàng"
                                                >
                                                    <Truck size={14} />
                                                </button>
                                            )}
                                            {order.status === 'SHIPPING' && (
                                                <button
                                                    className="admin-action-btn success"
                                                    onClick={() => onUpdateStatus(order.orderId, 'DELIVERED')}
                                                    title="Đã giao"
                                                >
                                                    <CheckCircle size={14} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="admin-pagination">
                        <span className="admin-pagination-info">
                            Trang {page + 1} / {orders.totalPages || 1} — {orders.totalElements || 0} đơn hàng
                        </span>
                        <div className="admin-pagination-btns">
                            <button
                                className="admin-pagination-btn"
                                disabled={page === 0}
                                onClick={() => setPage(page - 1)}
                            >
                                <ChevronLeft size={14} />
                            </button>
                            {Array.from({ length: Math.min(orders.totalPages || 1, 5) }, (_, i) => (
                                <button
                                    key={i}
                                    className={`admin-pagination-btn ${page === i ? 'active' : ''}`}
                                    onClick={() => setPage(i)}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                className="admin-pagination-btn"
                                disabled={page >= (orders.totalPages || 1) - 1}
                                onClick={() => setPage(page + 1)}
                            >
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

// ==================== ORDER DETAIL MODAL ====================

function OrderDetailModal({ order, onClose, onUpdateStatus }) {
    const [status, setStatus] = useState(order.status);

    const handleSaveStatus = () => {
        if (status !== order.status) {
            onUpdateStatus(order.orderId, status);
        }
    };

    return (
        <div className="admin-modal-overlay" onClick={onClose}>
            <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                <div className="admin-modal-header">
                    <span className="admin-modal-title">
                        Đơn hàng #{order.orderId}
                    </span>
                    <button className="admin-modal-close" onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>
                <div className="admin-modal-body">
                    <div className="admin-detail-grid">
                        <div className="admin-detail-item">
                            <span className="admin-detail-label">Khách hàng</span>
                            <span className="admin-detail-value">{order.fullName}</span>
                        </div>
                        <div className="admin-detail-item">
                            <span className="admin-detail-label">Số điện thoại</span>
                            <span className="admin-detail-value">{order.phone}</span>
                        </div>
                        <div className="admin-detail-item">
                            <span className="admin-detail-label">Email</span>
                            <span className="admin-detail-value">{order.email || '-'}</span>
                        </div>
                        <div className="admin-detail-item">
                            <span className="admin-detail-label">Phương thức thanh toán</span>
                            <span className="admin-detail-value">
                                {order.paymentMethod === 'cod' ? 'Thanh toán khi nhận' : order.paymentMethod}
                            </span>
                        </div>
                        <div className="admin-detail-item" style={{ gridColumn: 'span 2' }}>
                            <span className="admin-detail-label">Địa chỉ</span>
                            <span className="admin-detail-value">
                                {order.address}{order.district ? `, ${order.district}` : ''}{order.city ? `, ${order.city}` : ''}
                            </span>
                        </div>
                        {order.note && (
                            <div className="admin-detail-item" style={{ gridColumn: 'span 2' }}>
                                <span className="admin-detail-label">Ghi chú</span>
                                <span className="admin-detail-value">{order.note}</span>
                            </div>
                        )}
                        <div className="admin-detail-item">
                            <span className="admin-detail-label">Tạm tính</span>
                            <span className="admin-detail-value">{formatVND(order.subtotal)}</span>
                        </div>
                        <div className="admin-detail-item">
                            <span className="admin-detail-label">Phí ship</span>
                            <span className="admin-detail-value">{formatVND(order.shippingFee)}</span>
                        </div>
                        <div className="admin-detail-item">
                            <span className="admin-detail-label">Tổng cộng</span>
                            <span className="admin-detail-value" style={{ color: '#c8a96e', fontSize: '1.1rem', fontWeight: 800 }}>
                                {formatVND(order.grandTotal)}
                            </span>
                        </div>
                        <div className="admin-detail-item">
                            <span className="admin-detail-label">Ngày đặt</span>
                            <span className="admin-detail-value">{formatDate(order.createdAt)}</span>
                        </div>
                    </div>

                    {/* Order items */}
                    {order.items && order.items.length > 0 && (
                        <div className="admin-items-list">
                            <div className="admin-items-list-header">
                                Sản phẩm ({order.items.length})
                            </div>
                            {order.items.map((item, i) => (
                                <div className="admin-item-row" key={i}>
                                    {item.productImage && (
                                        <img
                                            src={item.productImage}
                                            alt={item.productName}
                                            className="admin-item-image"
                                        />
                                    )}
                                    <div className="admin-item-info">
                                        <div className="admin-item-name">{item.productName}</div>
                                        <div className="admin-item-variant">
                                            {item.variantLabel} × {item.quantity}
                                        </div>
                                    </div>
                                    <div className="admin-item-price">
                                        {formatVND(item.price * item.quantity)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Status update */}
                    <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span className="admin-detail-label" style={{ marginTop: 0 }}>Cập nhật trạng thái:</span>
                        <select
                            className="admin-status-select"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            {STATUS_OPTIONS.map((s) => (
                                <option key={s} value={s}>{STATUS_MAP[s].label}</option>
                            ))}
                        </select>
                        <button
                            className="admin-action-btn success"
                            onClick={handleSaveStatus}
                            disabled={status === order.status}
                            style={{ opacity: status === order.status ? 0.4 : 1 }}
                        >
                            <CheckCircle size={14} /> Lưu
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ==================== CONTACTS SECTION ====================

function ContactsSection({ contacts, loading, page, setPage, onMarkRead, onDelete }) {
    if (loading) {
        return (
            <div className="admin-loading">
                <div className="admin-loading-spinner" />
                <span className="admin-loading-text">Đang tải...</span>
            </div>
        );
    }

    if (!contacts.content?.length) {
        return (
            <div className="admin-table-container">
                <div className="admin-table-header">
                    <span className="admin-table-title">Tin nhắn liên hệ</span>
                </div>
                <div className="admin-empty">
                    <div className="admin-empty-icon">📬</div>
                    <div className="admin-empty-text">Chưa có tin nhắn nào</div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="admin-table-container" style={{ marginBottom: '1rem', padding: '1.25rem' }}>
                <span className="admin-table-title">
                    Tin nhắn liên hệ ({contacts.totalElements || 0})
                </span>
            </div>

            {contacts.content.map((msg) => (
                <div key={msg.id} className={`admin-contact-card ${!msg.read ? 'unread' : ''}`}>
                    <div className="admin-contact-top">
                        <div>
                            <div className="admin-contact-name">
                                {!msg.read && <span style={{ color: '#e94560', marginRight: '0.5rem' }}>●</span>}
                                {msg.name}
                            </div>
                            <div className="admin-contact-meta">
                                <span>{msg.phone}</span>
                                {msg.email && <span>{msg.email}</span>}
                                <span>{formatDate(msg.createdAt)}</span>
                            </div>
                        </div>
                        <div className="admin-actions-group">
                            {!msg.read && (
                                <button
                                    className="admin-action-btn primary"
                                    onClick={() => onMarkRead(msg.id)}
                                    title="Đánh dấu đã đọc"
                                >
                                    <MailOpen size={14} />
                                </button>
                            )}
                            <button
                                className="admin-action-btn danger"
                                onClick={() => onDelete(msg.id)}
                                title="Xóa"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>
                    {msg.subject && (
                        <div className="admin-contact-subject">📋 {msg.subject}</div>
                    )}
                    <div className="admin-contact-message">{msg.message}</div>
                </div>
            ))}

            {/* Pagination */}
            {contacts.totalPages > 1 && (
                <div className="admin-pagination" style={{ background: 'transparent', border: 'none', paddingLeft: 0 }}>
                    <span className="admin-pagination-info">
                        Trang {page + 1} / {contacts.totalPages}
                    </span>
                    <div className="admin-pagination-btns">
                        <button className="admin-pagination-btn" disabled={page === 0} onClick={() => setPage(page - 1)}>
                            <ChevronLeft size={14} />
                        </button>
                        <button className="admin-pagination-btn" disabled={page >= contacts.totalPages - 1} onClick={() => setPage(page + 1)}>
                            <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// ==================== PRODUCTS SECTION ====================

function ProductsSection({ products, loading }) {
    if (loading) {
        return (
            <div className="admin-loading">
                <div className="admin-loading-spinner" />
                <span className="admin-loading-text">Đang tải...</span>
            </div>
        );
    }

    return (
        <div className="admin-table-container">
            <div className="admin-table-header">
                <span className="admin-table-title">Danh sách sản phẩm ({products.length})</span>
            </div>

            {!products.length ? (
                <div className="admin-empty">
                    <div className="admin-empty-icon">📦</div>
                    <div className="admin-empty-text">Chưa có sản phẩm nào</div>
                </div>
            ) : (
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Sản phẩm</th>
                            <th>Danh mục</th>
                            <th>Giá</th>
                            <th>Giá gốc</th>
                            <th>Đơn vị</th>
                            <th>Badge</th>
                            <th>Nổi bật</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((p) => (
                            <tr key={p.id}>
                                <td>
                                    <div className="admin-product-name-cell">
                                        <img src={p.image} alt={p.name} className="admin-product-image" />
                                        <div>
                                            <div className="admin-product-name">{p.name}</div>
                                            <div className="admin-product-category">{p.slug}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span className={`status-badge status-CONFIRMED`}>
                                        {p.category?.name || '-'}
                                    </span>
                                </td>
                                <td className="admin-price">{formatVND(p.price)}</td>
                                <td style={{ textDecoration: p.originalPrice ? 'line-through' : 'none', opacity: 0.5 }}>
                                    {p.originalPrice ? formatVND(p.originalPrice) : '-'}
                                </td>
                                <td>{p.unit || '-'}</td>
                                <td>
                                    {p.badge && (
                                        <span className={`status-badge status-${p.badgeType === 'sale' ? 'CANCELLED' : 'DELIVERED'}`}>
                                            {p.badge}
                                        </span>
                                    )}
                                </td>
                                <td>{p.featured ? '⭐' : '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
