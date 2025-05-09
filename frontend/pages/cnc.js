// pages/cnc.js
import React, { useEffect, useState } from 'react';
import {
    DataTable,
    Column,
} from 'primereact/datatable';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import Sidebar from '../components/Sidebar';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { Checkbox } from 'primereact/checkbox';
import axios from 'axios';

export default function CNCPage() {
    const [machines, setMachines] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [selectedMachine, setSelectedMachine] = useState(null);
    const [selectedProgram, setSelectedProgram] = useState(null);
    const [filterMolde, setFilterMolde] = useState('');
    const [filterComp, setFilterComp] = useState('');
    const [machineDialog, setMachineDialog] = useState(false);
    const [programDialog, setProgramDialog] = useState(false);

    const [machineForm, setMachineForm] = useState({
        id: '', name: '', description: '', type: '', department: '', is_active: true,
    });

    const [programForm, setProgramForm] = useState({
        id: '', process_id: '', molde_codigo: '', maquina_id: '', description: '', programador: '', script: '', is_active: true,
    });

    useEffect(() => {
        loadMachines();
    }, []);

    const loadMachines = async () => {
        const res = await axios.get('/api/cnc/mach');
        setMachines(res.data.machines);
    };

    const loadPrograms = async () => {
        if (!filterComp) return;
        const res = await axios.get(`/api/cnc/program/${filterComp}`);
        setPrograms(res.data['CNC Programs']);
    };

    const openNewMachine = () => {
        setMachineForm({ id: '', name: '', description: '', type: '', department: '', is_active: true });
        setMachineDialog(true);
    };

    const openNewProgram = () => {
        setProgramForm({ id: '', process_id: '', molde_codigo: '', maquina_id: '', description: '', programador: '', script: '', is_active: true });
        setProgramDialog(true);
    };

    const saveMachine = async () => {
        if (machineForm.id) {
        await axios.put(`/api/cnc/mach/${machineForm.id}`, machineForm);
        } else {
        await axios.post('/api/cnc/mach', machineForm);
        }
        setMachineDialog(false);
        loadMachines();
    };

    const saveProgram = async () => {
        if (programForm.id) {
        await axios.put(`/api/cnc/program/${programForm.id}`, programForm);
        } else {
        await axios.post(`/api/cnc/program/${programForm.molde_codigo}`, programForm);
        }
        setProgramDialog(false);
        loadPrograms();
    };

    const deleteMachine = async (id) => {
        await axios.delete(`/api/cnc/mach/${id}`);
        loadMachines();
    };

    const deleteProgram = async (id) => {
        await axios.delete(`/api/cnc/program/${id}`);
        loadPrograms();
    };

    return (
        <div className="p-4">
            <Sidebar />
            <h2 className="text-xl mb-4">Máquinas CNC</h2>
            <Button label="Nova Máquina" icon="pi pi-plus" onClick={openNewMachine} className="mb-2" />
            <DataTable value={machines} paginator rows={5} selectionMode="single"
                onRowSelect={(e) => {
                    setMachineForm(e.data);
                    setMachineDialog(true);
                }}>
                <Column field="id" header="ID" />
                <Column field="name" header="Nome" />
                <Column field="type" header="Tipo" />
                <Column field="department" header="Departamento" />
                <Column field="is_active" header="Ativa" />
                <Column
                    body={(rowData) => (
                        <Button icon="pi pi-trash" severity="danger" onClick={() => deleteMachine(rowData.id)} />
                    )}
                />
            </DataTable>

            <Dialog header="Máquina CNC" visible={machineDialog} onHide={() => setMachineDialog(false)}>
                <div className="flex flex-col gap-2">
                    <InputText placeholder="Nome" value={machineForm.name} onChange={(e) => setMachineForm({ ...machineForm, name: e.target.value })} />
                    <InputText placeholder="Descrição" value={machineForm.description} onChange={(e) => setMachineForm({ ...machineForm, description: e.target.value })} />
                    <InputText placeholder="Tipo" value={machineForm.type} onChange={(e) => setMachineForm({ ...machineForm, type: e.target.value })} />
                    <InputText placeholder="Departamento" value={machineForm.department} onChange={(e) => setMachineForm({ ...machineForm, department: e.target.value })} />
                    <Checkbox checked={machineForm.is_active} onChange={(e) => setMachineForm({ ...machineForm, is_active: e.checked })} /> Ativa
                    <Button label="Salvar" onClick={saveMachine} />
                </div>
            </Dialog>

            <hr className="my-4" />

            <h2 className="text-xl mb-4">Programações CNC</h2>
            <div className="flex items-center gap-2 mb-2">
                <InputText placeholder="Filtrar por ID do Componente" value={filterComp} onChange={(e) => setFilterComp(e.target.value)} />
                <Button label="Buscar" onClick={loadPrograms} />
                <Button label="Nova Programação" onClick={openNewProgram} />
            </div>

            <DataTable value={programs} paginator rows={5} selectionMode="single"
                onRowSelect={(e) => {
                    setProgramForm(e.data);
                    setProgramDialog(true);
                }}>
                <Column field="id" header="ID" />
                <Column field="molde_codigo" header="Molde" />
                <Column field="programador" header="Programador" />
                <Column field="maquina_id" header="Máquina" />
                <Column
                    body={(rowData) => (
                        <Button icon="pi pi-trash" severity="danger" onClick={() => deleteProgram(rowData.id)} />
                    )}
                />
            </DataTable>

            <Dialog header="Programação CNC" visible={programDialog} onHide={() => setProgramDialog(false)}>
                <div className="flex flex-col gap-2">
                    <InputText placeholder="ID Processo" value={programForm.process_id} onChange={(e) => setProgramForm({ ...programForm, process_id: e.target.value })} />
                    <InputText placeholder="Código Molde" value={programForm.molde_codigo} onChange={(e) => setProgramForm({ ...programForm, molde_codigo: e.target.value })} />
                    <InputText placeholder="Máquina ID" value={programForm.maquina_id} onChange={(e) => setProgramForm({ ...programForm, maquina_id: e.target.value })} />
                    <InputTextarea placeholder="Descrição" value={programForm.description} onChange={(e) => setProgramForm({ ...programForm, description: e.target.value })} />
                    <InputText placeholder="Programador" value={programForm.programador} onChange={(e) => setProgramForm({ ...programForm, programador: e.target.value })} />
                    <InputText placeholder="Script URL" value={programForm.script} onChange={(e) => setProgramForm({ ...programForm, script: e.target.value })} />
                    <Checkbox checked={programForm.is_active} onChange={(e) => setProgramForm({ ...programForm, is_active: e.checked })} /> Ativa
                    <Button label="Salvar" onClick={saveProgram} />
                </div>
            </Dialog>
        </div>
    );
}
