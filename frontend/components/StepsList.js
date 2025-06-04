import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import api from '../utils/axios';
import styles from '../styles/StepList.module.css';

const StepsList = ({ visible, onHide }) => {
    const [steps, setSteps] = useState([]);
    const [loading, setLoading] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [editingStep, setEditingStep] = useState(null);
    const [newStep, setNewStep] = useState({ name: '', description: '' });

    useEffect(() => {
        if (visible) {
            fetchSteps();
        }
    }, [visible]);

    const fetchSteps = async () => {
        setLoading(true);
        try {
            const [activeRes, inactiveRes] = await Promise.all([
                api.get('processes/steps'),
                api.get('processes/inactive_steps')
            ]);
            
            // Extrair arrays de etapas
            const activeSteps = Array.isArray(activeRes.data) 
                ? activeRes.data 
                : activeRes.data.steps || activeRes.data.data || [];
            
            const inactiveSteps = Array.isArray(inactiveRes.data) 
                ? inactiveRes.data 
                : inactiveRes.data.steps || inactiveRes.data.data || [];
            
            setSteps([...activeSteps, ...inactiveSteps]);
        } catch (err) {
            console.error('Erro ao buscar etapas:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateStep = async () => {
        try {
            await api.post('/processes/register_steps', newStep);
            setShowCreateDialog(false);
            setNewStep({ name: '', description: '' });
            fetchSteps();
        } catch (err) {
            console.error('Erro ao criar etapa:', err);
        }
    };

    const handleUpdateStep = async () => {
        if (!editingStep) return;
        try {
            await api.put(`/processes/${editingStep.id}`, {
                name: editingStep.name,
                description: editingStep.description
            });
            setShowEditDialog(false);
            fetchSteps();
        } catch (err) {
            console.error('Erro ao atualizar etapa:', err);
        }
    };

    const handleDeleteStep = async (stepId) => {
        if (confirm('Tem certeza que deseja excluir esta etapa?')) {
            try {
                await api.delete(`/processes/steps/${stepId}`);
                fetchSteps();
            } catch (err) {
                console.error('Erro ao excluir etapa:', err);
            }
        }
    };

    const statusBodyTemplate = (rowData) => (
        <span className={rowData.is_active ? styles.activeBadge : styles.inactiveBadge}>
            {rowData.is_active ? 'Ativa' : 'Inativa'}
        </span>
    );

    const actionsBodyTemplate = (rowData) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button
                icon="pi pi-pencil"
                className="p-button-rounded p-button-text p-button-sm"
                onClick={() => {
                    setEditingStep(rowData);
                    setShowEditDialog(true);
                }}
            />
            <Button
                icon="pi pi-trash"
                className="p-button-rounded p-button-text p-button-danger p-button-sm"
                onClick={() => handleDeleteStep(rowData.id)}
            />
        </div>
    );

    return (
        <>
            <Dialog
                header="Gerenciar Lista de Etapas"
                visible={visible}
                style={{ width: '70vw', borderRadius: '12px' }}
                contentStyle={{ borderRadius: '0 0 12px 12px' }}
                onHide={onHide}
                modal
                className="p-dialog"
            >
                <div className={styles.modalHeader}>
                    <InputText
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        placeholder="Buscar etapas..."
                        className="p-inputtext-sm"
                        style={{ flex: 1 }}
                    />
                    <Button
                        label="Nova Etapa"
                        icon="pi pi-plus"
                        onClick={() => setShowCreateDialog(true)}
                        className="p-button p-button-success"
                    />
                </div>

                {loading ? (
                    <div className="p-d-flex p-jc-center">
                        <ProgressSpinner />
                    </div>
                ) : (
                    <DataTable
                        value={steps}
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        globalFilter={globalFilter}
                        emptyMessage="Nenhuma etapa encontrada."
                        className="p-datatable"
                    >
                        <Column field="name" header="Nome" sortable />
                        <Column field="description" header="Descrição" sortable />
                        <Column 
                            field="is_active" 
                            header="Status" 
                            body={statusBodyTemplate}
                            style={{ width: '120px' }}
                        />
                        <Column
                            header="Ações"
                            body={actionsBodyTemplate}
                            style={{ width: '120px' }}
                        />
                    </DataTable>
                )}
            </Dialog>

            <Dialog
                header="Nova Etapa"
                visible={showCreateDialog}
                style={{ width: '30vw', borderRadius: '12px' }}
                contentStyle={{ borderRadius: '0 0 12px 12px' }}
                onHide={() => setShowCreateDialog(false)}
                modal
                className="p-dialog"
            >
                <div className="p-fluid">
                    <div className="p-field formText">
                        <label htmlFor="name">Nome*</label>
                        <InputText
                            id="name"
                            value={newStep.name}
                            onChange={(e) => setNewStep({ ...newStep, name: e.target.value })}
                            className="p-inputtext"
                        />
                    </div>
                    <div className="p-field formText">
                        <label htmlFor="description">Descrição</label>
                        <InputText
                            id="description"
                            value={newStep.description}
                            onChange={(e) => setNewStep({ ...newStep, description: e.target.value })}
                            className="p-inputtext"
                        />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                        <Button
                            label="Cancelar"
                            icon="pi pi-times"
                            onClick={() => setShowCreateDialog(false)}
                            className="p-button-text"
                        />
                        <Button
                            label="Salvar"
                            icon="pi pi-check"
                            onClick={handleCreateStep}
                            className="p-button p-button-success"
                        />
                    </div>
                </div>
            </Dialog>

            <Dialog
                header="Editar Etapa"
                visible={showEditDialog}
                style={{ width: '30vw', borderRadius: '12px' }}
                contentStyle={{ borderRadius: '0 0 12px 12px' }}
                onHide={() => setShowEditDialog(false)}
                modal
                className="p-dialog"
            >
                {editingStep && (
                    <div className="p-fluid">
                        <div className="p-field formText">
                            <label htmlFor="editName">Nome*</label>
                            <InputText
                                id="editName"
                                value={editingStep.name}
                                onChange={(e) => setEditingStep({ ...editingStep, name: e.target.value })}
                                className="p-inputtext"
                            />
                        </div>
                        <div className="p-field formText">
                            <label htmlFor="editDescription">Descrição</label>
                            <InputText
                                id="editDescription"
                                value={editingStep.description}
                                onChange={(e) => setEditingStep({ ...editingStep, description: e.target.value })}
                                className="p-inputtext"
                            />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                            <Button
                                label="Cancelar"
                                icon="pi pi-times"
                                onClick={() => setShowEditDialog(false)}
                                className="p-button-text"
                            />
                            <Button
                                label="Atualizar"
                                icon="pi pi-check"
                                onClick={handleUpdateStep}
                                className="p-button p-button-success"
                            />
                        </div>
                    </div>
                )}
            </Dialog>
        </>
    );
};

export default StepsList;