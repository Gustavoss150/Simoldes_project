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

    const statusOptions = [
        { label: 'Todos', value: 'all' },
        { label: 'Chegou', value: 'arrived' },
        { label: 'Pendente', value: 'pending' },
        { label: 'Inativos', value: 'inactive' }
    ];
    const [selectedStatus, setSelectedStatus] = useState('all');

    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(false);

    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [formVisible, setFormVisible] = useState(false);

    const { show } = useNotification();

    useEffect(() => {
        api.get('/projects/')
            .then(res => setMolds(res.data.molds || []))
            .catch(err => {
                console.error('Erro ao carregar moldes:', err);
                show({ severity: 'error', summary: 'Erro', detail: 'Não foi possível carregar moldes.' });
            });
    }, []);

    // Atualiza componentes e materiais quando molde ou status mudam
    useEffect(() => {
        if (!selectedMold) {
            setComponents([]);
            setMaterials([]);
            return;
        }

        // Carrega componentes só se filtro for 'all'
        if (selectedStatus === 'all') {
            api.get(`/projects/components/${selectedMold.codigo}`)
                .then(res => setComponents(res.data.components || []))
                .catch(err => {
                    console.error('Erro ao carregar componentes:', err);
                    show({ severity: 'error', summary: 'Erro', detail: 'Não foi possível carregar componentes.' });
                });
        } else {
            setComponents([]);
            setSelectedComponent(null);
        }

        fetchMaterials();
    }, [selectedMold, selectedStatus]);

    // Quando muda o componente selecionado, recarrega apenas se filtro for 'all'
    useEffect(() => {
        if (selectedMold && selectedStatus === 'all') {
            fetchMaterials();
        }
    }, [selectedComponent]);

    const fetchMaterials = async () => {
        if (!selectedMold) return;
        setLoading(true);

        try {
            let url;
            switch (selectedStatus) {
                case 'arrived':
                    url = `/materials/arrived/${selectedMold.codigo}`;
                    break;
                case 'pending':
                    url = `/materials/pending/${selectedMold.codigo}`;
                    break;
                case 'inactive':
                    url = `/materials/inactive/${selectedMold.codigo}`;
                    break;
                default:
                    url = selectedComponent
                        ? `/materials/components/${selectedComponent.id}`
                        : `/materials/${selectedMold.codigo}`;
                    break;
            }

            const res = await api.get(url);
            const values = Object.values(res.data);
            const list = values.find(v => Array.isArray(v)) || [];
            setMaterials(list);
        } catch (err) {
            console.error('Erro ao carregar materiais:', err);
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
            acceptLabel: 'Sim', rejectLabel: 'Não',
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
            }
        });
    };

    const actionBodyTemplate = row => {
        // Sem ações se for status "inativo"
        if (selectedStatus === 'inactive') return null;
        return (
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
    };

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
                    disabled={selectedStatus === 'inactive'}
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
                    className={styles.filterDropdown}
                />
                <Dropdown
                    value={selectedStatus}
                    options={statusOptions}
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Status"
                    onChange={e => setSelectedStatus(e.value)}
                    className={styles.filterDropdown}
                />
                {selectedStatus === 'all' && (
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
                )}
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
                            body={row => new Date(row.arrival_date).toLocaleDateString('pt-BR')}
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
