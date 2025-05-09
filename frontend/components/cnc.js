import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { DataTable } from '@/components/ui/data-table';
import axios from 'axios';
import { Pencil, Trash2 } from 'lucide-react';

export default function CNCPage() {
    const [machines, setMachines] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingMachine, setEditingMachine] = useState(null);
    const [editingProgram, setEditingProgram] = useState(null);

    const fetchMachines = async () => {
        const res = await axios.get('/api/cnc/mach');
        setMachines(res.data.machines);
    };

    const fetchPrograms = async () => {
        if (!searchTerm) return;
        const res = await axios.get(`/api/cnc/program/${searchTerm}`);
        setPrograms(res.data['CNC Programs']);
    };

    useEffect(() => {
        fetchMachines();
    }, []);

    const handleDeleteMachine = async (id) => {
        await axios.delete(`/api/cnc/mach/${id}`);
        fetchMachines();
    };

    const handleDeleteProgram = async (id) => {
        await axios.delete(`/api/cnc/program/${id}`);
        fetchPrograms();
    };

    return (
        <div className="p-4 space-y-4">
            <h2 className="text-2xl font-bold">Máquinas CNC</h2>
            <Card className="p-4">
                <Button onClick={() => setDialogOpen(true)}>Nova Máquina</Button>
                <DataTable
                    columns={[
                        { accessorKey: 'name', header: 'Nome' },
                        { accessorKey: 'type', header: 'Tipo' },
                        { accessorKey: 'department', header: 'Departamento' },
                        {
                            id: 'actions',
                            cell: ({ row }) => (
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setEditingMachine(row.original);
                                            setDialogOpen(true);
                                        }}
                                    >
                                        <Pencil size={16} />
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDeleteMachine(row.original.id)}
                                    >
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                            )
                        }
                    ]}
                    data={machines}
                />
            </Card>

            <h2 className="text-2xl font-bold">Programações CNC</h2>
            <Card className="p-4 space-y-2">
                <Input
                    placeholder="Pesquisar por ID do componente"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button onClick={fetchPrograms}>Buscar</Button>
                <DataTable
                    columns={[
                        { accessorKey: 'molde_codigo', header: 'Molde' },
                        { accessorKey: 'programador', header: 'Programador' },
                        { accessorKey: 'maquina_id', header: 'Máquina' },
                        {
                            id: 'actions',
                            cell: ({ row }) => (
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setEditingProgram(row.original);
                                            setDialogOpen(true);
                                        }}
                                    >
                                        <Pencil size={16} />
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDeleteProgram(row.original.id)}
                                    >
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                            )
                        }
                    ]}
                    data={programs}
                />
            </Card>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        {editingMachine || editingProgram ? 'Editar' : 'Nova Entrada'}
                    </DialogHeader>
                        {/* Formulários específicos serão adicionados aqui */}
                </DialogContent>
            </Dialog>
        </div>
    );
}
