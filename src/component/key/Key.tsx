import React, { useReducer, useContext, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ConfirmDialog } from 'primereact/confirmdialog'; // For <ConfirmDialog /> component
import { confirmDialog } from 'primereact/confirmdialog'; // For confirmDialog method
import { Dialog } from 'primereact/dialog';
import { classNames } from 'primereact/utils';

import * as keyAdapter from '../../adapters/KeyAdapter';
import { Context } from '../../context';
import { ACTION_TYPE, reducer, initialState } from './KeyReducer';
import { Key } from '../../models/key';

const KeyComponent = () => {

    const toast = useContext<any>(Context);

    const filter = useRef<any>(null);

    const [state, dispatch] = useReducer(reducer, initialState);

    const defaultValues = {
        name: '',
        key: '',
        value: ''
    }

    const { control, formState: { errors }, handleSubmit, reset, setValue, clearErrors } = useForm({ defaultValues });

    const searchKeys = () => {
        dispatch({ type: ACTION_TYPE.START_SEARCH });

        keyAdapter.searchKeys(filter.current.value).then(data => {
            dispatch({ type: ACTION_TYPE.END_SEARCH, payload: {keys: data} });
        }).catch(error => {
            toast.current.show({ severity: 'error', summary: 'Error', detail: error.message });
            dispatch({ type: ACTION_TYPE.END_SEARCH, payload: {keys: []} });
        });
    }
    
    const openDialog = (key: Key | null) => {
        if (key) {
            clearErrors();
            setValue('name', key.name);
            setValue('key', key.key);
            setValue('value', key.value);
            dispatch({ type: ACTION_TYPE.SHOW_DIALOG, payload: {isEdit: true} });
        } else {
            reset();
            dispatch({ type: ACTION_TYPE.SHOW_DIALOG, payload: {isEdit: false} });
        }
    }    

    const submitChange = (data: Key) => {
        if (state.isEdit) {
            keyAdapter.updateKey(data).then(() => {
                searchKeys();
            }).catch(error => {
                toast.current.show({ severity: 'error', summary: 'Error', detail: error.message });
            });
        } else {
            keyAdapter.addKey(data).then(() => {
                searchKeys();
            }).catch(error => {
                toast.current.show({ severity: 'error', summary: 'Error', detail: error.message });
            });
        }
        dispatch({ type: ACTION_TYPE.HIDE_DIALOG });
    }

    const confirmDelete = (e: any, name: string) => {
        confirmDialog({
            message: `Are you sure to delete "${name}"?`,
            header: 'Delete Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName:"p-button-danger p-button-outlined p-button-rounded",
            rejectClassName:"p-button-text p-button-outlined p-button-rounded",
            accept: () => {
                keyAdapter.deleteKey(name).then(() => {
                    searchKeys();
                }).catch(error => {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: error.message });
                });
            },
            reject: () => { }
        });
    }

    const operationTemplate = (rowData: Key) => {
        return (
            <React.Fragment>
                <Button className="ml-2" icon="pi pi-pencil" title="update key" rounded text raised severity="info" onClick={(e) => openDialog(rowData)} />
                {rowData.name !== 'cmc-key' && <Button className="ml-2" icon="pi pi-trash" title="delete key" rounded text raised severity="danger" onClick={(e) => confirmDelete(e, rowData.name)} />}
            </React.Fragment>
        );
    }

    const renderFooter = () => {
        return (
            <React.Fragment>
                <Button className="ml-2" icon="pi pi-check" title="Yes" label="Yes" rounded text raised severity="success" onClick={handleSubmit(submitChange)} />
                <Button className="ml-2" icon="pi pi-times" title="No" label="No" rounded text raised severity="danger" onClick={() => {dispatch({type: ACTION_TYPE.HIDE_DIALOG})}} />
            </React.Fragment>
        );
    }

    return (
        <React.Fragment>
            <ConfirmDialog />
            <div className="mb-4">
                <InputText aria-label="search key" placeholder="Search Name" type="text" ref={filter} onKeyUp={(e) => e.key === 'Enter' && searchKeys()}/>
                <Button className="ml-2" icon="pi pi-search" title="search key" rounded text raised onClick={(e) => searchKeys()}/>
                <Button className="ml-2" icon="pi pi-plus" title="add key" rounded text raised severity="success" onClick={(e) => openDialog(null)}/>
            </div>

            <DataTable value={state.keys} stripedRows loading={state.showSpinner} scrollable paginator rows={5}>
                <Column header="" body={operationTemplate}></Column>
                <Column field="name" header="Name"></Column>
                <Column field="key" header="Key"></Column>
                <Column field="value" header="Value"></Column>
            </DataTable>

            <Dialog header={state.isEdit ? 'Update Key' : 'Add Key'} visible={state.displayModal} onHide={() => { dispatch({type: ACTION_TYPE.HIDE_DIALOG}) }} modal={true} breakpoints={{ '960px': '75vw', '640px': '100vw' }} style={{ width: '50vw' }} draggable={false} resizable={false} footer={renderFooter}>
                <div className="card">
                    <div className="field mt-4">
                        <span className="p-float-label">
                            <Controller name="name" control={control} rules={{ required: 'Site Name is required.' }} render={({ field, fieldState }) => (
                                <InputText id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} disabled={state.isEdit} onKeyUp={(e) => e.key === 'Enter' && handleSubmit(submitChange)()} />
                            )} />
                            <label htmlFor="name" className={classNames({ 'p-error': errors.name })}>Site Name*</label>
                        </span>
                        {errors.name && <small className="p-error">{errors.name.message}</small>}
                    </div>
                    <div className="field mt-4">
                        <span className="p-float-label">
                            <Controller name="key" control={control} rules={{ required: 'Key is required.' }} render={({ field, fieldState }) => (
                                <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} onKeyUp={(e) => e.key === 'Enter' && handleSubmit(submitChange)()} />
                            )} />
                            <label htmlFor="key" className={classNames({ 'p-error': errors.key })}>Key*</label>
                        </span>
                        {errors.key && <small className="p-error">{errors.key.message}</small>}
                    </div>
                    <div className="field mt-4">
                        <span className="p-float-label">
                            <Controller name="value" control={control} rules={{ required: 'Value is required.' }} render={({ field, fieldState }) => (
                                <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} onKeyUp={(e) => e.key === 'Enter' && handleSubmit(submitChange)()} />
                            )} />
                            <label htmlFor="value" className={classNames({ 'p-error': errors.value })}>Value*</label>
                        </span>
                        {errors.value && <small className="p-error">{errors.value.message}</small>}
                    </div>
                </div>
            </Dialog>
        </React.Fragment>
    );
}

export default KeyComponent