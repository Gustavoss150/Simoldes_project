import { useState } from "react";
import { useRouter } from "next/router";

const Login = () => {
  const [registration, setRegistration] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          registration: parseInt(registration),
          password: password,
        }),
      });

      if (response.ok) {
        const { token } = await response.json();
        localStorage.setItem(process.env.NEXT_PUBLIC_TOKEN_KEY, token);
        router.push("/dashboard");
      } else {
        throw new Error("Credenciais inválidas.");
      }
    } catch (err) {
      setError(err.message || "Erro ao tentar login.");
    }
  };

  return (
    <div className="authDesign">
      <div className="left">
        <h1>Login</h1>
        <p>Entre para acessar sua conta</p>
      </div>
      <div className="right">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Matrícula"
            value={registration}
            onChange={(e) => setRegistration(e.target.value)}
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="btn">Login</button>
          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;
