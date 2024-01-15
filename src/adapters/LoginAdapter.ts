import API from './Api';
import config from '../config';
import { User } from '../models/user';

const url = config.loginEndpoint;

export const login = (user: User): Promise<any> => {
    const body = {name: user.name, password: user.password};
    return API.post(url, body);
}