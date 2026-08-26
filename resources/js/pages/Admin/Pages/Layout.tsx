import React from 'react';
import Header from './Components/Header';
import { Head } from '@inertiajs/react';

interface AdminProps {
    children: React.ReactNode;
    title: string;
}

export default function Layout({ children, title }: AdminProps) {
    return (
        <>
            <Header></Header>
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
                <Head title={title} />
                {children}
            </div>
        </>
    );
}
