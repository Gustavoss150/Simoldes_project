// File: /components/projects/MoldList.js
import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import styles from '../../styles/projects/MoldList.module.css';

export default function MoldList({ molds, onEdit, onDelete, onExpand, expandedRows }) {
    return (
        <DataTable
            value={molds}
            className={styles.table}
            expandedRows={expandedRows}
            onRowToggle={(e) => onExpand(e.data)}
        >
            <Column expander style={{ width: '3em' }} />
            <Column field="codigo" header="Código" />
            <Column field="description" header="Descrição" />
            <Column field="status" header="Status" />
            <Column field="begin_date" header="Início" />
            <Column field="delivery_date" header="Entrega Prev." />
            <Column
                body={(rowData) => (
                    <div className={styles.actions}>
                        <Button icon="pi pi-pencil" onClick={() => onEdit(rowData)} className="p-button-text" />
                        <Button icon="pi pi-trash" onClick={() => onDelete(rowData.codigo)} className="p-button-text p-button-danger" />
                    </div>
                )}
                header="Ações"
                style={{ width: '150px' }}
            />
        </DataTable>
    );
}
