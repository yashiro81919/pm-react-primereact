import React, { useState, useContext } from 'react';
import { useForm, Controller } from 'react-hook-form';

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

import * as loginAdapter from '../../adapters/LoginAdapter';
import { Context } from '../../context';

function Login() {

    const [displayModal, setDisplayModal] = useState(true);

    const toast = useContext(Context);

    const defaultValues = {
        name: '',
        password: ''
    }

    const { control, handleSubmit } = useForm({ defaultValues });

    const confirmLogin = (user) => {
        loginAdapter.login(user).then(d => {
            if (d.data === '') {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Wrong user name/password.' });
            } else {
                localStorage.setItem('token', d.data);
                setDisplayModal(false);
            }
        }).catch(error => {
            toast.current.show({ severity: 'error', summary: 'Error', detail: error.message });
        });       
    }

    const renderFooter = () => {
        return (
            <React.Fragment>
                <Button label="Yes" className="p-button-outlined p-button-success" onClick={handleSubmit(confirmLogin)} />
            </React.Fragment>
        );
    }

    return (
        <Dialog header="Log in to your account" visible={displayModal} modal={true} breakpoints={{ '960px': '75vw', '640px': '100vw' }} style={{ width: '50vw' }} draggable={false} resizable={false} closable={false} footer={renderFooter}>
            <div className="card">
                <div className="field mt-4">
                    <span className="p-float-label">
                        <Controller name="name" control={control} render={({ field }) => (
                            <InputText id={field.name} {...field} type="text" onKeyUp={(e) => e.key === 'Enter' && handleSubmit(confirmLogin)()} autoFocus />
                        )} />
                        <label htmlFor="name">Name</label>
                    </span>
                </div>
                <div className="field mt-4">
                    <span className="p-float-label">
                        <Controller name="password" control={control} render={({ field }) => (
                            <InputText id={field.name} {...field} type="password" onKeyUp={(e) => e.key === 'Enter' && handleSubmit(confirmLogin)()} />
                        )} />
                        <label htmlFor="password">Password</label>
                    </span>
                </div>
            </div>
        </Dialog>
    );
}

export default Login
