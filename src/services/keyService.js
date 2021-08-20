import API from './api';
import { AES, enc } from 'crypto-js';
import config from '../config';

class KeyService {
    
    constructor() {
        this.secretKey = 'pm-sty';
        this.path = config.keyEndpoint;
    }
    
    encrypt = (value) => {
        return AES.encrypt(value, this.secretKey).toString();
    }
    
    decrypt = (value) => {
        return AES.decrypt(value, this.secretKey).toString(enc.Utf8);
    }
    
    searchKeys = (value) => {
        return API.get(`${this.path}?name=${value}`).then(resp => {
            resp.data.forEach(key => {
                key.key = this.decrypt(key.key);
                key.value = this.decrypt(key.value);
              })
            return resp;
          });
      }
    
      deleteKey = (name) => {
        return API.delete(`${this.path}/${name}`);
      }
    
      addKey = (key) => {
        key.key = this.encrypt(key.key); 
        key.value = this.encrypt(key.value); 
        return API.post(this.path, key);
      }
    
      updateKey = (key) => {
        key.key = this.encrypt(key.key); 
        key.value = this.encrypt(key.value);     
        return API.put(this.path, key);   
      }
}

export default new KeyService()

