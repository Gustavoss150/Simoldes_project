// File: /components/projects/ComponentForm.js
import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import api from '../../utils/axios';

const processStatusOptions = [
  { label: 'Não Iniciado', value: 'not started' },
  { label: 'Em Processo', value: 'in process' },
  { label: 'Pausado', value: 'paused' },
  { label: 'Completo', value: 'completed' }
];

export default function ComponentForm({ component, moldCode, visible, onHide, onSave, isNew }) {
  const [formData, setFormData] = useState({});
  const [processes, setProcesses] = useState([]);
  const [maquinas, setMaquinas] = useState([]);
  const [steps, setSteps] = useState([]);

  const handleFileUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const res = await api.post('/upload', formData, {
        headers: {'Content-Type': 'multipart/form-data'}
      });
      
      setFormData(prev => ({
        ...prev,
        Archive3DModel: res.data.fileUrl
      }));
    } catch (error) {
      console.error('Erro no upload:', error);
      alert('Erro ao enviar arquivo: ' + error.message);
    }
  };

  useEffect(() => {
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
        setMaquinas([]);
        setSteps([]);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!isNew && component) {
      setFormData({
        id: component.id,
        name: component.name,
        quantity: component.quantity,
        status: component.status,
        archive3DModel: component.archive_3d_model,
        material: component.material
      });
      fetchProcesses();
    } else {
      setFormData({ 
        status: false, 
        quantity: 1,
        archive3DModel: '',
        material: '',
        name: ''
      });
      setProcesses([]);
    }
  }, [component, isNew]);

  const fetchProcesses = async () => {
    try {
      const res = await api.get(`/processes/components/${component.id}`);
      setProcesses(res.data?.processes?.map(p => ({
        ...p,
        id: p.id || p.process_id || '', // Garante o ID correto
        step_id: p.step_id || '',
        status: p.status || 'not started',
        order: p.order || 1
      })) || []);
    } catch (error) {
      console.error('Erro ao buscar processos:', error);
      setProcesses([]);
    }
  };

  const handleProcessChange = (index, field, value) => {
    const newProcesses = [...processes];
    newProcesses[index] = { ...newProcesses[index], [field]: value };
    setProcesses(newProcesses);
  };

  const addNewProcess = () => {
    setProcesses([...processes, {
      step_id: '',
      status: 'not started',
      maquina_id: '',
      order: processes.length + 1,
      isNew: true
    }]);
  };

  const handleSubmit = async () => {
    try {
      if (!formData.id || !formData.name) {
        alert('Preencha todos os campos obrigatórios do componente!');
        return;
      }

      // Separar processos existentes e novos
      const existingProcesses = processes.filter(p => p.id && !p.isNew);
      const newProcesses = processes.filter(p => p.isNew);

      // Payload para atualização
      const updatePayload = {
        componentes: [{
          componente_id: formData.id,
          ...(formData.quantity && { quantity: formData.quantity }),
          ...(formData.status !== undefined && { status: formData.status }),
          ...(formData.archive3DModel && { archive_3d_model: formData.archive3DModel }),
          ...(formData.material && { material: formData.material })
        }],
        processos: existingProcesses.map(p => ({
          processo_id: p.id, // Campo obrigatório
          ...(p.step_id && { step_id: p.step_id }),
          ...(p.status && { status: p.status }),
          ...(p.maquina_id && { maquina_id: p.maquina_id }),
          ...(p.order && { order: p.order })
        }))
      };

      if (isNew) {
        // Criar novo componente com processos
        await api.post(`/projects/new/${moldCode}`, {
          componentes: [{
            id: formData.id,
            name: formData.name,
            material: formData.material,
            quantity: formData.quantity,
            status: formData.status,
            archive_3d_model: formData.archive3DModel
          }],
          processos: newProcesses.map(p => ({
            step_id: p.step_id,
            status: p.status,
            maquina_id: p.maquina_id,
            order: p.order,
            componente_id: formData.id,
            begin_date: new Date().toISOString(),
            delivery_date: new Date().toISOString()
          }))
        });
      } else {
        // Atualizar componente existente
        await api.put(`/projects/${moldCode}`, updatePayload);

        // Criar novos processos separadamente
        if (newProcesses.length > 0) {
          await api.post(`/projects/new/${moldCode}`, {
            processos: newProcesses.map(p => ({
              step_id: p.step_id,
              status: p.status,
              maquina_id: p.maquina_id,
              order: p.order,
              componente_id: formData.id,
              begin_date: new Date().toISOString(),
              delivery_date: new Date().toISOString()
            }))
          });
        }
      }

      onSave();
      onHide();
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert(`Erro: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <Dialog
      header={isNew ? 'Novo Componente' : `Editar Componente ${component?.id}`}
      visible={visible}
      onHide={onHide}
      style={{ width: '80vw' }}
    >
      <div className="p-fluid">
        <div className="p-grid p-mb-4">
          {isNew && (
            <div className="p-col-4">
              <label>ID do Componente *</label>
              <InputText
                value={formData.id || ''}
                onChange={(e) => setFormData({...formData, id: e.target.value})}
                required
              />
            </div>
          )}

          <div className="p-col-4">
            <label>Nome *</label>
            <InputText
              value={formData.name || ''}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          
          <div className="p-col-4">
            <label>Material *</label>
            <InputText
              value={formData.material || ''}
              onChange={(e) => setFormData({...formData, material: e.target.value})}
              required
            />
          </div>

          <div className="p-col-2">
            <label>Quantidade *</label>
            <InputText
              type="number"
              value={formData.quantity || 1}
              onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 1})}
              required
            />
          </div>

          <div className="p-col-2">
            <label>Status Componente</label>
            <div className="flex align-items-center">
              <Checkbox
                inputId="status"
                checked={formData.status || false}
                onChange={(e) => setFormData({...formData, status: e.checked})}
              />
              <label htmlFor="status" className="ml-2">
                {formData.status ? 'Concluído' : 'Pendente'}
              </label>
            </div>
          </div>

          <div className="p-col-6">
            <label>Modelo 3D</label>
            <div className="p-inputgroup">
              <InputText
                value={formData.archive3DModel || ''}
                placeholder="URL do modelo 3D"
                onChange={(e) => setFormData({...formData, archive3DModel: e.target.value})}
              />
              <Button
                icon="pi pi-upload"
                tooltip="Anexar arquivo"
                onClick={() => document.getElementById('fileInput').click()}
              />
              <input
                type="file"
                id="fileInput"
                hidden
                onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0])}
              />
            </div>
          </div>
        </div>

        <h3>Processos 
          <Button 
            icon="pi pi-plus" 
            className="p-button-sm ml-2" 
            onClick={addNewProcess} 
            tooltip="Adicionar novo processo"
          />
        </h3>
        
        <div className="p-grid">
          {processes.map((process, index) => (
            <div key={process.id || index} className="p-col-12 p-mb-3">
              <div className="p-grid">
                <div className="p-col-3">
                  <label>Etapa *</label>
                  <Dropdown
                    value={process.step_id}
                    options={(steps || []).map(s => ({
                      label: `${s.id} - ${s.name}`,
                      value: s.id
                    }))}
                    onChange={(e) => handleProcessChange(index, 'step_id', e.value)}
                    placeholder="Selecione a etapa"
                    required
                  />
                </div>

                <div className="p-col-3">
                  <label>Status *</label>
                  <Dropdown
                    value={process.status}
                    options={processStatusOptions}
                    onChange={(e) => handleProcessChange(index, 'status', e.value)}
                    required
                  />
                </div>

                <div className="p-col-3">
                  <label>Máquina</label>
                  <Dropdown
                    value={process.maquina_id}
                    options={(maquinas || []).map(m => ({
                      label: `${m.id} - ${m.name}`,
                      value: m.id
                    }))}
                    onChange={(e) => handleProcessChange(index, 'maquina_id', e.value)}
                    placeholder="Selecione a máquina"
                  />
                </div>

                <div className="p-col-2">
                  <label>Ordem *</label>
                  <InputText
                    type="number"
                    value={process.order}
                    onChange={(e) => handleProcessChange(index, 'order', parseInt(e.target.value) || 1)}
                    required
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-d-flex p-jc-end p-mt-4">
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
            onClick={handleSubmit}
          />
        </div>
      </div>
    </Dialog>
  );
}