import React, { useEffect, useState } from 'react';
import api from '../utils/axios';
import Sidebar from '../components/Sidebar';
import Head from 'next/head';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import MaterialForm from '../components/MaterialForm';
import styles from '../styles/Materials.module.css';

export default function MaterialList({ moldCode }) {
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [formVisible, setFormVisible] = useState(false);

    const fetchMaterials = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/materials/${moldCode}`);
            setMaterials(res.data.materials || []);
        } catch (err) {
            console.error('Erro ao buscar materiais:', err);
            setMaterials([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (moldCode) fetchMaterials();
    }, [moldCode]);

    const handleDelete = async (id) => {
        if (confirm(`Excluir material ${id}?`)) {
            try {
                await api.delete(`/materials/${id}`);
                fetchMaterials();
            } catch (err) {
                console.error('Erro ao deletar material:', err);
            }
        }
    };

    return (
        <div className={styles.container}>
            <Head>
                <title>Aços</title>
            </Head>
            <div className="flex h-screen">
                <Sidebar />
                <main className={styles.mainContent}>
                    <div className={styles.header}>
                        <h1 className={styles.title}>Tabela de Materiais</h1>
                        <Button
                            label="Novo Material"
                            icon="pi pi-plus"
                            className="p-button-success p-button-lg mr-3"
                            onClick={() => { setSelectedMaterial(null); setFormVisible(true); }}
                        />
                    </div>

                    {/* Área de filtros vazia por enquanto */}
                    <div className={styles.filters} />

                    {loading
                        ? <ProgressSpinner />
                        : (
                            <div className={styles.tableContainer}>
                                <DataTable
                                    value={materials}
                                    responsiveLayout="scroll"
                                    dataKey="id"
                                    className="p-datatable"
                                >
                                    <Column field="id" header="ID" />
                                    <Column field="componentes_id" header="Componente" />
                                    <Column field="type" header="Tipo" />
                                    <Column field="quantity" header="Quantidade" />
                                    <Column field="arrival_date" header="Data Chegada" body={row => new Date(row.arrival_date).toLocaleDateString()} />
                                    <Column field="is_arrived" header="Chegou?" body={row => row.is_arrived ? 'Sim' : 'Não'} />
                                    <Column field="supplier" header="Fornecedor" />
                                    <Column 
                                        header="Ações" 
                                        body={row => ( 
                                            <>
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
                                            </>
                                        )}
                                    />
                                </DataTable>
                            </div>
                        )
                    }

                    {formVisible && (
                        <MaterialForm
                            moldCode={moldCode}
                            material={selectedMaterial}
                            visible={formVisible}
                            onHide={() => setFormVisible(false)}
                            onSaved={() => { setFormVisible(false); fetchMaterials(); }}
                        />
                    )}
                </main>
            </div>
        </div>
    );
}