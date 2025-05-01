import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import api from '../utils/axios';
import Sidebar from '../components/Sidebar';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Button } from 'primereact/button';
import MoldForm from '../components/projects/MoldForm';
import ComponentList from '../components/projects/ComponentList';
import ProcessList from '../components/projects/ProcessList';

export default function MoldProjects() {
    const [molds, setMolds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [expandedRows, setExpandedRows] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingMold, setEditingMold] = useState(null);
    const router = useRouter();

    const statusOptions = [
        { label: 'Todos', value: null },
        { label: 'Não iniciado', value: 'not started' },
        { label: 'Em processo', value: 'in process' },
        { label: 'Pausado', value: 'paused' },
        { label: 'Completo', value: 'completed' }
    ];

    useEffect(() => {
        fetchMolds();
    }, [selectedStatus]);
    
    const fetchMolds = async () => {
        setLoading(true);
        try {
            const params = selectedStatus ? { status: selectedStatus } : {};
            const res = await api.get('/projects/', { params });
            setMolds(res.data.molds);
        } catch (err) {
            console.error(err);
            setError('Erro ao carregar projetos');
        } finally {
            setLoading(false);
        }
    };
    
    const handleCreate = () => {
        setEditingMold(null);
        setShowForm(true);
    };
    
    const handleEdit = (mold) => {
        setEditingMold(mold);
        setShowForm(true);
    };
    
    const handleDelete = async (codigo) => {
        if (confirm(`Confirma exclusão do molde ${codigo}?`)) {
            await api.delete(`/projects/${codigo}`);
            fetchMolds();
        }
    };
    
    const rowExpansionTemplate = (data) => (
        <div className="p-4">
            <h3 className="font-semibold mb-2">Componentes</h3>
            <ComponentList moldCode={data.codigo} />
            <h3 className="font-semibold mb-2 mt-4">Processos do Molde</h3>
            <ProcessList moldCode={data.codigo} />
        </div>
    );
    
    return (
        <div className="flex">
            <Sidebar />
            <main className="flex-1 p-6">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Projetos de Moldes</h1>
                    <Button label="Novo Projeto" icon="pi pi-plus" onClick={handleCreate} className="p-button-success" />
                </div>
                <div className="flex gap-4 items-center mb-4">
                    <Dropdown
                        value={selectedStatus}
                        options={statusOptions}
                        onChange={(e) => setSelectedStatus(e.value)}
                        placeholder="Filtrar por status"
                    />
                </div>

                {loading ? (
                <ProgressSpinner />
                ) : (
                <DataTable
                    value={molds}
                    paginator
                    rows={10}
                    expandedRows={expandedRows}
                    onRowToggle={(e) => setExpandedRows(e.data)}
                    rowExpansionTemplate={rowExpansionTemplate}
                    dataKey="codigo"
                    className="p-datatable-sm"
                >
                    <Column expander style={{ width: '3em' }} />
                    <Column field="codigo" header="Código" sortable />
                    <Column field="description" header="Descrição" />
                    <Column field="status" header="Status" sortable />
                    <Column field="current_step" header="Etapa Atual" />
                    <Column field="steps" header="Etapas" />
                    <Column field="begin_date" header="Início" />
                    <Column field="delivery_date" header="Entrega" />
                    <Column
                        header="Ações"
                        body={(rowData) => (
                            <div className="space-x-2">
                            <Button icon="pi pi-pencil" className="p-button-text" onClick={() => handleEdit(rowData)} />
                            <Button icon="pi pi-trash" className="p-button-text p-button-danger" onClick={() => handleDelete(rowData.codigo)} />
                            </div>
                        )}
                    />
                </DataTable>
                )}
                {error && <p className="text-red-500 mt-4">{error}</p>}
        
                {showForm && (
                    <MoldForm
                        mold={editingMold}
                        onHide={() => {
                            setShowForm(false);
                            fetchMolds();
                        }}
                    />
                )}
            </main>
        </div>
    );
}