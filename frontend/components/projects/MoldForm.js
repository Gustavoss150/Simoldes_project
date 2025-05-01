import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import styles from '../../styles/projects/MoldForm.module.css';

const statusOptions = [
  { label: 'Not Started', value: 'not started' },
  { label: 'In Process', value: 'in process' },
  { label: 'Paused', value: 'paused' },
  { label: 'Completed', value: 'completed' }
];

export default function MoldForm({ mold, onHide }) {
  const isEdit = Boolean(mold);
  const [formData, setFormData] = useState({ codigo: '', description: '', status: 'not started', begin_date: new Date(), delivery_date: new Date() });

  useEffect(() => {
    if (mold) {
      setFormData({
        codigo: mold.codigo,
        description: mold.description,
        status: mold.status,
        begin_date: new Date(mold.begin_date),
        delivery_date: new Date(mold.delivery_date)
      });
    }
  }, [mold]);

  const handleSave = async () => {
    const payload = { molde: formData, componentes: [], processos: [] };
    const url = isEdit ? `/api/projects/${formData.codigo}` : '/api/projects/';
    const method = isEdit ? 'PUT' : 'POST';
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    onHide();
  };

  return (
    <Dialog header={isEdit ? 'Editar Molde' : 'Novo Molde'} visible modal onHide={onHide} className={styles.dialog}>
      <div className="p-fluid">
        <div className="p-field">
          <label htmlFor="codigo">Código</label>
          <InputText id="codigo" value={formData.codigo} onChange={e => setFormData({ ...formData, codigo: e.target.value })} disabled={isEdit} />
        </div>
        <div className="p-field">
          <label htmlFor="description">Descrição</label>
          <InputText id="description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
        </div>
        <div className="p-field">
          <label htmlFor="status">Status</label>
          <Dropdown id="status" value={formData.status} options={statusOptions} onChange={e => setFormData({ ...formData, status: e.value })} />
        </div>
        <div className="p-field">
          <label htmlFor="begin_date">Data Início</label>
          <Calendar id="begin_date" value={formData.begin_date} onChange={e => setFormData({ ...formData, begin_date: e.value })} showIcon />
        </div>
        <div className="p-field">
          <label htmlFor="delivery_date">Data Entrega</label>
          <Calendar id="delivery_date" value={formData.delivery_date} onChange={e => setFormData({ ...formData, delivery_date: e.value })} showIcon />
        </div>
      </div>
      <div className="p-dialog-footer">
        <Button label="Cancelar" icon="pi pi-times" onClick={onHide} className="p-button-text" />
        <Button label="Salvar" icon="pi pi-check" onClick={handleSave} autoFocus />
      </div>
    </Dialog>
  );
}