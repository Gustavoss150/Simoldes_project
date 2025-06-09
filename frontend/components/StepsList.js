// File: components/StepsList.js
import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import api from '../utils/axios';
import styles from '../styles/StepList.module.css';

export default function StepsList({ visible, onHide }) {
    const [steps, setSteps] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState('');
    const [showCreate, setShowCreate] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [editStep, setEditStep] = useState(null);
    const [newStep, setNewStep] = useState({ name: '', description: '' });

    useEffect(() => {
        if (visible) fetch();
    }, [visible]);

    async function fetch() {
        setLoading(true);
        try {
            const [act, inact] = await Promise.all([
                api.get('processes/steps'),
                api.get('processes/inactive_steps')
            ]);
            const a = Array.isArray(act.data) ? act.data : act.data.steps || [];
            const b = Array.isArray(inact.data) ? inact.data : inact.data.steps || [];
            setSteps([...a, ...b]);
        } catch {
            console.error('Erro ao buscar etapas');
        } finally {
            setLoading(false);
        }
    }

    async function create() {
        await api.post('/processes/register_steps', newStep);
        setShowCreate(false);
        setNewStep({ name: '', description: '' });
        fetch();
    }

    async function update() {
        if (!editStep) return;
        await api.put(`/processes/${editStep.id}`, {
            name: editStep.name,
            description: editStep.description
        });
        setShowEdit(false);
        fetch();
    }

    function confirmDelete(id) {
        if (confirm('Confirma exclusão?')) api.delete(`/processes/steps/${id}`).then(fetch);
    }

    const statusBody = row => (
        <span className={row.is_active ? styles.activeBadge : styles.inactiveBadge}>
            {row.is_active ? 'Ativa' : 'Inativa'}
        </span>
    );

    const actionBody = row => (
        <div className={styles.actions}>
            <Button icon="pi pi-pencil" className="p-button-text p-button-sm" onClick={() => { setEditStep(row); setShowEdit(true); }} />
            <Button icon="pi pi-trash" className="p-button-text p-button-danger p-button-sm" onClick={() => confirmDelete(row.id)} />
        </div>
    );

    return (
        <>
            <Dialog
                header="Gerenciar Etapas"
                visible={visible}
                onHide={onHide}
                contentClassName={styles.dialogContent}
                modal className="p-dialog"
            >
                <div className={styles.modalHeader}>
                    <InputText value={filter} onChange={e => setFilter(e.target.value)} placeholder="Buscar..." className="p-inputtext-sm mr-3" />
                    <Button label="Nova Etapa" icon="pi pi-plus" className="p-button-success mr-3" onClick={() => setShowCreate(true)} />
                </div>
                {loading ? (
                    <div className="p-d-flex p-jc-center mb-4">
                        <ProgressSpinner />
                    </div>
                ) : (
                    <div className={styles.tableWrapper}>
                        <DataTable value={steps} paginator rows={10} globalFilter={filter} emptyMessage="Nenhuma etapa." className="p-datatable">
                            <Column field="name" header="Nome" sortable />
                            <Column field="description" header="Descrição" sortable />
                            <Column body={statusBody} header="Status" style={{ width: '120px' }} />
                            <Column body={actionBody} header="Ações" style={{ width: '100px' }} />
                        </DataTable>
                    </div>
                )}
            </Dialog>

            <Dialog header="Nova Etapa" visible={showCreate} onHide={() => setShowCreate(false)} contentClassName={styles.dialogContent} className="p-dialog" modal>
                <div className="p-fluid">
                    <div className="p-field formText">
                        <label>Nome*</label>
                        <InputText value={newStep.name} onChange={e => setNewStep({...newStep,name:e.target.value})} />
                    </div>
                    <div className="p-field formText">
                        <label>Descrição</label>
                        <InputText value={newStep.description} onChange={e => setNewStep({...newStep,description:e.target.value})} />
                    </div>
                    <div className={styles.footerButtons}>
                        <Button label="Cancelar" className="p-button-text" onClick={() => setShowCreate(false)} />
                        <Button label="Salvar" className="p-button-success" onClick={create} />
                    </div>
                </div>
            </Dialog>

            <Dialog header="Editar Etapa" visible={showEdit} onHide={() => setShowEdit(false)} contentClassName={styles.dialogContent} className="p-dialog" modal>
                {editStep && (
                    <div className="p-fluid">
                        <div className="p-field formText">
                            <label>Nome*</label>
                            <InputText value={editStep.name} onChange={e => setEditStep({...editStep,name:e.target.value})} />
                        </div>
                        <div className="p-field formText">
                            <label>Descrição</label>
                            <InputText value={editStep.description} onChange={e => setEditStep({...editStep,description:e.target.value})} />
                        </div>
                        <div className={styles.footerButtons}>
                            <Button label="Cancelar" className="p-button-text mr-3" onClick={() => setShowEdit(false)} />
                            <Button label="Atualizar" className="p-button-success" onClick={update} />
                        </div>
                    </div>
                )}
            </Dialog>
        </>
    );
}