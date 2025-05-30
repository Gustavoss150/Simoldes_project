import { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import api from "../utils/axios";
import styles from "../styles/Import.module.css"

export default function ImportModal({ onClose }) {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const uploadHandler = async ({ files }) => {
        setLoading(true);
        setError(null);
        const file = files[0];
        const form = new FormData();
        form.append("file", file, file.name);
        try {
        const token = localStorage.getItem(process.env.NEXT_PUBLIC_TOKEN_KEY);
        const res = await api.post("/import/all", form, {
            headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
            },
        });
            setResult(res.data);
        } catch (err) {
            setError(err.response?.data?.error || "Erro no upload");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            header="Importar Planilha Excel"
            visible
            modal
            className={styles.dialog}
            headerClassName={styles.dialogHeader}
            onHide={onClose}
        >
            <div className={`${styles.formContent} p-fluid`}>
                <div className="mr-3">
                    <FileUpload
                        name="file"
                        customUpload
                        uploadHandler={uploadHandler}
                        accept=".xlsm, .xls, .csv, .xlsx"
                        mode="basic"
                        auto
                        chooseOptions={{
                            label: "Selecionar Planilha",
                            icon: "pi pi-fw pi-file-excel",
                            className: "myImportButton p-button-sm mr-4"
                        }}
                    />

                </div>

                {loading && <p className="mt-4">Importando, aguarde...</p>}

                {result && (
                    <div className="mr-3">
                        <h4>Importação Concluída</h4>
                        <pre className="bg-gray-100 p-2 rounded">
                            {JSON.stringify(result, null, 2)}
                        </pre>
                    </div>
                )}

                {error && <p className="text-red-500 mt-2">{error}</p>}

                <div className="mt-4 text-right">
                    <Button
                        label="Fechar"
                        onClick={onClose}
                        className="p-button-text mr-4"
                    />
                </div>
            </div>
        </Dialog>
    );
}
