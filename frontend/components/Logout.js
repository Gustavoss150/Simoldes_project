import React from 'react';
import { useRouter } from 'next/router';
import 'primeicons/primeicons.css';

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem(process.env.NEXT_PUBLIC_TOKEN_KEY);
        router.push('/login');
    };

    return (
        <div className="logout-container">
            <button className="logout-button" onClick={handleLogout}>
                <i className="pi pi-sign-out" />
                Sair
            </button>
        </div>
    );
}
