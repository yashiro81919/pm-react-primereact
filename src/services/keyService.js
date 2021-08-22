import API from './api';
import { AES, enc } from 'crypto-js';
import config from '../config';

class KeyService {

  constructor() {
    this.url = config.keyEndpoint;
    this.secretKey = 'pm-sty';
  }

  encrypt = (value) => {
    return AES.encrypt(value, this.secretKey).toString();
  }

  decrypt = (value) => {
    return AES.decrypt(value, this.secretKey).toString(enc.Utf8);
  }

  searchKeys = (value) => {
    return API.get(`${this.url}?name=${value}`).then((resp) => {
      return resp.data.map(row => {
        return { name: row.name, key: this.decrypt(row.key), value: this.decrypt(row.value) };
      });
    });
  }

  deleteKey = (name) => {
    return API.delete(`${this.url}/${name}`);
  }

  addKey = (key) => {
    const body = {name: key.name, key: this.encrypt(key.key), value: this.encrypt(key.value)};
    return API.post(this.url, body);
  }

  updateKey = (key) => {
    const body = {name: key.name, key: this.encrypt(key.key), value: this.encrypt(key.value)}
    return API.put(this.url, body);
  }
}

export default new KeyService()

