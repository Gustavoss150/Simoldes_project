import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import api from "../utils/axios";
import Sidebar from "../components/Sidebar";
import UsersTable from "../components/UsersTable";
import UserUpdateForm from "../components/UserUpdateForm";
import styles from '../styles/Users.module.css';

export default function Users() {
    const [userData, setUserData] = useState(null);
    const [usersList, setUsersList] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem(process.env.NEXT_PUBLIC_TOKEN_KEY);
                const response = await api.get("/users/me", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUserData(response.data);
                setIsAdmin(response.data.role === "admin");

                if (response.data.role === "admin") {
                    const usersResponse = await api.get("/users/", {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setUsersList(usersResponse.data);
                }
            } catch (err) {
                console.error("Erro ao buscar os dados do usuário:", err);
                router.push("/auth/login");
            }
        };

        fetchUserData();
    }, [router, updateSuccess]);

    const handleUserSelect = (userId) => {
        const user = usersList.find((user) => user.id === userId);
        setSelectedUser(user);
    };

    const handleCloseForm = () => {
        setSelectedUser(null);
    };

    const handleUpdateSuccess = () => {
        setUpdateSuccess(prev => !prev); // Alterna o estado para forçar atualização
    };

    return (
        <div className={styles.container}>
            <Sidebar />
            <div className={styles.mainContent}>
                <h2 className={styles.title}>Gerenciamento de Usuários</h2>

                {userData && (
                    <div className={styles.userSection}>
                        <h3 className={styles.subtitle}>Meus Dados</h3>
                        <UserUpdateForm 
                            user={userData} 
                            onUpdateSuccess={handleUpdateSuccess}
                        />
                    </div>
                )}

                {isAdmin && (
                    <div className={styles.tableSection}>
                        <div className={styles.tableContainer}>
                            <h3 className={styles.title}>Lista de Usuários</h3>
                            <UsersTable 
                                users={usersList} 
                                onUserSelect={handleUserSelect}  
                            />
                        </div>
                        
                        {/* Container de edição à direita */}
                        {selectedUser && (
                            <div className={styles.editFormContainer}>
                                <UserUpdateForm 
                                    user={selectedUser} 
                                    isAdmin={true}
                                    onClose={handleCloseForm}
                                    onUpdateSuccess={handleUpdateSuccess}
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}