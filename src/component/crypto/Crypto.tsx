import React, { useEffect, useReducer, useContext } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ConfirmDialog } from 'primereact/confirmdialog'; // For <ConfirmDialog /> component
import { confirmDialog } from 'primereact/confirmdialog'; // For confirmDialog method
import { Dialog } from 'primereact/dialog';
import { AutoComplete, AutoCompleteCompleteEvent } from 'primereact/autocomplete';
import { classNames } from 'primereact/utils';

import * as cryptoAdapter from '../../adapters/CryptoAdapter';
import { Context } from '../../context';
import { ACTION_TYPE, reducer, initialState } from './CryptoReducer';
import { Crypto } from '../../models/crypto';
import { Cmc } from '../../models/cmc';

const CryptoComponent = () => {

    const toast = useContext(Context);

    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        //search cmc from coin market cap
        dispatch({ type: ACTION_TYPE.START_SEARCH });
        cryptoAdapter.listCmcObjects().then(async data => {
            const cryptos = await cryptoAdapter.listCryptos();
            const payload = mergeCrypto(cryptos, data);
            dispatch({ type: ACTION_TYPE.END_SEARCH, payload: payload });
        }).catch(error => {
            toast.current.show({ severity: 'error', summary: 'Error', detail: error.message });
            dispatch({ type: ACTION_TYPE.END_SEARCH, payload: { cryptos: [], total: 0, cmcObjs: [] } });
        })
    }, [toast]);

    const listCryptos = () => {
        dispatch({ type: ACTION_TYPE.START_SEARCH });

        cryptoAdapter.listCryptos().then(data => {
            const payload = mergeCrypto(data, state.cmcObjs);
            dispatch({ type: ACTION_TYPE.END_SEARCH, payload: payload });
        }).catch(error => {
            toast.current.show({ severity: 'error', summary: 'Error', detail: error.message });
            dispatch({ type: ACTION_TYPE.END_SEARCH, payload: { cryptos: [], total: 0, cmcObjs: state.cmcObjs } });
        });
    };

    const mergeCrypto = (cryptos: Crypto[], cmcObjs: Cmc[]) => {
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
        return { cryptos: cryptos, total: currentTotal, cmcObjs: cmcObjs };
    }

    const defaultValues = {
        cmc: '',
        quantity: '',
        remark: ''
    }

    type FormValues = {
        cmc: any;
        quantity: string;
        remark?: string;
      };

    const { control, formState: { errors }, handleSubmit, reset, setValue, clearErrors } = useForm<FormValues>({ defaultValues });

    const cmcValidator = (value: any) => {
        const type = typeof value;
        return type === 'object' ? true : 'CMC Object must be chosen from dropdown.';
    }

    const filterCmc = (event: AutoCompleteCompleteEvent) => {
        const filteredCmcs = state.cmcObjs.filter((cmc: Cmc) => {
            if (cmc.name.toLowerCase().includes(event.query.toLowerCase())) {
                return cmc;
            }
            return null;
        });
        dispatch({ type: ACTION_TYPE.FILTER_CMCS, payload: { filteredCmcs: filteredCmcs } });
    }

    const openDialog = (crypto: Crypto | null) => {
        if (crypto) {
            clearErrors();
            setValue('cmc', { cmcId: crypto.cmcId, name: crypto.name, price: crypto.price });
            setValue('quantity', crypto.quantity.toString());
            if (crypto.remark !== null) {
                setValue('remark', crypto.remark);
            }
            dispatch({ type: ACTION_TYPE.SHOW_DIALOG, payload: { isEdit: true } });
        } else {
            reset();
            dispatch({ type: ACTION_TYPE.SHOW_DIALOG, payload: { isEdit: false } });
        }
    }

    const submitChange = (data: any) => {
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

    const confirmDelete = (e: any, cmcId: number) => {
        confirmDialog({
            message: `Are you sure to delete "${cmcId}"?`,
            header: 'Delete Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName:"p-button-danger p-button-outlined p-button-rounded",
            rejectClassName:"p-button-text p-button-outlined p-button-rounded",
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

    const operationTemplate = (rowData: Crypto) => {
        return (
            <React.Fragment>
                <Button className="ml-2" icon="pi pi-pencil" title="update cryptocurrency" rounded text raised severity="info" onClick={(e) => openDialog(rowData)} />
                <Button className="ml-2" icon="pi pi-trash" title="delete cryptocurrency" rounded text raised severity="danger" onClick={(e) => confirmDelete(e, rowData.cmcId)} />
            </React.Fragment>
        );
    }

    const renderFooter = () => {
        return (
            <React.Fragment>
                <Button className="ml-2" icon="pi pi-check" title="Yes" label="Yes" rounded text raised severity="success" onClick={handleSubmit(submitChange)} />
                <Button className="ml-2" icon="pi pi-times" title="No" label="No" rounded text raised severity="danger" onClick={() => { dispatch({ type: ACTION_TYPE.HIDE_DIALOG }) }} />
            </React.Fragment>
        );
    }

    const itemTemplate = (item: Cmc) => {
        return (
            <React.Fragment>
                <img alt="" src={"https://s2.coinmarketcap.com/static/img/coins/64x64/" + item.cmcId + ".png"} width="16" height="16" />
                {item.name}
            </React.Fragment>
        );
    }

    return (
        <React.Fragment>
            <ConfirmDialog />
            <Button className="ml-2" icon="pi pi-plus" title="add cryptocurrency" rounded text raised severity="success" onClick={(e) => openDialog(null)} autoFocus />

            <p className="p-component">Total Price: <NumericFormat value={state.total} displayType={'text'} thousandSeparator={true} prefix={'$'} decimalScale={2} /></p>

            <DataTable value={state.cryptos} stripedRows loading={state.showSpinner} scrollable paginator rows={5}>
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

            <Dialog header={state.isEdit ? 'Update Crypto' : 'Add Crypto'} visible={state.displayModal} onHide={() => { dispatch({ type: ACTION_TYPE.HIDE_DIALOG }) }} modal={true} breakpoints={{ '960px': '75vw', '640px': '100vw' }} style={{ width: '50vw' }} draggable={false} resizable={false} footer={renderFooter}>
                <div className="card">
                    <div className="field mt-4">
                        <span className="p-float-label">
                            <Controller name="cmc" control={control} rules={{ required: 'CMC Object is required.', validate: cmcValidator }} render={({ field, fieldState }) => (
                                <AutoComplete id={field.name} {...field} suggestions={state.filteredCmcs} completeMethod={filterCmc} field="name" itemTemplate={itemTemplate} className={classNames({ 'p-invalid': fieldState.invalid })} onKeyUp={(e) => e.key === 'Enter' && handleSubmit(submitChange)()} disabled={state.isEdit} autoFocus />
                            )} />
                            <label htmlFor="cmc" className={classNames({ 'p-error': errors.cmc })}>CMC Object*</label>
                        </span>
                        {errors.cmc && <small className="p-error">{errors.cmc.message?.toString()}</small>}
                    </div>
                    <div className="field mt-4">
                        <span className="p-float-label">
                            <Controller name="quantity" control={control} rules={{ required: 'Quantity is required.' }} render={({ field, fieldState }) => (
                                <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} onKeyUp={(e) => e.key === 'Enter' && handleSubmit(submitChange)()} />
                            )} />
                            <label htmlFor="quantity" className={classNames({ 'p-error': errors.quantity })}>Quantity*</label>
                        </span>
                        {errors.quantity && <small className="p-error">{errors.quantity.message}</small>}
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

export default CryptoComponent
