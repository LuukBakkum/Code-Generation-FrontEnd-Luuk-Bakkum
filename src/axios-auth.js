import axios from 'axios';

const meinBankAPI = axios.create({
    baseURL: 'http://localhost:8080/'
});

export default meinBankAPI;