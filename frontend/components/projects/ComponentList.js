import React, { useEffect, useState } from 'react';
import api from '../../utils/axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { useNotification } from '../../components/NotificationProvider';
import ComponentForm from './ComponentForm';
import ProcessList from './ProcessList';
import styles from '../../styles/projects/ComponentList.module.css';
import projectStyles from '../../styles/Projects.module.css';

export default function ComponentList({ moldCode }) {
  const [globalFilter, setGlobalFilter] = useState('');
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState(null);
  const [showInactive, setShowInactive] = useState(false);
  const [editingComponent, setEditingComponent] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(0);

  const { show } = useNotification();

  const fetchComponents = async () => {
    setLoading(true);
    try {
      const url = showInactive
        ? `/projects/inactive_components/${moldCode}`
        : `/projects/components/${moldCode}`;
      const res = await api.get(url);
      setComponents(res.data.components || []);
    } catch (error) {
      console.error('Erro ao buscar componentes:', error);
      show({ severity: 'error', summary: 'Erro', detail: 'Falha ao buscar componentes.'
      });
      setComponents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComponents();
  }, [moldCode, showInactive, refreshFlag]);

  const handleDelete = (id) => {
    confirmDialog({
      message: `Excluir componente ${id}?`, header: 'Confirmação', icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim', rejectLabel: 'Não',
      acceptClassName: 'p-button-danger',
      accept: async () => {
        try {
          await api.delete(`/projects/components/${id}?moldCode=${moldCode}`);
          show({ severity: 'success', summary: 'Removido', detail: `Componente ${id} excluído.` });
          // aciona refresh
          setRefreshFlag(f => f + 1);
        } catch (error) {
          console.error('Erro ao excluir:', error);
          show({
            severity: 'error', summary: 'Erro',
            detail: 'Falha ao excluir componente: ' + (error.response?.data?.message || error.message)
          });
        }
      },
      reject: () => {}
    });
  };

  const rowExpansionTemplate = (data) => (
    <div className="p-4">
      <div className={styles.processSection}>
        <h5>Processos do Componente {data.name}</h5>
        {/* Passa refreshFlag para ProcessList */}
        <ProcessList
          moldCode={moldCode}
          componentID={data.id}
          parentRefreshFlag={refreshFlag}
        />
      </div>
    </div>
  );

  return (
    <div>
      <ConfirmDialog />
      <div className="flex gap-2 mb-2">
        <Button
          label="Novo Componente" icon="pi pi-plus" className="p-button-sm mr-3"
          onClick={() => {
            setEditingComponent(null);
            setShowForm(true);
          }}
        />
        <InputText
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Buscar componente..."
          className="p-inputtext-sm mr-4"
        />
        <Dropdown
          value={showInactive}
          options={[
            { label: 'Ativos', value: false },
            { label: 'Inativos', value: true }
          ]}
          onChange={(e) => setShowInactive(e.value)}
          placeholder="Filtrar componentes"
        />
      </div>

      <DataTable
        paginator
        rows={10}
        value={components}
        loading={loading}
        expandedRows={expandedRows}
        onRowToggle={(e) => setExpandedRows(e.data)}
        rowExpansionTemplate={rowExpansionTemplate}
        dataKey="id"
        globalFilter={globalFilter}
        header={null}
      >
        <Column expander style={{ width: '3em' }} />
        <Column field="id" header="ID" sortable />
        <Column field="name" header="Nome" sortable />
        <Column field="material" header="Material" />
        <Column field="quantity" header="Quantidade" />
        <Column
          header="Status"
          body={rowData => (
            <span
              className={`${projectStyles.statusBadge} ${
                rowData.status
                  ? projectStyles.completed
                  : projectStyles.inProcess
              }`}
            >
              {rowData.status ? 'Concluído' : 'Pendente'}
            </span>
          )}
        />
        <Column
          header="Modelo 3D"
          body={rowData => (
            rowData.archive_3d_model && (
              <Button
                icon="pi pi-external-link" className="p-button-text p-button-success" tooltip="Abrir modelo 3D"
                onClick={() => window.open(rowData.archive_3d_model, '_blank')}
              />
            )
          )}
        />
        <Column
          header="Ações"
          body={rowData => {
            if (showInactive) {
              return null;
            }
            return (
              <div className="flex gap-1">
                <Button
                  icon="pi pi-pencil" className="p-button-text"
                  onClick={() => {
                    setEditingComponent(rowData);
                    setShowForm(true);
                  }}
                />
                <Button
                  icon="pi pi-trash" className="p-button-text p-button-danger" onClick={() => handleDelete(rowData.id)}
                />
              </div>
            );
          }}
        />
      </DataTable>

      <ComponentForm
        component={editingComponent}
        moldCode={moldCode}
        visible={showForm}
        onHide={(saved) => {
          setShowForm(false);
          setEditingComponent(null);
          if (saved) {
            setRefreshFlag(f => f + 1);
          }
        }}
        onSave={(saved) => {
          if (saved) {
            setRefreshFlag(f => f + 1);
          }
        }}
        isNew={!editingComponent}
      />
    </div>
  );
}