import { useState, useEffect } from "react";
import api from "../utils/axios";

const UserUpdateForm = ({ user, isAdmin, onClose, onUpdateSuccess }) => {
    const [updatedUser, setUpdatedUser] = useState(user);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [activeForm, setActiveForm] = useState(null); // 'data' ou 'password'

    // Atualiza o estado quando o user prop muda
    useEffect(() => {
        setUpdatedUser(user);
        setPassword("");
        setConfirmPassword("");
        setError("");
        setSuccess("");
    }, [user]);

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

    const handleSubmitData = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const token = localStorage.getItem(process.env.NEXT_PUBLIC_TOKEN_KEY);
            
            // Remove a senha do objeto se existir (não queremos enviar no update de dados)
            const { password: _, ...userData } = updatedUser;
            
            await api.put(`/users/${updatedUser.id}`, userData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setSuccess("Dados atualizados com sucesso!");
            onUpdateSuccess && onUpdateSuccess();
        } catch (err) {
            setError("Erro ao atualizar os dados.");
            console.error("Erro ao atualizar usuário:", err);
        }
    };

    const handleSubmitPassword = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!password || !confirmPassword) {
            setError("Por favor, preencha ambos os campos de senha.");
            return;
        }

        if (password !== confirmPassword) {
            setError("As senhas não coincidem.");
            return;
        }

        try {
            const token = localStorage.getItem(process.env.NEXT_PUBLIC_TOKEN_KEY);
            
            await api.put(`/users/${updatedUser.id}`, {
                ...updatedUser,
                password: password
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setSuccess("Senha atualizada com sucesso!");
            setPassword("");
            setConfirmPassword("");
            onUpdateSuccess && onUpdateSuccess();
        } catch (err) {
            setError("Erro ao atualizar a senha.");
            console.error("Erro ao atualizar senha:", err);
        }
    };

    return (
        <div className="bg-white p-4 rounded shadow-md mb-4">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">{user.name}</h3>
                {onClose && (
                    <button 
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ×
                    </button>
                )}
            </div>

            {/* Botões de ação */}
            <div className="flex gap-2 mb-4">
                <button
                    className={`px-4 py-2 rounded ${activeForm === 'data' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                    onClick={() => setActiveForm('data')}
                >
                    Editar Dados
                </button>
                <button
                    className={`px-4 py-2 rounded ${activeForm === 'password' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                    onClick={() => setActiveForm('password')}
                >
                    Editar Senha
                </button>
            </div>

            {/* Mensagens de status */}
            {error && <p className="text-red-500 mb-2">{error}</p>}
            {success && <p className="text-green-500 mb-2">{success}</p>}

            {/* Formulário de edição de dados */}
            {activeForm === 'data' && (
                <form onSubmit={handleSubmitData}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome</label>
                            <input
                                type="text"
                                name="name"
                                value={updatedUser.name || ''}
                                onChange={handleChange}
                                className="w-full p-2 border rounded mt-1"
                            />
                        </div>

                        <div>
                            <label htmlFor="department" className="block text-sm font-medium text-gray-700">Departamento</label>
                            <input
                                type="text"
                                name="department"
                                value={updatedUser.department || ''}
                                onChange={handleChange}
                                className="w-full p-2 border rounded mt-1"
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <button 
                            type="submit" 
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Salvar Dados
                        </button>
                    </div>
                </form>
            )}

            {/* Formulário de alteração de senha */}
            {activeForm === 'password' && (
                <form onSubmit={handleSubmitPassword}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Nova Senha</label>
                            <input
                                type="password"
                                name="password"
                                value={password}
                                onChange={handlePasswordChange}
                                className="w-full p-2 border rounded mt-1"
                                placeholder="Nova senha"
                            />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirmar Nova Senha</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                                className="w-full p-2 border rounded mt-1"
                                placeholder="Confirme a nova senha"
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <button 
                            type="submit" 
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Salvar Senha
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default UserUpdateForm;