// File: /components/projects/MoldEditForm.js
import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import styles from '../../styles/projects/Forms.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const statusOptions = [
  { label: 'Not Started', value: 'not started' },
  { label: 'In Process',  value: 'in process'  },
  { label: 'Paused',      value: 'paused'      },
  { label: 'Completed',   value: 'completed'   }
];

export default function MoldEditForm({ mold, visible, onHide }) {
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('not started');
  const [deliveryDate, setDeliveryDate] = useState(new Date());

  useEffect(() => {
    if (mold) {
      setDescription(mold.description || '');
      setStatus(mold.status || 'not started');
      setDeliveryDate(new Date(mold.delivery_date));
    }
  }, [mold]);

  const handleSave = async () => {
    const body = {
      molde: {
        description: description || undefined,
        status: status || undefined,
        delivery_date: deliveryDate.toISOString()
      }
    };

    try {
      if (!API_URL) throw new Error('API_URL não definido');
      const url = `${API_URL}/projects/${mold.codigo}`;
      const resp = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem(process.env.NEXT_PUBLIC_TOKEN_KEY)}`
        },
        body: JSON.stringify(body)
      });
      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`Erro ${resp.status}: ${text}`);
      }
      onHide(true);
    } catch (err) {
      console.error(err);
      alert(`Falha ao atualizar molde: ${err.message}`);
    }
  };

  return (
    <Dialog
      header="Editar Molde"
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
          <label className={styles.formLabel}>Descrição</label>
          <InputText
            className={styles.formInput}
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Status</label>
          <Dropdown
            className={styles.dropdown}
            value={status}
            options={statusOptions}
            onChange={e => setStatus(e.value)}
          />
        </div>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Data de Entrega</label>
          <Calendar
            className={styles.formInput}
            value={deliveryDate}
            onChange={e => setDeliveryDate(e.value)}
            showIcon
          />
        </div>
        <div className={styles.formButtons}>
          <Button
            label="Cancelar"
            icon="pi pi-times"
            className="p-button-text"
            onClick={() => onHide(false)}
          />
          <Button
            label="Salvar"
            icon="pi pi-check"
            className="p-button-success"
            onClick={handleSave}
            autoFocus
          />
        </div>
      </div>
    </Dialog>
  );
}
