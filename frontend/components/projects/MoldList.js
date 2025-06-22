// File: /components/projects/MoldList.js
import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { useNotification } from '../../components/NotificationProvider';
import styles from '../../styles/projects/MoldList.module.css';

export default function MoldList({ molds, onEdit, onDelete, onExpand, expandedRows }) {
    const { show } = useNotification();

    // Chama onDelete e, após sucesso, exibe notificação e espera parent atualizar lista
    const handleDelete = (codigo) => {
        confirmDialog({
            message: `Confirma exclusão do molde ${codigo}?`,
            header: 'Confirmação',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sim',
            rejectLabel: 'Não',
            acceptClassName: 'p-button-danger',
            accept: async () => {
                try {
                    // onDelete deve retornar promise, ou tratar internamente a deleção
                    await onDelete(codigo);
                    show({ severity: 'success', summary: 'Removido', detail: `Molde ${codigo} excluído.` });
                    // espera o parent re-fetch no callback de onDelete
                } catch (error) {
                    console.error('Erro ao excluir molde:', error);
                    show({
                        severity: 'error',
                        summary: 'Erro',
                        detail: 'Falha ao excluir molde: ' + (error.response?.data?.message || error.message)
                    });
                }
            },
            reject: () => {
                // nada
            }
        });
    };

    return (
        <>
          <ConfirmDialog />
          <DataTable
              value={molds}
              className={styles.table}
              expandedRows={expandedRows}
              onRowToggle={(e) => onExpand(e.data)}
              dataKey="codigo"
          >
              <Column expander style={{ width: '3em' }} />
              <Column field="codigo" header="Código" sortable/>
              <Column field="description" header="Descrição" sortable/>
              <Column field="status" header="Status" sortable/>
              <Column field="begin_date" header="Início" />
              <Column field="delivery_date" header="Entrega Prev." />
              <Column
                  body={(rowData) => (
                      <div className={styles.actions}>
                          <Button
                            icon="pi pi-pencil"
                            onClick={() => {
                              onEdit(rowData);
                            }}
                            className="p-button-text"
                          />
                          <Button
                            icon="pi pi-trash"
                            className="p-button-text p-button-danger"
                            onClick={() => handleDelete(rowData.codigo)}
                          />
                      </div>
                  )}
                  header="Ações"
                  style={{ width: '150px' }}
              />
          </DataTable>
        </>
    );
}