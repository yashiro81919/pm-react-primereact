import React, { useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';

import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { confirmPopup } from 'primereact/confirmpopup';
import { Dialog } from 'primereact/dialog';
import { classNames } from 'primereact/utils';

import keyService from '../services/keyService';


function Key() {

    const toast = useRef(null);

    const [keys, setKeys] = useState([]);
    const [filter, setFilter] = useState('');
    const [showSpinner, setShowSpinner] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [displayModal, setDisplayModal] = useState(false);

    const defaultValues = {
        name: '',
        key: '',
        value: ''
    }

    const { control, formState: { errors }, handleSubmit, reset, setValue } = useForm({ defaultValues });

    const searchKeys = () => {
        setShowSpinner(true);

        keyService.searchKeys(filter).then(data => {
            setKeys(data);
            setShowSpinner(false);
        }).catch(error => {
            toast.current.show({ severity: 'error', summary: 'Error', detail: error.message });
            setShowSpinner(false);
        });
    }

    const openDialog = (key) => {
        if (key) {
            setIsEdit(true);
            reset();
            setValue('name', key.name);
            setValue('key', key.key);
            setValue('value', key.value);
            setDisplayModal(true);
        } else {
            setIsEdit(false);
            reset();
            setDisplayModal(true);
        }
    }

    const submitChange = (data) => {
        if (isEdit) {
            keyService.updateKey(data).then(() => {
                searchKeys();
            }).catch(error => {
                toast.current.show({ severity: 'error', summary: 'Error', detail: error.message });
            });
        } else {
            keyService.addKey(data).then(() => {
                searchKeys();
            }).catch(error => {
                toast.current.show({ severity: 'error', summary: 'Error', detail: error.message });
            });
        }
        setDisplayModal(false);
    }

    const confirmDialog = (e, name) => {
        confirmPopup({
            target: e.currentTarget,
            message: 'Are you sure to delete?',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            accept: () => {
                keyService.deleteKey(name).then(() => {
                    searchKeys();
                }).catch(error => {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: error.message });
                });
            },
            reject: () => { }
        });
    }

    const operationTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-primary p-button-text" onClick={(e) => openDialog(rowData)} />
                <Button icon="pi pi-trash" className="p-button-outlined p-button-danger p-button-text" onClick={(e) => confirmDialog(e, rowData.name)} />
            </React.Fragment>
        );
    }

    const renderFooter = () => {
        return (
            <React.Fragment>
                <Button label="Yes" className="p-button-outlined p-button-success" onClick={handleSubmit(submitChange)} />
                <Button label="No" className="p-button-outlined p-button-danger" onClick={() => { setDisplayModal(false) }} />
            </React.Fragment>
        );
    }

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>;
    };

    return (
        <React.Fragment>
            <Toast ref={toast} position="top-center"></Toast>
            <div className="p-component">
                Name search: <InputText onChange={(e) => setFilter(e.target.value)} onKeyUp={(e) => e.key === 'Enter' && searchKeys()} onBlur={searchKeys} />
                <Button icon="pi pi-plus" className="p-button-rounded p-button-success p-button-text ml-2" onClick={(e) => openDialog(null)} />
            </div>

            <DataTable value={keys} stripedRows loading={showSpinner} scrollable scrollHeight="800px">
                <Column header="" body={operationTemplate}></Column>
                <Column field="name" header="Name"></Column>
                <Column field="key" header="Key"></Column>
                <Column field="value" header="Value"></Column>
            </DataTable>

            <Dialog header={isEdit ? 'Update Key' : 'Add Key'} visible={displayModal} onHide={() => { setDisplayModal(false) }} modal={true} breakpoints={{ '960px': '75vw', '640px': '100vw' }} style={{ width: '50vw' }} draggable={false} resizable={false} footer={renderFooter}>
                <div className="card">
                    <div className="field mt-4">
                        <span className="p-float-label">
                            <Controller name="name" control={control} rules={{ required: 'Site Name is required.' }} render={({ field, fieldState }) => (
                                <InputText id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} disabled={isEdit} onKeyUp={(e) => e.key === 'Enter' && handleSubmit(submitChange)()} />
                            )} />
                            <label htmlFor="name" className={classNames({ 'p-error': errors.name })}>Site Name*</label>
                        </span>
                        {getFormErrorMessage('name')}
                    </div>
                    <div className="field mt-4">
                        <span className="p-float-label">
                            <Controller name="key" control={control} rules={{ required: 'Key is required.' }} render={({ field, fieldState }) => (
                                <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} onKeyUp={(e) => e.key === 'Enter' && handleSubmit(submitChange)()} />
                            )} />
                            <label htmlFor="key" className={classNames({ 'p-error': errors.key })}>Key*</label>
                        </span>
                        {getFormErrorMessage('key')}
                    </div>
                    <div className="field mt-4">
                        <span className="p-float-label">
                            <Controller name="value" control={control} rules={{ required: 'Value is required.' }} render={({ field, fieldState }) => (
                                <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} onKeyUp={(e) => e.key === 'Enter' && handleSubmit(submitChange)()} />
                            )} />
                            <label htmlFor="value" className={classNames({ 'p-error': errors.value })}>Value*</label>
                        </span>
                        {getFormErrorMessage('value')}
                    </div>
                </div>
            </Dialog>
        </React.Fragment>
    );
}

export default Key