import React, { useEffect, useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import api from '../utils/axios';
import styles from '../styles/CncTable.module.css';
import CNCForm from './CncForm';

export default function CNCList() {
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

    const ensureArray = (data) => {
        if (Array.isArray(data)) return data;
        if (data && data.programs) return ensureArray(data.programs);
        if (data && data.data) return ensureArray(data.data);
        if (data && data['CNC Programs']) return ensureArray(data['CNC Programs']);
        return [];
    };

    useEffect(() => {
        const loadPrograms = async () => {
            if (!selectedMold) {
                setPrograms([]);
                return;
            }
            try {
                let response;
                if (selectedComponent) {
                    response = await api.get(`/cnc/program/${selectedComponent.id}`);
                    setPrograms(ensureArray(response.data));
                } else {
                    response = await api.get(`/cnc/program/mold/${selectedMold.codigo}`);
                    setPrograms(ensureArray(response.data));
                }
            } catch (error) {
                console.error('Erro ao carregar programas:', error);
                if (error.response) {
                    console.error('Detalhes do erro:', error.response.data);
                }
                setPrograms([]);
            }
        };
        loadPrograms();
    }, [selectedMold, selectedComponent]);

    useEffect(() => {
        fetchMachines();
        fetchMolds();
    }, []);

    const fetchMachines = async () => {
        try {
            const { data } = await api.get('/cnc/mach');
            setMachines(ensureArray(data.machines));
        } catch (error) {
            console.error('Erro ao carregar máquinas:', error);
            setMachines([]);
        }
    };

    const fetchMolds = async () => {
        try {
            const { data } = await api.get('/projects/');
            setMolds(ensureArray(data.molds));
        } catch (error) {
            console.error('Erro ao carregar moldes:', error);
            setMolds([]);
        }
    };
    const onMoldChange = async (e) => {
        const mold = e.value;
        setSelectedMold(mold);
        setSelectedComponent(null);
        setProcesses([]);       
        try {
            const { data } = await api.get(`/projects/components/processes/${mold.codigo}`);
            setComponents(ensureArray(data.components));
            setProgramForm(prev => ({ ...prev, molde_codigo: mold.codigo, componente_id: '', process_id: '', maquina_id: '' }));
        } catch (error) {
            console.error('Erro ao carregar componentes:', error);
            setComponents([]);
        }
    };
    const onComponentChange = async (e) => {
        const comp = e.value;
        setSelectedComponent(comp);       
        try {
            const { data } = await api.get(`/processes/components/${comp.id}`);
            setProcesses(ensureArray(data.processes));
            setProgramForm(prev => ({ ...prev, componente_id: comp.id, process_id: '', maquina_id: '' }));
        } catch (error) {
            console.error('Erro ao carregar processos:', error);
            setProcesses([]);
        }
    };

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

    const deleteMachine = async (id) => {
        const confirmed = window.confirm("Tem certeza que deseja excluir esta máquina?");
        if (!confirmed) return;

        try {
            await api.delete(`/cnc/mach/${id}`);
            fetchMachines();
        } catch (error) {
            console.error('Erro ao excluir máquina:', error);
            alert('Erro ao excluir máquina: ' + error.message);
        }
    };

    const handleNCUpload = async (file) => {
        try {
            const fd = new FormData();
            fd.append('file', file);

            const res = await api.post('/upload/scriptnc', fd, {
                headers: {'Content-Type': 'multipart/form-data'}
            });

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
        setProgramForm({ 
            id: '', process_id: '', molde_codigo: selectedMold?.codigo || '', 
            componente_id: selectedComponent?.id || '', maquina_id: '', description: '', 
            programador: '', script: '', is_active: true 
        });
        setProgramDialog(true);
    };
    
    const onProgramRowSelect = (e) => {
        setIsEditProgram(true);
        setProgramForm(e.data);
        setSelectedMold({ codigo: e.data.molde_codigo });
        setSelectedComponent({ id: e.data.componente_id, name: e.data.componente_id });
        setProgramDialog(true);
    };

    const deleteProgram = async (id) => {
        const confirmed = window.confirm("Tem certeza que deseja excluir esta programação?");
        if (!confirmed) return;

        try {
            await api.delete(`/cnc/program/${id}`);
            
            if (selectedComponent) {
                const response = await api.get(`/cnc/program/${selectedComponent.id}`);
                setPrograms(ensureArray(response.data));
            } else if (selectedMold) {
                const response = await api.get(`/cnc/program/mold/${selectedMold.codigo}`);
                setPrograms(ensureArray(response.data));
            }
        } catch (error) {
            console.error('Erro ao excluir programação:', error);
            alert('Erro ao excluir programação: ' + error.message);
        }
    };

    const refreshMachines = () => {
        fetchMachines();
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
                    <Column field="is_active" header="Ativa" body={row => row.is_active ? 
                        <span className={`${styles.statusBadge} ${styles.statusActive}`}>Sim</span> : 
                        <span className={`${styles.statusBadge} ${styles.statusInactive}`}>Não</span>} />
                    <Column body={row => 
                        <Button 
                            icon="pi pi-trash" className="p-button-text p-button-danger p-button-sm" 
                            severity="danger" onClick={() => deleteMachine(row.id)} 
                        />} 
                    />
                </DataTable>
            </section>

            <section>
                <h2 className={styles.sectionHeader}>Programações CNC</h2>
                <div className={styles.filterBar}>
                    <Dropdown 
                        value={selectedMold} 
                        options={molds} 
                        onChange={onMoldChange} 
                        optionLabel="codigo" 
                        placeholder="Selecione Molde" 
                        filter 
                        filterBy="codigo" 
                        className="w-full md:w-14rem"
                    />
                    <Dropdown 
                        value={selectedComponent} 
                        options={components} 
                        onChange={onComponentChange} 
                        placeholder="Selecione Componente" 
                        disabled={!selectedMold} 
                        filter 
                        filterBy="name" 
                        itemTemplate={componentTemplate} 
                        valueTemplate={componentTemplate} 
                        className="w-full md:w-14rem"
                    />
                    <Button label="Nova Programação" icon="pi pi-plus" onClick={openNewProgram} className='mr-3' />
                </div>

                <DataTable 
                    value={programs} 
                    paginator 
                    rows={5} 
                    selectionMode="single" 
                    onRowSelect={onProgramRowSelect} 
                    className={styles.dataTable}
                    emptyMessage="Nenhuma programação encontrada. Selecione um molde ou componente."
                >
                    <Column field="id" header="ID" />
                    <Column field="molde_codigo" header="Molde" />
                    <Column 
                        header="Componente" 
                        body={row => {
                            const comp = components.find(c => c.id === row.componente_id);
                            return comp ? `${comp.id} — ${comp.name}` : row.componente_id;
                        }} 
                    />
                    <Column field="programador" header="Programador" />
                    <Column header="Máquina" body={row => {
                        const machine = machines.find(m => m.id === row.maquina_id);
                        return machine ? machine.name : row.maquina_id;
                    }} />
                    <Column header="Prog. CNC" body={row => row.script && 
                        <span 
                            className={styles.scriptPreview} 
                            onClick={() => window.open(row.script, '_blank')}
                        >
                            Ver Script
                        </span>} 
                    />
                    <Column body={row => 
                        <Button 
                            icon="pi pi-trash" 
                            severity="danger" 
                            className="p-button-text p-button-danger p-button-sm" 
                            onClick={() => deleteProgram(row.id)} 
                        />} 
                    />
                </DataTable>
            </section>

            <CNCForm 
                machineDialog={machineDialog}
                setMachineDialog={setMachineDialog}
                isEditMachine={isEditMachine}
                machineForm={machineForm}
                setMachineForm={setMachineForm}
                refreshMachines={refreshMachines}
                
                programDialog={programDialog}
                setProgramDialog={setProgramDialog}
                isEditProgram={isEditProgram}
                programForm={programForm}
                setProgramForm={setProgramForm}
                selectedComponent={selectedComponent}
                selectedMold={selectedMold}
                setPrograms={setPrograms}
                
                molds={molds}
                setSelectedMold={setSelectedMold}
                components={components}
                setSelectedComponent={setSelectedComponent}
                processes={processes}
                onMoldChange={onMoldChange}
                onComponentChange={onComponentChange}
                handleNCUpload={handleNCUpload}
                fileInputRef={fileInputRef}
            />
        </div>
    );
}