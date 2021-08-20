import React, { useRef } from 'react';
import logo from '../logo.svg';
import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import Pack from '../../package.json';


function Header() {

    const menu = useRef(null);

    const items = [{
        label: 'Navigate',
        items: [{
            label: 'Crypto',
            icon: 'pi pi-dollar',
            command: (e) => {
                window.location.hash = "/crypto"
            }
        },
        {
            label: 'Key',
            icon: 'pi pi-key',
            command: (e) => {
                window.location.hash = "/key"
            }
        }]
    }];

    return (
        <div>
            <div className="grid bg-indigo-700">
                <div className="col">
                    <div className="grid">
                        <div className="col-12">
                            <img src={logo} className="App-logo" alt="logo" width="48" height="48" />
                        </div>
                        <div className="col-12">
                            <Menu model={items} popup ref={menu} id="popup_menu" />
                            <Button label="Menu" icon="pi pi-bars" className="p-button-raised p-button-plain p-button-text" onClick={(event) => menu.current.toggle(event)} aria-controls="popup_menu" aria-haspopup />
                        </div>
                    </div>
                </div>
                <div className="col">
                    <h1>{Pack.name}</h1>
                </div>
                <div className="col">
                    <p className="text-right">Version {Pack.version}</p>
                </div>
            </div>
        </div>
    );
}

export default Header
