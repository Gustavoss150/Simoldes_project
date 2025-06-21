import React, { useEffect, useState } from 'react';
import api from '../utils/axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import MaterialForm from './MaterialForm';
import { useNotification } from '../components/NotificationProvider';
import styles from '../styles/Materials.module.css';
import statusStyles from '../styles/Projects.module.css';

export default function MaterialsList() {
    const [molds, setMolds] = useState([]);
    const [selectedMold, setSelectedMold] = useState(null);
    const [components, setComponents] = useState([]);
    const [selectedComponent, setSelectedComponent] = useState(null);

    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(false);

    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [formVisible, setFormVisible] = useState(false);

    const { show } = useNotification();

    useEffect(() => {
        api.get('/projects/')
            .then(res => {
                setMolds(res.data.molds || []);
            })
            .catch(err => {
                console.error('Erro ao carregar moldes:', err);
                setMolds([]);
                show({ severity: 'error', summary: 'Erro', detail: 'Não foi possível carregar moldes.' });
            });
    }, []);

    useEffect(() => {
        if (!selectedMold) {
            setComponents([]);
            setMaterials([]);
            return;
        }
        api.get(`/projects/components/${selectedMold.codigo}`)
            .then(res => {
                setComponents(res.data.components || []);
            })
            .catch(err => {
                console.error('Erro ao carregar componentes:', err);
                setComponents([]);
                show({ severity: 'error', summary: 'Erro', detail: 'Não foi possível carregar componentes.' });
            });
        fetchMaterials();
    }, [selectedMold]);

    useEffect(() => {
        if (selectedMold) {
            fetchMaterials();
        }
    }, [selectedComponent]);

    const fetchMaterials = async () => {
        setLoading(true);
        try {
            let url = `/materials/${selectedMold.codigo}`;
            if (selectedComponent) {
                url = `/materials/components/${selectedComponent.id}`;
            }
            const res = await api.get(url);
            setMaterials(res.data.materials || []);
        } catch (err) {
            console.error('Erro ao carregar materiais:', err);
            setMaterials([]);
            show({ severity: 'error', summary: 'Erro', detail: 'Não foi possível carregar materiais.' });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = id => {
        confirmDialog({
            message: `Deseja realmente excluir o material ${id}?`,
            header: 'Confirmação',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sim',
            rejectLabel: 'Não',
            accept: async () => {
                try {
                    await api.delete(`/materials/${id}`);
                    show({ severity: 'success', summary: 'Removido', detail: 'Material excluído com sucesso.' });
                    fetchMaterials();
                } catch (err) {
                    console.error('Erro ao excluir material:', err);
                    show({
                        severity: 'error',
                        summary: 'Erro ao excluir',
                        detail: 'Falha ao excluir material: ' + (err.response?.data?.message || err.message)
                    });
                }
            },
            reject: () => {}
        });
    };

    const actionBodyTemplate = row => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button
                icon="pi pi-pencil"
                className="p-button-text"
                onClick={() => {
                    setSelectedMaterial(row);
                    setFormVisible(true);
                }}
            />
            <Button
                icon="pi pi-trash"
                className="p-button-text p-button-danger"
                onClick={() => handleDelete(row.id)}
            />
        </div>
    );

    return (
        <div>
            <ConfirmDialog />
            <div className={styles.filterBar}>
                <Button
                    label="Novo Material"
                    icon="pi pi-plus"
                    className="mr-1"
                    onClick={() => {
                        setSelectedMaterial(null);
                        setFormVisible(true);
                    }}
                />
                <Dropdown
                    value={selectedMold}
                    options={molds}
                    optionLabel="codigo"
                    placeholder="Filtrar por Molde"
                    onChange={e => {
                        setSelectedMold(e.value);
                        setSelectedComponent(null);
                    }}
                />
                <Dropdown
                    value={selectedComponent}
                    options={components}
                    optionLabel="id"
                    placeholder="Filtrar por Componente"
                    onChange={e => setSelectedComponent(e.value)}
                    disabled={!selectedMold}
                    className={styles.filterDropdown}
                    itemTemplate={option => (
                        <div>
                            ({option.id}) {option.name}
                        </div>
                    )}
                />
            </div>
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                    <ProgressSpinner />
                </div>
            ) : (
                <div className={styles.tableContainer}>
                    <DataTable
                        value={materials}
                        paginator
                        rows={10}
                        dataKey="id"
                        responsiveLayout="scroll"
                        className={styles.dataTable}
                    >
                        <Column field="id" header="ID" />
                        <Column field="molde_codigo" header="Molde" />
                        <Column field="componentes_id" header="Componente" />
                        <Column field="type" header="Tipo" />
                        <Column field="quantity" header="Quantidade" />
                        <Column
                            field="arrival_date"
                            header="Data Chegada"
                            body={row =>
                                new Date(row.arrival_date).toLocaleDateString('pt-BR')
                            }
                        />
                        <Column
                            field="is_arrived"
                            header="Chegou?"
                            body={rowData => (
                                <span
                                    className={`${statusStyles.statusBadge} ${
                                        rowData.is_arrived
                                            ? statusStyles.completed
                                            : statusStyles.paused
                                    }`}
                                >
                                    {rowData.is_arrived ? 'Sim' : 'Não'}
                                </span>
                            )}
                        />
                        <Column field="supplier" header="Fornecedor" />
                        <Column header="Ações" body={actionBodyTemplate} />
                    </DataTable>
                </div>
            )}
            {formVisible && (
                <MaterialForm
                    material={selectedMaterial}
                    visible={formVisible}
                    onHide={() => setFormVisible(false)}
                    onSaved={() => {
                        setFormVisible(false);
                        fetchMaterials();
                    }}
                />
            )}
        </div>
    );
}
