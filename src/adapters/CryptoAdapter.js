import API from './Api';
import config from '../config';

const url = config.cryptoEndpoint;
const cmcUrl = config.cmcEndpoint;

export const listCmcObjects = () => {
    return API.get(cmcUrl).then((resp) => {
        return resp.data.map(row => {
            return { cmcId: row.id, name: row.name, price: row.quote.USD.price };
        });
    });
}

export const listCryptos = () => {
    return API.get(url).then((resp) => {
        return resp.data.map(row => {
            return { cmcId: row.cmcId, quantity: row.quantity, remark: row.remark, name: '', price: 0 };
        });
    });
}

export const deleteCrypto = (cmcId) => {
    return API.delete(`${url}/${cmcId}`);
}

export const addCrypto = (crypto) => {
    const body = { cmcId: crypto.cmcId, quantity: crypto.quantity, remark: crypto.remark };
    return API.post(url, body);
}

export const updateCrypto = (crypto) => {
    const body = { cmcId: crypto.cmcId, quantity: crypto.quantity, remark: crypto.remark };
    return API.put(url, body);
}

