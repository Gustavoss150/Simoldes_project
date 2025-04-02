// components/UsersTable.js
const UsersTable = ({ users, onUserSelect }) => {
    return (
        <table className="userTable">
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
                                className="actionButton bg-indigo-100 text-indigo-700 hover:bg-indigo-200 px-3 py-1 rounded text-sm"
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