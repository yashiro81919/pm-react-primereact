import API from './Api';
import config from '../config';
import { Cmc } from '../models/cmc';
import { Crypto } from '../models/crypto';

const url = config.cryptoEndpoint;
const cmcUrl = config.cmcEndpoint;

export const listCmcObjects = async (): Promise<Cmc[]> => {
    const resp = await API.get(cmcUrl);
    return resp.data.map((row: any) => {
        return { cmcId: row.id, name: row.name, price: row.quote.USD.price };
    });
}

export const listCryptos = async (): Promise<Crypto[]> => {
    const resp = await API.get(url);
    return resp.data.map((row: Crypto) => {
        return { cmcId: row.cmcId, quantity: row.quantity, remark: row.remark, name: '', price: 0 };
    });
}

export const deleteCrypto = (cmcId: number): Promise<any> => {
    return API.delete(`${url}/${cmcId}`);
}

export const addCrypto = (crypto: Crypto): Promise<any> => {
    const body = { cmcId: crypto.cmcId, quantity: crypto.quantity, remark: crypto.remark };
    return API.post(url, body);
}

export const updateCrypto = (crypto: Crypto): Promise<any> => {
    const body = { cmcId: crypto.cmcId, quantity: crypto.quantity, remark: crypto.remark };
    return API.put(url, body);
}

