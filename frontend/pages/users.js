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
    const [selectedUser, setSelectedUser] = useState(null); // Estado para armazenar o usuário selecionado para edição
    const [isAdmin, setIsAdmin] = useState(false);
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

                // Se for admin, carrega a lista de usuários
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
    }, [router]);

    const handleUserSelect = (userId) => {
        const user = usersList.find((user) => user.id === userId);
        setSelectedUser(user); // Atualiza o estado com o usuário selecionado
    };

    return (
        <div className={styles.container}>
            <Sidebar />
            <div className={styles.mainContent}>
                <h2 className={styles.title}>Gerenciamento de Usuários</h2>

                {userData && <UserUpdateForm user={userData} />}

                {isAdmin && (
                    <div className={styles.tableContainer}>
                        <h3 className={styles.title}>Lista de Usuários</h3>
                        <UsersTable 
                            users={usersList} 
                            onUserSelect={handleUserSelect}  
                        />
                    </div>
                )}

                {selectedUser && (
                    <div className={styles.editContainer}>
                        <h3 className={styles.title}>Editar Usuário: {selectedUser.name}</h3>
                        <UserUpdateForm user={selectedUser} />
                    </div>
                )}
            </div>
        </div>
    );
}

