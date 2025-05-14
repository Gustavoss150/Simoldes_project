// pages/cnc.js
import React from 'react';
import Head from 'next/head';
import Sidebar from '../components/Sidebar';
import Cnc from '../components/CncTable';

export default function CNCPage() {
  return (
    <>
      <Head>
        <title>CNC</title>
      </Head>
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto">
          <Cnc />
        </main>
      </div>
    </>
  );
}