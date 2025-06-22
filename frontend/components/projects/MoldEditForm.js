import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { useNotification } from '../../components/NotificationProvider';
import api from '../../utils/axios';
import styles from '../../styles/projects/Forms.module.css';

const statusOptions = [
    { label: 'Not Started', value: 'not started' },
    { label: 'In Process',  value: 'in process'  },
    { label: 'Paused',      value: 'paused'      },
    { label: 'Completed',   value: 'completed'   }
];

export default function MoldEditForm({ mold, visible, onHide, onSave }) {
    const { show } = useNotification();
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('not started');
    const [deliveryDate, setDeliveryDate] = useState(new Date());

    useEffect(() => {
        if (visible && mold) {
            setDescription(mold.description || '');
            setStatus(mold.status || 'not started');
            setDeliveryDate(mold.delivery_date ? new Date(mold.delivery_date) : new Date());
        }
    }, [mold, visible]);

    const handleSave = async () => {
        const body = { molde: {} };
        if (description !== undefined) body.molde.description = description;
        if (status)      body.molde.status      = status;
        if (deliveryDate) body.molde.delivery_date = deliveryDate.toISOString();

        try {
            await api.put(`/projects/${mold.codigo}`, body);
            show({ severity: 'success', summary: 'Sucesso', detail: `Molde ${mold.codigo} atualizado.` });
            if (typeof onSave === 'function') {
                await onSave(); // parent deve refetch e atualizar lista
            }
            onHide(true);
        } catch (err) {
            console.error('Error updating mold:', err);
            show({
                severity: 'error', summary: 'Erro',
                detail: 'Falha ao atualizar molde: ' + (err.response?.data?.message || err.message)
            });
        }
    };

    if (!visible) return null;

    return (
        <Dialog
            header={`Editar Molde ${mold.codigo}`}
            visible={visible}
            onHide={() => onHide(false)}
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
                    <label className={styles.formLabel}>Descrição *</label>
                    <InputText
                        className={styles.formInput}
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />
                </div>
                <div className={styles.formField}>
                    <label className={styles.formLabel}>Status *</label>
                    <Dropdown
                        value={status}
                        options={statusOptions}
                        onChange={e => setStatus(e.value)}
                        placeholder="Selecione status"
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
                        label="Cancelar" icon="pi pi-times" className="p-button-text mr-2"
                        onClick={() => onHide(false)}
                    />
                    <Button
                        label="Salvar" icon="pi pi-check" className="p-button-success mr-2" onClick={handleSave}
                        autoFocus
                    />
                </div>
            </div>
        </Dialog>
    );
}