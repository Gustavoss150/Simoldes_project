import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import api from "../utils/axios";

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Verificar se o token existe
    const token = localStorage.getItem(process.env.NEXT_PUBLIC_TOKEN_KEY);
    if (!token) {
      router.push("/auth/login"); // Redireciona se não tiver token
    } else {
      // Buscar dados do usuário após o login
      const fetchUserData = async () => {
        try {
          const response = await api.get("/user/profile"); // Exemplo de endpoint para obter dados do usuário
          setUserData(response.data);
        } catch (err) {
          setError("Erro ao carregar os dados do usuário.");
        }
      };

      fetchUserData();
    }
  }, [router]);

  return (
    <div>
      {error && <p className="text-red-500">{error}</p>}
      <h2>Dashboard</h2>
      {userData ? (
        <div>
          <h3>Bem-vindo, {userData.name}</h3>
          {/* Exibir dados do usuário */}
        </div>
      ) : (
        <p>Carregando...</p>
      )}
    </div>
  );
}
