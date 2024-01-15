import React from 'react';
import { Toolbar } from 'primereact/toolbar';

const FooterComponent = () => {

    const description = '© 2024 by Tim Shi for a better life';

    const startContent = () => {
        return (
            <React.Fragment />
        );
    }

    const centerContent = () => {
        return (
            <React.Fragment />
        );
    }

    const endContent = () => {
        return (
            <div className="flex align-items-center gap-2">
                <span className="font-bold text-indigo-50">{ description }</span>
            </div>
        );
    }

    return (
        <Toolbar start={startContent} center={centerContent} end={endContent} className="bg-indigo-700 shadow-2" style={{ backgroundImage: 'linear-gradient(to right, var(--indigo-500), var(--indigo-800))' }} />
    );
}

export default FooterComponent