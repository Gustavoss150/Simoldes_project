import React, { useEffect, useState } from 'react';
import api from '../../utils/axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';

export default function ProcessList({ moldCode, componentID, isGlobalView }) {
    const [processes, setProcesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState(null);
    const [expandedRows, setExpandedRows] = useState(null);

    const statusOptions = [
        { label: 'Todos', value: null },
        { label: 'Não Iniciados', value: 'not started' },
        { label: 'Em Processo', value: 'in process' },
        { label: 'Completos', value: 'completed' },
        { label: 'Pausados', value: 'paused' },
        { label: 'Histórico (Inativos)', value: 'inactive' }
    ];

    const fetchProcesses = async () => {
        setLoading(true);
        try {
            let data = [];

            if (statusFilter === 'inactive') {
                const res = await api.get(`/processes/inactive_processes/${moldCode}`);
                data = (res.data.inactive_processes || []).map(p => ({
                    id: p.id, // Adicionado campo único obrigatório
                    process_id: p.id,
                    component_id: p.componente_id,
                    step_name: p.description,
                    order: p.order,
                    status: p.status
                }));
            } else {
                const res = componentID 
                    ? await api.get(`/processes/components/${componentID}`)
                    : await api.get(`/processes/${moldCode}`);

                data = isGlobalView 
                    ? (res.data.processes || []).flatMap(component => 
                        component.processes.map(process => ({
                            id: process.process_id, // Campo único obrigatório
                            ...process,
                            component_id: component.component_id
                        })) 
                      )
                    : (res.data.processes || []).map(p => ({ ...p, id: p.process_id }));

                if (statusFilter) {
                    data = data.filter(p => p.status === statusFilter);
                }
            }

            setProcesses(data);
        } catch (err) {
            console.error('Erro ao buscar processos:', err);
            setProcesses([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { 
        if (moldCode || componentID) {
            fetchProcesses();
        }
    }, [moldCode, componentID, statusFilter]);

    const handleDelete = async (id) => {
        if (confirm(`Excluir processo ${id}?`)) {
            try {
                await api.delete(`/processes/${id}?moldCode=${moldCode}`);
                fetchProcesses();
            } catch (err) { 
                console.error('Erro ao deletar processo:', err); 
            }
        }
    };

    return (
        <div>
            <div className="flex gap-2 mb-2">
                <Dropdown
                    value={statusFilter}
                    options={statusOptions}
                    onChange={(e) => setStatusFilter(e.value)}
                    placeholder="Filtrar processos"
                    className="p-inputtext-sm"
                />
            </div>

            <DataTable paginator rows={10}
                value={processes}
                responsiveLayout="scroll"
                dataKey="id" // Campo único obrigatório
                expandedRows={expandedRows}
                onRowToggle={(e) => setExpandedRows(e.data)}
            >
                {isGlobalView && <Column field="component_id" header="Componente" />}
                <Column field="step_name" header="Etapa" />
                <Column field="order" header="Ordem" />
                <Column 
                    field="status" 
                    header="Status" 
                    body={(rowData) => (
                        <span className={`status-badge ${rowData.status.replace(' ', '-')}`}>
                            {statusOptions.find(opt => opt.value === rowData.status)?.label || rowData.status}
                        </span>
                    )}
                />
                <Column field="maquina_id" header="Maq. ID" />
                <Column field="maquina_name" header="Maq. Nome" />
                <Column
                    header="Ações"
                    body={(row) => (
                        <Button 
                            icon="pi pi-trash" 
                            className="p-button-text p-button-danger" 
                            onClick={() => handleDelete(row.id)} 
                            disabled={statusFilter === 'inactive'}
                        />
                    )}
                />
            </DataTable>
        </div>
    );
}