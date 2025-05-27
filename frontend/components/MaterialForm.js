// File: components/MaterialForm.js
import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import api from '../utils/axios';
import styles from '../styles/Materials.module.css';

export default function MaterialForm({ material, visible, onHide, onSaved }) {
    const isEdit = Boolean(material);
    const [form, setForm] = useState({
        id: '', molde_codigo: '', componentes_id: '', type: '', quantity: 0, arrival_date: new Date(), is_arrived: false, supplier: ''
    });
    const [molds, setMolds] = useState([]);
    const [components, setComponents] = useState([]);

    useEffect(() => {
        if (!visible) return;

        api.get('/projects/').then(res => setMolds(res.data.projects || []));
        if (isEdit) {
            setForm({
                id:             material.id,
                molde_codigo:   material.molde_codigo,
                componentes_id: material.componentes_id,
                type:           material.type,
                quantity:       material.quantity,
                arrival_date:   new Date(material.arrival_date),
                is_arrived:     material.is_arrived,
                supplier:       material.supplier
            });
            api.get(`/projects/components/${material.molde_codigo}`).then(res => setComponents(res.data.components || []));
        } else {
            setForm(f => ({ ...f, molde_codigo: '', componentes_id: '' }));
            setComponents([]);
        }
    }, [visible]);

    const onMoldChange = e => {
        const m = e.value;
        setForm(f => ({ ...f, molde_codigo: m.codigo, componentes_id: '' }));
        api.get(`/projects/components/${m.codigo}`).then(res => setComponents(res.data.components || []));
    };

    const handleSave = async () => {
        const payload = isEdit
            ? {
                type: form.type,
                quantity: form.quantity,
                arrival_date: form.arrival_date.toISOString(),
                is_arrived: form.is_arrived,
                supplier: form.supplier
            }
            : {
                id:             form.id,
                molde_codigo:   form.molde_codigo,
                componentes_id: form.componentes_id,
                type:           form.type,
                quantity:       form.quantity,
                arrival_date:   form.arrival_date.toISOString(),
                is_arrived:     form.is_arrived,
                supplier:       form.supplier
            };

        try {
            if (isEdit) {
                await api.put(`/materials/${material.id}`, payload);
            } else {
                await api.post('/materials', payload);
            }
            onSaved();
        } catch (err) {
            console.error('Erro ao salvar material:', err);
            alert('Falha ao salvar material');
        }
    };

    if (!visible) return null;
    return (
        <Dialog
            header={isEdit ? 'Editar Material' : 'Novo Material'}
            visible={visible}
            onHide={onHide}
            className={styles.dialog}
            headerClassName={styles.dialogHeader}
            modal
        >
            <div className={styles.formContent + ' p-fluid'}>
                {!isEdit && (
                    <div className={styles.formField}>
                        <label className={styles.formLabel}>ID *</label>
                        <InputText
                            className={styles.formInput}
                            value={form.id}
                            onChange={e => setForm(f => ({ ...f, id: e.target.value }))}
                        />
                    </div>
                )}

                {!isEdit && (
                    <>
                        <div className={styles.formField}>
                            <label className={styles.formLabel}>Molde *</label>
                            <Dropdown
                                value={molds.find(m => m.codigo === form.molde_codigo)}
                                options={molds}
                                optionLabel="codigo"
                                onChange={onMoldChange}
                                placeholder="Selecione Molde"
                                filter filterBy="codigo"
                            />
                        </div>
                        <div className={styles.formField}>
                            <label className={styles.formLabel}>Componente *</label>
                            <Dropdown
                                value={components.find(c => c.id === form.componentes_id)}
                                options={components}
                                optionLabel="id"
                                onChange={e => setForm(f => ({ ...f, componentes_id: e.value.id }))}
                                placeholder="Selecione Componente"
                                filter filterBy="id"
                            />
                        </div>
                    </>
                )}

                <div className={styles.formField}>
                    <label className={styles.formLabel}>Tipo *</label>
                    <InputText
                        className={styles.formInput}
                        value={form.type}
                        onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                    />
                </div>
                <div className={styles.formField}>
                    <label className={styles.formLabel}>Quantidade *</label>
                    <InputText
                        className={styles.formInput}
                        type="number"
                        value={form.quantity}
                        onChange={e => setForm(f => ({ ...f, quantity: +e.target.value }))}
                    />
                </div>
                <div className={styles.formField}>
                    <label className={styles.formLabel}>Data Chegada *</label>
                    <Calendar
                        className={styles.formInput}
                        value={form.arrival_date}
                        onChange={e => setForm(f => ({ ...f, arrival_date: e.value }))}
                        showIcon
                    />
                </div>
                <div className={styles.formField}>
                    <label className={styles.formLabel}>Chegou?</label>
                    <Checkbox
                        checked={form.is_arrived}
                        onChange={e => setForm(f => ({ ...f, is_arrived: e.checked }))}
                    />
                </div>
                <div className={styles.formField}>
                    <label className={styles.formLabel}>Fornecedor</label>
                    <InputText
                        className={styles.formInput}
                        value={form.supplier}
                        onChange={e => setForm(f => ({ ...f, supplier: e.target.value }))}
                    />
                </div>
            </div>

            <div className={styles.formButtons}>
                <Button
                    label="Cancelar"
                    icon="pi pi-times"
                    className="p-button-text mr-3"
                    onClick={onHide}
                />
                <Button
                    label="Salvar"
                    icon="pi pi-check"
                    className="p-button-success mr-3"
                    onClick={handleSave}
                />
            </div>
        </Dialog>
    );
}