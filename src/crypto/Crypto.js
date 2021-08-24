import React, { useState, useEffect, useRef, useReducer, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import NumberFormat from 'react-number-format';

import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { confirmPopup } from 'primereact/confirmpopup';
import { Dialog } from 'primereact/dialog';
import { AutoComplete } from 'primereact/autocomplete';
import { classNames } from 'primereact/utils';

import cryptoService from '../services/cryptoService';

const initialState = {
    cmcObjs: [],
    cryptos: [],
    total: 0,
    filteredCmcs: []
};

function reducer(state, action) {
    const data = action.payload;
    switch (action.type) {
        case 'loadCmc':
            return { ...state, cmcObjs: action.payload };
        case 'loadCrypto':
            //merge cryto with cmc
            data.forEach(crypto => {
                const cmc = state.cmcObjs.find(cmc => cmc.cmcId === crypto.cmcId);
                crypto.name = cmc?.name ? cmc.name : '';
                crypto.price = cmc?.price ? cmc.price : 0;
            });
            return { ...state, cryptos: data };
        case 'setTotal':
            //calculate total
            let currentTotal = 0;
            state.cryptos.forEach(crypto => {
                currentTotal += crypto.quantity * crypto.price;
            });
            return { ...state, total: currentTotal };
        case 'filterCmc':
            const cmcs = state.cmcObjs.filter(cmc => {
                if (cmc.name.toLowerCase().includes(data.query.toLowerCase())) {
                    return cmc;
                }
                return null;
            });
            return { ...state, filteredCmcs: cmcs };
        default:
            throw new Error();
    }
}

function Crypto() {

    const toast = useRef(null);

    const [showSpinner, setShowSpinner] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [displayModal, setDisplayModal] = useState(false);

    const [state, dispatch] = useReducer(reducer, initialState);

    const listCryptos = useCallback(
        () => {
            setShowSpinner(true);
            cryptoService.listCryptos().then(data => {
                dispatch({ type: 'loadCrypto', payload: data });
                dispatch({ type: 'setTotal', payload: data });

                setShowSpinner(false);
            }).catch(error => {
                toast.current.show({ severity: 'error', summary: 'Error', detail: error.message });
                setShowSpinner(false);
            });
        },
        []
    );

    useEffect(() => {
        //search cmc from coin market cap
        setShowSpinner(true);
        cryptoService.listCmcObjects().then(data => {
            dispatch({ type: 'loadCmc', payload: data });
            listCryptos();
        }).catch(error => {
            toast.current.show({ severity: 'error', summary: 'Error', detail: error.message });
            setShowSpinner(false);
        })
    }, [listCryptos]);

    const defaultValues = {
        cmc: '',
        quantity: '',
        remark: ''
    }

    const { control, formState: { errors }, handleSubmit, reset, setValue, clearErrors } = useForm({ defaultValues });

    const cmcValidator = (value) => {
        const type = typeof value;
        return type === 'object' ? true : 'CMC Object must be chosen from dropdown.';
    }

    const filterCmc = (event) => {
        dispatch({ type: 'filterCmc', payload: event });
    }

    const openDialog = (crypto) => {
        if (crypto) {
            setIsEdit(true);
            clearErrors();
            setValue('cmc', { cmcId: crypto.cmcId, name: crypto.name, price: crypto.price });
            setValue('quantity', crypto.quantity);
            if (crypto.remark !== null) {
                setValue('remark', crypto.remark);
            }
        } else {
            setIsEdit(false);
            reset();
        }
        setDisplayModal(true);
    }

    const submitChange = (data) => {
        const cryptoObject = { cmcId: data?.cmc?.cmcId, name: '', price: 0, quantity: data?.quantity, remark: data?.remark };
        if (isEdit) {
            cryptoService.updateCrypto(cryptoObject).then(() => {
                listCryptos();
            }).catch(error => {
                toast.current.show({ severity: 'error', summary: 'Error', detail: error.message });
            });
        } else {
            cryptoService.addCrypto(cryptoObject).then(() => {
                listCryptos();
            }).catch(error => {
                toast.current.show({ severity: 'error', summary: 'Error', detail: error.message });
            });
        }
        setDisplayModal(false);
    }

    const confirmDialog = (e, cmcId) => {
        confirmPopup({
            target: e.currentTarget,
            message: 'Are you sure to delete?',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            accept: () => {
                cryptoService.deleteCrypto(cmcId).then(() => {
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
                <Button icon="pi pi-trash" className="p-button-outlined p-button-danger p-button-text" onClick={(e) => confirmDialog(e, rowData.cmcId)} />
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

    const itemTemplate = (item) => {
        return (
            <React.Fragment>
                <img alt="" src={"https://s2.coinmarketcap.com/static/img/coins/64x64/" + item.cmcId + ".png"} width="16" height="16" />
                {item.name}
            </React.Fragment>
        );
    }

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>;
    };

    return (
        <React.Fragment>
            <Toast ref={toast} position="top-center"></Toast>
            <Button icon="pi pi-plus" className="p-button-rounded p-button-success p-button-text" onClick={(e) => openDialog(null)} autoFocus />

            <p className="p-component">Total Price: <NumberFormat value={state.total} displayType={'text'} thousandSeparator={true} prefix={'$'} decimalScale={2} /></p>

            <DataTable value={state.cryptos} stripedRows loading={showSpinner} scrollable scrollHeight="800px">
                <Column header="" body={operationTemplate}></Column>
                <Column field="cmcId" header="CMC ID"></Column>
                <Column field="name" header="Name"></Column>
                <Column field="quantity" header="Quantity"></Column>
                <Column header="Price" body={(rowData) => {
                    return <NumberFormat value={rowData.price} displayType={'text'} thousandSeparator={true} prefix={'$'} decimalScale={2} />
                }}></Column>
                <Column header="Total" body={(rowData) => {
                    return <NumberFormat value={rowData.quantity * rowData.price} displayType={'text'} thousandSeparator={true} prefix={'$'} decimalScale={2} />
                }}></Column>
                <Column field="remark" header="Remark"></Column>
            </DataTable>

            <Dialog header={isEdit ? 'Update Crypto' : 'Add Crypto'} visible={displayModal} onHide={() => { setDisplayModal(false) }} modal={true} breakpoints={{ '960px': '75vw', '640px': '100vw' }} style={{ width: '50vw' }} draggable={false} resizable={false} footer={renderFooter}>
                <div className="card">
                    <div className="field mt-4">
                        <span className="p-float-label">
                            <Controller name="cmc" control={control} rules={{ required: 'CMC Object is required.', validate: cmcValidator }} render={({ field, fieldState }) => (
                                <AutoComplete id={field.name} {...field} suggestions={state.filteredCmcs} completeMethod={filterCmc} field="name" itemTemplate={itemTemplate} className={classNames({ 'p-invalid': fieldState.invalid })} onKeyUp={(e) => e.key === 'Enter' && handleSubmit(submitChange)()} disabled={isEdit} autoFocus />
                            )} />
                            <label htmlFor="cmc" className={classNames({ 'p-error': errors.cmc })}>CMC Object*</label>
                        </span>
                        {getFormErrorMessage('cmc')}
                    </div>
                    <div className="field mt-4">
                        <span className="p-float-label">
                            <Controller name="quantity" control={control} rules={{ required: 'Quantity is required.' }} render={({ field, fieldState }) => (
                                <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} onKeyUp={(e) => e.key === 'Enter' && handleSubmit(submitChange)()} />
                            )} />
                            <label htmlFor="quantity" className={classNames({ 'p-error': errors.quantity })}>Quantity*</label>
                        </span>
                        {getFormErrorMessage('quantity')}
                    </div>
                    <div className="field mt-4">
                        <span className="p-float-label">
                            <Controller name="remark" control={control} render={({ field }) => (
                                <InputText id={field.name} {...field} onKeyUp={(e) => e.key === 'Enter' && handleSubmit(submitChange)()} />
                            )} />
                            <label htmlFor="remark">Remark</label>
                        </span>
                    </div>
                </div>
            </Dialog>
        </React.Fragment >
    )
}

export default Crypto
