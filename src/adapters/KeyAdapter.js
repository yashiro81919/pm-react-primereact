import API from './Api';
import config from '../config';

const url = config.keyEndpoint;

export const searchKeys = (value) => {
  return API.get(`${url}?name=${value}`).then((resp) => {
    return resp.data.map(row => {
      return { name: row.name, key: row.key, value: row.value };
    });
  });
}

export const deleteKey = (name) => {
  return API.delete(`${url}/${name}`);
}

export const addKey = (key) => {
  const body = {name: key.name, key: key.key, value: key.value};
  return API.post(url, body);
}

export const updateKey = (key) => {
  const body = {name: key.name, key: key.key, value: key.value}
  return API.put(url, body);
}

