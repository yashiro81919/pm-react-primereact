import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

import keyService from '../services/keyService';

function Login() {

    const [displayModal, setDisplayModal] = useState(true);

    const defaultValues = {
        key1: '',
        key2: ''
    }

    const { control, handleSubmit } = useForm({ defaultValues });

    const confirmLogin = (data) => {
        const apiKey = keyService.encrypt(data.key1 + data.key2);
        localStorage.setItem('key', apiKey);

        setDisplayModal(false);
    }

    const renderFooter = () => {
        return (
            <React.Fragment>
                <Button label="Yes" className="p-button-outlined p-button-success" onClick={handleSubmit(confirmLogin)} />
            </React.Fragment>
        );
    }

    return (
        <Dialog header="Input Key" visible={displayModal} onHide={() => { setDisplayModal(false) }} modal={true} breakpoints={{ '960px': '75vw', '640px': '100vw' }} style={{ width: '50vw' }} draggable={false} resizable={false} footer={renderFooter}>
            <div className="card">
                <div className="field mt-4">
                    <span className="p-float-label">
                        <Controller name="key1" control={control} render={({ field }) => (
                            <InputText id={field.name} {...field} type="password" onKeyUp={(e) => e.key === 'Enter' && handleSubmit(confirmLogin)()} autoFocus />
                        )} />
                        <label htmlFor="key1">Key1</label>
                    </span>
                </div>
                <div className="field mt-4">
                    <span className="p-float-label">
                        <Controller name="key2" control={control} render={({ field }) => (
                            <InputText id={field.name} {...field} type="password" onKeyUp={(e) => e.key === 'Enter' && handleSubmit(confirmLogin)()} />
                        )} />
                        <label htmlFor="key2">Key2</label>
                    </span>
                </div>
            </div>
        </Dialog>
    );
}

export default Login
