import { useState, useEffect } from "react";
import api from "../utils/axios";
import styles from '../styles/Users.module.css';

const UserUpdateForm = ({ user, isAdmin, onClose, onUpdateSuccess }) => {
    const [updatedUser, setUpdatedUser] = useState(user);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [activeForm, setActiveForm] = useState(null);

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
        <div className={styles.editFormContainer}>
            <div className={styles.formHeader}>
                <h3 className={styles.formTitle}>{user.name}</h3>
                {onClose && (
                    <button onClick={onClose} className={styles.closeButton}>
                        ×
                    </button>
                )}
            </div>

            <div className={styles.buttonGroup}>
                <button
                    className={`${styles.toggleButton} ${activeForm === 'data' ? styles.active : ''}`}
                    onClick={() => setActiveForm('data')}
                >
                    Editar Dados
                </button>
                <button
                    className={`${styles.toggleButton} ${activeForm === 'password' ? styles.active : ''}`}
                    onClick={() => setActiveForm('password')}
                >
                    Editar Senha
                </button>
            </div>

            {error && <p className={styles.errorMessage}>{error}</p>}
            {success && <p className={styles.successMessage}>{success}</p>}

            {activeForm === 'data' && (
                <form onSubmit={handleSubmitData} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="name">Nome</label>
                        <input
                            type="text"
                            name="name"
                            value={updatedUser.name || ''}
                            onChange={handleChange}
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="department">Departamento</label>
                        <input
                            type="text"
                            name="department"
                            value={updatedUser.department || ''}
                            onChange={handleChange}
                            className={styles.input}
                        />
                    </div>

                    <button type="submit" className={styles.submitButton}>
                        Salvar Dados
                    </button>
                </form>
            )}

            {activeForm === 'password' && (
                <form onSubmit={handleSubmitPassword} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="password">Nova Senha</label>
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={handlePasswordChange}
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="confirmPassword">Confirmar Nova Senha</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            className={styles.input}
                        />
                    </div>

                    <button type="submit" className={styles.submitButton}>
                        Salvar Senha
                    </button>
                </form>
            )}
        </div>
    );
};

export default UserUpdateForm;
