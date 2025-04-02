import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import api from '../utils/axios';

const Sidebar = () => {
    const [userRole, setUserRole] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

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

    const toggleSidebar = () => {
        setIsOpen(prevState => !prevState);
    };

    return (
        <>
            {/* Botão para abrir o menu */}
            <button className="menu-button" onClick={toggleSidebar}>
                {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
            </button>

            {/* Sidebar */}
            <div className={`sidebar ${isOpen ? 'open' : ''}`} onClick={toggleSidebar}>
                <h2 className="sidebar-title">Simoldes Aços</h2>
                <ul>
                    <SidebarLink href="/dashboard" label="Dashboard" />
                    <SidebarLink href="/projects" label="Projetos" />
                    <SidebarLink href="/materials" label="Materiais" />

                    {userRole === 'user' && <SidebarLink href="/users/" label="Editar Dados" />}
                    {userRole === 'admin' && <SidebarLink href="/users/" label="Gerenciar Usuários" />}
                </ul>
            </div>

            <style jsx>{`
                .menu-button {
                    position: fixed;
                    top: 20px;
                    left: 20px;
                    background: #267a40;
                    color: white;
                    border: none;
                    padding: 10px;
                    border-radius: 50%;
                    cursor: pointer;
                    transition: transform 0.3s ease;
                }

                .menu-button:hover {
                    transform: scale(1.1);
                }

                .sidebar {
                    position: fixed;
                    left: -250px;
                    top: 0;
                    width: 250px;
                    height: 100vh;
                    background: #267a40;
                    color: white;
                    padding: 20px;
                    transition: left 0.3s ease-in-out;
                }

                .sidebar.open {
                    left: 0;
                }

                .sidebar-title {
                    font-size: 22px;
                    margin-bottom: 20px;
                }

                .sidebar ul {
                    list-style: none;
                    padding: 0;
                }

                .sidebar-item {
                    padding: 10px;
                    text-align: center;
                    transition: background 0.3s;
                }

                .sidebar-item:hover {
                    background: #2B6B5F;
                }

                .sidebar-link {
                    color: white;
                    text-decoration: none;
                    display: block;
                    padding: 10px;
                }
            `}</style>
        </>
    );
};

const SidebarLink = ({ href, label }) => (
    <li className="sidebar-item">
        <Link href={href}>
            <span className="sidebar-link">{label}</span>
        </Link>
    </li>
);

export default Sidebar;
