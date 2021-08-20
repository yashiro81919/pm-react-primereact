import axios from 'axios';
import env from '../config';

const instance = axios.create({
  baseURL: env.baseURL,
  headers: { 'Content-Type': 'application/json' }
});

instance.interceptors.request.use(function (config) {
  const authToken = localStorage.getItem('key');
  config.headers[env.keyName] = authToken !== null ? authToken : '';
  return config;
});

export default instance;