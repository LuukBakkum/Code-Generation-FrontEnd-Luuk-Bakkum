import { defineStore } from 'pinia';
import meinBankAPI from '../axios-auth';

export const userAuthStore = defineStore('auth', {
    state: () => ({
        jwt: '',
        roles: '',
        username: '',
        email: '',
        id: '',
    }),
    getters: {
        isAuthenticated: (state) => state.jwt !== '',
        userRoles: (state) => state.roles ? JSON.parse(state.roles) : [],
        userId: (state) => state.id ? state.id : '',
        userUsername: (state) => state.username ? state.username : '',
    },
    actions: {
        autoLogin() {
            if (localStorage['jwt'] && localStorage['roles'] && localStorage['username'] && localStorage['email'] && localStorage['id']) {
                this.jwt = localStorage['jwt'];
                this.roles = JSON.stringify(localStorage['roles']);
                this.username = localStorage['username'];
                this.email = localStorage['email'];
                this.id = localStorage['id'];

                meinBankAPI.defaults.headers.common['Authorization'] = 'Bearer ' + this.jwt;
            }
        },
        async register(registerData) {
            // console.log(registerData);
            return new Promise((resolve, reject) => {
                // console.log(registerData)
                meinBankAPI.post('authenticate/register', registerData)
                    .then((response) => {
                        // Basic response checks
                        if (!response || response.status !== 201 || !response.data) {
                            reject('Invalid response from server.');
                            return;
                        }
                        
                        // TODO: duplicate code fix
                        const data = response.data;

                        if (!data) {
                            reject('No token received.');
                            return;
                        }

                        this.jwt = data.token;//jwt
                        this.roles = data.roles;
                        this.username = data.username;
                        this.email = data.email;
                        this.id = data.id;

                        localStorage.setItem('jwt', this.jwt);
                        localStorage.setItem('roles', JSON.stringify(this.roles));
                        localStorage.setItem('username', this.username);
                        localStorage.setItem('email', this.email);
                        localStorage.setItem('id', this.id);

                        meinBankAPI.defaults.headers.common['Authorization'] = 'Bearer ' + this.jwt;
                        
                        // Resolve the promise
                        resolve(true);
                    })
                    .catch(error => {
                        // Reject the promise with the error message
                        reject((error.response.data.message ?? "Something unexpected happened while trying to register! Please refresh..."));
                    });
            });
        },
        async login(formData) {
            return new Promise((resolve, reject) => {
                meinBankAPI.post('authenticate/login', formData)
                    .then((response) => {
                        // Basic response checks
                        if (!response || response.status !== 200 || !response.data) {
                            reject('Invalid response from server.');
                            return;
                        }
                        if (response.status === 401) {
                            reject('Invalid credentials.');
                            return;
                        }
                        if (response.status === 403) {
                            reject('User not active.');
                            return;
                        }
                        if (response.status === 500) {
                            reject('User no longer active.');
                            return;
                        }

                        const data = response.data;

                        if (!data) {
                            reject('No token received.');
                            return;
                        }

                        this.jwt = data.token;//jwt
                        this.roles = data.roles;
                        this.username = data.username;
                        this.email = data.email;
                        this.id = data.id;

                        localStorage.setItem('jwt', this.jwt);
                        localStorage.setItem('roles', JSON.stringify(this.roles));
                        localStorage.setItem('username', this.username);
                        localStorage.setItem('email', this.email);
                        localStorage.setItem('id', this.id);

                        meinBankAPI.defaults.headers.common['Authorization'] = 'Bearer ' + this.jwt;

                        // Resolve the promise
                        resolve(true);
                    })
                    .catch(error => {
                        // Reject the promise with the error message
                        reject((error.response.data.message ?? "Something unexpected happened while trying to log in! Please refresh..."));
                    });
            });
        },
        logout() {

            this.jwt = '';
            this.id = 0;
            this.roles = '';
            this.username = '';
            this.email = '';

            localStorage.removeItem('jwt');
            localStorage.removeItem('id');
            localStorage.removeItem('roles');
            localStorage.removeItem('username');
            localStorage.removeItem('email');

            localStorage.clear();

            meinBankAPI.defaults.headers.common['Authorization'] = '';
        }
    },
    created() {
        this.autoLogin();
    },
});

