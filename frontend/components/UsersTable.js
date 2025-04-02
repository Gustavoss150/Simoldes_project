const UsersTable = ({ users, onUserSelect }) => {
    return (
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-800 text-white">
                <tr>
                    <th className="py-3 px-4 text-left">Nome</th>
                    <th className="py-3 px-4 text-left">Matrícula</th>
                    <th className="py-3 px-4 text-left">Departamento</th>
                    <th className="py-3 px-4 text-left">Ações</th>
                </tr>
            </thead>
            <tbody>
                {users.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-100">
                        <td className="py-3 px-4">{user.name}</td>
                        <td className="py-3 px-4">{user.registration}</td>
                        <td className="py-3 px-4">{user.department}</td>
                        <td className="py-3 px-4">
                            <button 
                                onClick={() => onUserSelect(user.id)} 
                                className="text-blue-600 hover:text-blue-800"
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
