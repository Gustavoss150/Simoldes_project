import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import api from "../utils/axios";
import Sidebar from "../components/Sidebar";
import Link from "next/link"; // Certifique-se de importar o Link

export default function Dashboard() {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState("");
    const [usersList, setUsersList] = useState([]);  // Para armazenar os usuários (para admins)
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem(process.env.NEXT_PUBLIC_TOKEN_KEY);
        if (!token) {
            router.push("/auth/login");
            return;
        }

        const fetchUserData = async () => {
            try {
                const response = await api.get(`/users/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUserData(response.data);

                // Se o usuário for admin, carregue a lista de todos os usuários
                if (response.data.role === 'admin') {
                    const usersResponse = await api.get(`/users/`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setUsersList(usersResponse.data);
                }
            } catch (err) {
                setError("Erro ao carregar os dados do usuário.");
                console.error("Erro na API:", err);
                router.push("/auth/login");
            }
        };

        fetchUserData();
    }, [router]);

    return (
        <div className="dashboard-container flex">
            <Sidebar />
            <main className="dashboard-main flex-1 p-6">
                <header className="dashboard-header">
                    {userData ? (
                        <div>
                            <h3 className="text-2xl font-bold">{userData.name}</h3>
                            <p>Matrícula: {userData.registration}</p>
                            <p>Departamento: {userData.department}</p>
                            <p>Role: {userData.role}</p>
                        </div>
                    ) : (
                        <p>Carregando...</p>
                    )}
                </header>

                <section className="dashboard-content mt-4">
                    <h2 className="text-xl font-semibold">Simoldes PCP</h2>
                    {error && <p className="text-red-500">{error}</p>}

                    {/* Lista de usuários para admins */}
                    {userData?.role === 'admin' && (
                        <div className="mt-4">
                            <h3 className="text-lg font-medium">Lista de Usuários</h3>
                            <ul>
                                {usersList.map((user) => (
                                    <li key={user.id} className="my-2">
                                        <span>{user.name} - {user.registration}</span>
                                        <Link href={`/users/${user.id}`} className="ml-4 text-blue-600">
                                            Editar
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}
