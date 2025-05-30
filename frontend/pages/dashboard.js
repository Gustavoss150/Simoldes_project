import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from 'next/head';
import api from "../utils/axios";
import Sidebar from "../components/Sidebar";
import ImportModal from "../components/ImportModal";
import { Upload } from 'lucide-react';
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProgressSpinner } from "primereact/progressspinner";
import styles from "../styles/Import.module.css"

export default function Dashboard() {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [molds, setMolds] = useState([]);
    const [total, setTotal] = useState(0);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [showImportModal, setShowImportModal] = useState(false);
    const router = useRouter();

    const statusOptions = [
        { label: "Todos", value: null },
        { label: "Não iniciado", value: "not started" },
        { label: "Em processo", value: "in process" },
        { label: "Pausado", value: "paused" },
        { label: "Completo", value: "completed" }
    ];

    useEffect(() => {
        const token = localStorage.getItem(process.env.NEXT_PUBLIC_TOKEN_KEY);
        if (!token) {
            setError("Token não encontrado. Redirecionando para login...");
            router.push("/auth/login");
            return;
        }

        const fetchUserData = async () => {
            try {
                const response = await api.get(`/users/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUserData(response.data);
            } catch (err) {
                setError("Erro ao carregar os dados do usuário.");
                console.error("Erro na API:", err);
                router.push("/auth/login");
            }
        };

        fetchUserData();
    }, [router]);

    useEffect(() => {
        const fetchMolds = async () => {
            setLoading(true);
            setError("");
            try {
                const token = localStorage.getItem(process.env.NEXT_PUBLIC_TOKEN_KEY);
                if (!token) {
                    setError("Token não encontrado. Redirecionando para login...");
                    router.push("/auth/login");
                    return;
                }

                const params = selectedStatus ? { status: selectedStatus } : {};
                const response = await api.get(`/projects/`, { params });
                setMolds(response.data.molds);
                setTotal(response.data.total);
            } catch (err) {
                setError("Erro ao carregar moldes.");
                console.error("Erro ao buscar moldes:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMolds();
    }, [selectedStatus, router]);

    return (
        <>
            <Head>
                <title>Página Inicial</title>
            </Head>
            <div className="dashboard-container flex">
                <Sidebar />
                <main className="dashboard-main flex-1 p-6">
                    <header className="dashboard-header flex justify-between items-center">
                        {userData ? (
                            <div>
                                <h1 className="text-2xl font-bold">{userData.name}</h1>
                                <p>Matrícula: {userData.registration}</p>
                                <p>Departamento: {userData.department}</p>
                                <p>Role: {userData.role}</p>
                            </div>
                        ) : (
                            <ProgressSpinner />
                        )}
                    <Button
                        icon="pi pi-fw pi-file-excel"
                        label="Importar Planilha"
                        className="p-button mr-4"
                        onClick={() => setShowImportModal(true)}
                    />
                    </header>

                    <section className="dashboard-content mt-4">
                        <div className="flex items-center gap-4">
                            <h2 className="text-xl font-semibold">Moldes</h2>
                            <Dropdown
                                value={selectedStatus}
                                options={statusOptions}
                                onChange={(e) => setSelectedStatus(e.value)}
                                placeholder="Filtrar por status"
                            />
                        </div>

                        {loading ? (
                            <ProgressSpinner />
                        ) : (
                            <DataTable value={molds} paginator rows={5} totalRecords={total} className="p-datatable-sm">
                                <Column field="codigo" header="Código" sortable />
                                <Column field="description" header="Descrição" />
                                <Column field="status" header="Status" sortable />
                                <Column field="current_step" header="Etapa Atual" />
                                <Column field="steps" header="Etapas" />
                                <Column field="begin_date" header="Início" />
                                <Column field="delivery_date" header="Entrega Prevista" />
                            </DataTable>
                        )}

                        {error && <p className="text-red-500 mt-2">{error}</p>}
                    </section>

                    {showImportModal && <ImportModal onClose={() => setShowImportModal(false)} />}
                </main>
            </div>
        </>
    );
}
