// File: /components/materials/MaterialForm.js
import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import api from '../utils/axios';
import styles from '../styles/Materials.module.css';

export default function MaterialForm({ moldCode, material, visible, onHide, onSaved }) {
    const isEdit = Boolean(material);
    const [form, setForm] = useState({
        componentes_id: '', type: '', quantity: 0,
        arrival_date: new Date(), is_arrived: false, supplier: ''
    });

    const [molds, setMolds] = useState([]);
        const componentTemplate = (option) => option ? `${option.id} — ${option.name}` : '';
        const [components, setComponents] = useState([]);
        const [selectedMold, setSelectedMold] = useState(null);
        const [selectedComponent, setSelectedComponent] = useState(null);

    useEffect(() => {
        if (visible) {
            if (isEdit) {
                setForm({
                    componentes_id: material.componentes_id,
                    type:           material.type,
                    quantity:       material.quantity,
                    arrival_date:   new Date(material.arrival_date),
                    is_arrived:     material.is_arrived,
                    supplier:       material.supplier
                });
            } else {
                setForm({ componentes_id: '', type: '', quantity: 0, arrival_date: new Date(), is_arrived: false, supplier: '' });
            }
        }
    }, [visible, material]);

    const onMoldChange = async (e) => {
        const mold = e.value;
        setSelectedMold(mold);
        setSelectedComponent(null);
        setProcesses([]);
        const { data } = await api.get(`/projects/components/${mold.codigo}`);
        setComponents(data.components);
        setProgramForm(prev => ({ ...prev, molde_codigo: mold.codigo, componente_id: '', process_id: '', maquina_id: '' }));
    };

    const onComponentChange = async (e) => {
        const comp = e.value;
        setSelectedComponent(comp);
        const { data } = await api.get(`/processes/components/${comp.id}`);
        setProcesses(data.processes);
        setProgramForm(prev => ({ ...prev, componente_id: comp.id, process_id: '', maquina_id: '' }));
    };

    const handleSave = async () => {
        const payload = {
            molde_codigo: moldCode,
            componentes_id: form.componentes_id,
            type: form.type,
            quantity: form.quantity,
            arrival_date: form.arrival_date.toISOString(),
            is_arrived: form.is_arrived,
            supplier: form.supplier
        };
        try {
            if (isEdit) {
                await api.put(`/materials/${material.id}`, payload);
            } else {
                await api.post('/materials/', payload);
            }
            onSaved();
        } catch (err) {
            console.error('Erro ao salvar material:', err);
            alert('Falha ao salvar material');
        }
    };

    if (!visible) return null;

    return (
        <Dialog header={isEdit ? 'Editar Material' : 'Novo Material'} visible={visible} onHide={onHide} className={styles.dialog} headerClassName={styles.dialogHeader} modal>
            <div className={styles.formContent + ' p-fluid'}>
                <div className={styles.formField}>
                    <label className={styles.formLabel}>Componente</label>
                    <Dropdown
                        value={selectedComponent}
                        options={components}
                        onChange={e => { onComponentChange(e); setProgramForm(prev => ({ ...prev, componente_id: e.value.id })); }}
                        optionLabel="name"
                        placeholder="Selecione Componente"
                        filter
                        filterBy="name"
                        itemTemplate={componentTemplate}
                        valueTemplate={componentTemplate}
                        className={styles.dropdown}
                    />
                </div>
                <div className={styles.formField}>
                    <label className={styles.formLabel}>Tipo *</label>
                    <InputText value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} required className='formText' />
                </div>
                <div className={styles.formField}>
                    <label className={styles.formLabel}>Quantidade *</label>
                    <InputText type="number" value={form.quantity} onChange={e => setForm({ ...form, quantity: parseInt(e.target.value) })} required className='formText' />
                </div>
                <div className={styles.formField}>
                    <label className={styles.formLabel}>Data Chegada *</label>
                    <Calendar value={form.arrival_date} onChange={e => setForm({ ...form, arrival_date: e.value })} showIcon required />
                </div>
                <div className={styles.formField}>
                    <label className={styles.formLabel}>Chegou?</label>
                    <Checkbox checked={form.is_arrived} onChange={e => setForm({ ...form, is_arrived: e.checked })} />
                </div>
                <div className={styles.formField}>
                    <label className={styles.formLabel}>Fornecedor</label>
                    <InputText value={form.supplier} onChange={e => setForm({ ...form, supplier: e.target.value })} className='formText' />
                </div>
            </div>
            <div className={styles.formButtons}>
                <Button label="Cancelar" icon="pi pi-times" className="p-button-text mr-3" onClick={onHide} />
                <Button label="Salvar" icon="pi pi-check" className="p-button-success mr-3" onClick={handleSave} />
            </div>
        </Dialog>
    );
}
