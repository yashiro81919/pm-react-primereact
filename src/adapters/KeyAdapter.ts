import API from './Api';
import config from '../config';
import { Key } from '../models/key';

const url = config.keyEndpoint;

export const searchKeys = async (value: string): Promise<Key[]> => {
  const resp = await API.get(`${url}?name=${value}`);
  return resp.data.map((row: Key) => {
    return { name: row.name, key: row.key, value: row.value };
  });
}

export const deleteKey = (name: string): Promise<any> => {
  return API.delete(`${url}/${name}`);
}

export const addKey = (key: Key): Promise<any> => {
  const body = {name: key.name, key: key.key, value: key.value};
  return API.post(url, body);
}

export const updateKey = (key: Key): Promise<any> => {
  const body = {name: key.name, key: key.key, value: key.value}
  return API.put(url, body);
}

