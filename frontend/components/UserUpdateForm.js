import { useState } from "react";
import api from "../utils/axios";

const UserUpdateForm = ({ user, isAdmin }) => {
    const [updatedUser, setUpdatedUser] = useState(user);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [newPasswordSuccess, setNewPasswordSuccess] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isFormOpen, setIsFormOpen] = useState(false); // Estado para controlar visibilidade do formulário de dados
    const [isPasswordFormOpen, setIsPasswordFormOpen] = useState(false); // Estado para controlar visibilidade do formulário de senha

    const handleChange = (e) => {
        setUpdatedUser({
            ...updatedUser,
            [e.target.name]: e.target.value,
        });
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Se for um usuário comum, ele só pode atualizar seus próprios dados
        if (!isAdmin && updatedUser.id !== user.id) {
            setError("Você não pode editar dados de outro usuário.");
            return;
        }

        try {
            const token = localStorage.getItem(process.env.NEXT_PUBLIC_TOKEN_KEY);

            // Se a senha foi informada, inclui na atualização do usuário
            if (password || confirmPassword) {
                if (!password || !confirmPassword) {
                    setError("Por favor, preencha ambos os campos de senha.");
                    return;
                }

                if (password !== confirmPassword) {
                    setError("As senhas não coincidem.");
                    return;
                }

                updatedUser.password = password;
            }

            // Envia os dados atualizados (dados gerais + senha, caso tenha sido preenchida)
            await api.put(`/users/${updatedUser.id}`, updatedUser, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setSuccess("Usuário atualizado com sucesso!");
            setError("");  // Limpa erro anterior
            setIsFormOpen(false); // Fecha o formulário de dados
        } catch (err) {
            setError("Erro ao atualizar o usuário.");
            console.error("Erro ao atualizar usuário:", err);
        }
    };

    return (
        <div>
            {/* Botão de editar (exibido quando o formulário de dados estiver fechado) */}
            {!isFormOpen && !isPasswordFormOpen && (
                <button
                    className="bg-blue-600 text-white p-2 rounded mt-4"
                    onClick={() => setIsFormOpen(true)} // Abre o formulário de dados
                >
                    Editar Dados
                </button>
            )}

            {/* Formulário de edição de dados */}
            {isFormOpen && (
                <form onSubmit={handleSubmit} className="mt-4">
                    <h3 className="text-lg font-semibold">Editar {user.name}</h3>
                    {error && <p className="text-red-500">{error}</p>}
                    {success && <p className="text-green-500">{success}</p>}

                    <div className="mt-2">
                        <label htmlFor="name" className="block">Nome</label>
                        <input
                            type="text"
                            name="name"
                            value={updatedUser.name}
                            onChange={handleChange}
                            className="w-full p-2 border rounded mt-1"
                        />
                    </div>

                    <div className="mt-2">
                        <label htmlFor="department" className="block">Departamento</label>
                        <input
                            type="text"
                            name="department"
                            value={updatedUser.department}
                            onChange={handleChange}
                            className="w-full p-2 border rounded mt-1"
                        />
                    </div>

                    {/* Botão de confirmação */}
                    <div className="mt-4">
                        <button type="submit" className="bg-blue-600 text-white p-2 rounded">
                            Salvar Dados
                        </button>
                    </div>
                </form>
            )}

            {/* Botão para editar senha */}
            {!isPasswordFormOpen && (
                <button
                    className="bg-green-600 text-white p-2 rounded mt-4"
                    onClick={() => setIsPasswordFormOpen(true)} // Abre o formulário de senha
                >
                    Editar Senha
                </button>
            )}

            {/* Formulário de alteração de senha */}
            {isPasswordFormOpen && (
                <form onSubmit={handleSubmit} className="mt-4">
                    <h3 className="text-lg font-semibold">Alterar Senha</h3>
                    {error && <p className="text-red-500">{error}</p>}
                    {newPasswordSuccess && <p className="text-green-500">{newPasswordSuccess}</p>}

                    <div className="mt-2">
                        <label htmlFor="password" className="block">Nova Senha</label>
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={handlePasswordChange}
                            className="w-full p-2 border rounded mt-1"
                            placeholder="Nova senha"
                        />
                    </div>

                    <div className="mt-2">
                        <label htmlFor="confirmPassword" className="block">Confirmar Nova Senha</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            className="w-full p-2 border rounded mt-1"
                            placeholder="Confirme a nova senha"
                        />
                    </div>
                    <div className="mt-4">
                        <button type="submit" className="bg-green-600 text-white p-2 rounded">
                            Salvar Senha
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default UserUpdateForm;
