import React, { useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import NumberFormat from 'react-number-format';

import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { confirmPopup } from 'primereact/confirmpopup';
import { Dialog } from 'primereact/dialog';
import { classNames } from 'primereact/utils';

import cryptoService from '../services/cryptoService';

function Crypto() {

    const toast = useRef(null);

    const [cryptos, setCryptos] = useState([]);
    const [total, setTotal] = useState(0);
    const [showSpinner, setShowSpinner] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [displayModal, setDisplayModal] = useState(false);

    const defaultValues = {
        cmc_id: '',
        name: '',
        quantity: '',
        remark: ''
    }

    const { control, formState: { errors }, handleSubmit, reset, setValue } = useForm({ defaultValues });

    const listCryptos = () => {
        setShowSpinner(true);

        cryptoService.listCryptos().then(resp => {
            setCryptos(resp.data);
            setTotal(0);

            //calculate total
            cryptos.forEach(element => {
                setTotal(prevTotal => prevTotal + element.total);
            });

            setShowSpinner(false);
        }).catch(error => {
            toast.current.show({ severity: 'error', summary: 'Error', detail: error.message });
            setShowSpinner(false);
        });
    }

    const openDialog = (crypto) => {
        if (crypto) {
            setIsEdit(true);
            reset();
            setValue('cmc_id', crypto.cmc_id);
            setValue('name', crypto.name);
            setValue('quantity', crypto.quantity);
            if (crypto.remark !== null) {
                setValue('remark', crypto.remark);
            }
            setDisplayModal(true);
        } else {
            setIsEdit(false);
            reset();
            setDisplayModal(true);
        }
    }


    const submitChange = (data) => {
        if (isEdit) {
            cryptoService.updateCrypto(data).then(() => {
                listCryptos();
            }).catch(error => {
                toast.current.show({ severity: 'error', summary: 'Error', detail: error.message });
            });
        } else {
            cryptoService.addCrypto(data).then(() => {
                listCryptos();
            }).catch(error => {
                toast.current.show({ severity: 'error', summary: 'Error', detail: error.message });
            });
        }
        setDisplayModal(false);
    }

    const confirmDialog = (e, cmc_id) => {
        confirmPopup({
            target: e.currentTarget,
            message: 'Are you sure to delete?',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            accept: () => {
                cryptoService.deleteCrypto(cmc_id).then(() => {
                    listCryptos();
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
                <Button icon="pi pi-trash" className="p-button-outlined p-button-danger p-button-text" onClick={(e) => confirmDialog(e, rowData.cmc_id)} />
            </React.Fragment>
        );
    }

    const renderFooter = () => {
        return (
            <React.Fragment>
                <Button label="Yes" className="p-button-outlined p-button-success" disabled={false} onClick={handleSubmit(submitChange)} />
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
            <Button label="Search" className="p-button-outlined p-button-secondary ml-2" onClick={listCryptos} />
            <Button label="Add" className="p-button-outlined p-button-success ml-2" onClick={(e) => openDialog(null)} />

            <p className="p-component">Total Price: <NumberFormat value={total} displayType={'text'} thousandSeparator={true} prefix={'$'} decimalScale={2} /></p>

            <DataTable value={cryptos} stripedRows loading={showSpinner} scrollable scrollHeight="800px">
                <Column header="" body={operationTemplate}></Column>
                <Column field="cmc_id" header="CMC ID"></Column>
                <Column field="name" header="Name"></Column>
                <Column field="quantity" header="Quantity"></Column>
                <Column header="Price" body={(rowData) => {
                    return <NumberFormat value={rowData.price} displayType={'text'} thousandSeparator={true} prefix={'$'} decimalScale={2} />
                }}></Column>
                <Column header="Total" body={(rowData) => {
                    return <NumberFormat value={rowData.total} displayType={'text'} thousandSeparator={true} prefix={'$'} decimalScale={2} />
                }}></Column>
                <Column field="remark" header="Remark"></Column>
            </DataTable>

            <Dialog header={isEdit ? 'Update Crypto' : 'Add Crypto'} visible={displayModal} onHide={() => { setDisplayModal(false) }} modal={true} style={{ width: '25vw' }} draggable={false} resizable={false} footer={renderFooter}>
                <div className="card">
                    <div className="field mt-4">
                        <span className="p-float-label">
                            <Controller name="cmc_id" control={control} rules={{ required: 'CMC ID is required.' }} render={({ field, fieldState }) => (
                                <InputText id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} disabled={isEdit} />
                            )} />
                            <label htmlFor="cmc_id" className={classNames({ 'p-error': errors.cmc_id })}>CMC ID*</label>
                        </span>
                        {getFormErrorMessage('cmc_id')}
                    </div>
                    <div className="field mt-4">
                        <span className="p-float-label">
                            <Controller name="name" control={control} rules={{ required: 'Name is required.' }} render={({ field, fieldState }) => (
                                <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} />
                            )} />
                            <label htmlFor="name" className={classNames({ 'p-error': errors.name })}>Name*</label>
                        </span>
                        {getFormErrorMessage('name')}
                    </div>
                    <div className="field mt-4">
                        <span className="p-float-label">
                            <Controller name="quantity" control={control} rules={{ required: 'Quantity is required.' }} render={({ field, fieldState }) => (
                                <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} />
                            )} />
                            <label htmlFor="quantity" className={classNames({ 'p-error': errors.quantity })}>Quantity*</label>
                        </span>
                        {getFormErrorMessage('quantity')}
                    </div>
                    <div className="field mt-4">
                        <span className="p-float-label">
                            <Controller name="remark" control={control} render={({ field }) => (
                                <InputText id={field.name} {...field} />
                            )} />
                            <label htmlFor="remark">Remark</label>
                        </span>
                    </div>
                </div>
            </Dialog>
        </React.Fragment>
    )
}

export default Crypto
