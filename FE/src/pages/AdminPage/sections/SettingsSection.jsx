import { useState, useEffect } from 'react';
import adminService from '../../../services/adminService';

const DEFAULT_SETTINGS = [
    { settingKey: 'store_name', label: 'Tên cửa hàng', type: 'text', settingValue: '' },
    { settingKey: 'store_email', label: 'Email', type: 'text', settingValue: '' },
    { settingKey: 'store_phone', label: 'Số điện thoại', type: 'text', settingValue: '' },
    { settingKey: 'store_address', label: 'Địa chỉ', type: 'textarea', settingValue: '' },
    { settingKey: 'store_logo', label: 'Logo URL', type: 'text', settingValue: '' },
    { settingKey: 'shipping_fee', label: 'Phí ship mặc định (₫)', type: 'number', settingValue: '' },
    { settingKey: 'free_ship_min', label: 'Miễn phí ship từ (₫)', type: 'number', settingValue: '' },
    { settingKey: 'facebook_url', label: 'Facebook URL', type: 'text', settingValue: '' },
    { settingKey: 'zalo_phone', label: 'Zalo', type: 'text', settingValue: '' },
];

export default function SettingsSection({ settings: initialSettings, loading, onRefresh }) {
    const [form, setForm] = useState({});
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const map = {};
        (initialSettings || []).forEach(s => { map[s.settingKey] = s.settingValue || ''; });
        DEFAULT_SETTINGS.forEach(s => { if (!map[s.settingKey]) map[s.settingKey] = s.settingValue; });
        setForm(map);
    }, [initialSettings]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const payload = DEFAULT_SETTINGS.map(s => ({ settingKey: s.settingKey, settingValue: form[s.settingKey] || '', label: s.label, type: s.type }));
            await adminService.updateSettings(payload);
            setSaved(true); setTimeout(() => setSaved(false), 2000);
            onRefresh();
        } catch { alert('Lỗi'); }
        setSaving(false);
    };

    if (loading) return <div className="admin-loading"><div className="admin-spinner" />Đang tải...</div>;

    return (
        <div className="admin-section-card">
            <div className="admin-section-header">
                <h2>⚙️ Cài Đặt Hệ Thống</h2>
                {saved && <span style={{ color: 'var(--admin-success)', fontSize: '0.85rem', fontWeight: 600 }}>✓ Đã lưu</span>}
            </div>
            <div className="admin-section-body">
                {DEFAULT_SETTINGS.map(s => (
                    <div key={s.settingKey} className="admin-form-group">
                        <label>{s.label}</label>
                        {s.type === 'textarea' ? (
                            <textarea className="admin-textarea" value={form[s.settingKey] || ''} onChange={e => setForm({ ...form, [s.settingKey]: e.target.value })} />
                        ) : (
                            <input type={s.type === 'number' ? 'number' : 'text'} className="admin-input" value={form[s.settingKey] || ''} onChange={e => setForm({ ...form, [s.settingKey]: e.target.value })} />
                        )}
                    </div>
                ))}
                {form.store_logo && (
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--admin-text-secondary)', marginBottom: '0.5rem', display: 'block' }}>Preview Logo</label>
                        <img src={form.store_logo} alt="Logo" style={{ maxHeight: 80, borderRadius: 8 }} />
                    </div>
                )}
                <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={saving} style={{ marginTop: '0.5rem' }}>
                    {saving ? 'Đang lưu...' : '💾 Lưu Cài Đặt'}
                </button>
            </div>
        </div>
    );
}
