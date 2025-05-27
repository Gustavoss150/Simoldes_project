// File: pages/materials.js
import React from 'react';
import Head from 'next/head';
import Sidebar from '../components/Sidebar';
import MaterialList from '../components/MaterialsList';
import styles from '../styles/Materials.module.css';

export default function MaterialsPage() {
    return (
        <div className={styles.container}>
            <Head>
                <title>Aços</title>
            </Head>
            <div className="flex h-screen">
                <Sidebar />
                <main className={styles.mainContent}>
                    <h1 className={styles.header}>Materiais</h1>
                    <MaterialList />
                </main>
            </div>
         </div>
    );
}
