import { useState } from 'react';
import { Coffee, Lock, User, Eye, EyeOff, Shield, AlertCircle } from 'lucide-react';
import adminAuthService from '../../services/adminAuthService';

export default function AdminLoginPage({ onLoginSuccess }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!username.trim() || !password.trim()) {
            setError('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu');
            return;
        }

        setLoading(true);
        try {
            const result = await adminAuthService.login(username.trim(), password);
            if (result.success) {
                onLoginSuccess(result.data);
            } else {
                setError(result.message || 'Đăng nhập thất bại');
            }
        } catch (err) {
            const msg = err.response?.data?.message || 'Không thể kết nối đến server';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-wrapper">
            <div className="admin-login-bg">
                <div className="admin-login-circle admin-login-circle-1" />
                <div className="admin-login-circle admin-login-circle-2" />
                <div className="admin-login-circle admin-login-circle-3" />
            </div>
            <div className="admin-login-card">
                <div className="admin-login-header">
                    <div className="admin-login-logo">
                        <Coffee size={32} />
                    </div>
                    <h1>Quản Trị Viên</h1>
                    <p>Đăng nhập để quản lý hệ thống</p>
                </div>

                <form onSubmit={handleSubmit} className="admin-login-form">
                    {error && (
                        <div className="admin-login-error">
                            <AlertCircle size={16} />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="admin-login-field">
                        <label htmlFor="admin-username">
                            <User size={14} />
                            Tên đăng nhập
                        </label>
                        <input
                            id="admin-username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Nhập tên đăng nhập..."
                            autoComplete="username"
                            autoFocus
                        />
                    </div>

                    <div className="admin-login-field">
                        <label htmlFor="admin-password">
                            <Lock size={14} />
                            Mật khẩu
                        </label>
                        <div className="admin-login-password-wrap">
                            <input
                                id="admin-password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Nhập mật khẩu..."
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                className="admin-login-toggle-pw"
                                onClick={() => setShowPassword(p => !p)}
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="admin-login-submit"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="admin-login-spinner" />
                        ) : (
                            <>
                                <Shield size={18} />
                                Đăng Nhập
                            </>
                        )}
                    </button>
                </form>

                <div className="admin-login-footer">
                    <p>Nông Sản Phú Yên &copy; {new Date().getFullYear()}</p>
                </div>
            </div>

            <style>{`
                .admin-login-wrapper {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #1a1210;
                    position: relative;
                    overflow: hidden;
                    font-family: 'Inter', sans-serif;
                }
                .admin-login-bg {
                    position: absolute;
                    inset: 0;
                    z-index: 0;
                }
                .admin-login-circle {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(100px);
                    opacity: 0.15;
                }
                .admin-login-circle-1 {
                    width: 500px; height: 500px;
                    background: #C8A96E;
                    top: -100px; right: -100px;
                    animation: floatA 8s ease-in-out infinite;
                }
                .admin-login-circle-2 {
                    width: 400px; height: 400px;
                    background: #8B6914;
                    bottom: -80px; left: -80px;
                    animation: floatA 10s ease-in-out infinite reverse;
                }
                .admin-login-circle-3 {
                    width: 300px; height: 300px;
                    background: #C8A96E;
                    top: 50%; left: 50%;
                    transform: translate(-50%, -50%);
                    animation: floatA 6s ease-in-out infinite;
                }
                @keyframes floatA {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    50% { transform: translate(20px, -20px) scale(1.1); }
                }
                .admin-login-card {
                    position: relative;
                    z-index: 1;
                    width: 100%;
                    max-width: 420px;
                    margin: 1rem;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(200,169,110,0.15);
                    border-radius: 24px;
                    padding: 3rem 2.5rem;
                    backdrop-filter: blur(40px);
                    box-shadow: 0 25px 60px rgba(0,0,0,0.5);
                }
                .admin-login-header {
                    text-align: center;
                    margin-bottom: 2.5rem;
                }
                .admin-login-logo {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 64px; height: 64px;
                    background: linear-gradient(135deg, #C8A96E, #8B6914);
                    border-radius: 20px;
                    color: #fff;
                    margin-bottom: 1.25rem;
                    box-shadow: 0 8px 32px rgba(200,169,110,0.3);
                }
                .admin-login-header h1 {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.75rem;
                    color: #F5F0E8;
                    font-weight: 800;
                    margin: 0 0 0.35rem;
                    letter-spacing: -0.5px;
                }
                .admin-login-header p {
                    color: rgba(245,240,232,0.5);
                    font-size: 0.85rem;
                    margin: 0;
                }
                .admin-login-error {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: rgba(220,53,69,0.15);
                    border: 1px solid rgba(220,53,69,0.3);
                    color: #ff6b6b;
                    padding: 0.75rem 1rem;
                    border-radius: 12px;
                    font-size: 0.85rem;
                    margin-bottom: 1rem;
                    animation: shakeX 0.4s ease;
                }
                @keyframes shakeX {
                    0%, 100% { transform: translateX(0); }
                    20% { transform: translateX(-8px); }
                    40% { transform: translateX(8px); }
                    60% { transform: translateX(-4px); }
                    80% { transform: translateX(4px); }
                }
                .admin-login-field {
                    margin-bottom: 1.25rem;
                }
                .admin-login-field label {
                    display: flex;
                    align-items: center;
                    gap: 0.4rem;
                    font-size: 0.75rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    color: rgba(245,240,232,0.6);
                    margin-bottom: 0.5rem;
                }
                .admin-login-field input {
                    width: 100%;
                    padding: 0.85rem 1rem;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(200,169,110,0.2);
                    border-radius: 12px;
                    color: #F5F0E8;
                    font-size: 0.95rem;
                    font-family: 'Inter', sans-serif;
                    transition: all 0.3s;
                    outline: none;
                    box-sizing: border-box;
                }
                .admin-login-field input:focus {
                    border-color: #C8A96E;
                    box-shadow: 0 0 0 3px rgba(200,169,110,0.15);
                    background: rgba(255,255,255,0.08);
                }
                .admin-login-field input::placeholder {
                    color: rgba(245,240,232,0.25);
                }
                .admin-login-password-wrap {
                    position: relative;
                }
                .admin-login-password-wrap input {
                    padding-right: 2.75rem;
                }
                .admin-login-toggle-pw {
                    position: absolute;
                    right: 0.75rem;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    color: rgba(245,240,232,0.4);
                    cursor: pointer;
                    padding: 0.25rem;
                    display: flex;
                    transition: color 0.2s;
                }
                .admin-login-toggle-pw:hover {
                    color: #C8A96E;
                }
                .admin-login-submit {
                    width: 100%;
                    padding: 0.9rem;
                    background: linear-gradient(135deg, #C8A96E, #8B6914);
                    color: #fff;
                    font-weight: 800;
                    font-size: 0.9rem;
                    border: none;
                    border-radius: 14px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    transition: all 0.3s;
                    margin-top: 0.5rem;
                    font-family: 'Inter', sans-serif;
                    box-shadow: 0 8px 24px rgba(200,169,110,0.3);
                }
                .admin-login-submit:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 12px 32px rgba(200,169,110,0.4);
                }
                .admin-login-submit:active:not(:disabled) {
                    transform: translateY(0);
                }
                .admin-login-submit:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }
                .admin-login-spinner {
                    width: 20px; height: 20px;
                    border: 2px solid rgba(255,255,255,0.3);
                    border-top-color: #fff;
                    border-radius: 50%;
                    animation: spin 0.6s linear infinite;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                .admin-login-footer {
                    text-align: center;
                    margin-top: 2rem;
                    padding-top: 1.5rem;
                    border-top: 1px solid rgba(200,169,110,0.1);
                }
                .admin-login-footer p {
                    color: rgba(245,240,232,0.25);
                    font-size: 0.75rem;
                    margin: 0;
                }
            `}</style>
        </div>
    );
}
