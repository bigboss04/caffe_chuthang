import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
    LayoutDashboard, ShoppingCart, Package, Tag, Users, Gift, Star,
    Warehouse, Truck, BarChart3, Layout, Settings, MessageSquare, Home
} from 'lucide-react';
import adminService from '../../services/adminService';
import DashboardSection from './sections/DashboardSection';
import ProductsSection from './sections/ProductsSection';
import CategoriesSection from './sections/CategoriesSection';
import OrdersSection from './sections/OrdersSection';
import CustomersSection from './sections/CustomersSection';
import CouponsSection from './sections/CouponsSection';
import ReviewsSection from './sections/ReviewsSection';
import InventorySection from './sections/InventorySection';
import ShippingSection from './sections/ShippingSection';
import AnalyticsSection from './sections/AnalyticsSection';
import CMSSection from './sections/CMSSection';
import SettingsSection from './sections/SettingsSection';
import ContactsSection from './sections/ContactsSection';
import './AdminPage.css';

const NAV_ITEMS = [
    {
        group: 'Tổng Quan', items: [
            { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        ]
    },
    {
        group: 'Quản Lý', items: [
            { key: 'orders', label: 'Đơn Hàng', icon: ShoppingCart, badgeKey: 'pendingOrders' },
            { key: 'products', label: 'Sản Phẩm', icon: Package },
            { key: 'categories', label: 'Danh Mục', icon: Tag },
            { key: 'customers', label: 'Khách Hàng', icon: Users },
            { key: 'inventory', label: 'Kho', icon: Warehouse },
        ]
    },
    {
        group: 'Marketing', items: [
            { key: 'coupons', label: 'Khuyến Mãi', icon: Gift },
            { key: 'reviews', label: 'Đánh Giá', icon: Star },
        ]
    },
    {
        group: 'Vận Hành', items: [
            { key: 'shipping', label: 'Giao Hàng', icon: Truck },
            { key: 'analytics', label: 'Thống Kê', icon: BarChart3 },
            { key: 'contacts', label: 'Tin Nhắn', icon: MessageSquare, badgeKey: 'unreadContacts' },
        ]
    },
    {
        group: 'Hệ Thống', items: [
            { key: 'cms', label: 'Nội Dung', icon: Layout },
            { key: 'settings', label: 'Cài Đặt', icon: Settings },
        ]
    },
];

const SECTION_TITLES = {
    dashboard: 'Tổng Quan', orders: 'Đơn Hàng', products: 'Sản Phẩm', categories: 'Danh Mục',
    customers: 'Khách Hàng', coupons: 'Khuyến Mãi', reviews: 'Đánh Giá', inventory: 'Kho',
    shipping: 'Giao Hàng', analytics: 'Thống Kê', contacts: 'Tin Nhắn', cms: 'Nội Dung', settings: 'Cài Đặt'
};

export default function AdminPage() {
    const [active, setActive] = useState('dashboard');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({});

    const fetchData = useCallback(async (section, params) => {
        setLoading(true);
        try {
            let result;
            switch (section || active) {
                case 'dashboard': result = await adminService.getDashboard(); break;
                case 'products': {
                    const [prods, cats] = await Promise.all([adminService.getProducts(), adminService.getCategories()]);
                    result = { products: prods, categories: cats }; break;
                }
                case 'categories': result = await adminService.getCategories(); break;
                case 'orders': result = await adminService.getOrders(params); break;
                case 'customers': result = await adminService.getCustomers(params); break;
                case 'coupons': result = await adminService.getCoupons(); break;
                case 'reviews': result = await adminService.getReviews(params); break;
                case 'inventory': result = await adminService.getInventory(); break;
                case 'shipping': result = await adminService.getShippingZones(); break;
                case 'analytics': result = await adminService.getAnalytics(params || 30); break;
                case 'cms': result = await adminService.getBanners(); break;
                case 'settings': result = await adminService.getSettings(); break;
                case 'contacts': result = await adminService.getContacts(params); break;
                default: break;
            }
            setData(prev => ({ ...prev, [section || active]: result }));
        } catch (e) { console.error('Admin fetch error:', e); }
        setLoading(false);
    }, [active]);

    useEffect(() => { fetchData(active); }, [active]);

    const handleNav = (key) => { setActive(key); };
    const dashBadges = data.dashboard || {};

    const today = new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const renderSection = () => {
        switch (active) {
            case 'dashboard': return <DashboardSection dashboard={data.dashboard} loading={loading} />;
            case 'products': return <ProductsSection products={data.products?.products || data.products} categories={data.products?.categories} loading={loading} onRefresh={() => fetchData('products')} />;
            case 'categories': return <CategoriesSection categories={data.categories} loading={loading} onRefresh={() => fetchData('categories')} />;
            case 'orders': return <OrdersSection orders={data.orders} loading={loading} onRefresh={(p) => fetchData('orders', p)} />;
            case 'customers': return <CustomersSection customers={data.customers} loading={loading} onRefresh={(p) => fetchData('customers', p)} />;
            case 'coupons': return <CouponsSection coupons={data.coupons} loading={loading} onRefresh={() => fetchData('coupons')} />;
            case 'reviews': return <ReviewsSection reviews={data.reviews} loading={loading} onRefresh={() => fetchData('reviews')} />;
            case 'inventory': return <InventorySection inventory={data.inventory} loading={loading} onRefresh={() => fetchData('inventory')} />;
            case 'shipping': return <ShippingSection zones={data.shipping} loading={loading} onRefresh={() => fetchData('shipping')} />;
            case 'analytics': return <AnalyticsSection analytics={data.analytics} loading={loading} onRefresh={(d) => fetchData('analytics', d)} />;
            case 'cms': return <CMSSection banners={data.cms} loading={loading} onRefresh={() => fetchData('cms')} />;
            case 'settings': return <SettingsSection settings={data.settings} loading={loading} onRefresh={() => fetchData('settings')} />;
            case 'contacts': return <ContactsSection contacts={data.contacts} loading={loading} onRefresh={() => fetchData('contacts')} />;
            default: return null;
        }
    };

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="admin-sidebar-header">
                    <div className="admin-sidebar-logo">☕</div>
                    <div className="admin-sidebar-title">
                        <h2>Nông Sản</h2>
                        <span>Admin Panel</span>
                    </div>
                </div>
                <nav className="admin-nav">
                    {NAV_ITEMS.map(group => (
                        <div key={group.group} className="admin-nav-group">
                            <div className="admin-nav-group-title">{group.group}</div>
                            {group.items.map(item => {
                                const Icon = item.icon;
                                const badge = item.badgeKey ? dashBadges[item.badgeKey] : 0;
                                return (
                                    <button key={item.key} className={`admin-nav-item ${active === item.key ? 'active' : ''}`} onClick={() => handleNav(item.key)}>
                                        <Icon size={18} className="nav-icon" />
                                        <span>{item.label}</span>
                                        {badge > 0 && <span className="admin-nav-badge">{badge}</span>}
                                    </button>
                                );
                            })}
                        </div>
                    ))}
                </nav>
                <div className="admin-sidebar-footer">
                    <Link to="/"><Home size={16} /> <span>Về trang chủ</span></Link>
                </div>
            </aside>

            <main className="admin-main">
                <div className="admin-header">
                    <div className="admin-header-left">
                        <div className="breadcrumb">Admin / {SECTION_TITLES[active]}</div>
                        <h1>{SECTION_TITLES[active]}</h1>
                    </div>
                    <div className="admin-header-right">
                        <span style={{ fontSize: '0.85rem', color: 'var(--admin-text-secondary)' }}>{today}</span>
                    </div>
                </div>
                {renderSection()}
            </main>
        </div>
    );
}
