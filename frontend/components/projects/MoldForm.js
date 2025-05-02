import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import styles from '../../styles/projects/Forms.module.css';

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
    
    const [componenteDrafts, setComponenteDrafts] = useState([]);
    const [processoDrafts, setProcessoDrafts] = useState([]);
    const [maquinas, setMaquinas] = useState([]);
    const [steps, setSteps] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [maqRes, stepsRes] = await Promise.all([
                    fetch('/api/cnc/mach').then(res => res.json()),
                    fetch('/api/processes/steps').then(res => res.json())
                ]);
                setMaquinas(maqRes.machines || []);
                setSteps(stepsRes.steps || []);
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (mold) {
            setFormData({
                codigo: mold.codigo,
                description: mold.description,
                status: mold.status,
                begin_date: new Date(mold.begin_date),
                delivery_date: new Date(mold.delivery_date),
                componentes: mold.componentes || [],
                processos: mold.processos || []
            });
        } else {
            setFormData({
                codigo: '',
                description: '',
                status: 'not started',
                begin_date: new Date(),
                delivery_date: new Date(),
                componentes: [],
                processos: []
            });
        }
    }, [mold]);

    const addComponenteDraft = () => {
        setComponenteDrafts([...componenteDrafts, { 
            id: '', 
            name: '', 
            material: '', 
            quantity: 1, 
            archive_3d_model: '' 
        }]);
    };

    const addProcessoDraft = () => {
        setProcessoDrafts([...processoDrafts, { 
            componente_id: '',
            description: '',
            step_name: '',
            status: 'not started',
            maquina_id: '',
            begin_date: new Date(),
            delivery_date: new Date(),
            notes: '',
            order: processoDrafts.length + 1
        }]);
    };

    const handleSave = async () => {
        // Preparar os componentes
        const componentesPayload = [
            ...formData.componentes,
            ...componenteDrafts.map(c => ({
                id: c.id,
                name: c.name,
                material: c.material,
                quantity: c.quantity,
                archive_3d_model: c.archive_3d_model
            }))
        ];
    
        // Preparar os processos
        const processosPayload = [
            ...formData.processos,
            ...processoDrafts.map(p => ({
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
        ];
    
        // Construir o payload completo
        const payload = {
            molde: {
                codigo: formData.codigo,
                description: formData.description,
                status: formData.status,
                begin_date: formData.begin_date.toISOString(),
                delivery_date: formData.delivery_date.toISOString()
            },
            componentes: componentesPayload,
            processos: processosPayload
        };
    
        console.log('Payload sendo enviado:', JSON.stringify(payload, null, 2)); // Para debug
    
        try {
            const url = isEdit ? `/api/projects/${formData.codigo}` : '/api/projects/';
            const method = isEdit ? 'PUT' : 'POST';
    
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload),
                credentials: 'include' // Caso precise de cookies/sessão
            });
    
            if (!response.ok) {
                const errorResponse = await response.json().catch(() => null);
                throw new Error(
                    errorResponse?.message || 
                    `Erro ${response.status}: ${response.statusText}`
                );
            }
    
            const data = await response.json();
            console.log('Resposta da API:', data);
            onHide(); // Fechar o modal após sucesso
        } catch (error) {
            console.error('Erro detalhado:', {
                error: error,
                message: error.message,
                stack: error.stack
            });
            alert(`Erro ao salvar: ${error.message}`);
        }
    };
    return (
        <Dialog 
            header={isEdit ? 'Editar Molde' : 'Novo Molde'} 
            visible={visible} 
            onHide={onHide} 
            className={styles.dialog}
            headerClassName={styles.dialogHeader}
            modal
        >
            <div className={styles.formContent}>
                {/* Campos básicos do molde */}
                <div className={styles.formField}>
                    <label className={styles.formLabel}>Código</label>
                    <InputText
                        className={styles.formInput}
                        value={formData.codigo}
                        onChange={e => setFormData({ ...formData, codigo: e.target.value })}
                        disabled={isEdit}
                    />
                </div>
                
                <div className={styles.formField}>
                    <label className={styles.formLabel}>Descrição</label>
                    <InputText
                        className={styles.formInput}
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>
                
                <div className={styles.formField}>
                    <label className={styles.formLabel}>Status</label>
                    <Dropdown
                        className={styles.dropdown}
                        value={formData.status}
                        options={statusOptions}
                        onChange={e => setFormData({ ...formData, status: e.value })}
                    />
                </div>
                
                <div className={styles.formField}>
                    <label className={styles.formLabel}>Data Início</label>
                    <Calendar
                        className={styles.formInput}
                        value={formData.begin_date}
                        onChange={e => setFormData({ ...formData, begin_date: e.value })}
                        showIcon
                    />
                </div>
                
                <div className={styles.formField}>
                    <label className={styles.formLabel}>Data Entrega</label>
                    <Calendar
                        className={styles.formInput}
                        value={formData.delivery_date}
                        onChange={e => setFormData({ ...formData, delivery_date: e.value })}
                        showIcon
                    />
                </div>

                {/* Seção de Componentes */}
                <div className={styles.formSection}>
                    <h3>Componentes</h3>
                    <Button 
                        label="Adicionar Componente" 
                        icon="pi pi-plus" 
                        className="p-button-secondary"
                        onClick={addComponenteDraft}
                    />
                    
                    {componenteDrafts.map((draft, index) => (
                        <div key={`component-draft-${index}`} className={styles.draftForm}>
                            <div className={styles.formField}>
                                <label className={styles.formLabel}>ID do Componente *</label>
                                <InputText
                                    value={draft.id}
                                    onChange={(e) => {
                                        const newDrafts = [...componenteDrafts];
                                        newDrafts[index].id = e.target.value;
                                        setComponenteDrafts(newDrafts);
                                    }}
                                    required
                                />
                            </div>
                            
                            <div className={styles.formField}>
                                <label className={styles.formLabel}>Nome *</label>
                                <InputText
                                    value={draft.name}
                                    onChange={(e) => {
                                        const newDrafts = [...componenteDrafts];
                                        newDrafts[index].name = e.target.value;
                                        setComponenteDrafts(newDrafts);
                                    }}
                                    required
                                />
                            </div>
                            
                            <div className={styles.formField}>
                                <label className={styles.formLabel}>Material *</label>
                                <InputText
                                    value={draft.material}
                                    onChange={(e) => {
                                        const newDrafts = [...componenteDrafts];
                                        newDrafts[index].material = e.target.value;
                                        setComponenteDrafts(newDrafts);
                                    }}
                                    required
                                />
                            </div>
                            
                            <div className={styles.formField}>
                                <label className={styles.formLabel}>Quantidade *</label>
                                <InputText
                                    type="number"
                                    value={draft.quantity}
                                    onChange={(e) => {
                                        const newDrafts = [...componenteDrafts];
                                        newDrafts[index].quantity = parseInt(e.target.value) || 1;
                                        setComponenteDrafts(newDrafts);
                                    }}
                                    required
                                />
                            </div>
                            
                            <div className={styles.formField}>
                                <label className={styles.formLabel}>Modelo 3D</label>
                                <InputText
                                    value={draft.archive_3d_model}
                                    onChange={(e) => {
                                        const newDrafts = [...componenteDrafts];
                                        newDrafts[index].archive_3d_model = e.target.value;
                                        setComponenteDrafts(newDrafts);
                                    }}
                                />
                            </div>
                            
                            <div className={styles.draftButtons}>
                                <Button 
                                    label="Salvar" 
                                    icon="pi pi-check" 
                                    className="p-button-success"
                                    onClick={() => {
                                        const newComponente = { ...componenteDrafts[index] };
                                        setFormData(prev => ({
                                            ...prev,
                                            componentes: [...prev.componentes, newComponente]
                                        }));
                                        setComponenteDrafts(componenteDrafts.filter((_, i) => i !== index));
                                    }}
                                />
                                <Button 
                                    label="Cancelar" 
                                    icon="pi pi-times" 
                                    className="p-button-danger"
                                    onClick={() => setComponenteDrafts(componenteDrafts.filter((_, i) => i !== index))}
                                />
                            </div>
                        </div>
                    ))}
                    
                    {formData.componentes.map((componente, index) => (
                        <div key={`componente-${index}`} className={styles.savedItem}>
                            <span>{componente.id} - {componente.name}</span>
                            <Button 
                                icon="pi pi-trash" 
                                className="p-button-rounded p-button-danger"
                                onClick={() => {
                                    const newComponentes = formData.componentes.filter((_, i) => i !== index);
                                    setFormData(prev => ({ ...prev, componentes: newComponentes }));
                                }}
                            />
                        </div>
                    ))}
                </div>

                {/* Seção de Processos */}
                <div className={styles.formSection}>
                    <h3>Processos</h3>
                    <Button 
                        label="Adicionar Processo" 
                        icon="pi pi-plus" 
                        className="p-button-secondary"
                        onClick={addProcessoDraft}
                    />
                    
                    {processoDrafts.map((draft, index) => (
                        <div key={`process-draft-${index}`} className={styles.draftForm}>
                            <div className={styles.formField}>
                                <label className={styles.formLabel}>Componente Relacionado *</label>
                                <Dropdown
                                    value={draft.componente_id}
                                    options={[
                                    ...formData.componentes.map(c => ({ label: `${c.id} - ${c.name}`, value: c.id }))
                                    ]}
                                    onChange={(e) => {
                                        const newDrafts = [...processoDrafts];
                                        newDrafts[index].componente_id = e.value;
                                        setProcessoDrafts(newDrafts);
                                    }}
                                    placeholder="Selecione um Componente"
                                    required
                                />
                            </div>
                            
                            <div className={styles.formField}>
                                <label className={styles.formLabel}>Descrição *</label>
                                <InputText
                                    value={draft.description}
                                    onChange={(e) => {
                                        const newDrafts = [...processoDrafts];
                                        newDrafts[index].description = e.target.value;
                                        setProcessoDrafts(newDrafts);
                                    }}
                                    required
                                />
                            </div>
                            
                            <div className={styles.formField}>
                                <label className={styles.formLabel}>Nome do Passo *</label>
                                <InputText
                                    value={draft.step_name}
                                    onChange={(e) => {
                                        const newDrafts = [...processoDrafts];
                                        newDrafts[index].step_name = e.target.value;
                                        setProcessoDrafts(newDrafts);
                                    }}
                                    required
                                />
                            </div>
                            
                            <div className={styles.formField}>
                                <label className={styles.formLabel}>Status *</label>
                                <Dropdown
                                    options={statusOptions}
                                    value={draft.status}
                                    onChange={(e) => {
                                        const newDrafts = [...processoDrafts];
                                        newDrafts[index].status = e.value;
                                        setProcessoDrafts(newDrafts);
                                    }}
                                    required
                                />
                            </div>
                            
                            <div className={styles.formField}>
                                <label className={styles.formLabel}>Máquina</label>
                                <Dropdown
                                    value={draft.maquina_id}
                                    options={maquinas.map(m => ({ label: `${m.id} - ${m.name}`, value: m.id }))}
                                    onChange={(e) => {
                                        const newDrafts = [...processoDrafts];
                                        newDrafts[index].maquina_id = e.value;
                                        setProcessoDrafts(newDrafts);
                                    }}
                                    placeholder="Selecione a máquina"
                                />
                            </div>
                            
                            <div className={styles.formField}>
                                <label className={styles.formLabel}>Data Início</label>
                                <Calendar
                                    showIcon
                                    value={draft.begin_date}
                                    onChange={(e) => {
                                        const newDrafts = [...processoDrafts];
                                        newDrafts[index].begin_date = e.value;
                                        setProcessoDrafts(newDrafts);
                                    }}
                                />
                            </div>
                            
                            <div className={styles.formField}>
                                <label className={styles.formLabel}>Data Entrega</label>
                                <Calendar
                                    showIcon
                                    value={draft.delivery_date}
                                    onChange={(e) => {
                                        const newDrafts = [...processoDrafts];
                                        newDrafts[index].delivery_date = e.value;
                                        setProcessoDrafts(newDrafts);
                                    }}
                                />
                            </div>
                            
                            <div className={styles.formField}>
                                <label className={styles.formLabel}>Notas</label>
                                <InputText
                                    value={draft.notes}
                                    onChange={(e) => {
                                        const newDrafts = [...processoDrafts];
                                        newDrafts[index].notes = e.target.value;
                                        setProcessoDrafts(newDrafts);
                                    }}
                                />
                            </div>
                            
                            <div className={styles.formField}>
                                <label className={styles.formLabel}>Ordem *</label>
                                <InputText
                                    type="number"
                                    value={draft.order}
                                    onChange={(e) => {
                                        const newDrafts = [...processoDrafts];
                                        newDrafts[index].order = parseInt(e.target.value) || 1;
                                        setProcessoDrafts(newDrafts);
                                    }}
                                    required
                                />
                            </div>
                            
                            <div className={styles.draftButtons}>
                                <Button 
                                    label="Salvar" 
                                    icon="pi pi-check" 
                                    className="p-button-success"
                                    onClick={() => {
                                        const newProcesso = { ...processoDrafts[index] };
                                        setFormData(prev => ({
                                            ...prev,
                                            processos: [...prev.processos, newProcesso]
                                        }));
                                        setProcessoDrafts(processoDrafts.filter((_, i) => i !== index));
                                    }}
                                />
                                <Button 
                                    label="Cancelar" 
                                    icon="pi pi-times" 
                                    className="p-button-danger"
                                    onClick={() => setProcessoDrafts(processoDrafts.filter((_, i) => i !== index))}
                                />
                            </div>
                        </div>
                    ))}
                    
                    {formData.processos.map((processo, index) => (
                        <div key={`processo-${index}`} className={styles.savedItem}>
                            <span>{processo.componente_id} - {processo.step_name}</span>
                            <Button 
                                icon="pi pi-trash" 
                                className="p-button-rounded p-button-danger"
                                onClick={() => {
                                    const newProcessos = formData.processos.filter((_, i) => i !== index);
                                    setFormData(prev => ({ ...prev, processos: newProcessos }));
                                }}
                            />
                        </div>
                    ))}
                </div>

                <div className={styles.formButtons}>
                    <Button
                        label="Cancelar"
                        icon="pi pi-times"
                        className="p-button-text"
                        onClick={onHide}
                    />
                    <Button
                        label="Salvar"
                        icon="pi pi-check"
                        className="p-button-success"
                        onClick={handleSave}
                    />
                </div>
            </div>
        </Dialog>
    );
}