import { useState } from "react";
import { useRouter } from "next/router";

const Register = () => {
  const [registration, setRegistration] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user");
  const [department, setDepartment] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const registrationNumber = parseInt(registration);
    if (isNaN(registrationNumber) || registrationNumber <= 0) {
      setError("Matrícula inválida. Por favor, insira um número válido.");
      return;
    }
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }
    if (!name) {
      setError("Nome é obrigatório.");
      return;
    }
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          registration: registrationNumber,
          name: name,
          password: password,
          role: role,
          department: department,
        }),
      });
      if (response.ok) {
        router.push("/login");
      } else {
        throw new Error("Erro ao tentar cadastrar.");
      }
    } catch (err) {
      setError(err.message || "Erro ao tentar cadastrar.");
    }
  };

  return (
    <div className="authDesign">
      <div className="left">
        <h1>Cadastrar</h1>
        <p>Preencha seus dados para se registrar</p>
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
            type="text"
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirmar Senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="user">Operador</option>
            <option value="admin">Administrador</option>
          </select>
          <input
            type="text"
            placeholder="Setor (opcional)"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />
          <button type="submit" className="btn">Cadastrar</button>
          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Register;
