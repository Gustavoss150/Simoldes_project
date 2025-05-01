// /components/projects/ComponentList.js
import React, { useEffect, useState } from 'react';
import api from '../../utils/axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import ProcessList from './ProcessList';
import { Dropdown } from 'primereact/dropdown';

export default function ComponentList({ moldCode }) {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState(null);
  const [showInactive, setShowInactive] = useState(false);

  const fetchComponents = async () => {
    setLoading(true);
    // Ajuste na rota: usa /projects/components/:moldCode ou /projects/inactive_components/:moldCode
    const url = showInactive
      ? `/projects/inactive_components/${moldCode}`
      : `/projects/components/${moldCode}`;
    const res = await api.get(url);
    setComponents(res.data.components || []);
    setLoading(false);
  };
  useEffect(() => { fetchComponents(); }, [moldCode, showInactive]);

  const handleDelete = async (id) => {
    if (confirm(`Excluir componente ${id}?`)) {
      await api.delete(`/projects/components/${id}?moldCode=${moldCode}`);
      fetchComponents();
    }
  };

  const view3D = (url) => window.open(url, '_blank');

  const rowExpansionTemplate = (data) => (
    <div className="p-4">
      <h5 className="font-semibold mb-2">Processos do Componente {data.name}</h5>
      <ProcessList moldCode={moldCode} componentID={data.id} />
    </div>
  );

  if (loading) return <ProgressSpinner />;

  return (
    <div>
      <div className="flex gap-2 mb-2">
        <Dropdown
          value={showInactive}
          options={[{ label: 'Ativos', value: false }, { label: 'Inativos', value: true }]}
          onChange={(e) => setShowInactive(e.value)}
          placeholder="Filtrar componentes"
        />
      </div>
      <DataTable
        value={components}
        responsiveLayout="scroll"
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
          header="3D Model"
          body={(row) => row.archive_3d_model ? (
            <Button
              icon="pi pi-external-link"
              className="p-button-text"
              onClick={() => view3D(row.archive_3d_model)}
            />
          ) : null}
        />
        <Column field="status" header="Status" />
        <Column
          header="Ações"
          body={(row) => (
            <Button icon="pi pi-trash" className="p-button-text p-button-danger" onClick={() => handleDelete(row.id)} />
          )}
        />
      </DataTable>
    </div>
  );
}