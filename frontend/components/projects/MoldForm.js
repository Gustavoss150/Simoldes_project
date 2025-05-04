import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import styles from '../../styles/projects/MoldForm.module.css';

// Garanta que NEXT_PUBLIC_API_URL esteja definido em .env.local
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const statusOptions = [
    { label: 'Not Started', value: 'not started' },
    { label: 'In Process', value: 'in process' },
    { label: 'Paused', value: 'paused' },
    { label: 'Completed', value: 'completed' }
];

export default function MoldForm({ mold, onHide, visible }) {
    const isEdit = Boolean(mold);
    const [formData, setFormData] = useState({
        codigo: '',
        description: '',
        status: 'not started',
        begin_date: new Date(),
        delivery_date: new Date(),
        componentes: [],
        processos: []
    });

    const [newComponent, setNewComponent] = useState({ id: '', name: '', material: '', quantity: 1, archive_3d_model: '' });
    const [newProcess, setNewProcess] = useState({
        componente_id: '',
        description: '',
        step_name: '',
        maquina_id: '',
        notes: '',
        order: 1,
        begin_date: new Date(),
        delivery_date: new Date(),
        status: 'not started'      // inicializa status
    });

    useEffect(() => {
        if (mold) setFormData({
            codigo: mold.codigo,
            description: mold.description,
            status: mold.status,
            begin_date: new Date(mold.begin_date),
            delivery_date: new Date(mold.delivery_date),
            componentes: mold.componentes || [],
            processos: mold.processos || []
        });
    }, [mold]);

    const handleAddComponent = () => {
        if (!newComponent.id || !newComponent.name) return alert('Preencha ID e nome do componente!');
        setFormData(prev => ({ ...prev, componentes: [...prev.componentes, newComponent] }));
        setNewComponent({ id: '', name: '', material: '', quantity: 1, archive_3d_model: '' });
    };

    const handleAddProcess = () => {
        if (!newProcess.componente_id) return alert('Selecione um componente válido!');
        setFormData(prev => ({ ...prev, processos: [...prev.processos, newProcess] }));
        setNewProcess({ componente_id: '', description: '', step_name: '', maquina_id: '', notes: '', order: 1, begin_date: new Date(), delivery_date: new Date(), status: 'not started' });
    };

    const handleSave = async () => {
        const payload = {
            molde: {
                codigo: formData.codigo,
                description: formData.description,
                status: formData.status,
                begin_date: formData.begin_date.toISOString(),
                delivery_date: formData.delivery_date.toISOString()
            },
            componentes: formData.componentes.map(c => ({
                id: c.id,
                name: c.name,
                material: c.material,
                quantity: c.quantity,
                archive_3d_model: c.archive_3d_model
            })),
            processos: formData.processos.map(p => ({
                componente_id: p.componente_id,
                description: p.description,
                step_name: p.step_name,
                status: p.status,
                maquina_id: p.maquina_id,
                begin_date: p.begin_date.toISOString(),
                delivery_date: p.delivery_date.toISOString(),
                notes: p.notes,
                order: p.order
            }))
        };

        try {
            if (!API_URL) throw new Error('NEXT_PUBLIC_API_URL não está definido');
            const url = isEdit
                ? `${API_URL}/projects/${formData.codigo}`
                : `${API_URL}/projects/`;
            const method = isEdit ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem(process.env.NEXT_PUBLIC_TOKEN_KEY)}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Erro ${response.status}: ${errorText}`);
            }

            onHide(true);
        } catch (error) {
            console.error('Erro detalhado:', error);
            alert(`Erro ao salvar: ${error.message}`);
        }
    };

    return (
        <Dialog header={isEdit ? 'Editar Molde' : 'Novo Molde'} visible={visible} onHide={() => onHide(false)} className={styles.dialog} modal>
            <div className="p-fluid">
                <div className="p-field"><label>Código</label><InputText value={formData.codigo} onChange={e => setFormData({ ...formData, codigo: e.target.value })} disabled={isEdit} /></div>
                <div className="p-field"><label>Descrição</label><InputText value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} /></div>
                <div className="p-field"><label>Status</label><Dropdown value={formData.status} options={statusOptions} onChange={e => setFormData({ ...formData, status: e.value })} /></div>
                <div className="p-field"><label>Data Início</label><Calendar value={formData.begin_date} onChange={e => setFormData({ ...formData, begin_date: e.value })} showIcon /></div>
                <div className="p-field"><label>Data Entrega</label><Calendar value={formData.delivery_date} onChange={e => setFormData({ ...formData, delivery_date: e.value })} showIcon /></div>

                <div className={styles.section}>
                    <h4>Componentes</h4>
                    <div className="p-grid">
                        <div className="p-col-3"><InputText placeholder="ID" value={newComponent.id} onChange={e => setNewComponent({ ...newComponent, id: e.target.value })} /></div>
                        <div className="p-col-3"><InputText placeholder="Nome" value={newComponent.name} onChange={e => setNewComponent({ ...newComponent, name: e.target.value })} /></div>
                        <div className="p-col-3"><InputText placeholder="Material" value={newComponent.material} onChange={e => setNewComponent({ ...newComponent, material: e.target.value })} /></div>
                        <div className="p-col-1"><InputText type="number" placeholder="Qtd" value={newComponent.quantity} onChange={e => setNewComponent({ ...newComponent, quantity: parseInt(e.target.value) })} /></div>
                        <div className="p-col-2"><InputText placeholder="3D Model URL" value={newComponent.archive_3d_model} onChange={e => setNewComponent({ ...newComponent, archive_3d_model: e.target.value })} /></div>
                        <div className="p-col-1"><Button label="+" icon="pi pi-plus" onClick={handleAddComponent} /></div>
                    </div>
                    <div className={styles.list}>{formData.componentes.map((c, i) => <div key={i} className={styles.listItem}><span>{c.id} - {c.name}</span><Button icon="pi pi-trash" className="p-button-danger" onClick={() => setFormData(prev => ({ ...prev, componentes: prev.componentes.filter((_, idx) => idx !== i) }))} /></div>)}</div>
                </div>

                <div className={styles.section}>
                    <h4>Processos</h4>
                    <div className="p-grid">
                        <div className="p-col-2"><Dropdown placeholder="Componente" options={formData.componentes.map(c => ({ label: `${c.id}`, value: c.id }))} value={newProcess.componente_id} onChange={e => setNewProcess({ ...newProcess, componente_id: e.value })} /></div>
                        <div className="p-col-2"><InputText placeholder="Descrição" value={newProcess.description} onChange={e => setNewProcess({ ...newProcess, description: e.target.value })} /></div>
                        <div className="p-col-2"><InputText placeholder="Etapa" value={newProcess.step_name} onChange={e => setNewProcess({ ...newProcess, step_name: e.target.value })} /></div>
                        <div className="p-col-2"><label>Status</label><Dropdown value={newProcess.status} options={statusOptions} onChange={e => setNewProcess({ ...newProcess, status: e.value })} /></div>
                        <div className="p-col-1"><InputText placeholder="Máq ID" value={newProcess.maquina_id} onChange={e => setNewProcess({ ...newProcess, maquina_id: e.target.value })} /></div>
                        <div className="p-col-1"><InputText type="number" placeholder="Ord" value={newProcess.order} onChange={e => setNewProcess({ ...newProcess, order: parseInt(e.target.value) })} /></div>
                        <div className="p-col-2"><Calendar placeholder="Início" value={newProcess.begin_date} onChange={e => setNewProcess({ ...newProcess, begin_date: e.value })} showIcon /></div>
                        <div className="p-col-2"><Calendar placeholder="Entrega" value={newProcess.delivery_date} onChange={e => setNewProcess({ ...newProcess, delivery_date: e.value })} showIcon /></div>
                        <div className="p-col-1"><Button label="+" icon="pi pi-plus" onClick={handleAddProcess} /></div>
                    </div>
                    <div className={styles.list}>{formData.processos.map((p, i) => <div key={i} className={styles.listItem}><span>{p.componente_id} - {p.step_name}</span><Button icon="pi pi-trash" className="p-button-danger" onClick={() => setFormData(prev => ({ ...prev, processos: prev.processos.filter((_, idx) => idx !== i) }))} /></div>)}</div>
                </div>

                <div className="p-dialog-footer">
                    <Button label="Cancelar" icon="pi pi-times" onClick={() => onHide(false)} className="p-button-text" />
                    <Button label="Salvar" icon="pi pi-check" onClick={handleSave} autoFocus />
                </div>
            </div>
        </Dialog>
    );
}
