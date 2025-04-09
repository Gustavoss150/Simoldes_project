import styles from '../styles/Users.module.css';

const UsersTable = ({ users, onUserSelect }) => {
    return (
        <table className={styles.userTable}>
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Departamento</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                {users.map((user) => (
                    <tr key={user.id}>
                        <td>{user.name}</td>
                        <td>{user.department}</td>
                        <td>
                            <button
                                onClick={() => onUserSelect(user.id)}
                                className={styles.actionButton}
                            >
                                Editar
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default UsersTable;
