import React, { useEffect, useState } from 'react';
import api from '../../utils/axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';

export default function ProcessList({ moldCode, componentID }) {
    const [processes, setProcesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showInactive, setShowInactive] = useState(false);

    const fetchProcesses = async () => {
        setLoading(true);
        let url;
        if (componentID) url = `/processes/components/${componentID}`;
        else url = showInactive ? `/processes/inactive_processes/${moldCode}` : `/processes/${moldCode}`;
        try {
            const res = await api.get(url);
            setProcesses(res.data.processes || res.data.inactive_processes || []);
        } catch (err) {
            console.error('Erro ao buscar processos:', err);
            setProcesses([]);
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => { if (moldCode || componentID) fetchProcesses(); }, [moldCode, componentID, showInactive]);

    const handleDelete = async (id) => {
        if (confirm(`Excluir processo ${id}?`)) {
            try {
                await api.delete(`/processes/${id}?moldCode=${moldCode}`);
                fetchProcesses();
            } catch (err) { console.error('Erro ao deletar processo:', err); }
        }
    };

    if (loading) return <ProgressSpinner />;

    return (
        <div>
            <div className="flex gap-2 mb-2">
                <Dropdown
                    value={showInactive}
                    options={[{ label: 'Ativos', value: false }, { label: 'Inativos', value: true }]}
                    onChange={(e) => setShowInactive(e.value)}
                    placeholder="Filtrar processos"
                />
            </div>
            <DataTable value={processes} responsiveLayout="scroll">
                <Column field="process_id" header="Processo ID" />
                <Column field="step_name" header="Etapa" />
                <Column field="notes" header="Descrição" />
                <Column field="order" header="Ordem" />
                <Column fielf="step_id" header="Máquina" />
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