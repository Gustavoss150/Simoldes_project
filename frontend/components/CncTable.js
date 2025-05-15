// components/CncTable.js
import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import api from '../utils/axios';

export default function Cnc() {
  // Máquinas CNC
  const [machines, setMachines] = useState([]);
  const [machineDialog, setMachineDialog] = useState(false);
  const [machineForm, setMachineForm] = useState({ id: '', name: '', description: '', type: '', department: '', is_active: true });

  // Programações CNC
  const [programs, setPrograms] = useState([]);
  const [programDialog, setProgramDialog] = useState(false);
  const [programForm, setProgramForm] = useState({ id: '', process_id: '', molde_codigo: '', componente_id: '', maquina_id: '', description: '', programador: '', script: '', is_active: true });

  // Seleção de moldes, componentes, processos
  const [molds, setMolds] = useState([]);
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
    setProgramForm(prev => ({ ...prev, molde_codigo: mold.codigo }));
  };

  const onComponentChange = async (e) => {
    const comp = e.value;
    setSelectedComponent(comp);
    const { data } = await api.get(`/processes/components/${comp.id}`);
    setProcesses(data.processes);
    setProgramForm(prev => ({ ...prev, componente_id: comp.id }));
  };

  // CRUD Máquinas
  const openNewMachine = () => {
    setMachineForm({ id: '', name: '', description: '', type: '', department: '', is_active: true });
    setMachineDialog(true);
  };

  const saveMachine = async () => {
    if (machineForm.id) await api.put(`/cnc/mach/${machineForm.id}`, machineForm);
    else await api.post('/cnc/mach', machineForm);
    setMachineDialog(false);
    fetchMachines();
  };

  const deleteMachine = async (id) => {
    await api.delete(`/cnc/mach/${id}`);
    fetchMachines();
  };

  // CRUD Programações
  const openNewProgram = () => {
    setProgramForm({ id: '', process_id: '', molde_codigo: '', componente_id: '', maquina_id: '', description: '', programador: '', script: '', is_active: true });
    setProgramDialog(true);
  };

  const loadPrograms = async () => {
    if (!selectedComponent) return;
    const { data } = await api.get(`/cnc/program/${selectedComponent.id}`);
    setPrograms(data['CNC Programs']);
  };

  const saveProgram = async () => {
    if (programForm.id) await api.put(`/cnc/program/${programForm.id}`, programForm);
    else await api.post(`/cnc/program/${programForm.molde_codigo}`, programForm);
    setProgramDialog(false);
    loadPrograms();
  };

  const deleteProgram = async (id) => {
    await api.delete(`/cnc/program/${id}`);
    loadPrograms();
  };

  return (
    <div className="space-y-6">
      {/* Máquinas CNC */}
      <section>
        <h2 className="text-xl mb-2">Máquinas CNC</h2>
        <Button label="Nova Máquina" icon="pi pi-plus" onClick={openNewMachine} className="mb-2" />
        <DataTable value={machines} paginator rows={5} selectionMode="single" onRowSelect={(e) => { setMachineForm(e.data); setMachineDialog(true); }}>
          <Column field="id" header="ID" />
          <Column field="name" header="Nome" />
          <Column field="type" header="Tipo" />
          <Column field="department" header="Departamento" />
          <Column field="is_active" header="Ativa" body={(row) => row.is_active ? 'Sim' : 'Não'} />
          <Column body={(row) => <Button icon="pi pi-trash" severity="danger" onClick={() => deleteMachine(row.id)} />} />
        </DataTable>

        <Dialog header="Máquina CNC" visible={machineDialog} onHide={() => setMachineDialog(false)}>
          <div className="flex flex-col gap-3">
            <InputText placeholder="Nome" value={machineForm.name} onChange={(e) => setMachineForm({ ...machineForm, name: e.target.value })} />
            <InputText placeholder="Descrição" value={machineForm.description} onChange={(e) => setMachineForm({ ...machineForm, description: e.target.value })} />
            <InputText placeholder="Tipo" value={machineForm.type} onChange={(e) => setMachineForm({ ...machineForm, type: e.target.value })} />
            <InputText placeholder="Departamento" value={machineForm.department} onChange={(e) => setMachineForm({ ...machineForm, department: e.target.value })} />
            <div className="flex items-center">
              <input type="checkbox" checked={machineForm.is_active} onChange={(e) => setMachineForm({ ...machineForm, is_active: e.target.checked })} /> Ativa
            </div>
            <Button label="Salvar" onClick={saveMachine} />
          </div>
        </Dialog>
      </section>

      {/* Programações CNC */}
      <section>
        <h2 className="text-xl mb-2">Programações CNC</h2>
        <div className="flex gap-2 mb-2">
          <Dropdown
            value={selectedMold}
            options={molds}
            onChange={onMoldChange}
            optionLabel="codigo"
            placeholder="Selecione Molde"
            filter
            filterBy="codigo"
          />
          <Dropdown
            value={selectedComponent}
            options={components}
            onChange={onComponentChange}
            optionLabel="name"
            placeholder="Selecione Componente"
            disabled={!selectedMold}
            filter
            filterBy="name"
          />
          <Button label="Buscar Programas" icon="pi pi-search" onClick={loadPrograms} />
          <Button label="Nova Programação" icon="pi pi-plus" onClick={openNewProgram} />
        </div>

        <DataTable value={programs} paginator rows={5} selectionMode="single" onRowSelect={(e) => { setProgramForm(e.data); setProgramDialog(true); }}>
          <Column field="id" header="ID" />
          <Column field="molde_codigo" header="Molde" />
          <Column field="componente_id" header="Componente" />
          <Column field="programador" header="Programador" />
          <Column field="maquina_id" header="Máquina" />
          <Column 
            header="Código"
            body={rowData => (
              rowData.script && (
                <Button
                  icon="pi pi-external-link"
                  className="p-button-text p-button-success"
                  tooltip="Abrir Programação"
                  onClick={() => window.open(rowData.script, '_blank')}
                />
              )
            )}
          />
          <Column body={(row) => <Button icon="pi pi-trash" severity="danger" onClick={() => deleteProgram(row.id)} />} />
        </DataTable>

        <Dialog header="Programação CNC" visible={programDialog} onHide={() => setProgramDialog(false)}>
          <div className="flex flex-col gap-3">
            <Dropdown
              value={programForm.process_id}
              options={processes}
              onChange={(e) => setProgramForm({ ...programForm, process_id: e.value })}
              optionLabel="description"
              placeholder="Selecione Processo"
              filter
              filterBy="description"
            />
            <Dropdown
              value={programForm.maquina_id}
              options={machines}
              onChange={(e) => setProgramForm({ ...programForm, maquina_id: e.value.id })}
              optionLabel="name"
              placeholder="Selecione Máquina"
            />
            <InputText placeholder="Programador" value={programForm.programador} onChange={(e) => setProgramForm({ ...programForm, programador: e.target.value })} />
            <InputText placeholder="Script URL" value={programForm.script} onChange={(e) => setProgramForm({ ...programForm, script: e.target.value })} />
            <div className="flex items-center">
              <input type="checkbox" checked={programForm.is_active} onChange={(e) => setProgramForm({ ...programForm, is_active: e.target.checked })} /> Ativa
            </div>
            <Button label="Salvar" onClick={saveProgram} />
          </div>
        </Dialog>
      </section>
    </div>
  );
}
