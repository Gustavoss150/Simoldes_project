import React from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
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

    const saveMachine = async () => {
        try {
            if (isEditMachine) {
                const payload = {
                    name: machineForm.name,
                    description: machineForm.description,
                    type: machineForm.type,
                    department: machineForm.department,
                    is_active: machineForm.is_active
                };
                await api.put(`/cnc/mach/${machineForm.id}`, payload);
            } else {
                await api.post('/cnc/mach', machineForm);
            }
            setMachineDialog(false);
            refreshMachines();
        } catch (error) {
            console.error("Erro ao salvar máquina:", error);
            alert("Erro ao salvar máquina: " + (error.response?.data?.error || error.message));
        }
    };

    const saveProgram = async () => {
        try {
            if (isEditProgram) {
                const payload = {
                    process_id: programForm.process_id, maquina_id: programForm.maquina_id, description: programForm.description,
                    programador: programForm.programador, script: programForm.script, is_active: programForm.is_active
                };
                await api.put(`/cnc/program/${programForm.id}`, payload);
            } else {
                await api.post(`/cnc/program/${programForm.molde_codigo}`, programForm);
            }
            setProgramDialog(false);

            if (selectedComponent) {
                const { data } = await api.get(`/cnc/program/${selectedComponent.id}`);
                setPrograms(data['CNC Programs']);
            } else if (selectedMold) {
                const { data } = await api.get(`/cnc/program/mold/${selectedMold.codigo}`);
                setPrograms(data);
            }
        } catch (error) {
            console.error("Erro ao salvar programação:", error);
            alert("Erro ao salvar programação: " + (error.response?.data?.error || error.message));
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
                        <label className={formStyles.formLabel}>ID</label>
                        <InputText 
                            className={formStyles.formInput} value={machineForm.id} 
                            onChange={e => setMachineForm({ ...machineForm, id: e.target.value })}  
                            disabled={isEditMachine} // Editável apenas na criação
                        />
                    </div>
                    <div className={formStyles.formField}>
                        <label className={formStyles.formLabel}>Nome</label>
                        <InputText 
                            className={formStyles.formInput} value={machineForm.name} 
                            onChange={e => setMachineForm({ ...machineForm, name: e.target.value })}
                        />
                    </div>
                    <div className={formStyles.formField}>
                        <label className={formStyles.formLabel}>Descrição</label>
                        <InputText 
                            className={formStyles.formInput} value={machineForm.description} 
                            onChange={e => setMachineForm({ ...machineForm, description: e.target.value })} 
                        />
                    </div>
                    <div className={formStyles.formField}>
                        <label className={formStyles.formLabel}>Tipo</label>
                        <InputText 
                            className={formStyles.formInput} value={machineForm.type} 
                            onChange={e => setMachineForm({ ...machineForm, type: e.target.value })} 
                        />
                    </div>
                    <div className={formStyles.formField}>
                        <label className={formStyles.formLabel}>Departamento</label>
                        <InputText 
                             className={formStyles.formInput} value={machineForm.department} 
                            onChange={e => setMachineForm({ ...machineForm, department: e.target.value })} 
                        />
                    </div>
                    <div className={formStyles.statusToggle}>
                        <label className={formStyles.formLabel}>
                            <input 
                                type="checkbox" checked={machineForm.is_active} 
                                onChange={e => setMachineForm({ ...machineForm, is_active: e.target.checked })} 
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
                className={formStyles.dialog} headerClassName={formStyles.dialogHeader}
            >
                <div className={formStyles.formContent}>
                    <div className={formStyles.formField}>
                        <label className={formStyles.formLabel}>ID</label>
                        <InputText 
                            className={formStyles.formInput} value={programForm.id} 
                            onChange={e => setProgramForm({ ...programForm, id: e.target.value })} 
                            disabled={isEditProgram} required 
                        />
                    </div>
                    <div className={formStyles.formField}>
                        <label className={formStyles.formLabel}>Molde</label>
                        <Dropdown
                            value={formSelectedMold}
                            options={molds}
                            onChange={e => { 
                                onMoldChange(e); 
                                setProgramForm(prev => ({ ...prev, molde_codigo: e.value.codigo })); 
                            }}
                            optionLabel="codigo"
                            placeholder="Selecione Molde"
                            filter
                            filterBy="codigo"
                            className={formStyles.dropdown}
                            disabled={isEditProgram}
                        />
                    </div>
                    <div className={formStyles.formField}>
                        <label className={formStyles.formLabel}>Componente</label>
                        <Dropdown
                            value={formSelectedComponent}
                            options={components}
                            onChange={e => { 
                                onComponentChange(e); 
                                setProgramForm(prev => ({ ...prev, componente_id: e.value.id })); 
                            }}
                            optionLabel="name"
                            placeholder="Selecione Componente"
                            filter
                            filterBy="name"
                            itemTemplate={component => component ? `${component.id} — ${component.name}` : ''}
                            valueTemplate={component => component ? `${component.id} — ${component.name}` : ''}
                            className={formStyles.dropdown}
                            disabled={isEditProgram || !formSelectedMold}
                        />
                    </div>
                    <div className={formStyles.formField}>
                        <label className={formStyles.formLabel}>Processo</label>
                        <Dropdown
                            value={programForm.process_id}
                            options={processes}
                            onChange={onProcessChange}
                            optionLabel="step_name"
                            optionValue="process_id"
                            placeholder="Selecione Processo"
                            filter
                            filterBy="step_name"
                            className={formStyles.dropdown}
                            itemTemplate={processOptionTemplate}
                            valueTemplate={processOptionTemplate}
                        />
                    </div>
                    <div className={formStyles.formField}>
                        <label className={formStyles.formLabel}>Descrição</label>
                        <InputText 
                            className={formStyles.formInput} value={programForm.description} 
                            onChange={e => setProgramForm({ ...programForm, description: e.target.value })}  
                        />
                    </div>
                    <div className={formStyles.formField}>
                        <label className={formStyles.formLabel}>Programador</label>
                        <InputText 
                            className={formStyles.formInput} value={programForm.programador} 
                            onChange={e => setProgramForm({ ...programForm, programador: e.target.value })} 
                        />
                    </div>
                    <div className={styles.uploadGroup}>
                        <InputText 
                            readOnly placeholder="Script NC URL" value={programForm.script} className='url-upload' 
                        />
                        <Button icon="pi pi-upload" className="upload-buttom" onClick={() => fileInputRef.current.click()} />
                        <input
                            type="file" ref={fileInputRef} hidden 
                            accept=".nc,.txt" onChange={e => e.target.files[0] && handleNCUpload(e.target.files[0])}
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