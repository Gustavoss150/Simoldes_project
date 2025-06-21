import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { useNotification } from '../components/NotificationProvider';
import api from '../utils/axios';
import styles from '../styles/Materials.module.css';

export default function MaterialForm({ material, visible, onHide, onSaved }) {
    const isEdit = Boolean(material);
    const [form, setForm] = useState({
        id: '', molde_codigo: '', componentes_id: '', type: '', quantity: 0, arrival_date: new Date(),
        is_arrived: false, supplier: ''
    });
    const [molds, setMolds] = useState([]);
    const [components, setComponents] = useState([]);
    const { show } = useNotification();

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!visible) return;
        setErrors({});

        api.get('/projects/')
            .then(res => setMolds(res.data.molds || []))
            .catch(err => {
                console.error('Erro ao carregar moldes:', err);
                setMolds([]);
                show({ severity: 'error', summary: 'Erro', detail: 'Não foi possível carregar moldes.' });
            });

        if (isEdit) {
            setForm({
                id: material.id, molde_codigo: material.molde_codigo, componentes_id: material.componentes_id,
                type: material.type, quantity: material.quantity, arrival_date: new Date(material.arrival_date),
                is_arrived: material.is_arrived, supplier: material.supplier
            });
            // Carregar componentes do molde existente
            api.get(`/projects/components/${material.molde_codigo}`)
                .then(res => setComponents(res.data.components || []))
                .catch(err => {
                    console.error('Erro ao carregar componentes:', err);
                    setComponents([]);
                    show({ severity: 'error', summary: 'Erro', detail: 'Não foi possível carregar componentes.' });
                });
        } else {
            // Novo: limpar campos de chave estrangeira
            setForm(f => ({ ...f, molde_codigo: '', componentes_id: '' }));
            setComponents([]);
        }
    }, [visible]);

    const onMoldChange = e => {
        const m = e.value;
        // limpar erro de molde/componente
        setErrors(errs => {
            const copy = { ...errs };
            delete copy.molde_codigo;
            delete copy.componentes_id;
            return copy;
        });
        setForm(f => ({ ...f, molde_codigo: m.codigo, componentes_id: '' }));
        api.get(`/projects/components/${m.codigo}`)
            .then(res => setComponents(res.data.components || []))
            .catch(err => {
                console.error('Erro ao carregar componentes:', err);
                setComponents([]);
                show({ severity: 'error', summary: 'Erro', detail: 'Não foi possível carregar componentes.' });
            });
    };

    // Handlers que limpam erro do campo ao alterar
    const onIdChange = e => {
        const val = e.target.value;
        setForm(f => ({ ...f, id: val }));
        setErrors(errs => ({ ...errs, id: undefined }));
    };
    const onComponentChange = e => {
        const compId = e.value.id;
        setForm(f => ({ ...f, componentes_id: compId }));
        setErrors(errs => ({ ...errs, componentes_id: undefined }));
    };
    const onTypeChange = e => {
        const val = e.target.value;
        setForm(f => ({ ...f, type: val }));
        setErrors(errs => ({ ...errs, type: undefined }));
    };
    const onQuantityChange = e => {
        const num = Number(e.target.value) || 0;
        setForm(f => ({ ...f, quantity: num }));
        setErrors(errs => ({ ...errs, quantity: undefined }));
    };
    const onDateChange = e => {
        const dt = e.value;
        setForm(f => ({ ...f, arrival_date: dt }));
        setErrors(errs => ({ ...errs, arrival_date: undefined }));
    };
    const onArrivedChange = e => {
        setForm(f => ({ ...f, is_arrived: e.checked }));
    };
    const onSupplierChange = e => {
        const val = e.target.value;
        setForm(f => ({ ...f, supplier: val }));
    };

    // Validação antes de salvar
    const validate = () => {
        const errs = {};
        if (!isEdit) {
            if (!form.id || form.id.trim() === '') {
                errs.id = 'ID é obrigatório';
            }
        }
        if (!form.molde_codigo || form.molde_codigo.trim() === '') {
            errs.molde_codigo = 'Selecione um molde';
        }
        if (!form.componentes_id) {
            errs.componentes_id = 'Selecione um componente';
        }
        if (!form.type || form.type.trim() === '') {
            errs.type = 'Tipo é obrigatório';
        }
        if (form.quantity == null || form.quantity <= 0) {
            errs.quantity = 'Quantidade deve ser maior que zero';
        }
        if (!form.arrival_date) {
            errs.arrival_date = 'Data de chegada é obrigatória';
        }
        return errs;
    };

    const handleSave = async () => {
        const errs = validate();
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            const firstMsg = Object.values(errs)[0];
            show({ severity: 'warn', summary: 'Validação', detail: firstMsg, life: 3000 });
            return;
        }

        const arrivalDate = form.arrival_date.toISOString();
        const payload = {
            molde_codigo: form.molde_codigo,
            componentes_id: form.componentes_id,
            type: form.type,
            quantity: form.quantity,
            arrival_date: arrivalDate,
            is_arrived: form.is_arrived,
            supplier: form.supplier
        };

        try {
            if (isEdit) {
                await api.put(`/materials/${material.id}`, payload);
            } else {
                await api.post('/materials/', {
                    ...payload,
                    id: form.id
                });
            }
            show({
                severity: 'success',
                summary: 'Sucesso',
                detail: isEdit
                    ? 'Material atualizado com sucesso'
                    : 'Material criado com sucesso'
            });
            onSaved();
            onHide();
        } catch (err) {
            console.error('Erro ao salvar material:', err);
            show({
                severity: 'error',
                summary: 'Erro ao salvar',
                detail: 'Falha ao salvar material: ' + (err.response?.data?.message || err.message),
                life: 5000
            });
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
                            className={`${styles.formInput} ${errors.id ? 'p-invalid' : ''}`}
                            value={form.id}
                            onChange={onIdChange}
                        />
                        {errors.id && <small className="p-error">{errors.id}</small>}
                    </div>
                )}

                {!isEdit && (
                    <>
                        <div className={styles.formField}>
                            <label className={styles.formLabel}>Molde *</label>
                            <Dropdown
                                className={errors.molde_codigo ? 'p-invalid' : ''}
                                value={molds.find(m => m.codigo === form.molde_codigo)}
                                options={molds}
                                optionLabel="codigo"
                                onChange={onMoldChange}
                                placeholder="Selecione Molde"
                                filter
                                filterBy="codigo"
                            />
                            {errors.molde_codigo && <small className="p-error">{errors.molde_codigo}</small>}
                        </div>
                        <div className={styles.formField}>
                            <label className={styles.formLabel}>Componente *</label>
                            <Dropdown
                                className={errors.componentes_id ? 'p-invalid' : ''}
                                value={components.find(c => c.id === form.componentes_id)}
                                options={components}
                                optionLabel="name"
                                onChange={onComponentChange}
                                placeholder="Selecione Componente"
                                filter
                                filterBy="name,id"
                                itemTemplate={option => (
                                    <div>
                                        {option.name} (ID: {option.id})
                                    </div>
                                )}
                                valueTemplate={(option, props) => {
                                    if (!option) return props.placeholder;
                                    return <div>{option.name} (ID: {option.id})</div>;
                                }}
                                disabled={!form.molde_codigo}
                            />
                            {errors.componentes_id && <small className="p-error">{errors.componentes_id}</small>}
                        </div>
                    </>
                )}

                <div className={styles.formField}>
                    <label className={styles.formLabel}>Tipo *</label>
                    <InputText
                        className={`${styles.formInput} ${errors.type ? 'p-invalid' : ''}`}
                        value={form.type}
                        onChange={onTypeChange}
                    />
                    {errors.type && <small className="p-error">{errors.type}</small>}
                </div>
                <div className={styles.formField}>
                    <label className={styles.formLabel}>Quantidade *</label>
                    <InputText
                        className={`${styles.formInput} ${errors.quantity ? 'p-invalid' : ''}`}
                        type="number"
                        value={form.quantity}
                        onChange={onQuantityChange}
                    />
                    {errors.quantity && <small className="p-error">{errors.quantity}</small>}
                </div>
                <div className={styles.formField}>
                    <label className={styles.formLabel}>Data Chegada *</label>
                    <Calendar
                        className={`${styles.formInput} ${errors.arrival_date ? 'p-invalid' : ''}`}
                        value={form.arrival_date}
                        onChange={onDateChange}
                        showIcon
                        dateFormat="dd/mm/yy"
                    />
                    {errors.arrival_date && <small className="p-error">{errors.arrival_date}</small>}
                </div>
                <div className={styles.formField}>
                    <label className={styles.formLabel}>Chegou?</label>
                    <Checkbox checked={form.is_arrived} onChange={onArrivedChange} />
                </div>
                <div className={styles.formField}>
                    <label className={styles.formLabel}>Fornecedor</label>
                    <InputText className={styles.formInput} value={form.supplier} onChange={onSupplierChange} />
                </div>
            </div>
            <div className={styles.formButtons}>
                <Button
                    label="Cancelar" icon="pi pi-times" className="p-button-text mr-3" onClick={onHide}
                />
                <Button
                    label="Salvar" icon="pi pi-check" className="p-button-success mr-3" onClick={handleSave}
                />
            </div>
        </Dialog>
    );
}
