import React, { useEffect, useState } from 'react'; 
import api from '../../utils/axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import AddProcessForm from './ProcessForm';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { useNotification } from '../../components/NotificationProvider';
import styles from '../../styles/Projects.module.css';

export default function ProcessList({ moldCode, componentID, isGlobalView, parentRefreshFlag }) {
    const [processes, setProcesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState(null);
    const [expandedRows, setExpandedRows] = useState(null);
    const [displayAddForm, setDisplayAddForm] = useState(false);

    const { show } = useNotification();

    const statusOptions = [
        { label: 'Todos', value: null },
        { label: 'Não Iniciados', value: 'not started' },
        { label: 'Em Processo', value: 'in process' },
        { label: 'Completos', value: 'completed' },
        { label: 'Pausados', value: 'paused' },
        { label: 'Histórico (Inativos)', value: 'inactive' }
    ];

    const fetchProcesses = async () => {
        if (!moldCode && !componentID) return;
        setLoading(true);
        try {
            let data = [];
            if (statusFilter === 'inactive') {
                const res = await api.get(`/processes/inactive_processes/${moldCode}`);
                data = (res.data.inactive_processes || []).map(p => ({
                    id: p.id,
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
                if (isGlobalView) {
                    data = (res.data.processes || []).flatMap(component => 
                        component.processes.map(process => ({
                            id: process.process_id,
                            ...process,
                            component_id: component.component_id
                        }))
                    );
                } else {
                    data = (res.data.processes || []).map(p => ({ ...p, id: p.process_id }));
                }
                if (statusFilter) {
                    data = data.filter(p => p.status === statusFilter);
                }
            }
            setProcesses(data);
        } catch (err) {
            console.error('Erro ao buscar processos:', err);
            show({ severity: 'error', summary: 'Erro', detail: 'Falha ao buscar processos.' });
            setProcesses([]);
        } finally {
            setLoading(false);
        }
    };

    // Ao montar e quando deps mudam: moldCode, componentID, statusFilter, parentRefreshFlag
    useEffect(() => { 
        fetchProcesses();
    }, [moldCode, componentID, statusFilter, parentRefreshFlag]);

    const handleDelete = async (id) => {
        confirmDialog({
            message: `Excluir processo ${id}?`, header: 'Confirmação', icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sim', rejectLabel: 'Não',
            acceptClassName: 'p-button-danger',
            accept: async () => {
                try {
                    await api.delete(`/processes/${id}?moldCode=${moldCode}`);
                    show({ severity: 'success', summary: 'Removido', detail: `Processo ${id} excluído.` });
                    fetchProcesses();
                } catch (err) {
                    console.error('Erro ao deletar processo:', err);
                    show({ severity: 'error', summary: 'Erro', detail: 'Falha ao excluir processo.' });
                }
            },
            reject: () => {}
        });
    };

    return (
        <div>
            <ConfirmDialog />
            <div className="flex gap-2 mb-2">
                {componentID && (
                    <Button
                        label="Adicionar Processo" icon="pi pi-plus" className="p-button-sm mr-3"
                        onClick={() => setDisplayAddForm(true)}
                    />
                )}
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
                loading={loading}
                responsiveLayout="scroll"
                dataKey="id"
                expandedRows={expandedRows}
                onRowToggle={(e) => setExpandedRows(e.data)}
            >
                {isGlobalView && <Column field="component_id" header="Componente" />}
                <Column field="step_name" header="Etapa" />
                <Column field="order" header="Ordem" />
                <Column field="status" header="Status" sortable body={(rowData) => (
                    <span className={`${styles.statusBadge} ${
                        rowData.status === 'not started' ? styles.notStarted :
                        rowData.status === 'in process' ? styles.inProcess :
                        rowData.status === 'paused' ? styles.paused : styles.completed
                    }`}>
                        {statusOptions.find(opt => opt.value === rowData.status)?.label || rowData.status}
                    </span>
                )} />
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
            {displayAddForm && (
                <AddProcessForm
                    componentID={componentID}
                    visible={displayAddForm}
                    onHide={() => setDisplayAddForm(false)}
                    onAdded={() => {
                        setDisplayAddForm(false);
                        fetchProcesses();
                    }}
                />
            )}
        </div>
    );
}