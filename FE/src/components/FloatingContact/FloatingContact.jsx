import { useState } from 'react';
import { MessageCircle, Phone, X } from 'lucide-react';
import './FloatingContact.css';

export default function FloatingContact() {
    const [open, setOpen] = useState(false);

    return (
        <div className="floating-contact" aria-label="Liên hệ nhanh">
            {/* Popup buttons */}
            <div className={`floating-options ${open ? 'show' : ''}`}>
                <a
                    href="https://zalo.me/0826487948"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="floating-opt zalo-opt"
                    aria-label="Chat Zalo"
                    title="Chat Zalo"
                >
                    <span className="floating-opt-icon">
                        <svg width="22" height="22" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M28 0C12.536 0 0 12.536 0 28C0 43.464 12.536 56 28 56C43.464 56 56 43.464 56 28C56 12.536 43.464 0 28 0Z" fill="white" />
                            <text x="8" y="38" fontFamily="Arial" fontWeight="bold" fontSize="22" fill="#0068ff">Zalo</text>
                        </svg>
                    </span>
                    <span className="floating-opt-label">Chat Zalo</span>
                </a>

                <a
                    href="tel:0826487948"
                    className="floating-opt phone-opt"
                    aria-label="Gọi điện"
                    title="Gọi điện"
                >
                    <span className="floating-opt-icon">
                        <Phone size={20} />
                    </span>
                    <span className="floating-opt-label">0826 487 948</span>
                </a>
            </div>

            {/* Main toggle button */}
            <button
                className={`floating-main-btn ${open ? 'active' : ''}`}
                onClick={() => setOpen(!open)}
                aria-label="Mở liên hệ nhanh"
                id="floating-contact-btn"
            >
                {open ? <X size={22} /> : <MessageCircle size={22} />}
                {!open && <span className="floating-pulse" />}
            </button>
        </div>
    );
}
