import API from './Api';
import config from '../config';

const url = config.loginEndpoint;

export const login = (user) => {
    const body = {name: user.name, password: user.password};
    return API.post(url, body);
}