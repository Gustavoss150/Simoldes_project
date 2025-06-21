import React, { useState, useEffect, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { useNotification } from '../../components/NotificationProvider';
import api from '../../utils/axios';
import styles from '../../styles/projects/Forms.module.css';

const statusOptions = [
    { label: 'Not Started', value: 'not started' },
    { label: 'In Process', value: 'in process' },
    { label: 'Paused', value: 'paused' },
    { label: 'Completed', value: 'completed' }
];

export default function MoldForm({ mold, onHide, visible }) {
    const isEdit = Boolean(mold);
    const { show } = useNotification();

    const [formData, setFormData] = useState({
        codigo: '',
        description: '',
        status: 'not started',
        begin_date: new Date(),
        delivery_date: new Date(),
        componentes: [],
        processos: []
    });

    const [formErrors, setFormErrors] = useState({});
    const [machines, setMachines] = useState([]);
    const [steps, setSteps] = useState([]);
    const fileInputRef = useRef(null);

    const [newComponent, setNewComponent] = useState({ 
        id: '', name: '', material: '', quantity: 1, archive_3d_model: '' 
    });

    const [newProcess, setNewProcess] = useState({
        componente_id: '',
        step_id: '',
        status: 'not started',
        maquina_id: '',
        order: 1,
        begin_date: new Date(),
        delivery_date: new Date(),
        description: '',
        notes: ''
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                const [maqRes, stepsRes] = await Promise.all([
                    api.get('/cnc/mach'),
                    api.get('/processes/steps')
                ]);
                setMachines(maqRes.data.machines || []);
                setSteps(stepsRes.data.steps || []);
            } catch (err) {
                console.error('Erro ao carregar máquinas/etapas:', err);
                show({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar máquinas ou etapas.' });
            }
        };
        loadData();
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

    const handleFileUpload = async (file) => {
        try {
            const fd = new FormData();
            fd.append('file', file);
            const res = await api.post('/upload/model3d', fd, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const backendRoot = process.env.NEXT_PUBLIC_API_URL.replace(/\/api$/, '');
            const fullUrl = res.data.url.startsWith('http') 
                ? res.data.url 
                : `${backendRoot}${res.data.url}`;
                
            setNewComponent(prev => ({ ...prev, archive_3d_model: fullUrl }));
        } catch (error) {
            console.error('Erro no upload:', error);
            show({ 
                severity: 'error', summary: 'Erro', detail: 'Erro ao enviar arquivo: ' + (error.response?.data?.error || error.message) 
            });
        }
    };

    const handleAddComponent = () => {
        if (!newComponent.id.trim() || !newComponent.name.trim()) {
            show({ 
                severity: 'warn', summary: 'Validação', detail: 'Preencha ID e nome do componente!' 
            });
            return;
        }
        setFormData(prev => ({ 
            ...prev, 
            componentes: [...prev.componentes, newComponent] 
        }));
        setNewComponent({ id: '', name: '', material: '', quantity: 1, archive_3d_model: '' });
    };

    const handleAddProcess = () => {
        if (!newProcess.componente_id || !newProcess.step_id || !newProcess.maquina_id) {
            show({ 
                severity: 'warn', summary: 'Validação', detail: 'Selecione componente, etapa e máquina!' 
            });
            return;
        }
        setFormData(prev => ({ 
            ...prev, 
            processos: [...prev.processos, newProcess] 
        }));
        setNewProcess({ 
            componente_id: '', 
            step_id: '', 
            status: 'not started', 
            maquina_id: '', 
            order: 1, 
            begin_date: new Date(), 
            delivery_date: new Date(), 
            description: '',
            notes: ''
        });
    };

    const handleSave = async () => {
        if (!formData.codigo.trim()) {
            show({ 
                severity: 'warn', summary: 'Validação', detail: 'Código é obrigatório!' 
            });
            return;
        }
        if (!formData.description.trim()) {
            show({ 
                severity: 'warn', summary: 'Validação', detail: 'Descrição é obrigatória!' 
            });
            return;
        }

        if (formData.delivery_date < formData.begin_date) {
            show({ 
                severity: 'warn', summary: 'Validação', detail: 'Data de entrega deve ser posterior à data de início!' 
            });
            return;
        }

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
                step_name: steps.find(s => s.id === p.step_id)?.name || '',
                status: p.status,
                maquina_id: p.maquina_id,
                begin_date: p.begin_date.toISOString(),
                delivery_date: p.delivery_date.toISOString(),
                notes: p.notes || '',
                order: p.order,
                step_id: p.step_id
            }))
        };

        try {
            if (isEdit) {
                await api.put(`/projects/${formData.codigo}`, payload);
            } else {
                await api.post('/projects/', payload);
            }           
            show({ 
                severity: 'success', summary: 'Sucesso', detail: isEdit ? 'Molde atualizado' : 'Molde criado' 
            });
            onHide(true);
        } catch (error) {
            console.error('Erro ao salvar projeto:', error);
            show({ severity: 'error', summary: 'Erro', detail: `Erro ao salvar: ${error.response?.data?.error || error.message}` 
            });
        }
    };

    if (!visible) return null;

    return (
        <Dialog 
            header={isEdit ? 'Editar Molde' : 'Novo Molde'} 
            visible={visible} 
            onHide={() => onHide(false)} 
            className={styles.dialog} 
            headerClassName={styles.dialogHeader} 
            modal
        >
            <div className={styles.formContent + ' p-fluid'}>
                <div className={styles.formField}>
                    <label className={styles.formLabel}>Código *</label>
                    <InputText 
                        className={`${styles.formInput} ${!formData.codigo.trim() ? 'p-invalid' : ''}`} 
                        value={formData.codigo} 
                        onChange={e => setFormData({...formData, codigo: e.target.value})} 
                        disabled={isEdit}
                    />
                </div>               
                <div className={styles.formField}>
                    <label className={styles.formLabel}>Descrição *</label>
                    <InputText 
                        className={`${styles.formInput} ${!formData.description.trim() ? 'p-invalid' : ''}`} 
                        value={formData.description} 
                        onChange={e => setFormData({...formData, description: e.target.value})}
                    />
                </div>              
                <div className={styles.formField}>
                    <label className={styles.formLabel}>Status</label>
                    <Dropdown 
                        className={styles.dropdown} 
                        value={formData.status} 
                        options={statusOptions} 
                        onChange={e => setFormData({...formData, status: e.value})}
                    />
                </div>                
                <div className={styles.formField}>
                    <label className={styles.formLabel}>Data Início</label>
                    <Calendar 
                        className={styles.formInput} 
                        value={formData.begin_date} 
                        onChange={e => setFormData({...formData, begin_date: e.value})} 
                        showIcon
                    />
                </div>               
                <div className={styles.formField}>
                    <label className={styles.formLabel}>Data Entrega</label>
                    <Calendar 
                        className={styles.formInput} 
                        value={formData.delivery_date} 
                        onChange={e => setFormData({...formData, delivery_date: e.value})} 
                        showIcon
                    />
                </div>

                <div className={styles.section}>
                    <h4>Componentes</h4>
                    <div className="p-grid">
                        <div className="p-col-3">
                            <InputText 
                                placeholder="ID *" 
                                value={newComponent.id} 
                                onChange={e => setNewComponent({ ...newComponent, id: e.target.value })} 
                                className={`formText ${!newComponent.id.trim() ? 'p-invalid' : ''}`}
                            />
                        </div>                        
                        <div className="p-col-3">
                            <InputText 
                                placeholder="Nome *" 
                                value={newComponent.name} 
                                onChange={e => setNewComponent({ ...newComponent, name: e.target.value })} 
                                className={`formText ${!newComponent.name.trim() ? 'p-invalid' : ''}`}
                            />
                        </div>                      
                        <div className="p-col-3">
                            <InputText 
                                placeholder="Material" 
                                value={newComponent.material} 
                                onChange={e => setNewComponent({ ...newComponent, material: e.target.value })} 
                                className='formText' 
                            />
                        </div>                       
                        <div className="p-col-1">
                            <InputText 
                                type="number" 
                                placeholder="Qtd" 
                                value={newComponent.quantity} 
                                onChange={e => setNewComponent({ ...newComponent, quantity: parseInt(e.target.value) || 1 })} 
                                className='formText' 
                            />
                        </div>                       
                        <div className={styles.uploadGroup}>
                            <InputText 
                                readOnly 
                                placeholder="Modelo 3D URL" 
                                value={newComponent.archive_3d_model} 
                                className='url-upload' 
                            />
                            <Button 
                                icon="pi pi-upload" className="upload-buttom" onClick={() => fileInputRef.current.click()} 
                            />
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                hidden 
                                accept=".stl,.step,.iges,.pdf" 
                                onChange={e => e.target.files[0] && handleFileUpload(e.target.files[0])} 
                            />
                        </div>
                        
                        <div className="p-col-1">
                            <Button label="+" icon="pi pi-plus" onClick={handleAddComponent} className='mr-2' />
                        </div>
                    </div>
                    
                    <div className={styles.list}>
                        {formData.componentes.map((c, i) => (
                            <div key={i} className={styles.listItem}>
                                <span>{c.id} - {c.name}</span>
                                <Button 
                                    icon="pi pi-trash" className="p-button-text p-button-danger" 
                                    onClick={() => setFormData(prev => ({ 
                                        ...prev, 
                                        componentes: prev.componentes.filter((_, idx) => idx !== i) 
                                    }))} 
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.section}>
                    <h4>Processos</h4>
                    <div className="p-grid">
                        <div className="p-col-3">
                            <Dropdown 
                                placeholder="Componente *" 
                                options={formData.componentes.map(c => ({ label: c.id, value: c.id }))} 
                                value={newProcess.componente_id} 
                                onChange={e => setNewProcess({ ...newProcess, componente_id: e.value })} 
                                className={!newProcess.componente_id ? 'p-invalid' : ''}
                            />
                        </div>                        
                        <div className="p-col-3">
                            <Dropdown 
                                placeholder="Etapa *" 
                                options={steps.map(s => ({ label: s.name, value: s.id }))} 
                                value={newProcess.step_id} 
                                onChange={e => setNewProcess({ ...newProcess, step_id: e.value })} 
                                className={!newProcess.step_id ? 'p-invalid' : ''}
                            />
                        </div>                       
                        <div className="p-col-2">
                            <Dropdown 
                                placeholder="Máquina *" 
                                options={machines.map(m => ({ label: m.name, value: m.id }))} 
                                value={newProcess.maquina_id} 
                                onChange={e => setNewProcess({ ...newProcess, maquina_id: e.value })} 
                            />
                        </div>                      
                       <div className="p-col-2">
                            <InputText 
                                placeholder="Notas" className='mr-2' value={newProcess.notes} 
                                onChange={e => setNewProcess({ ...newProcess, notes: e.target.value })} 
                            />
                        </div>                       
                        <div className="p-col-1">
                            <InputText 
                                type="number" placeholder="Ord" className='mr-2' value={newProcess.order} 
                                onChange={e => setNewProcess({ ...newProcess, order: parseInt(e.target.value) || 1 })} 
                            />
                        </div>                       
                        <div className="p-col-1">
                            <Button label="+" icon="pi pi-plus" className='mr-2' onClick={handleAddProcess} />
                        </div>
                    </div>
                    
                    <div className={styles.list}>
                        {formData.processos.map((p, i) => (
                            <div key={i} className={styles.listItem}>
                                <span>{p.componente_id} - {steps.find(s => s.id === p.step_id)?.name}</span>
                                <Button 
                                    icon="pi pi-trash" className="p-button-text p-button-danger" 
                                    onClick={() => setFormData(prev => ({ 
                                        ...prev, 
                                        processos: prev.processos.filter((_, idx) => idx !== i) 
                                    }))} 
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.formButtons}>
                    <Button 
                        label="Cancelar" icon="pi pi-times" className="p-button-text mr-3" onClick={() => onHide(false)}
                    />
                    <Button 
                        label="Salvar" icon="pi pi-check" className="p-button-success mr-3" onClick={handleSave}
                    />
                </div>
            </div>
        </Dialog>
    );
}