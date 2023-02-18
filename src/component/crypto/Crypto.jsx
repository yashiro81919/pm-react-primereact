import React, { useEffect, useReducer, useContext } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { Dialog } from 'primereact/dialog';
import { AutoComplete } from 'primereact/autocomplete';
import { classNames } from 'primereact/utils';

import * as cryptoAdapter from '../../adapters/CryptoAdapter';
import { Context } from '../../context';
import { ACTION_TYPE, reducer, initialState } from './CryptoReducer';

function Crypto() {

    const toast = useContext(Context);

    const [state, dispatch] = useReducer(reducer, initialState);  

    useEffect(() => {
        //search cmc from coin market cap
        dispatch({ type: ACTION_TYPE.START_SEARCH });
        cryptoAdapter.listCmcObjects().then(data => {
            return cryptoAdapter.listCryptos().then(cryptos => {
                const payload = mergeCrypto(cryptos, data);  
                dispatch({ type: ACTION_TYPE.END_SEARCH, payload: payload });
            }); 
        }).catch(error => {
            toast.current.show({ severity: 'error', summary: 'Error', detail: error.message });
            dispatch({ type: ACTION_TYPE.END_SEARCH, payload: {cryptos: [], total: 0, cmcObjs: []} });
        })
    }, [toast]);

    const listCryptos = () => {
        dispatch({ type: ACTION_TYPE.START_SEARCH });

        cryptoAdapter.listCryptos().then(data => {
            const payload = mergeCrypto(data, state.cmcObjs);               
            dispatch({ type: ACTION_TYPE.END_SEARCH, payload: payload });
        }).catch(error => {
            toast.current.show({ severity: 'error', summary: 'Error', detail: error.message });
            dispatch({ type: ACTION_TYPE.END_SEARCH, payload: {cryptos: [], total: 0, cmcObjs: state.cmcObjs} });
        });
    };    
    
    const mergeCrypto = (cryptos, cmcObjs) => {
        //merge cryto with cmc
        cryptos.forEach(crypto => {
            const cmc = cmcObjs.find(cmc => cmc.cmcId === crypto.cmcId);
            crypto.name = cmc?.name ? cmc.name : '';
            crypto.price = cmc?.price ? cmc.price : 0;
        });
        //calculate total
        let currentTotal = 0;
        cryptos.forEach(crypto => {
            currentTotal += crypto.quantity * crypto.price;
        });
        return {cryptos: cryptos, total: currentTotal, cmcObjs: cmcObjs };           
    } 

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
        const filteredCmcs = state.cmcObjs.filter(cmc => {
            if (cmc.name.toLowerCase().includes(event.query.toLowerCase())) {
                return cmc;
            }
            return null;
        });        
        dispatch({ type: ACTION_TYPE.FILTER_CMCS, payload: {filteredCmcs: filteredCmcs} });
    }

    const openDialog = (crypto) => {
        if (crypto) {
            clearErrors();
            setValue('cmc', { cmcId: crypto.cmcId, name: crypto.name, price: crypto.price });
            setValue('quantity', crypto.quantity);
            if (crypto.remark !== null) {
                setValue('remark', crypto.remark);
            }
            dispatch({ type: ACTION_TYPE.SHOW_DIALOG, payload: {isEdit: true} });
        } else {
            reset();
            dispatch({ type: ACTION_TYPE.SHOW_DIALOG, payload: {isEdit: false} });
        }
    }

    const submitChange = (data) => {
        const cryptoObject = { cmcId: data?.cmc?.cmcId, name: '', price: 0, quantity: data?.quantity, remark: data?.remark };
        if (state.isEdit) {
            cryptoAdapter.updateCrypto(cryptoObject).then(() => {
                listCryptos();
            }).catch(error => {
                toast.current.show({ severity: 'error', summary: 'Error', detail: error.message });
            });
        } else {
            cryptoAdapter.addCrypto(cryptoObject).then(() => {
                listCryptos();
            }).catch(error => {
                toast.current.show({ severity: 'error', summary: 'Error', detail: error.message });
            });
        }
        dispatch({ type: ACTION_TYPE.HIDE_DIALOG });
    }

    const confirmDialog = (e, cmcId) => {
        confirmPopup({
            target: e.currentTarget,
            message: 'Are you sure to delete?',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            accept: () => {
                cryptoAdapter.deleteCrypto(cmcId).then(() => {
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
                <Button label="No" className="p-button-outlined p-button-danger" onClick={() => { dispatch({type: ACTION_TYPE.HIDE_DIALOG}) }} />
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
            <ConfirmPopup />
            <Button icon="pi pi-plus" className="p-button-rounded p-button-success p-button-text" onClick={(e) => openDialog(null)} autoFocus />

            <p className="p-component">Total Price: <NumericFormat value={state.total} displayType={'text'} thousandSeparator={true} prefix={'$'} decimalScale={2} /></p>

            <DataTable value={state.cryptos} stripedRows loading={state.showSpinner} scrollable scrollHeight="800px">
                <Column header="" body={operationTemplate}></Column>
                <Column field="cmcId" header="CMC ID"></Column>
                <Column field="name" header="Name"></Column>
                <Column field="quantity" header="Quantity"></Column>
                <Column header="Price" body={(rowData) => {
                    return <NumericFormat value={rowData.price} displayType={'text'} thousandSeparator={true} prefix={'$'} decimalScale={2} />
                }}></Column>
                <Column header="Total" body={(rowData) => {
                    return <NumericFormat value={rowData.quantity * rowData.price} displayType={'text'} thousandSeparator={true} prefix={'$'} decimalScale={2} />
                }}></Column>
                <Column field="remark" header="Remark"></Column>
            </DataTable>

            <Dialog header={state.isEdit ? 'Update Crypto' : 'Add Crypto'} visible={state.displayModal} onHide={() => { dispatch({type: ACTION_TYPE.HIDE_DIALOG}) }} modal={true} breakpoints={{ '960px': '75vw', '640px': '100vw' }} style={{ width: '50vw' }} draggable={false} resizable={false} footer={renderFooter}>
                <div className="card">
                    <div className="field mt-4">
                        <span className="p-float-label">
                            <Controller name="cmc" control={control} rules={{ required: 'CMC Object is required.', validate: cmcValidator }} render={({ field, fieldState }) => (
                                <AutoComplete id={field.name} {...field} suggestions={state.filteredCmcs} completeMethod={filterCmc} field="name" itemTemplate={itemTemplate} className={classNames({ 'p-invalid': fieldState.invalid })} onKeyUp={(e) => e.key === 'Enter' && handleSubmit(submitChange)()} disabled={state.isEdit} autoFocus />
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
