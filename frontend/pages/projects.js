import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import api from '../utils/axios';
import Sidebar from '../components/Sidebar';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import StepsList from '../components/StepsList';
import MoldForm from '../components/projects/MoldForm';
import MoldEditForm from '../components/projects/MoldEditForm';
import ComponentList from '../components/projects/ComponentList';
import ProcessList from '../components/projects/ProcessList';
import styles from '../styles/Projects.module.css';

export default function ProjectsPage() {
    const [showStepsModal, setShowStepsModal] = useState(false); // Corrigido o nome do estado
    const [globalFilter, setGlobalFilter] = useState('');
    const [molds, setMolds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [expandedRows, setExpandedRows] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [editingMold, setEditingMold] = useState(null);
    const [showGlobalInactive, setShowGlobalInactive] = useState(false);

    const statusOptions = [
        { label: 'Todos', value: null },
        { label: 'Não iniciado', value: 'not started' },
        { label: 'Em processo', value: 'in process' },
        { label: 'Pausado', value: 'paused' },
        { label: 'Completo', value: 'completed' }
    ];

    useEffect(() => { fetchMolds(); }, [selectedStatus]);

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
        setShowCreateForm(true);
    };

    const handleEdit = (mold) => {
        setEditingMold(mold);
        setShowEditForm(true);
    };

    const handleDelete = async (codigo) => {
        if (confirm(`Confirma exclusão do molde ${codigo}?`)) {
            await api.delete(`/projects/${codigo}`);
            fetchMolds();
        }
    };

    const rowExpansionTemplate = (data) => (
        <div className={styles.rowExpansion}>
            <div className={styles.section}>
                <h3>Componentes</h3>
                <ComponentList moldCode={data.codigo} />
            </div>
            <div className={styles.section}>
                <h3>Processos do Molde</h3>
                <ProcessList moldCode={data.codigo} showInactive={showGlobalInactive} isGlobalView />
            </div>
        </div>
    );

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        } catch {
            return dateString;
        }
    };

    return (
        <>
            <Head>
                <title>Processos de Moldes</title>
            </Head>
            <div className={styles.container}>
                <Sidebar />
                <main className={styles.mainContent}>
                    <div className={styles.header}>
                        <h1 className={styles.title}>Projetos de Moldes</h1>
                        <div>
                            <Button label="Novo Projeto" icon="pi pi-plus" onClick={handleCreate} className="p-button p-button-lg mr-5" />
                            <Button 
                                label="Gerenciar Etapas" 
                                icon="pi pi-cog"
                                onClick={() => setShowStepsModal(true)}
                                className="p-button p-button-lg mr-5"
                            />
                        </div>
                    </div>
                    <div className={styles.filters}>
                        <InputText 
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            placeholder="Buscar por código ou descrição"
                            className="p-inputtext-sm mr-4"
                        />
                        <Dropdown value={selectedStatus} options={statusOptions} onChange={(e) => setSelectedStatus(e.value)} placeholder="Filtrar por status" className={styles.filterDropdown} />
                    </div>
                    {loading ? <ProgressSpinner /> : (
                        <div className={styles.tableContainer}>
                            <DataTable value={molds} paginator rows={1} expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)} rowExpansionTemplate={rowExpansionTemplate} dataKey="codigo" globalFilter={globalFilter}>
                                <Column expander style={{ width: '3em' }} />
                                <Column field="codigo" header="Código" sortable />
                                <Column field="description" header="Descrição" />
                                <Column field="status" header="Status" sortable body={(rowData) => (
                                    <span className={`${styles.statusBadge} ${
                                        rowData.status === 'not started' ? styles.notStarted :
                                        rowData.status === 'in process' ? styles.inProcess :
                                        rowData.status === 'paused' ? styles.paused : styles.completed
                                    }`}>{statusOptions.find(opt => opt.value === rowData.status)?.label || rowData.status}</span>
                                )} />
                                <Column field="current_step" header="Etapa Atual" />
                                <Column field="steps" header="Total de Etapas" />
                                <Column 
                                    field="begin_date" 
                                    header="Início" 
                                    body={(rowData) => formatDate(rowData.begin_date)} 
                                />
                                <Column 
                                    field="delivery_date" 
                                    header="Entrega Prevista" 
                                    body={(rowData) => formatDate(rowData.delivery_date)} 
                                />
                                <Column header="Ações" body={(rowData) => (
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <Button icon="pi pi-pencil" className="p-button-text p-button-sm" onClick={() => handleEdit(rowData)} />
                                        <Button icon="pi pi-trash" className="p-button-text p-button-danger p-button-sm" onClick={() => handleDelete(rowData.codigo)} />
                                    </div>
                                )} />
                            </DataTable>
                        </div>
                    )}
                    {error && <p className={styles.errorMessage}>{error}</p>}

                    {showCreateForm && (
                        <MoldForm mold={null} visible={showCreateForm} onHide={(saved) => { setShowCreateForm(false); if (saved) fetchMolds(); }} />
                    )}
                    {showEditForm && editingMold && (
                        <MoldEditForm mold={editingMold} visible={showEditForm} onHide={(saved) => { setShowEditForm(false); if (saved) fetchMolds(); }} />
                    )}

                    <StepsList 
                        visible={showStepsModal} 
                        onHide={() => setShowStepsModal(false)} 
                    />
                </main>
            </div>
        </>
    );
}