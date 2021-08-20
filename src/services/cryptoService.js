import API from './api';
import config from '../config';

class CryptoService {

    constructor() {
        this.path = config.cryptoEndpoint;
    }

    listCryptos() {
        return API.get(this.path);
    }

    deleteCrypto(cmc_id) {
        return API.delete(`${this.path}/${cmc_id}`);
    }

    addCrypto(crypto) {
        return API.post(this.path, crypto);
    }

    updateCrypto(crypto) {
        return API.put(this.path, crypto);
    }
}

export default new CryptoService()

