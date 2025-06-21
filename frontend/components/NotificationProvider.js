import React, { createContext, useContext, useRef } from 'react';
import { Toast } from 'primereact/toast';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
    const toast = useRef(null);

    // show recebe severity ('success'|'info'|'warn'|'error'), summary e detail/text
    const show = ({ severity, summary, detail, life }) => {
        if (toast.current) {
            toast.current.show({ severity, summary, detail, life: life || 3000 });
        }
    };

    return (
        <NotificationContext.Provider value={{ show }}>
            {children}
            <Toast ref={toast} position="top-right" />
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const ctx = useContext(NotificationContext);
    if (!ctx) {
        throw new Error('useNotification deve ser usado dentro de NotificationProvider');
    }
    return ctx;
};