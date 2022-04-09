import API from './api';
import config from '../config';

class KeyService {

  constructor() {
    this.url = config.keyEndpoint;
  }

  searchKeys = (value) => {
    return API.get(`${this.url}?name=${value}`).then((resp) => {
      return resp.data.map(row => {
        return { name: row.name, key: row.key, value: row.value };
      });
    });
  }

  deleteKey = (name) => {
    return API.delete(`${this.url}/${name}`);
  }

  addKey = (key) => {
    const body = {name: key.name, key: key.key, value: key.value};
    return API.post(this.url, body);
  }

  updateKey = (key) => {
    const body = {name: key.name, key: key.key, value: key.value}
    return API.put(this.url, body);
  }
}

export default new KeyService()

