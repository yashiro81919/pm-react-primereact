import axios from 'axios';
import env from '../config';

const instance = axios.create({
  baseURL: env.baseURL,
  headers: { 'Content-Type': 'application/json' }
});

instance.interceptors.request.use(function (config) {
  const authToken = localStorage.getItem('token');
  config.headers[env.keyName] = authToken ? 'Bearer ' + authToken : '';
  return config;
});

export default instance;