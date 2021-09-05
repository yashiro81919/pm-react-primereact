import API from './api';
import config from '../config';

class CryptoService {

    constructor() {
        this.url = config.cryptoEndpoint;
        this.cmcUrl = config.cmcEndpoint;
    }

    listCmcObjects() {
        return API.get(this.cmcUrl).then((resp) => {
            return resp.data.map(row => {
                return { cmcId: row.id, name: row.name, price: row.quote.USD.price };
            });
        });
    }

    listCryptos() {
        return API.get(this.url).then((resp) => {
            return resp.data.map(row => {
                return { cmcId: row.cmcId, quantity: row.quantity, remark: row.remark, name: '', price: 0 };
            });
        });
    }

    deleteCrypto(cmcId) {
        return API.delete(`${this.url}/${cmcId}`);
    }

    addCrypto(crypto) {
        const body = { cmcId: crypto.cmcId, quantity: crypto.quantity, remark: crypto.remark };
        return API.post(this.url, body);
    }

    updateCrypto(crypto) {
        const body = { cmcId: crypto.cmcId, quantity: crypto.quantity, remark: crypto.remark };
        return API.put(this.url, body);
    }
}

export default new CryptoService()

