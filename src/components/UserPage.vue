<template>
    <body>
        <div id="overview-container">
            <div class="left position-relative">
                <div class="row align-items-center m-0 mb-1">
                    <div class="col">
                        <h1>User Summary</h1>
                    </div>
                    <div class="col-auto">
                        <button @click="this.addUserModal.open()">+ Add user</button>
                        <Modal ref="addUserModal" id="addUserModal">
                            <h1>Add new user</h1>
                            <form @submit.prevent="createNewUser">
                                <div class="row g-3" id="registerRow">
                                    <div class="col-md-6">
                                        <label for="addUserFirstName" class="form-label">First name</label>
                                        <input v-model="newUser.firstName" type="text" class="form-control"
                                            id="addUserFirstName" placeholder="first name">
                                    </div>
                                    <div class="col-md-6">
                                        <label for="addUserLastName" class="form-label">Last name</label>
                                        <input v-model="newUser.lastName" type="text" class="form-control"
                                            id="addUserLastName" placeholder="Last name">
                                    </div>
                                    <div class="col-12">
                                        <label for="addUserEmail" class="form-label">Email</label>
                                        <input v-model="newUser.email" type="text" class="form-control" id="addUserEmail"
                                            placeholder="example@email.com">
                                    </div>
                                    <div class="col-md-6">
                                        <label for="addUserPhoneNumber" class="form-label">Phonenumber</label>
                                        <input v-model="newUser.phoneNumber" type="number" class="form-control"
                                            id="addUserPhoneNumber" placeholder="0612344566">
                                    </div>
                                    <div class="col-md-6">
                                        <label for="addUserBirthDate" class="form-label">Birthdate</label>
                                        <input v-model="newUser.birthdate" type="date" :max="maxDate" class="form-control"
                                            id="addUserBirthDate">
                                    </div>
                                    <div class="col-12">
                                        <label for="addUserUsername"
                                            class="form-label">Username</label><!--OF GEWOON USERNAME MAKEN?-->
                                        <input v-model="newUser.username" type="text" class="form-control"
                                            id="addUserUsername" placeholder="helloWorld">
                                    </div>
                                    <div class="col-md-6">
                                        <label for="addUserRole" class="form-label">User role</label>
                                        <select v-model="newUser.roles" class="form-control" id="addUserRole" multiple>
                                            <option value='0'>Employee</option>
                                            <option value='1'>Customer</option>
                                        </select>
                                        <!-- <p>Selected roles: {{ '[' + (newUser.roles ? newUser.roles.join(', ') : " ") + ']'
                                        }}</p> -->
                                    </div>
                                    <div class="col-6">
                                        <div class="row-auto">
                                            <label for="addUserTransactionlimit" class="form-label">Transactionlimit</label>
                                            <input v-model="newUser.transactionLimit" type="number"
                                                id="addUserTransactionlimit" class="form-control">
                                        </div>
                                        <div class="row-auto">
                                            <label for="addUserDayLimit" class="form-label">Daylimit</label>
                                            <input v-model="newUser.dayLimit" type="number" id="addUserDayLimit"
                                                class="form-control">
                                        </div>
                                    </div>
                                    <div class="col-12">
                                        <label for="addUserPassword" class="form-label">Password</label>
                                        <input v-model="newUser.password" type="password" id="addUserPassword"
                                            class="form-control" aria-labelledby="passwordHelpBlock">
                                        <div id="passwordHelpBlock" class="form-text">
                                            Your password must be 8-20 characters long, contain letters and numbers, and
                                            must not contain
                                            spaces, special characters, or emoji.
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" class="btn btn-primary">Submit</button>
                                <div class="alert alert-danger mt-3" role="alert" v-if="error">
                                    {{ this.error }}
                                </div>
                            </form>
                        </Modal>
                    </div>
                    <form @submit.prevent="performUserFilter" class="row align-items-center m-0 border border-3">
                        <div class="col form-group p-1 px-3">
                            <label for="userFilterUsername">Username:</label>
                            <input type="text" id="userFilterUsername" v-model="userFilters.username" placeholder="johndoe">
                        </div>
                        <div class="col form-group p-1 px-3">
                            <label for="userFilterHasAccount">Has account:</label>
                            <select class="col-md-10" id="userFilterHasAccount" v-model="userFilters.hasAccount">
                                <option selected value="">All</option>
                                <option value="false">No account</option>
                                <option value="true">Has account</option>
                            </select>
                        </div>
                        <div class="col form-group p-1 px-3">
                            <label for="userFilterIsDeleted">Is deleted:</label>
                            <input class="m-2" type="checkbox" id="userFilterIsDeleted" v-model="userFilters.isDeleted"
                                value="false">
                        </div>
                        <div class="col form-group p-1 px-3 mb-0">
                            <button type="submit" class="col-12">Perform filter</button>
                        </div>
                    </form>
                </div>
                <div class="card-box">
                    <h2>Customer</h2>
                    <div class="card" v-for="user in customerUser" :key="user.id" @click="handleUserCardClick(user)"
                        :class="{ 'selected': selectedUser && selectedUser.id === user.id }">
                        <div class="card-body">
                            <div class="user-info">
                                <div class="row">
                                    <div class="col" id="userCardLeft">
                                        <p>Username: <strong>{{ user.username }}</strong></p>
                                        <p>Full name: <strong>{{ user.firstName }} {{ user.lastName }}</strong></p>
                                        <p>Email: <strong>{{ user.email }}</strong></p>
                                    </div>
                                    <div class="col" id="userCardRight">
                                        <p>Phone number: <strong>{{ user.phoneNumber }}</strong></p>
                                        <p>Birthdate: <strong>{{ user.birthdate }}</strong></p>
                                        <div class="row">
                                            <button @click.stop="this.updateUserModal.open()"
                                                :disabled="selectedUser.id != user.id">Update user</button>
                                            <button @click.stop="this.deleteUserModal.open()"
                                                :disabled="selectedUser.id != user.id">Delete user</button>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <h2>Employee</h2>
                    <div class="card" v-for="user in employeeUser" :key="user.id" @click="handleUserCardClick(user)"
                        :class="{ 'selected': selectedUser && selectedUser.id === user.id }">
                        <div class="card-body">
                            <div class="user-info">
                                <div class="row">
                                    <div class="col" id="userCardLeft">
                                        <p>Username: <strong>{{ user.username }}</strong></p>
                                        <p>Full name: <strong>{{ user.firstName }} {{ user.lastName }}</strong></p>
                                        <p>Email: <strong>{{ user.email }}</strong></p>
                                    </div>
                                    <div class="col" id="userCardRight">
                                        <p>Phone number: <strong>{{ user.phoneNumber }}</strong></p>
                                        <p>Birthdate: <strong>{{ user.birthdate }}</strong></p>
                                        <div class="row">
                                            <button @click.stop="this.updateUserModal.open()"
                                                :disabled="selectedUser.id != user.id">Update user</button>
                                            <button @click.stop="this.deleteUserModal.open()"
                                                :disabled="selectedUser.id != user.id">Delete user</button>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="position-absolute bottom-0 start-0">
                    <label class="mx-2" for="currentUserPage">Page: </label>
                    <input v-model="currentUserPage" class="col-3" min="1" type="number" id="currentUserPage">
                </div>
            </div>

            <div class="right position-relative">
                <div class="row align-items-center">
                    <div class="col-auto">
                        <h1>Accounts</h1>
                    </div>
                    <div v-if="this.selectedUser.id" class="col">
                        <h5>Remaining daylimit: €{{ selectedUser.remainingDayLimit }}</h5>
                        <h5>Transaction limit: €{{ selectedUser.transactionLimit }}</h5>
                        <h5>Accounts total: €{{ totalAccountBalance.toFixed(2) }}</h5>
                    </div>
                    <div class="col-auto">
                        <button @click="this.createAccountModal.open()">+ Add account</button>
                        <Modal ref="createAccountModal" id="createAccountModal">
                            <h1>Create new account</h1>
                            <form @submit.prevent="createAccount">
                                <div class="form-group">
                                    <label for="createAccountType">Account type*</label>
                                    <select v-model="newAccount.accountType" class="form-control" id="createAccountType"
                                        placeholder="1">
                                        <option v-for="(value, name) in accountType" :value="value">
                                            {{ name }}
                                        </option>
                                    </select>
                                </div>
                                <div class="form-group" v-if="this.userRoles.includes(this.roles.EMPLOYEE)">
                                    <label for="createAccountUserId">User ID<span v-if="!this.selectedUser.id"> (own
                                            will be used when not included)</span></label>
                                    <input v-if="this.selectedUser.id" type="number" class="form-control"
                                        id="createAccountUserId" v-model="newAccount.customerId" disabled>
                                    <input v-else type="number" class="form-control" id="createAccountUserId"
                                        v-model="newAccount.customerId" :placeholder="store.id + ''" min="1">
                                </div>
                                <div class="form-group" v-if="this.userRoles.includes(this.roles.EMPLOYEE)">
                                    <label for="createAccountAbsoluteLimit">Absolute limit</label>
                                    <input type="number" class="form-control" id="createAccountAbsoluteLimit"
                                        v-model="newAccount.absoluteLimit" placeholder="0">
                                </div>
                                <button type="submit" class="btn btn-primary">Submit</button>
                                <div class="alert alert-danger mt-3" role="alert" v-if="error">
                                    {{ this.error }}
                                </div>
                            </form>
                        </Modal>
                    </div>
                </div>
                <div class="card-box">
                    <h2>Current Accounts</h2>
                    <div class="card" v-for="account in currentAccounts" :key="account.id"
                        @click="handleAccountCardClick(account)"
                        :class="{ 'selected': selectedAccount && selectedAccount.iban === account.iban }">

                        <div class="card-body">
                            <div class="account-info">
                                <!-- {{ account.user.lastName }} -->
                                <p>Name: {{ account.username }}</p>
                                <p>Iban: {{ account.iban }}</p>
                                <p>Absolute limit: {{ account.absoluteLimit }}</p>
                            </div>
                            <div class="account-balance">
                                <h2>€{{ account.balance }}</h2>
                            </div>
                            <div class="row">
                                <button id="accountButtons" @click.stop="this.updateAccountModal.open()"
                                    :disabled="selectedAccount.iban != account.iban">Update account</button>
                                <button id="accountButtons" @click.stop="this.deleteAccountModal.open()"
                                    :disabled="selectedAccount.iban != account.iban">Delete account</button>
                            </div>
                        </div>
                    </div>

                    <h2>Savings Accounts</h2>
                    <div class="card" v-for="account in savingsAccounts" :key="account.id"
                        @click="handleAccountCardClick(account)"
                        :class="{ 'selected': selectedAccount && selectedAccount.iban === account.iban }">
                        <div class="card-body">
                            <div class="account-info">
                                <!-- {{ account.user.lastName }} -->
                                <p>Name: {{ account.username }}</p>
                                <p>Iban: {{ account.iban }}</p>
                                <p>Absolute limit: {{ account.absoluteLimit }}</p>
                            </div>
                            <div class="account-balance">
                                <h2>€{{ account.balance }}</h2>
                            </div>
                            <div class="row">
                                <button id="accountButtons" @click.stop="this.updateAccountModal.open()"
                                    :disabled="selectedAccount.iban != account.iban">Update account</button>
                                <button id="accountButtons" @click.stop="this.deleteAccountModal.open()"
                                    :disabled="selectedAccount.iban != account.iban">Delete account</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="position-absolute bottom-0 start-0">
                    <label class="mx-2" for="currentAccountPage">Page: </label>
                    <input v-model="currentAccountPage" class="col-3" min="1" type="number" id="currentAccountPage">
                </div>
            </div>
        </div>
        <Modal ref="updateUserModal" id="updateUserModal">
            <form @submit.prevent="updateUser">
                <div class="row g-3" id="registerRow">
                    <div class="col-md-6">
                        <label for="inputFirstName" class="form-label">First name</label>
                        <input v-model="selectedUser.firstName" type="text" class="form-control" id="inputFirstName"
                            placeholder="first name">
                    </div>
                    <div class="col-md-6">
                        <label for="inputLastName" class="form-label">Last name</label>
                        <input v-model="selectedUser.lastName" type="text" class="form-control" id="inputLastName"
                            placeholder="Last name">
                    </div>
                    <div class="col-12">
                        <label for="inputEmail" class="form-label">Email</label>
                        <input v-model="selectedUser.email" type="text" class="form-control" id="inputEmail"
                            placeholder="example@email.com">
                    </div>
                    <div class="col-md-6">
                        <label for="inputPhoneNumber" class="form-label">Phonenumber</label>
                        <input v-model="selectedUser.phoneNumber" type="number" class="form-control" id="inputPhoneNumber"
                            placeholder="0612344566">
                    </div>
                    <div class="col-md-6">
                        <label for="inputBirthDate" class="form-label">Birthdate</label>
                        <input v-model="selectedUser.birthdate" type="date" :max="maxDate" class="form-control"
                            id="inputBirthDate">
                    </div>
                    <div class="col-12">
                        <label for="inputUsername" class="form-label">Username</label><!--OF GEWOON USERNAME MAKEN?-->
                        <input v-model="selectedUser.username" type="text" class="form-control" id="inputUsername"
                            placeholder="helloWorld">
                    </div>
                    <div class="col-md-6">
                        <label for="inputRole" class="form-label">User role</label>
                        <select v-model="selectedUser.roles" class="form-control h-75" id="inputRole" multiple>
                            <option value='0'>Employee</option>
                            <option value='1'>Customer</option>
                        </select>
                        <!-- <p>Selected roles: {{ '[' + selectedUser.roles.join(', ') + ']' }}</p> -->
                    </div>
                    <div class="col-md-6">
                        <label for="inputDayLimit" class="form-label">Day limit</label>
                        <input v-model="selectedUser.dayLimit" type="number" class="form-control" id="inputDayLimit"
                            placeholder="€1000">
                        <label for="inputTransactionLimit" class="form-label mt-2">Transaction limit</label>
                        <input v-model="selectedUser.transactionLimit" type="number" class="form-control" id="inputTransactionLimit"
                            placeholder="€1000">
                    </div>
                    <div class="col-12">
                        <label for="inputPassword" class="form-label">Password</label>
                        <input v-model="selectedUser.password" type="password" id="inputPassword" class="form-control"
                            aria-labelledby="passwordHelpBlock" placeholder="If not entered you keep the old password">
                        <div id="passwordHelpBlock" class="form-text">
                            Your password must be 8-20 characters long, contain letters and numbers, and
                            must not contain
                            spaces, special characters, or emoji.
                        </div>
                    </div>
                </div>
                <button type="submit" class="btn btn-primary">Submit</button>
                <div class="alert alert-danger mt-3" role="alert" v-if="error">
                    {{ this.error }}
                </div>
            </form>
        </Modal>

        <Modal ref="deleteUserModal" id="deleteUserModal" title="Delete User">
            <h5 class="modal-title" id="deleteUserModalLabel">Delete User</h5>
            Are you sure you want to delete this user? This action cannot be undone.
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
                @click="this.$refs.deleteUserModal.close()">Close</button>
            <button type="button" class="btn btn-danger" @click="deleteUser">Delete</button>
            <div class="alert alert-danger mt-3" role="alert" v-if="error">
                {{ this.error }}
            </div>
        </Modal>

        <Modal ref="updateAccountModal" id="updateAccountModal" title="Update account">
            <form @submit.prevent="updateAccount">
                <div class="form-group">
                    <label for="updateAccountUserId">User Id</label>
                    <input type="number" class="form-control" id="updateAccountUserId"
                        v-model="this.selectedAccount.customerId">
                </div>
                <div class="form-group">
                    <label for="updateAccountType">Account type*</label>
                    <select v-model="selectedAccount.accountType" class="form-control" id="updateAccountType"
                        placeholder="1">
                        <option v-for="(value, name) in accountType" :value="value">
                            {{ name }}
                        </option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="updateAccountAbsoluteLimit">Absolute limit</label>
                    <input type="number" class="form-control" id="updateAccountAbsoluteLimit"
                        v-model="selectedAccount.absoluteLimit">
                </div>
                <button type="submit" class="btn btn-primary">Submit</button>
                <div class="alert alert-danger mt-3" role="alert" v-if="error">
                    {{ this.error }}
                </div>
            </form>
        </Modal>
        <Modal ref="deleteAccountModal" id="deleteAccountModal" title="Delete account">
            <h5 class="modal-title" id="deleteAccountModalLabel">Delete account</h5>
            Are you sure you want to delete this account? This action cannot be undone.
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
                @click="this.$refs.deleteAccountModal.close()">Close</button>
            <button type="button" class="btn btn-danger" @click="deleteAccount">Delete</button>
            <div class="alert alert-danger mt-3" role="alert" v-if="error">
                {{ this.error }}
            </div>
        </Modal>

    </body>
</template>

<script>
import axios from 'axios';
import Modal from './Modal.vue';
import { userAuthStore } from '../stores/auth-store';
import { ref, computed, onMounted, nextTick } from 'vue';
import roles from '../js/roles.js';
import accountType from '../js/accountType';
import meinBankAPI from '../axios-auth';
import '../assets/userPage.css'
// import { handle } from 'express/lib/application';

export default {
    name: "userPage",
    components: {
        Modal,
    },

    // inject: ['openModal'],

    data() {
        return {
            error: null,
            users: [],
            accounts: [],
            roles: roles,
            accountType: accountType,
            // tableData: [],

            newUser: {
                roles: [],
                username: null,
                password: null,
                firstName: null,
                lastName: null,
                email: null,
                phoneNumber: null,
                birthdate: null,
            },

            selectedUser: {
                id: null,  // User's unique identifier
                firstName: null,  // User's first name
                lastName: null,  // User's last name
                email: null,  // User's email
                phoneNumber: null,  // User's phone number
                birthdate: null,  // User's birthdate
                roles: [],  // This is an array holding the roles assigned to the user, initially empty
                username: null,  // User's username
                password: "",  // User's password
                dayLimit: null,  // User's daily limit
                remainingDayLimit: null, // User's remaining day limit
                transactionLimit: null
            },
            selectedAccount: {},

            userFilters: {
                username: '',
                hasAccount: '',
                isDeleted: false
            },

            newUser: {},
            newAccount: {},

            error: null,
            currentUserPage: 1,
            currentAccountPage: 1
        }
    },
    watch: {
        'currentAccountPage'(newVal) {
            if (!newVal || newVal < 1) {
                this.currentAccountPage = 1;
            }
            this.getUserAccounts();
        },
        'currentUserPage'(newVal) {
            if (!newVal || newVal < 1) {
                this.currentUserPage = 1;
            }
            this.getUsers();
        },
    },

    setup() {
        const store = userAuthStore();
        const userRoles = computed(() => store.roles);

        const addUserModal = ref(null);
        const updateUserModal = ref(null);
        const deleteUserModal = ref(null);
        const createAccountModal = ref(null);
        const updateAccountModal = ref(null);
        const deleteAccountModal = ref(null);

        return {
            store,
            userRoles,

            addUserModal,
            updateUserModal,
            deleteUserModal,
            createAccountModal,
            updateAccountModal,
            deleteAccountModal,
            // maxDate: new Date().toISOString().slice(0, 10),
        }
    },


    created() {
        this.getUsers();
    },
    mounted() {
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        let yyyy = today.getFullYear() - 18;

        today = yyyy + '-' + mm + '-' + dd;
        this.maxDate = today;
    },

    methods: {

        fieldFilled() {
            return (
                this.selectedUser.firstName &&
                this.selectedUser.lastName &&
                this.selectedUser.username &&
                this.selectedUser.email &&
                this.selectedUser.phoneNumber &&
                this.selectedUser.birthdate &&
                this.selectedUser.roles &&
                this.selectedUser.dayLimit &&
                this.selectedUser.remainingDayLimit &&
                this.selectedUser.transactionLimit
            );
        },
        newUserFields() {
            return (
                this.newUser.firstName &&
                this.newUser.lastName &&
                this.newUser.email &&
                this.newUser.phoneNumber &&
                this.newUser.birthdate &&
                this.newUser.username &&
                this.newUser.roles &&
                this.newUser.password
            );
        },
        getUserAccounts() {
            meinBankAPI.get(('users/' + this.selectedUser.id + '/accounts?page=' + (this.currentAccountPage - 1)))
                .then(response => {
                    // console.log(response.data)
                    this.accounts = response.data.map(account => ({
                        id: account.id,
                        iban: account.iban,
                        accountType: account.accountType,
                        balance: account.balance,
                        username: account.username,
                        absoluteLimit: account.absoluteLimit,

                    }));
                    // this.selectedUser = this.accounts[0]
                })
                .catch(error => {
                    this.error = (error.response.data.message ?? "Something went wrong while trying to load the accounts of a user! Please refresh...");
                });
        },
        createAccount() {
            this.error = null;
            const newAccount = this.newAccount;


            meinBankAPI.post('accounts', newAccount)
                .then(response => {
                    // console.log(response.data)
                    this.accounts.push(response.data);
                    this.$refs.createAccountModal.close();
                })
                .catch(error => {
                    this.error = (error.response.data.message ?? "Something unexpected happened while trying to create an account! Please refresh...");
                });
        },
        updateAccount() {
            this.error = null;
            const account = {};
            account.customerId = this.selectedAccount.customerId;
            account.absoluteLimit = this.selectedAccount.absoluteLimit;
            account.accountType = this.selectedAccount.accountType;

            // console.log(account)
            meinBankAPI.put('accounts/' + this.selectedAccount.iban, account)
                .then(response => {
                    // console.log(response.data)
                    this.$refs.updateAccountModal.close();
                })
                .catch(error => {
                    this.error = (error.response.data.message ?? "Something unexpected happened while trying to update an account! Please refresh...");
                });
            this.getUserAccounts();
        },
        deleteAccount() {
            this.error = null;
            const account = this.selectedAccount;

            meinBankAPI.delete('accounts/' + account.iban)
                .then(response => {
                    // console.log(response.data)
                    this.getUserAccounts();
                    this.$refs.deleteAccountModal.close();
                })
                .catch(error => {
                    this.error = (error.response.data.message ?? "Something unexpected happened while trying to delete an account! Please refresh...");
                });
        },
        performUserFilter() {
            this.getUsers(this.userFilter, this.userHasAccount);
        },
        getUsers(filter = "", hasAccount = "") {
            meinBankAPI.get(('users?filter=' + filter + "&hasAccount=" + hasAccount + "&page=" + (this.currentUserPage - 1)))
                .then(response => {
                    // console.log(response.data)
                    this.users = response.data.map(user => ({
                        id: user.id,
                        username: user.username,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        phoneNumber: user.phoneNumber,
                        birthdate: new Date(user.birthdate).toISOString().split('T')[0],
                        dayLimit: user.dayLimit,
                        remainingDayLimit: user.remainingDayLimit,
                        transactionLimit: user.transactionLimit,
                        roles: user.roles,
                    }));
                })
                .catch(error => {
                    this.error = (error.response.data.message ?? "Something went wrong while trying to load the users! Please refresh...");
                });
        },
        createNewUser() {
            this.error = null;
            const newUser = this.newUser;

            if (!this.newUserFields()) {
                this.error = "Please fill all fields";
                return;
            }

            meinBankAPI.post('users', newUser)
                .then(response => {
                    // console.log(response.data)
                    this.$refs.addUserModal.close();
                    this.users.push(response.data);
                })
                .catch(error => {
                    this.error = (error.response.data.message ?? "Something unexpected happened while trying to create a new user! Please refresh...");
                });
        },
        updateUser() {
            // this.$refs.createUserModal.open();
            if (!this.fieldFilled()) {
                return this.error = "Please fill all fields!";
            }
            if (!this.selectedUser.password) {
                this.selectedUser.password = "";
            }

            // console.log(this.selectedUser);
            meinBankAPI.put('users/' + this.selectedUser.id, this.selectedUser)
                .then(response => {
                    // console.log(response.data)
                    if (response.status == 200) {
                        this.getUsers();
                        this.$refs.updateUserModal.close();
                    }
                    if (response.status == 500) {
                        this.error = "Something went wrong!";
                    }
                    if (response.status == 400) {
                        this.error = "Please fill all fields!";
                    }
                    if (response.status == 409) {
                        this.error = "Username already exists!";
                    }
                })
                .catch(error => {
                    this.error = (error.response.data.message ?? "Something unexpected happened while trying to update a user! Please refresh...");
                });
        },
        deleteUser() {
            this.error = null;
            const user = this.selectedUser;

            meinBankAPI.delete('users/' + user.id)
                .then(response => {
                    // console.log(response)
                    this.users = this.users.filter(user => user.id != this.selectedUser.id);
                    this.$refs.deleteUserModal.close();
                })
                .catch(error => {
                    this.error = (error.response.data.message ?? "Something unexpected happened while trying to delete a user! Please refresh...");
                });
        },

        handleUserCardClick(user) {
            // Do something when a card is clicked
            if (this.selectedUser.id == user.id) {
                this.selectedUser = {
                    id: null,
                    username: null,
                    firstName: null,
                    lastName: null,
                    email: null,
                    phoneNumber: null,
                    birthdate: null,
                    dayLimit: null,
                    roles: null,
                };
                this.accounts = [];
                this.newAccount = [];
            } else {
                this.selectedUser = user;
                this.getUserAccounts();
                this.newAccount.customerId = user.id;
            }
        },
        handleAccountCardClick(account) {
            // Do something when a card is clicked
            if (this.selectedAccount.iban == account.iban) {
                this.selectedAccount = {
                    id: null,
                    iban: null,
                    accountType: null,
                    balance: null,
                    username: null,
                    absoluteLimit: null,
                };
                this.selectedAccount = [];
            } else {
                this.selectedAccount = account;
                this.selectedAccount.customerId = this.selectedUser.id;
            }
        }
    },
    computed: {
        isAllFieldsFilled() {
            return this.checkAllFieldsFilled(this.userData);
        },
        selectedUserRole: function () {
            // This will hold the roles in string format.
            let roles = [];
            if (this.selectedUser.roles.includes("0")) roles.push('Employee');
            if (this.selectedUser.roles.includes("1")) roles.push('Customer');
            // Join the roles array into a string, separated by a comma and a space.
            return roles.join(', ');
        },
        selectedUserRolesAsNumbers() {
            return this.selectedUser.roles.map(role => Number(role));
        },
        customerUser() {
            return this.users.filter(user => user.roles.includes(1));
        },
        employeeUser() {
            return this.users.filter(user => user.roles.includes(0));
        },
        currentAccounts() {
            return this.accounts.filter(account => account.accountType === 0);
        },
        savingsAccounts() {
            return this.accounts.filter(account => account.accountType === 1);
        },
        totalAccountBalance() {
            let currentAccountsTotal = this.currentAccounts.reduce((total, account) => total + account.balance, 0);
            let savingsAccountsTotal = this.savingsAccounts.reduce((total, account) => total + account.balance, 0);
            return currentAccountsTotal + savingsAccountsTotal;
        },
        userHasAccount() {
            return (this.userFilters.hasAccount ?? "")
        },
        userFilter() {
            return (this.userFilters.username ? ("username:\'" + this.userFilters.username + "\',") : "") +
                (this.userFilters.isDeleted ? ("isDeleted:\'" + this.userFilters.isDeleted + "\',") : "");
        }
    }
};
</script>

<style>
#registerRow {
    margin: auto;
}

#accountButtons {
    width: 140px;
}</style>