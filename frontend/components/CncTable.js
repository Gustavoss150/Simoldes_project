import React, { useEffect, useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import api from '../utils/axios';
import styles from '../styles/CncTable.module.css';
import formStyles from '../styles/CncForm.module.css';

export default function Cnc() {
    const fileInputRef = useRef(null);
    const [machines, setMachines] = useState([]);
    const [machineDialog, setMachineDialog] = useState(false);
    const [isEditMachine, setIsEditMachine] = useState(false);
    const [machineForm, setMachineForm] = useState({ id: '', name: '', description: '', type: '', department: '', is_active: true });

    const [programs, setPrograms] = useState([]);
    const [programDialog, setProgramDialog] = useState(false);
    const [isEditProgram, setIsEditProgram] = useState(false);
    const [programForm, setProgramForm] = useState({
        id: '', process_id: '', molde_codigo: '', componente_id: '', maquina_id: '',
        description: '', programador: '', script: '', is_active: true
    });

    const [molds, setMolds] = useState([]);
    const componentTemplate = (option) => option ? `${option.id} — ${option.name}` : '';
    const [components, setComponents] = useState([]);
    const [processes, setProcesses] = useState([]);
    const [selectedMold, setSelectedMold] = useState(null);
    const [selectedComponent, setSelectedComponent] = useState(null);

    useEffect(() => {
        fetchMachines();
        fetchMolds();
    }, []);

    const fetchMachines = async () => {
        const { data } = await api.get('/cnc/mach');
        setMachines(data.machines);
    };

    const fetchMolds = async () => {
        const { data } = await api.get('/projects/');
        setMolds(data.molds);
    };

    const onMoldChange = async (e) => {
        const mold = e.value;
        setSelectedMold(mold);
        setSelectedComponent(null);
        setProcesses([]);
        const { data } = await api.get(`/projects/components/${mold.codigo}`);
        setComponents(data.components);
        setProgramForm(prev => ({ ...prev, molde_codigo: mold.codigo, componente_id: '', process_id: '', maquina_id: '' }));
    };

    const onComponentChange = async (e) => {
        const comp = e.value;
        setSelectedComponent(comp);
        const { data } = await api.get(`/processes/components/${comp.id}`);
        setProcesses(data.processes);
        setProgramForm(prev => ({ ...prev, componente_id: comp.id, process_id: '', maquina_id: '' }));
    };

    const onProcessChange = (e) => {
        const pid = e.value;
        const proc = processes.find(p => p.process_id === pid);
        if (!proc) return;
        setProgramForm(prev => ({ ...prev, process_id: pid, maquina_id: proc.maquina_id }));
    };

    // Abertura de modal Máquina
    const openNewMachine = () => {
        setIsEditMachine(false);
        setMachineForm({ id: '', name: '', description: '', type: '', department: '', is_active: true });
        setMachineDialog(true);
    };
    const onMachineRowSelect = (e) => {
        setIsEditMachine(true);
        setMachineForm(e.data);
        setMachineDialog(true);
    };

    const saveMachine = async () => {
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
        fetchMachines();
    };

    const deleteMachine = async (id) => {
        const confirmed = window.confirm("Tem certeza que deseja excluir esta máquina?");
        if (!confirmed) return;

        await api.delete(`/cnc/mach/${id}`);
        fetchMachines();
    };

    const handleNCUpload = async (file) => {
        try {
            const fd = new FormData();
            fd.append('file', file);

            // envia para http://localhost:9000/api/upload/scriptnc
            const res = await api.post('/upload/scriptnc', fd, {
                headers: {'Content-Type': 'multipart/form-data'}
            });

            // monta URL absoluta (retira /api do baseURL)
            const host = process.env.NEXT_PUBLIC_API_URL.replace(/\/api$/, '');
            setProgramForm(prev => ({
            ...prev,
            script: host + res.data.url
            }));
        } catch (err) {
            console.error('Erro no upload NC:', err);
            alert('Erro ao enviar script NC: ' + (err.response?.data?.error || err.message));
        }
    };

    const openNewProgram = () => {
        setIsEditProgram(false);
        setProgramForm({ id: '', process_id: '', molde_codigo: selectedMold?.codigo || '', componente_id: selectedComponent?.id || '', maquina_id: '', description: '', programador: '', script: '', is_active: true });
        setProgramDialog(true);
    };
    const onProgramRowSelect = (e) => {
        setIsEditProgram(true);
        setProgramForm(e.data);
        setSelectedMold({ codigo: e.data.molde_codigo });
        setSelectedComponent({ id: e.data.componente_id, name: e.data.componente_id });
        setProgramDialog(true);
    };

    const loadPrograms = async () => {
        if (!selectedComponent) return;
        const { data } = await api.get(`/cnc/program/${selectedComponent.id}`);
        setPrograms(data['CNC Programs']);
    };

    const saveProgram = async () => {
        if (isEditProgram) {
            const payload = {
                maquina_id: programForm.maquina_id,
                description: programForm.description,
                programador: programForm.programador,
                script: programForm.script
            };
            await api.put(`/cnc/program/${programForm.id}`, payload);
        } else {
            await api.post(`/cnc/program/${programForm.molde_codigo}`, programForm);
        }
        setProgramDialog(false);
        loadPrograms();
    };

    const deleteProgram = async (id) => {
        const confirmed = window.confirm("Tem certeza que deseja excluir esta programação?");
        if (!confirmed) return;

        await api.delete(`/cnc/program/${id}`);
        loadPrograms();
    };

    return (
        <div className={styles.cncContainer}>
            <section>
                <h2 className={styles.sectionHeader}>Máquinas CNC</h2>
                <Button label="Nova Máquina" icon="pi pi-plus" onClick={openNewMachine} className="mr-3" />
                <DataTable value={machines} paginator rows={5} selectionMode="single" onRowSelect={onMachineRowSelect} className={styles.dataTable}>
                    <Column field="id" header="ID" />
                    <Column field="name" header="Nome" />
                    <Column field="type" header="Tipo" />
                    <Column field="department" header="Departamento" />
                    <Column field="is_active" header="Ativa" body={row => row.is_active ? <span className={`${styles.statusBadge} ${styles.statusActive}`}>Sim</span> : <span className={`${styles.statusBadge} ${styles.statusInactive}`}>Não</span>} />
                    <Column body={row => <Button icon="pi pi-trash" className="p-button-text p-button-danger p-button-sm" severity="danger" onClick={() => deleteMachine(row.id)} />} />
                </DataTable>

                <Dialog header="Máquina CNC" visible={machineDialog} onHide={() => setMachineDialog(false)} className={formStyles.dialog} headerClassName={formStyles.dialogHeader}>
                    <div className={formStyles.formContent}>
                        <div className={formStyles.formField}>
                            <label className={formStyles.formLabel}>ID</label>
                            <InputText value={machineForm.id} className={formStyles.formInput} disabled={isEditMachine} />
                        </div>
                        <div className={formStyles.formField}>
                            <label className={formStyles.formLabel}>Nome</label>
                            <InputText value={machineForm.name} onChange={e => setMachineForm({ ...machineForm, name: e.target.value })} className={formStyles.formInput} />
                        </div>
                        <div className={formStyles.formField}>
                            <label className={formStyles.formLabel}>Descrição</label>
                            <InputText value={machineForm.description} onChange={e => setMachineForm({ ...machineForm, description: e.target.value })} className={formStyles.formInput} />
                        </div>
                        <div className={formStyles.formField}>
                            <label className={formStyles.formLabel}>Tipo</label>
                            <InputText value={machineForm.type} onChange={e => setMachineForm({ ...machineForm, type: e.target.value })} className={formStyles.formInput} />
                        </div>
                        <div className={formStyles.formField}>
                            <label className={formStyles.formLabel}>Departamento</label>
                            <InputText value={machineForm.department} onChange={e => setMachineForm({ ...machineForm, department: e.target.value })} className={formStyles.formInput} />
                        </div>
                        <div className={formStyles.statusToggle}>
                            <label className={formStyles.formLabel}><input type="checkbox" checked={machineForm.is_active} onChange={e => setMachineForm({ ...machineForm, is_active: e.target.checked })} /> Ativa</label>
                        </div>
                        <div className={formStyles.formButtons}>
                            <Button label="Salvar" onClick={saveMachine} className="p-button-success mr-3" />
                        </div>
                    </div>
                </Dialog>
            </section>

            <section>
                <h2 className={styles.sectionHeader}>Programações CNC</h2>
                <div className={styles.filterBar}>
                    <Dropdown value={selectedMold} options={molds} onChange={onMoldChange} optionLabel="codigo" placeholder="Selecione Molde" filter filterBy="codigo" />
                    <Dropdown value={selectedComponent} options={components} onChange={onComponentChange} placeholder="Selecione Componente" disabled={!selectedMold} filter filterBy="name" itemTemplate={componentTemplate} valueTemplate={componentTemplate} />
                    <Button label="Buscar Programas" icon="pi pi-search" onClick={loadPrograms} className='mr-3' />
                    <Button label="Nova Programação" icon="pi pi-plus" onClick={openNewProgram} className='mr-3' />
                </div>

                <DataTable value={programs} paginator rows={5} selectionMode="single" onRowSelect={onProgramRowSelect} className={styles.dataTable}>
                    <Column field="id" header="ID" />
                    <Column field="molde_codigo" header="Molde" />
                    <Column field="componente_id" header="Componente" />
                    <Column field="programador" header="Programador" />
                    <Column field="maquina_id" header="Máquina" />
                    <Column header="Prog. CNC" body={row => row.script && <span className={styles.scriptPreview} onClick={() => window.open(row.script, '_blank')}>Ver Script</span>} />
                    <Column body={row => <Button icon="pi pi-trash" severity="danger" className="p-button-text p-button-danger p-button-sm" onClick={() => deleteProgram(row.id)} />} />
                </DataTable>

                <Dialog header="Programação CNC" visible={programDialog} onHide={() => setProgramDialog(false)} className={formStyles.dialog} headerClassName={formStyles.dialogHeader}>
                    <div className={formStyles.formContent}>
                        <div className={formStyles.formField}>
                            <label className={formStyles.formLabel}>ID</label>
                            <InputText value={programForm.id} onChange={e => setProgramForm({ ...programForm, id: e.target.value })} className={formStyles.formInput} disabled={isEditProgram} required />
                        </div>
                        <div className={formStyles.formField}>
                            <label className={formStyles.formLabel}>Molde</label>
                            <Dropdown
                                value={selectedMold}
                                options={molds}
                                onChange={e => { onMoldChange(e); setProgramForm(prev => ({ ...prev, molde_codigo: e.value.codigo })); }}
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
                                value={selectedComponent}
                                options={components}
                                onChange={e => { onComponentChange(e); setProgramForm(prev => ({ ...prev, componente_id: e.value.id })); }}
                                optionLabel="name"
                                placeholder="Selecione Componente"
                                filter
                                filterBy="name"
                                itemTemplate={componentTemplate}
                                valueTemplate={componentTemplate}
                                className={formStyles.dropdown}
                                disabled={isEditProgram || !selectedMold}
                            />
                        </div>
                        <div className={formStyles.formField}>
                            <label className={formStyles.formLabel}>Processo</label>
                            <Dropdown
                                value={programForm.process_id}
                                options={processes}
                                onChange={e => { onProcessChange(e); }}
                                optionLabel="step_name"
                                optionValue="process_id"
                                placeholder="Selecione Processo"
                                filter
                                filterBy="step_name"
                                className={formStyles.dropdown}
                                disabled={isEditProgram || !selectedComponent}
                            />
                        </div>
                        <div className={formStyles.formField}>
                            <label className={formStyles.formLabel}>Descrição</label>
                            <InputText value={programForm.description} onChange={e => setProgramForm({ ...programForm, description: e.target.value })} className={formStyles.formInput} />
                        </div>
                        <div className={formStyles.formField}>
                            <label className={formStyles.formLabel}>Programador</label>
                            <InputText value={programForm.programador} onChange={e => setProgramForm({ ...programForm, programador: e.target.value })} className={formStyles.formInput} />
                        </div>
                        <div className={styles.uploadGroup}>
                            <InputText readOnly placeholder="Script NC URL" value={programForm.script} className='url-upload' />
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
            </section>
        </div>
    );
}
