// File: /components/projects/MoldEditForm.js
import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import api from '../../utils/axios';
import styles from '../../styles/projects/Forms.module.css';

const statusOptions = [
    { label: 'Not Started', value: 'not started' },
    { label: 'In Process',  value: 'in process'  },
    { label: 'Paused',      value: 'paused'      },
    { label: 'Completed',   value: 'completed'   }
];

export default function MoldEditForm({ mold, visible, onHide, onSave }) {
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('not started');
    const [deliveryDate, setDeliveryDate] = useState(new Date());

    useEffect(() => {
        if (visible && mold) {
            setDescription(mold.description || '');
            setStatus(mold.status || 'not started');
            setDeliveryDate(new Date(mold.delivery_date));
        }
    }, [mold, visible]);

    const handleSave = async () => {
        const body = { molde: {} };
        if (description) body.molde.description = description;
        if (status)      body.molde.status      = status;
        if (deliveryDate) body.molde.delivery_date = deliveryDate.toISOString();

    try {
        await api.put(`/projects/${mold.codigo}`, body);
        if (typeof onSave === 'function') onSave();
        onHide();
        } catch (err) {
        console.error('Error updating mold:', err);
        alert('Falha ao atualizar molde');
        }
    };

    if (!visible) return null;

    return (
        <Dialog
            header={`Editar Molde ${mold.codigo}`}
            visible={visible}
            onHide={onHide}
            className={styles.dialog}
            headerClassName={styles.dialogHeader}
            modal
        >
            <div className={styles.formContent + ' p-fluid'}>
                <div className={styles.formField}>
                    <label className={styles.formLabel}>Código</label>
                    <InputText className={styles.formInput} value={mold.codigo} disabled />
                </div>
                <div className={styles.formField}>
                    <label className={styles.formLabel}>Descrição</label>
                    <InputText className={styles.formInput} value={description}
                        onChange={e => setDescription(e.target.value)}
                    />
                </div>
                <div className={styles.formField}>
                    <label className={styles.formLabel}>Status</label>
                    <Dropdown
                        value={status}
                        options={statusOptions}
                        onChange={e => setStatus(e.value)}
                    />
                </div>
                <div className={styles.formField}>
                    <label className={styles.formLabel}>Data de Entrega</label>
                    <Calendar
                        value={deliveryDate}
                        onChange={e => setDeliveryDate(e.value)}
                        showIcon
                    />
                </div>
                <div className={styles.formButtons}>
                    <Button
                        label="Cancelar"
                        icon="pi pi-times"
                        className="p-button-text mr-2"
                        onClick={onHide}
                    />
                    <Button
                        label="Salvar"
                        icon="pi pi-check"
                        className="p-button-success mr-2"
                        onClick={handleSave}
                        autoFocus
                    />
                </div>
            </div>
        </Dialog>
    );
}
