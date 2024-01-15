import React, { useRef } from 'react';
import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import { Toolbar } from 'primereact/toolbar';
import Pack from '../../../package.json';
import config from '../../config';

const HeaderComponent = () => {

    const menu = useRef<any>(null);
    const logo: string = require("../../logo.svg").default;

    const items = [{
        label: 'Navigate',
        items: [{
            label: 'Crypto',
            icon: 'pi pi-dollar',
            command: () => {
                window.location.hash = '/crypto'
            }
        },
        {
            label: 'Key',
            icon: 'pi pi-key',
            command: () => {
                window.location.hash = '/key'
            }
        }]
    }];

    const startContent = () => {
        return (
            <div className="grid">
                <div className="col-12">
                    <img src={logo} className="App-logo" alt="logo" width="48" height="48" />
                </div>
                <div className="col-12">
                    <Menu model={items} popup ref={menu} id="popup_menu" />
                    <Button className="ml-2" icon="pi pi-bars" title="show menu" rounded text raised severity="warning" onClick={(event) => menu.current.toggle(event)} aria-controls="popup_menu" aria-haspopup />
                </div>
            </div>
        );
    }

    const centerContent = () => {
        return (
            <div className="flex flex-wrap align-items-center gap-3 text-white">
                <h1>{Pack.name}</h1>
            </div>
        );
    }

    const endContent = () => {
        return (
            <div className="flex align-items-center gap-2">
                <span className="font-bold text-indigo-50">Version: {config.production ? 'prd ' : 'dev '} {Pack.version}</span>
            </div>
        );
    }

    return (
        <Toolbar start={startContent} center={centerContent} end={endContent} className="bg-indigo-700 shadow-2" style={{ backgroundImage: 'linear-gradient(to right, var(--indigo-500), var(--indigo-800))' }} />
    );
}

export default HeaderComponent
