import React, { useState, useEffect, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { useNotification } from '../../components/NotificationProvider';
import api from '../../utils/axios';
import styles from '../../styles/projects/Forms.module.css';

const processStatusOptions = [
    { label: 'Não Iniciado', value: 'not started' },
    { label: 'Em Processo', value: 'in process' },
    { label: 'Pausado', value: 'paused' },
    { label: 'Completo', value: 'completed' }
];

export default function ComponentForm({ component, moldCode, visible, onHide, onSave, isNew }) {
    const isEdit = !isNew;
    const { show } = useNotification();
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        id: '',
        name: '',
        material: '',
        quantity: 1,
        status: false,
        archive_3d_model: ''
    });
    const [errors, setErrors] = useState({});

    const [processes, setProcesses] = useState([]);
    const [processErrors, setProcessErrors] = useState([]); // array aligned with processes

    const [maquinas, setMaquinas] = useState([]);
    const [steps, setSteps] = useState([]);

    useEffect(() => {
        if (visible) {
            const fetchData = async () => {
                try {
                    const [maqRes, stepsRes] = await Promise.all([
                        api.get('/cnc/mach'),
                        api.get('/processes/steps')
                    ]);
                    setMaquinas(maqRes.data?.machines || []);
                    setSteps(stepsRes.data?.steps || []);
                } catch (error) {
                    console.error('Erro ao carregar dados:', error);
                    show({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar máquinas ou etapas.' });
                    setMaquinas([]);
                    setSteps([]);
                }
            };
            fetchData();
        }
    }, [visible, show]);

    // Inicializa formData e processes ao abrir ou mudar component/isNew
    useEffect(() => {
        if (visible) {
            if (isEdit && component) {
                setFormData({
                    id: component.id || '',
                    name: component.name || '',
                    quantity: component.quantity ?? 1,
                    status: component.status ?? false,
                    archive_3d_model: component.archive_3d_model || '',
                    material: component.material || ''
                });
                // carregar processos existentes
                fetchProcesses(component.id);
            } else {
                setFormData({ id: '', name: '', material: '', quantity: 1, status: false, archive_3d_model: '' });
                setProcesses([]);
                setProcessErrors([]);
            }
            setErrors({});
        }
    }, [visible, component, isEdit]);

    const fetchProcesses = async (componentId) => {
        try {
            const res = await api.get(`/processes/components/${componentId}`);
            const fetched = res.data?.processes || [];
            // normalize into array of objects with needed fields
            const arr = fetched.map((p, idx) => ({
                id: p.id || p.process_id || `${idx}`, 
                step_id: p.step_id || '',
                status: p.status || 'not started',
                maquina_id: p.maquina_id || null,
                order: p.order || (idx + 1),
                description: p.description || ''
            }));
            setProcesses(arr);
            setProcessErrors(arr.map(() => ({})));
        } catch (error) {
            console.error('Erro ao buscar processos:', error);
            show({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar processos.' });
            setProcesses([]);
            setProcessErrors([]);
        }
    };

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
            setFormData(prev => ({ ...prev, archive_3d_model: fullUrl }));
            show({ severity: 'success', summary: 'Upload', detail: 'Modelo 3D enviado.' });
        } catch (error) {
            console.error('Erro no upload:', error);
            show({
                severity: 'error', summary: 'Erro', detail: 'Erro ao enviar arquivo: ' + (error.response?.data?.error || error.message)
            });
        }
    };

    const handleProcessChange = (index, field, value) => {
        const newProcesses = [...processes];
        newProcesses[index] = {
            ...newProcesses[index],
            [field]: value,
            // atualizar descrição se alterar step_id
            description: field === 'step_id'
                ? (steps.find(s => s.id === value)?.name || newProcesses[index].description)
                : newProcesses[index].description
        };
        setProcesses(newProcesses);
        // limpa erro do campo
        setProcessErrors(prev => {
            const arr = [...prev];
            if (arr[index]) {
                arr[index][field] = undefined;
            }
            return arr;
        });
    };

    const addNewProcess = () => {
        setProcesses(prev => [...prev, {
            id: null, step_id: '', status: 'not started', maquina_id: null,
            order: prev.length + 1,
            description: '', isNew: true
        }]);
        setProcessErrors(prev => [...prev, {}]);
    };

    const validate = () => {
        const errs = {};
        if (!formData.id.trim()) {
            errs.id = 'ID é obrigatório';
        }
        if (!formData.name.trim()) {
            errs.name = 'Nome é obrigatório';
        }
        if (!formData.material.trim()) {
            errs.material = 'Material é obrigatório';
        }
        if (formData.quantity == null || formData.quantity < 1) {
            errs.quantity = 'Quantidade deve ser >= 1';
        }
        return errs;
    };

    const validateProcesses = () => {
        const errsArr = processes.map(p => {
            const pErr = {};
            if (!p.step_id) {
                pErr.step_id = 'Etapa obrigatória';
            }
            if (!p.status) {
                pErr.status = 'Status obrigatório';
            }
            if (!p.maquina_id) {
                pErr.maquina_id = 'Máquina obrigatória';
            }
            if (p.order == null || p.order < 1) {
                pErr.order = 'Ordem deve ser >= 1';
            }
            return pErr;
        });
        return errsArr;
    };

    const handleSubmit = async () => {
        const errs = validate();
        if (Object.keys(errs).length) {
            setErrors(errs);
            show({ severity: 'warn', summary: 'Validação', detail: Object.values(errs)[0], life: 3000 });
            return;
        }
        const pErrs = validateProcesses();
        const hasProcessError = pErrs.some(pe => Object.keys(pe).length > 0);
        if (hasProcessError) {
            setProcessErrors(pErrs);
            // mostra primeiro erro encontrado
            for (let i = 0; i < pErrs.length; i++) {
                const pe = pErrs[i];
                const first = Object.values(pe)[0];
                if (first) {
                    show({ severity: 'warn', summary: 'Validação', detail: `Processo ${i + 1}: ${first}`, life: 3000 });
                    break;
                }
            }
            return;
        }

        try {
            // monta payload
            if (isNew) {
                // criação
                const payload = {
                    componentes: [{
                        id: formData.id,
                        name: formData.name,
                        material: formData.material,
                        quantity: formData.quantity,
                        status: formData.status,
                        archive_3d_model: formData.archive_3d_model
                    }],
                    processos: processes.map(p => ({
                        step_id: p.step_id,
                        status: p.status,
                        maquina_id: p.maquina_id || null,
                        order: p.order,
                        componente_id: formData.id,
                        begin_date: new Date().toISOString(),
                        delivery_date: new Date().toISOString(),
                        description: p.description || '',
                        step_name: steps.find(s => s.id === p.step_id)?.name || '',
                        notes: ''
                    }))
                };
                await api.post(`/projects/new/${moldCode}`, payload);
                show({ severity: 'success', summary: 'Sucesso', detail: 'Componente criado.' });
            } else {
                // atualização
                // separar existentes e novos
                const existing = processes.filter(p => p.id && !p.isNew);
                const newPs = processes.filter(p => p.isNew);
                const updatePayload = {
                    componentes: [{
                        componente_id: formData.id,
                        ...(formData.quantity && { quantity: formData.quantity }),
                        ...(formData.status !== undefined && { status: formData.status }),
                        ...(formData.archive_3d_model && { archive_3d_model: formData.archive_3d_model }),
                        ...(formData.material && { material: formData.material })
                    }],
                    processos: existing.map(p => ({
                        processo_id: p.id,
                        ...(p.step_id && { step_id: p.step_id }),
                        ...(p.status && { status: p.status }),
                        ...(p.maquina_id && { maquina_id: p.maquina_id }),
                        ...(p.order && { order: p.order })
                    }))
                };
                await api.put(`/projects/${moldCode}`, updatePayload);
                if (newPs.length > 0) {
                    const payloadNew = {
                        processos: newPs.map(p => ({
                            step_id: p.step_id,
                            status: p.status,
                            maquina_id: p.maquina_id || null,
                            order: p.order,
                            componente_id: formData.id,
                            begin_date: new Date().toISOString(),
                            delivery_date: new Date().toISOString(),
                            description: p.description || '',
                            step_name: steps.find(s => s.id === p.step_id)?.name || '',
                            notes: ''
                        }))
                    };
                    await api.post(`/projects/new/${moldCode}`, payloadNew);
                }
                show({ severity: 'success', summary: 'Sucesso', detail: 'Componente atualizado.' });
            }
            // sinaliza ao parent para recarregar tabela
            if (onSave) {
                onSave(true);
            }
            onHide(true);
        } catch (error) {
            console.error('Erro ao salvar:', error);
            show({
                severity: 'error', summary: 'Erro', detail: 'Falha ao salvar: ' + (error.response?.data?.message || error.message),
                life: 5000
            });
        }
    };

    if (!visible) return null;

    return (
        <Dialog
            header={isNew ? 'Novo Componente' : `Editar Componente ${component?.id}`}
            visible={visible}
            onHide={() => onHide(false)}
            className={styles.dialog}
            headerClassName={styles.dialogHeader}
            modal
        >
            <div className={styles.formContent}>
                <div className={styles.formGrid}>
                    {isNew && (
                        <div className={styles.formField}>
                            <label className={styles.formLabel}>ID do Componente *</label>
                            <InputText
                                className={`${styles.formInput} ${errors.id ? 'p-invalid' : ''}`}
                                value={formData.id}
                                onChange={(e) => {
                                    setFormData(prev => ({ ...prev, id: e.target.value }));
                                    setErrors(prev => ({ ...prev, id: undefined }));
                                }}
                            />
                            {errors.id && <small className="p-error">{errors.id}</small>}
                        </div>
                    )}
                    <div className={styles.formField}>
                        <label className={styles.formLabel}>Nome *</label>
                        <InputText
                            className={`${styles.formInput} ${errors.name ? 'p-invalid' : ''}`}
                            value={formData.name}
                            onChange={(e) => {
                                setFormData(prev => ({ ...prev, name: e.target.value }));
                                setErrors(prev => ({ ...prev, name: undefined }));
                            }}
                        />
                        {errors.name && <small className="p-error">{errors.name}</small>}
                    </div>
                    <div className={styles.formField}>
                        <label className={styles.formLabel}>Material *</label>
                        <InputText
                            className={`${styles.formInput} ${errors.material ? 'p-invalid' : ''}`}
                            value={formData.material}
                            onChange={(e) => {
                                setFormData(prev => ({ ...prev, material: e.target.value }));
                                setErrors(prev => ({ ...prev, material: undefined }));
                            }}
                        />
                        {errors.material && <small className="p-error">{errors.material}</small>}
                    </div>
                    <div className={styles.formField}>
                        <label className={styles.formLabel}>Quantidade *</label>
                        <InputText
                            type="number"
                            className={`${styles.formInput} ${errors.quantity ? 'p-invalid' : ''}`}
                            value={formData.quantity}
                            onChange={(e) => {
                                const val = parseInt(e.target.value);
                                setFormData(prev => ({ ...prev, quantity: isNaN(val) ? '' : val }));
                                setErrors(prev => ({ ...prev, quantity: undefined }));
                            }}
                        />
                        {errors.quantity && <small className="p-error">{errors.quantity}</small>}
                    </div>
                    <div className={styles.formField}>
                        <label className={styles.formLabel}>Status Componente</label>
                        <div className={styles.statusToggle}>
                            <Checkbox
                                inputId="status"
                                checked={!!formData.status}
                                onChange={(e) => setFormData(prev => ({ ...prev, status: e.checked }))}
                            />
                            <label htmlFor="status">
                                {formData.status ? 'Concluído' : 'Pendente'}
                            </label>
                        </div>
                    </div>
                    <div className={styles.formField}>
                        <label className={styles.formLabel}>Modelo 3D</label>
                        <div className={styles.uploadGroup}>
                            <InputText
                                readOnly
                                value={formData.archive_3d_model || ''}
                                placeholder="URL do modelo 3D"
                                className="url-upload"
                            />
                            <Button icon="pi pi-upload" onClick={() => fileInputRef.current.click()} className="upload-buttom" />
                            <input
                                type="file"
                                ref={fileInputRef}
                                hidden
                                accept=".stl,.step,.iges,.pdf"
                                onChange={e => e.target.files[0] && handleFileUpload(e.target.files[0])}
                            />
                        </div>
                    </div>
                </div>

                <div className={styles.processSection}>
                    <div className={styles.processHeader}>
                        <h3>Processos</h3>
                    </div>
                    <div className={styles.processGrid}>
                        {processes.map((process, index) => (
                            <div key={process.id ?? index} className={styles.processRow}>
                                <div className={styles.processHeaderRow}>
                                    <h4>Processo {index + 1}</h4>
                                    {isNew && (
                                        <Button
                                            icon="pi pi-times"
                                            className="p-button-danger p-button-text"
                                            onClick={() => {
                                                const newArr = processes.filter((_, i) => i !== index);
                                                setProcesses(newArr);
                                                setProcessErrors(prev => prev.filter((_, i) => i !== index));
                                            }}
                                            tooltip="Cancelar processo"
                                        />
                                    )}
                                </div>
                                <div className={styles.formField}>
                                    <label className={styles.formLabel}>Etapa *</label>
                                    <Dropdown
                                        className={`${styles.dropdown} ${processErrors[index]?.step_id ? 'p-invalid' : ''}`}
                                        value={process.step_id}
                                        options={steps.map(s => ({ label: s.name, value: s.id }))}
                                        onChange={(e) => handleProcessChange(index, 'step_id', e.value)}
                                        placeholder="Selecione a etapa"
                                    />
                                    {processErrors[index]?.step_id && <small className="p-error">{processErrors[index].step_id}</small>}
                                </div>
                                <div className={styles.formField}>
                                    <label className={styles.formLabel}>Status *</label>
                                    <Dropdown
                                        className={`${styles.dropdown} ${processErrors[index]?.status ? 'p-invalid' : ''}`}
                                        value={process.status}
                                        options={processStatusOptions}
                                        onChange={(e) => handleProcessChange(index, 'status', e.value)}
                                        placeholder="Selecione status"
                                    />
                                    {processErrors[index]?.status && <small className="p-error">{processErrors[index].status}</small>}
                                </div>
                                <div className={styles.formField}>
                                    <label className={styles.formLabel}>Máquina</label>
                                    <Dropdown
                                        className={styles.dropdown}
                                        value={process.maquina_id}
                                        options={maquinas.map(m => ({ label: `${m.name} - ${m.id}`, value: m.id }))}
                                        onChange={(e) => handleProcessChange(index, 'maquina_id', e.value)}
                                        placeholder="Selecione a máquina"
                                    />
                                </div>
                                <div className={styles.formField}>
                                    <label className={styles.formLabel}>Ordem *</label>
                                    <InputText
                                        type="number"
                                        className={`${styles.formInput} ${processErrors[index]?.order ? 'p-invalid' : ''}`}
                                        value={process.order}
                                        onChange={(e) => handleProcessChange(index, 'order', parseInt(e.target.value) || 1)}
                                    />
                                    {processErrors[index]?.order && <small className="p-error">{processErrors[index].order}</small>}
                                </div>
                            </div>
                        ))}
                    </div>
                    {isNew && (
                        <div className={styles.addProcessButton}>
                            <Button
                                icon="pi pi-plus" label="Adicionar Processo" className="p-button-success mr-3"
                                onClick={addNewProcess}
                            />
                        </div>
                    )}
                </div>

                <div className={styles.formButtons}>
                    <Button
                        label="Cancelar" icon="pi pi-times" className="p-button-text mr-3" onClick={() => onHide(false)}
                    />
                    <Button
                        label="Salvar" icon="pi pi-check" className="p-button-success mr-3" onClick={handleSubmit}
                    />
                </div>
            </div>
        </Dialog>
    );
}