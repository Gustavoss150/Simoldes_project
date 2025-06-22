import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { useNotification } from '../../components/NotificationProvider';
import api from '../../utils/axios';
import styles from '../../styles/projects/Forms.module.css';

const statusOptions = [
    { label: 'Não Iniciado', value: 'not started' },
    { label: 'Em Processo',  value: 'in process'  },
    { label: 'Pausado',      value: 'paused'      },
    { label: 'Completo',     value: 'completed'   }
];

export default function ProcessForm({ componentID, visible, onHide, onAdded }) {
    const { show } = useNotification();

    const [entries, setEntries] = useState([]);
    const [steps, setSteps] = useState([]);
    const [maquinas, setMaquinas] = useState([]);

    useEffect(() => {
        if (visible) {
            api.get('/processes/steps')
              .then(res => setSteps(res.data.steps || []))
              .catch(err => {
                  console.error('Erro ao carregar etapas:', err);
                  show({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar etapas.' });
                  setSteps([]);
              });
            api.get('/cnc/mach')
              .then(res => setMaquinas(res.data.machines || []))
              .catch(err => {
                  console.error('Erro ao carregar máquinas:', err);
                  show({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar máquinas.' });
                  setMaquinas([]);
              });
            setEntries([{
                step_id: '',
                status: 'not started',
                maquina_id: '',
                order: 1,
                begin_date: new Date(),
                delivery_date: new Date(),
                description: '',
                notes: ''
            }]);
        }
    }, [visible, show]);

    const addEntry = () => {
        setEntries(prev => [
            ...prev,
            {
                step_id: '',
                status: 'not started',
                maquina_id: '',
                order: prev.length + 1,
                begin_date: new Date(),
                delivery_date: new Date(),
                description: '',
                notes: ''
            }
        ]);
    };

    const removeEntry = (index) => {
        setEntries(prev => prev.filter((_, i) => i !== index));
    };

    const updateEntry = (index, field, value) => {
        setEntries(prev => prev.map((e, i) => i === index ? { ...e, [field]: value } : e));
    };

    const handleSave = async () => {
        for (let idx = 0; idx < entries.length; idx++) {
            const e = entries[idx];
            if (!e.step_id) {
                show({ severity: 'warn', summary: 'Validação', detail: `Processo ${idx+1}: selecione a etapa.` });
                return;
            }
            if (!e.status) {
                show({ severity: 'warn', summary: 'Validação', detail: `Processo ${idx+1}: selecione o status.` });
                return;
            }
            if (e.order == null || e.order < 1) {
                show({ severity: 'warn', summary: 'Validação', detail: `Processo ${idx+1}: informe ordem >= 1.` });
                return;
            }
            if (e.delivery_date < e.begin_date) {
                show({ severity: 'warn', summary: 'Validação', detail: `Processo ${idx+1}: data de entrega deve ser >= data de início.` });
                return;
            }
        }
        try {
            const payload = { processos: entries.map(e => ({
                description: e.description || '',
                step_id:       e.step_id,
                status:        e.status,
                maquina_id:    e.maquina_id || null,
                begin_date:    e.begin_date.toISOString(),
                delivery_date: e.delivery_date.toISOString(),
                notes:         e.notes || '',
                order:         e.order
            })) };
            await api.post(`/processes/components/${componentID}/processes`, payload);
            show({ severity: 'success', summary: 'Sucesso', detail: 'Processos adicionados.' });
            onAdded();
        } catch (err) {
            console.error('Error adding processes:', err);
            show({ severity: 'error', summary: 'Erro', detail: 'Falha ao adicionar processos.' });
        }
    };

    if (!visible) return null;

    return (
        <Dialog
            header="Adicionar Processos"
            visible={visible}
            onHide={onHide}
            className={styles.dialog}
            headerClassName={styles.dialogHeader}
            modal
        >
            <div className={styles.formContent + ' p-fluid'}>
                <div className={styles.processSection}>
                    {entries.map((entry, idx) => (
                        <div key={idx} className={styles.processRow}>
                            <div className={styles.processHeaderRow}>
                                <h4>Processo {idx + 1}</h4>
                                {entries.length > 1 && (
                                    <Button
                                        icon="pi pi-times"
                                        className="p-button-danger p-button-text"
                                        onClick={() => removeEntry(idx)}
                                        tooltip="Remover este processo"
                                    />
                                )}
                            </div>
                            <div className="p-fluid">
                                <div className={styles.formField}>
                                    <label className={styles.formLabel}>Etapa *</label>
                                    <Dropdown
                                        value={entry.step_id}
                                        options={steps.map(s => ({ label: s.name, value: s.id }))}
                                        onChange={e => updateEntry(idx, 'step_id', e.value)}
                                        placeholder="Selecione a etapa"
                                        className={!entry.step_id ? 'p-invalid' : ''}
                                    />
                                </div>
                                <div className={styles.formField}>
                                    <label className={styles.formLabel}>Status *</label>
                                    <Dropdown
                                        value={entry.status}
                                        options={statusOptions}
                                        onChange={e => updateEntry(idx, 'status', e.value)}
                                        placeholder="Selecione status"
                                        className={!entry.status ? 'p-invalid' : ''}
                                    />
                                </div>
                                <div className={styles.formField}>
                                    <label className={styles.formLabel}>Máquina</label>
                                    <Dropdown
                                        value={entry.maquina_id}
                                        options={maquinas.map(m => ({ label: m.name, value: m.id }))}
                                        onChange={e => updateEntry(idx, 'maquina_id', e.value)}
                                        placeholder="Selecione a máquina"
                                    />
                                </div>
                                <div className={styles.formField}>
                                    <label className={styles.formLabel}>Ordem *</label>
                                    <InputText
                                        type="number"
                                        value={entry.order}
                                        onChange={e => updateEntry(idx, 'order', parseInt(e.target.value) || '')}
                                        className={`${styles.formInput} ${(!entry.order || entry.order < 1) ? 'p-invalid' : ''}`}
                                    />
                                </div>
                                <div className={styles.formField}>
                                    <label className={styles.formLabel}>Data Início</label>
                                    <Calendar
                                        value={entry.begin_date}
                                        onChange={e => updateEntry(idx, 'begin_date', e.value)}
                                        showIcon
                                    />
                                </div>
                                <div className={styles.formField}>
                                    <label className={styles.formLabel}>Data Entrega</label>
                                    <Calendar
                                        value={entry.delivery_date}
                                        onChange={e => updateEntry(idx, 'delivery_date', e.value)}
                                        showIcon
                                    />
                                </div>
                                <div className={styles.formField}>
                                    <label className={styles.formLabel}>Descrição</label>
                                    <InputText
                                        value={entry.description}
                                        onChange={e => updateEntry(idx, 'description', e.target.value)}
                                        className={styles.formInput}
                                    />
                                </div>
                                <div className={styles.formField}>
                                    <label className={styles.formLabel}>Notas</label>
                                    <InputText
                                        value={entry.notes}
                                        onChange={e => updateEntry(idx, 'notes', e.target.value)}
                                        className={styles.formInput}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                    <Button
                        label="Adicionar Outro Processo" icon="pi pi-plus" className="p-button-text mr-3" onClick={addEntry}
                    />
                </div>
                <div className={styles.formButtons}>
                    <Button
                        label="Cancelar" icon="pi pi-times" className="p-button-text mr-3"onClick={onHide}
                    />
                    <Button
                        label="Salvar Todos" icon="pi pi-check" className="p-button-success mr-3" onClick={handleSave}
                    />
                </div>
            </div>
        </Dialog>
    );
}