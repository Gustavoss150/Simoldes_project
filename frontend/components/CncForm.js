import React, { useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { useNotification } from '../components/NotificationProvider';
import api from '../utils/axios';
import formStyles from '../styles/CncForm.module.css';
import styles from '../styles/CncTable.module.css';

const CNCForm = ({
    machineDialog, setMachineDialog, isEditMachine, machineForm, setMachineForm, refreshMachines,
    programDialog, setProgramDialog, isEditProgram, programForm, setProgramForm, setPrograms,
    selectedComponent, selectedMold,
    molds, selectedMold: formSelectedMold, setSelectedMold, components, selectedComponent: formSelectedComponent,
    setSelectedComponent, processes, onMoldChange, onComponentChange, handleNCUpload, fileInputRef
}) => {
    const { show } = useNotification();
    // estado de erros para máquina e para programação
    const [machineErrors, setMachineErrors] = React.useState({});
    const [programErrors, setProgramErrors] = React.useState({});

    // Limpa erros ao abrir dialogos
    useEffect(() => {
        if (machineDialog) setMachineErrors({});
    }, [machineDialog]);

    useEffect(() => {
        if (programDialog) setProgramErrors({});
    }, [programDialog]);

    const validateMachine = () => {
        const errs = {};
        if (!machineForm.id || machineForm.id.trim() === '') {
            errs.id = 'ID é obrigatório';
        }
        if (!machineForm.name || machineForm.name.trim() === '') {
            errs.name = 'Nome é obrigatório';
        }
        if (!machineForm.type || machineForm.type.trim() === '') {
            errs.type = 'Tipo é obrigatório';
        }
        if (!machineForm.department || machineForm.department.trim() === '') {
            errs.department = 'Departamento é obrigatório';
        }
        return errs;
    };

    const saveMachine = async () => {
        const errs = validateMachine();
        if (Object.keys(errs).length) {
            setMachineErrors(errs);
            const firstMsg = Object.values(errs)[0];
            show({ severity: 'warn', summary: 'Validação', detail: firstMsg, life: 3000 });
            return;
        }
        try {
            const payload = {
                name: machineForm.name,
                description: machineForm.description,
                type: machineForm.type,
                department: machineForm.department,
                is_active: machineForm.is_active
            };
            if (isEditMachine) {
                await api.put(`/cnc/mach/${machineForm.id}`, payload);
            } else {
                // inclui id manualmente no payload
                await api.post('/cnc/mach', machineForm);
            }
            setMachineDialog(false);
            refreshMachines();
            show({ severity: 'success', summary: 'Sucesso', detail: isEditMachine ? 'Máquina atualizada' : 'Máquina criada' });
        } catch (error) {
            console.error("Erro ao salvar máquina:", error);
            show({ severity: 'error', summary: 'Erro', detail: "Erro ao salvar máquina: " + (error.response?.data?.error || error.message), life: 5000 });
        }
    };

    const validateProgram = () => {
        const errs = {};
        if (!programForm.id || programForm.id.trim() === '') {
            errs.id = 'ID é obrigatório';
        }
        if (!programForm.molde_codigo || programForm.molde_codigo.trim() === '') {
            errs.molde_codigo = 'Molde é obrigatório';
        }
        if (!programForm.componente_id) {
            errs.componente_id = 'Componente é obrigatório';
        }
        if (!programForm.process_id) {
            errs.process_id = 'Processo é obrigatório';
        }
        if (!programForm.programador || programForm.programador.trim() === '') {
            errs.programador = 'Programador é obrigatório';
        }
        return errs;
    };

    const saveProgram = async () => {
        const errs = validateProgram();
        if (Object.keys(errs).length) {
            setProgramErrors(errs);
            const firstMsg = Object.values(errs)[0];
            show({ severity: 'warn', summary: 'Validação', detail: firstMsg, life: 3000 });
            return;
        }
        try {
            const payload = {
                process_id: programForm.process_id, maquina_id: programForm.maquina_id,
                description: programForm.description, programador: programForm.programador,
                script: programForm.script, is_active: programForm.is_active
            };
            if (isEditProgram) {
                await api.put(`/cnc/program/${programForm.id}`, payload);
            } else {
                await api.post(`/cnc/program/${programForm.molde_codigo}`, programForm);
            }
            setProgramDialog(false);
            show({ severity: 'success', summary: 'Sucesso', detail: isEditProgram ? 'Programação atualizada' : 'Programação criada' });
            // recarregar lista
            if (selectedComponent) {
                const { data } = await api.get(`/cnc/program/${selectedComponent.id}`);
                setPrograms(data['CNC Programs'] || []);
            } else if (selectedMold) {
                const { data } = await api.get(`/cnc/program/mold/${selectedMold.codigo}`);
                setPrograms(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            console.error("Erro ao salvar programação:", error);
            show({ severity: 'error', summary: 'Erro', detail: "Erro ao salvar programação: " + (error.response?.data?.error || error.message), life: 5000 });
        }
    };

    const processOptionTemplate = (option) => {
        if (!option) return '';
        const machineInfo = option.maquina_id ? ` (Máq: ${option.maquina_id})` : '';
        return `${option.step_name}${machineInfo}`;
    };

    const onProcessChange = (e) => {
        const pid = e.value;
        const proc = processes.find(p => p.process_id === pid);
        if (!proc) return;
        setProgramForm(prev => ({ ...prev, process_id: pid, maquina_id: proc.maquina_id }));
        setProgramErrors(errs => ({ ...errs, process_id: undefined }));
    };

    const onMachineFieldChange = (field, value) => {
        setMachineForm(prev => ({ ...prev, [field]: value }));
        setMachineErrors(errs => ({ ...errs, [field]: undefined }));
    };
    const onProgramFieldChange = (field, value) => {
        setProgramForm(prev => ({ ...prev, [field]: value }));
        setProgramErrors(errs => ({ ...errs, [field]: undefined }));
    };

    return (
        <>
            <Dialog
                header={isEditMachine ? "Editar Máquina CNC" : "Nova Máquina CNC"}
                visible={machineDialog}
                onHide={() => setMachineDialog(false)}
                className={formStyles.dialog}
                headerClassName={formStyles.dialogHeader}
            >
                <div className={formStyles.formContent}>
                    <div className={formStyles.formField}>
                        <label className={formStyles.formLabel}>ID *</label>
                        <InputText
                            className={`${formStyles.formInput} ${machineErrors.id ? 'p-invalid' : ''}`}
                            value={machineForm.id}
                            onChange={e => onMachineFieldChange('id', e.target.value)}
                            disabled={isEditMachine}
                        />
                        {machineErrors.id && <small className="p-error">{machineErrors.id}</small>}
                    </div>
                    <div className={formStyles.formField}>
                        <label className={formStyles.formLabel}>Nome *</label>
                        <InputText
                            className={`${formStyles.formInput} ${machineErrors.name ? 'p-invalid' : ''}`}
                            value={machineForm.name}
                            onChange={e => onMachineFieldChange('name', e.target.value)}
                        />
                        {machineErrors.name && <small className="p-error">{machineErrors.name}</small>}
                    </div>
                    <div className={formStyles.formField}>
                        <label className={formStyles.formLabel}>Descrição</label>
                        <InputText
                            className={formStyles.formInput}
                            value={machineForm.description}
                            onChange={e => onMachineFieldChange('description', e.target.value)}
                        />
                    </div>
                    <div className={formStyles.formField}>
                        <label className={formStyles.formLabel}>Tipo *</label>
                        <InputText
                            className={`${formStyles.formInput} ${machineErrors.type ? 'p-invalid' : ''}`}
                            value={machineForm.type}
                            onChange={e => onMachineFieldChange('type', e.target.value)}
                        />
                        {machineErrors.type && <small className="p-error">{machineErrors.type}</small>}
                    </div>
                    <div className={formStyles.formField}>
                        <label className={formStyles.formLabel}>Departamento *</label>
                        <InputText
                            className={`${formStyles.formInput} ${machineErrors.department ? 'p-invalid' : ''}`}
                            value={machineForm.department}
                            onChange={e => onMachineFieldChange('department', e.target.value)}
                        />
                        {machineErrors.department && <small className="p-error">{machineErrors.department}</small>}
                    </div>
                    <div className={formStyles.statusToggle}>
                        <label className={formStyles.formLabel}>
                            <input
                                type="checkbox"
                                checked={machineForm.is_active}
                                onChange={e => setMachineForm(prev => ({ ...prev, is_active: e.target.checked }))}
                            /> Ativa
                        </label>
                    </div>
                    <div className={formStyles.formButtons}>
                        <Button label="Cancelar" severity="secondary" onClick={() => setMachineDialog(false)} className="mr-3" />
                        <Button label="Salvar" onClick={saveMachine} className="p-button-success mr-3" />
                    </div>
                </div>
            </Dialog>

            <Dialog
                header={isEditProgram ? "Editar Programação CNC" : "Nova Programação CNC"}
                visible={programDialog}
                onHide={() => setProgramDialog(false)}
                className={formStyles.dialog}
                headerClassName={formStyles.dialogHeader}
            >
                <div className={formStyles.formContent}>
                    <div className={formStyles.formField}>
                        <label className={formStyles.formLabel}>ID *</label>
                        <InputText
                            className={`${formStyles.formInput} ${programErrors.id ? 'p-invalid' : ''}`}
                            value={programForm.id}
                            onChange={e => onProgramFieldChange('id', e.target.value)}
                            disabled={isEditProgram}
                        />
                        {programErrors.id && <small className="p-error">{programErrors.id}</small>}
                    </div>
                    <div className={formStyles.formField}>
                        <label className={formStyles.formLabel}>Molde *</label>
                        <Dropdown
                            className={`${formStyles.dropdown} ${programErrors.molde_codigo ? 'p-invalid' : ''}`}
                            value={formSelectedMold}
                            options={molds}
                            onChange={e => {
                                onMoldChange(e);
                                onProgramFieldChange('molde_codigo', e.value.codigo);
                            }}
                            optionLabel="codigo"
                            placeholder="Selecione Molde"
                            filter
                            filterBy="codigo"
                            disabled={isEditProgram}
                        />
                        {programErrors.molde_codigo && <small className="p-error">{programErrors.molde_codigo}</small>}
                    </div>
                    <div className={formStyles.formField}>
                        <label className={formStyles.formLabel}>Componente *</label>
                        <Dropdown
                            className={`${formStyles.dropdown} ${programErrors.componente_id ? 'p-invalid' : ''}`}
                            value={formSelectedComponent}
                            options={components}
                            onChange={e => {
                                onComponentChange(e);
                                onProgramFieldChange('componente_id', e.value.id);
                            }}
                            optionLabel="name"
                            placeholder="Selecione Componente"
                            filter
                            filterBy="name"
                            itemTemplate={component => component ? `${component.id} — ${component.name}` : ''}
                            valueTemplate={component => component ? `${component.id} — ${component.name}` : ''}
                            disabled={isEditProgram || !formSelectedMold}
                        />
                        {programErrors.componente_id && <small className="p-error">{programErrors.componente_id}</small>}
                    </div>
                    <div className={formStyles.formField}>
                        <label className={formStyles.formLabel}>Processo *</label>
                        <Dropdown
                            className={`${formStyles.dropdown} ${programErrors.process_id ? 'p-invalid' : ''}`}
                            value={programForm.process_id}
                            options={processes}
                            onChange={onProcessChange}
                            optionLabel="step_name"
                            optionValue="process_id"
                            placeholder="Selecione Processo"
                            filter
                            filterBy="step_name"
                            itemTemplate={processOptionTemplate}
                            valueTemplate={processOptionTemplate}
                        />
                        {programErrors.process_id && <small className="p-error">{programErrors.process_id}</small>}
                    </div>
                    <div className={formStyles.formField}>
                        <label className={formStyles.formLabel}>Descrição</label>
                        <InputText
                            className={formStyles.formInput}
                            value={programForm.description}
                            onChange={e => onProgramFieldChange('description', e.target.value)}
                        />
                    </div>
                    <div className={formStyles.formField}>
                        <label className={formStyles.formLabel}>Programador *</label>
                        <InputText
                            className={`${formStyles.formInput} ${programErrors.programador ? 'p-invalid' : ''}`}
                            value={programForm.programador}
                            onChange={e => onProgramFieldChange('programador', e.target.value)}
                        />
                        {programErrors.programador && <small className="p-error">{programErrors.programador}</small>}
                    </div>
                    <div className={styles.uploadGroup}>
                        <InputText readOnly placeholder="Script NC URL" value={programForm.script} className="url-upload" />
                        <Button icon="pi pi-upload" className="upload-buttom" onClick={() => fileInputRef.current.click()} />
                        <input
                            type="file"
                            ref={fileInputRef}
                            hidden
                            accept=".nc,.txt"
                            onChange={e => e.target.files[0] && handleNCUpload(e.target.files[0])}
                        />
                    </div>
                    <div className={formStyles.formButtons}>
                        <Button label="Cancelar" severity="secondary" onClick={() => setProgramDialog(false)} className="mr-3" />
                        <Button label="Salvar" onClick={saveProgram} className="p-button-success mr-3" />
                    </div>
                </div>
            </Dialog>
        </>
    );
};

export default CNCForm;