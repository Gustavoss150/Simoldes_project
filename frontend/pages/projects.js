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
import styles from '../styles/Projects.module.css';

export default function ProjectsPage() {
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

  const handleCreate = () => { setEditingMold(null); setShowForm(true); };
  const handleEdit = (mold) => { setEditingMold(mold); setShowForm(true); };
  const handleDelete = async (codigo) => {
    if (confirm(`Confirma exclusão do molde ${codigo}?`)) {
      await api.delete(`/projects/${codigo}`);
      fetchMolds();
    }
  };

  const rowExpansionTemplate = (data) => (
    <div className={styles.rowExpansion}>
      <h3>Componentes</h3>
      <ComponentList moldCode={data.codigo} />
    </div>
  );

  return (
    <div className={styles.container}>
      <Sidebar />
      <main className={styles.mainContent}>
        <div className={styles.header}>
          <h1 className={styles.title}>Projetos de Moldes</h1>
          <Button 
            label="Novo Projeto" 
            icon="pi pi-plus" 
            onClick={handleCreate} 
            className="p-button-success" 
          />
        </div>
        
        <div className={styles.filters}>
          <Dropdown
            value={selectedStatus}
            options={statusOptions}
            onChange={(e) => setSelectedStatus(e.value)}
            placeholder="Filtrar por status"
            className={styles.filterDropdown}
          />
        </div>

        {loading ? (
          <ProgressSpinner />
        ) : (
          <div className={styles.tableContainer}>
            <DataTable
              value={molds}
              paginator 
              rows={10}
              expandedRows={expandedRows}
              onRowToggle={(e) => setExpandedRows(e.data)}
              rowExpansionTemplate={rowExpansionTemplate}
              dataKey="codigo"
            >
              <Column expander style={{ width: '3em' }} />
              <Column field="codigo" header="Código" sortable />
              <Column field="description" header="Descrição" />
              <Column 
                field="status" 
                header="Status" 
                sortable 
                body={(rowData) => (
                  <span className={`${styles.statusBadge} ${
                    rowData.status === 'not started' ? styles.notStarted :
                    rowData.status === 'in process' ? styles.inProcess :
                    rowData.status === 'paused' ? styles.paused :
                    styles.completed
                  }`}>
                    {statusOptions.find(opt => opt.value === rowData.status)?.label || rowData.status}
                  </span>
                )}
              />
              <Column field="current_step" header="Etapa Atual" />
              <Column field="steps" header="Total de Etapas" />
              <Column field="begin_date" header="Data de Início" />
              <Column field="delivery_date" header="Data de Entrega" />
              <Column
                header="Ações"
                body={(rowData) => (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Button 
                      icon="pi pi-pencil" 
                      className="p-button-text p-button-sm" 
                      onClick={() => handleEdit(rowData)} 
                    />
                    <Button 
                      icon="pi pi-trash" 
                      className="p-button-text p-button-danger p-button-sm" 
                      onClick={() => handleDelete(rowData.codigo)} 
                    />
                  </div>
                )}
              />
            </DataTable>
          </div>
        )}

        {error && <p className={styles.errorMessage}>{error}</p>}
        
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