// File: /components/projects/ComponentList.js
import React, { useEffect, useState } from 'react';
import api from '../../utils/axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Dropdown } from 'primereact/dropdown';
import ComponentForm from './ComponentForm';
import ProcessList from './ProcessList';

export default function ComponentList({ moldCode }) {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState(null);
  const [showInactive, setShowInactive] = useState(false);
  const [editingComponent, setEditingComponent] = useState(null);
  const [showForm, setShowForm] = useState(false);

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchComponents(); }, [moldCode, showInactive]);

  const handleDelete = async (id) => {
    if (confirm(`Excluir componente ${id}?`)) {
      try {
        await api.delete(`/projects/components/${id}?moldCode=${moldCode}`);
        fetchComponents();
      } catch (error) {
        console.error('Erro ao excluir:', error);
      }
    }
  };

  const rowExpansionTemplate = (data) => (
    <div className="p-4">
      <h5 className="font-semibold mb-2">Processos do Componente {data.name}</h5>
      <ProcessList moldCode={moldCode} componentID={data.id} />
    </div>
  );

  return (
    <div>
      <div className="flex gap-2 mb-2">
        <Button
          label="Novo Componente"
          icon="pi pi-plus"
          className="p-button-sm"
          onClick={() => setShowForm(true)}
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
        value={components}
        loading={loading}
        expandedRows={expandedRows}
        onRowToggle={(e) => setExpandedRows(e.data)}
        rowExpansionTemplate={rowExpansionTemplate}
        dataKey="id"
      >
        <Column expander style={{ width: '3em' }} />
        <Column field="id" header="ID" />
        <Column field="name" header="Nome" />
        <Column field="material" header="Material" />
        <Column field="quantity" header="Quantidade" />
        <Column 
          header="Status"
          body={rowData => (
            <span className={rowData.status ? 'text-green-500' : 'text-yellow-500'}>
              {rowData.status ? 'Concluído' : 'Pendente'}
            </span>
          )}
        />
        <Column
          header="Ações"
          body={rowData => (
            <div className="flex gap-1">
              <Button
                icon="pi pi-pencil"
                className="p-button-text"
                onClick={() => {
                  setEditingComponent(rowData);
                  setShowForm(true);
                }}
              />
              <Button
                icon="pi pi-trash"
                className="p-button-text p-button-danger"
                onClick={() => handleDelete(rowData.id)}
              />
            </div>
          )}
        />
      </DataTable>

      <ComponentForm
        component={editingComponent}
        moldCode={moldCode}
        visible={showForm}
        onHide={() => {
          setShowForm(false);
          setEditingComponent(null);
        }}
        onSave={fetchComponents}
        isNew={!editingComponent}
      />
    </div>
  );
}