import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import api from "../utils/axios";
import Sidebar from "../components/Sidebar";

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
                </section>
            </main>
        </div>
    );
}
