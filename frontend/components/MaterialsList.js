// File: components/MaterialsList.js
import React, { useEffect, useState } from 'react';
import api from '../utils/axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import MaterialForm from './MaterialForm';
import styles from '../styles/Materials.module.css';

export default function MaterialsList() {
    const [molds, setMolds] = useState([]);
    const [selectedMold, setSelectedMold] = useState(null);
    const [components, setComponents] = useState([]);
    const [selectedComponent, setSelectedComponent] = useState(null);

    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(false);

    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [formVisible, setFormVisible] = useState(false);

    useEffect(() => {
        api.get('/projects/')
            .then(res => setMolds(res.data.molds || [])).catch(() => setMolds([]));
    }, []);

    useEffect(() => {
        if (!selectedMold) {
            setComponents([]);
            setMaterials([]);
            return;
        }

        api.get(`/projects/components/${selectedMold.codigo}`)
            .then(res => setComponents(res.data.components || []))
            .catch(() => setComponents([]));
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
        } catch {
            setMaterials([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async id => {
        if (!confirm(`Excluir material ${id}?`)) return;
        await api.delete(`/materials/${id}`);
        fetchMaterials();
    };

    return (
        <div>
            <div className={styles.filterBar}>
                <Button
                    label="Novo Material"
                    icon="pi pi-plus"
                    className="mr-3"
                    onClick={() => { setSelectedMaterial(null); setFormVisible(true); }}
                />
                <Dropdown
                    value={selectedMold}
                    options={molds}
                    optionLabel="codigo"
                    placeholder="Filtrar por Molde"
                    onChange={e => { setSelectedMold(e.value); setSelectedComponent(null); }}
                />
                <Dropdown
                    value={selectedComponent}
                    options={components}
                    optionLabel="id"
                    placeholder="Filtrar por Componente"
                    onChange={e => setSelectedComponent(e.value)}
                    disabled={!selectedMold}
                    className={styles.filterDropdown}
                />
            </div>
            {loading
                ? <ProgressSpinner />
                : (
                    <div className={styles.tableContainer}>
                        <DataTable
                            value={materials}
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
                                body={row => new Date(row.arrival_date).toLocaleDateString()}
                            />
                            <Column
                                field="is_arrived"
                                header="Chegou?"
                                body={row => row.is_arrived ? 'Sim' : 'Não'}
                            />
                            <Column field="supplier" header="Fornecedor" />
                            <Column
                                header="Ações"
                                body={row => (
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <Button
                                            icon="pi pi-pencil"
                                            className="p-button-text"
                                            onClick={() => { setSelectedMaterial(row); setFormVisible(true); }}
                                        />
                                        <Button
                                            icon="pi pi-trash"
                                            className="p-button-text p-button-danger"
                                            onClick={() => handleDelete(row.id)}
                                        />
                                    </div>
                                )}
                            />
                        </DataTable>
                    </div>
                )   
            }
            {formVisible && (
                <MaterialForm
                    material={selectedMaterial}
                    visible={formVisible}
                    onHide={() => setFormVisible(false)}
                    onSaved={() => { setFormVisible(false); fetchMaterials(); }}
                />
            )}
        </div>
    );
}
