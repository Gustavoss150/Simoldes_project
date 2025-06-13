import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import api from '../utils/axios';
import LogoutButton from './Logout';

const AppSidebar = () => {
    const [visible, setVisible] = useState(false);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await api.get('/users/me');
                setUserRole(response.data.role);
            } catch (error) {
                console.error('Erro ao buscar dados do usuário:', error);
            }
        };
        fetchUserData();
    }, []);

    return (
        <div>
            <Button icon="pi pi-bars" onClick={() => setVisible(true)} className="p-button-rounded p-button-success p-button-text" />

            <Sidebar
                visible={visible}
                onHide={() => setVisible(false)}
                position="left"
                showCloseIcon
                className="custom-sidebar"
            >
                <div>
                    <h2>Simoldes Aços</h2>
                    <ul>
                        <SidebarLink href="/dashboard" label="Dashboard" />
                        <SidebarLink href="/projects" label="Projetos" />
                        <SidebarLink href="/materials" label="Materiais" />
                        <SidebarLink href="/cnc" label="CNC" />
                        <LogoutButton />
                        {userRole === 'user' && <SidebarLink href="/users/" label="Editar Dados" />}
                        {userRole === 'admin' && <SidebarLink href="/users/" label="Gerenciar Usuários" />}
                    </ul>
                </div>
            </Sidebar>

        </div>
    );
};

const SidebarLink = ({ href, label }) => (
    <li>
        <Link href={href}>
            <span className="cursor-pointer hover:text-green-700 transition-colors">{label}</span>
        </Link>
    </li>
);

export default AppSidebar;