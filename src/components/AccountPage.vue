<template>
    <body>
        <div id="overview-container">
            <div class="left position-relative">
                <div class="row align-items-center">
                    <div class="col-auto">
                        <h1>Account Summary</h1>
                    </div>
                    <div class="col">
                        <h5>Your remaining daylimit: {{
                            this.currentUser.remainingDayLimit
                        }}</h5>
                        <h5>Your transaction limit: {{
                            this.currentUser.transactionLimit
                        }}</h5>
                        <h5 v-if="!this.userRoles.includes(roles.EMPLOYEE)">Accounts total: €{{
                            totalAccountBalance.toFixed(2) }}</h5>
                    </div>
                    <div class="col-auto">
                        <button @click="openAccountModal">+ Add account</button>
                        <Modal ref="createAccountModal">
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
                                    <label for="createAccountUserId">User ID<span
                                            v-if="!this.selectedAccount.username == this.userUsername"> (own
                                            will be used when not included)</span></label>
                                    <input v-if="this.selectedAccount.username == this.userUsername" type="number"
                                        class="form-control" id="createAccountUserId" v-model="newAccount.customerId"
                                        disabled>
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
                    <div class="card" v-for="account in currentAccounts" :key="account.id" @click="handleCardClick(account)"
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
                                <div class="row">
                                    <button id="accountButtons" @click.stop="this.$refs.deleteAccountModal.open()"
                                        :disabled="selectedAccount.iban != account.iban">Delete account</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <h2>Savings Accounts</h2>
                    <div class="card" v-for="account in savingsAccounts" :key="account.id" @click="handleCardClick(account)"
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
                                <div class="row">
                                    <button id="accountButtons" @click.stop="this.$refs.deleteAccountModal.open()"
                                        :disabled="selectedAccount.iban != account.iban">Delete account</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="position-absolute bottom-0 start-0">
                    <label class="mx-2" for="currentAccountPage">Page: </label>
                    <input v-model="currentAccountPage" class="col-3" min="1" type="number" id="currentAccountPage">
                </div>
            </div>
            <div class="right position-relative">
                <div class="row align-items-center mb-1">
                    <div class="col">
                        <h1>Transaction History</h1>
                    </div>
                    <div class="col-auto">
                        <button v-if="this.userRoles.includes(roles.EMPLOYEE)" class="me-2" @click="openATMModal">+ Use Mock ATM</button>
                        <Modal ref="atmModal">
                            <h1>Use Mock ATM</h1>
                            <form @submit.prevent>
                                <div class="atm border border-5 border-dark rounded-4 mb-3 bg-secondary position-relative d-flex">
                                    <div class="border border-dark bg-primary atm-screen mx-auto align-self-center text-center text-light p-2">
                                        <h1 class="mb-3">Mein Bank Mock ATM</h1>
                                        <div class="form-group my-4">
                                            <label class="fs-3" for="createATMRequestAccount">Account</label>
                                            <input v-if="selectedAccount.iban" type="text" required class="form-control"
                                                id="createATMRequestAccount" :v-model="this.atmRequest.accountIban"
                                                :placeholder="selectedAccount.iban" disabled>
                                            <input v-else type="text" required class="form-control"
                                                id="createATMRequestAccount" :v-model="this.atmRequest.accountIban"
                                                placeholder="Account IBAN">
                                        </div>
                                        <div class="form-group my-4">
                                            <label class="fs-3" for="createATMRequestAmount">Amount</label>
                                            <input type="number" required class="form-control" id="createATMRequestAmount"
                                                v-model="this.atmRequest.amount" min="0" step=".01" placeholder="0">
                                        </div>
                                        <div class="mt-5">
                                            <button type="submit" class="btn btn-success me-4" @click="createDeposit">Deposit</button>
                                            <button type="submit" class="btn btn-danger ms-4" @click="createWithdrawal">Withdraw</button>
                                        </div>
                                    </div>
                                </div>
                                <div class="alert alert-success mt-3" role="alert" v-if="success">
                                    {{ this.success }}
                                </div>
                                <div class="alert alert-danger mt-3" role="alert" v-if="error">
                                    {{ this.error }}
                                </div>
                            </form>
                        </Modal>
                        <button @click="openTransactionModal">+ Create transaction</button>
                        <Modal ref="transactionModal">
                            <h1>Create new transaction</h1>
                            <form @submit.prevent="createTransaction">
                                <div class="form-group">
                                    <label for="createTransactionAmount">Amount</label>
                                    <input type="number" required class="form-control" id="createTransactionAmount"
                                        v-model="this.newTransaction.amount" min="0" step=".01">
                                </div>
                                <div class="form-group">
                                    <label for="createTransactionAccountFrom">Account From</label>
                                    <input v-if="selectedAccount.iban" type="text" required class="form-control"
                                        id="createTransactionAccountFrom" :v-model="this.newTransaction.accountFromIban"
                                        :placeholder="selectedAccount.iban" disabled>
                                    <input v-else type="text" required class="form-control"
                                        id="createTransactionAccountFrom" :v-model="this.newTransaction.accountFromIban"
                                        placeholder="iban from">
                                </div>
                                <div class="form-group">
                                    <label for="createTransactionAccountTo">Transfer To</label>
                                    <input type="text" required class="form-control" id="createTransactionAccountTo"
                                        v-model="this.newTransaction.accountToIban" placeholder="iban to">
                                </div>
                                <div class="form-group">
                                    <label for="createTransactionDescription">Description</label>
                                    <input type="text" class="form-control" id="createTransactionDescription"
                                        v-model="this.newTransaction.description">
                                </div>
                                <button type="submit" class="btn btn-primary">Submit</button>
                                <div class="alert alert-danger mt-3" role="alert" v-if="error">
                                    {{ this.error }}
                                </div>
                            </form>
                        </Modal>
                    </div>
                </div>
                <!-- <div class="row">
                    <div class="col-auto">
                        <button @click="this.$refs.depositModal.open()" v-if="selectedAccount.username == userUsername">+ Deposit</button>
                    </div>
                    <div class="col-auto">
                        <button @click="this.$refs.withdrawModal.open()" v-if="selectedAccount.username == userUsername">- Withdraw</button>
                    </div>
                </div> -->

                <form @submit.prevent="performTransactionFilter" class="row align-items-center m-0 border border-3">
                    <div class="col form-group p-1 px-3">
                        <label for="transactionFilterTimestampMin">Timestamp min:</label>
                        <input type="datetime-local" id="transactionFilterTimestampMin"
                            v-model="transactionFilters.timestampMin">
                        <label for="transactionFilterTimestampMax">Timestamp max:</label>
                        <input type="datetime-local" id="transactionFilterTimestampMax"
                            v-model="transactionFilters.timestampMax">
                    </div>
                    <div class="col form-group p-1 px-3">
                        <label for="transactionFilterIbanFrom">Account IBAN from:</label>
                        <input type="text" id="transactionFilterIbanFrom" v-model="transactionFilters.ibanFrom"
                            :placeholder="selectedAccount.iban ?? ''">
                        <label for="transactionFilterIbanTo">Account IBAN to:</label>
                        <input type="text" id="transactionFilterIbanTo" v-model="transactionFilters.ibanTo"
                            :placeholder="selectedAccount.iban ?? ''">
                    </div>
                    <div class="col form-group p-1 px-3">
                        <div class="py-4">
                            <label class="col" for="transactionFilterAmount">Amount:</label>
                            <select class="col mx-2" id="transactionFilterAmountOperator"
                                v-model="transactionFilters.amountOperator">
                                <option selected value=":">&equals;</option>
                                <option value=">">&gt;</option>
                                <option value="<">&lt;</option>
                                <option value=">:">&gt;&equals;</option>
                                <option value="<:">&lt;&equals;</option>
                            </select>
                            <input class="col-5" type="number" step=".01" id="transactionFilterAmount" placeholder="0"
                                v-model="transactionFilters.amount">
                        </div>
                        <button type="submit" class="col-12">Perform filter</button>
                    </div>
                </form>
                <table>
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Timestamp</th>
                            <th>Account from</th>
                            <th>Account to</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="row in filteredTableData" :key="row.id">
                            <td>{{ row.description }}</td>
                            <td>{{ row.transactionDate }}</td>
                            <td :title="row.accountFromUsername">{{ row.accountFromIban }}</td>
                            <td :title="row.accountToUsername" >{{ row.accountToIban }}</td>
                            <td v-if="!selectedAccount || selectedAccount.iban == ''">{{ row.amount }}</td>
                            <td v-else
                                :class="{ positive: row.accountToIban == selectedAccount.iban, negative: row.accountFromIban == selectedAccount.iban }">
                                {{ row.accountToIban == selectedAccount.iban ? '+' : '-' }}{{ row.amount }}
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="position-absolute bottom-0 start-0">
                    <label class="mx-2" for="currentTransactionsPage">Page: </label>
                    <input v-model="currentTransactionsPage" class="col-3" min="1" type="number" id="currentTransactionsPage">
                </div>
            </div>
        </div>
        <!-- <Modal ref="depositModal" id="depositModal">
            <form @submit.prevent="deposit" class="row align-items-center m-0 border border-3">
                <h2>Deposit into account <span id="atm">ATM</span></h2>
                <div class="col form-group p-1 px-3">
                    <label for="depositAmount">Amount:</label>
                    <input type="number" step=".01" id="depositAmount" v-model="this.newTransaction.amount">
                </div>
                <div class="col form-group p-1 px-3">
                    <button type="submit" class="col-12">Deposit</button>
                </div>
            </form>
        </Modal>
        <Modal ref="withdrawModal" id="withdrawModal">
            <form @submit.prevent="withdraw" class="row align-items-center m-0 border border-3">
                <h2>Withdraw from account <span id="atm">ATM</span></h2>
                <div class="col form-group p-1 px-3">
                    <label for="withdrawAmount">Amount:</label>
                    <input type="number" step=".01" id="withdrawAmount" v-model="this.newTransaction.amount">
                </div>
                <div class="col form-group p-1 px-3">
                    <button type="submit" class="col-12">Withdraw</button>
                </div>
            </form>
        </Modal> -->
        <Modal ref="deleteAccountModal" id="deleteAccountModal" title="Delete account">
            <h5 class="modal-title" id="deleteAccountModalLabel">Delete account</h5>
            Are you sure you want to delete this account? This action cannot be undone.
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="this.$refs.deleteAccountModal.close()">Close</button>
            <button type="button" class="btn btn-danger" @click="deleteAccount">Delete</button>
            <div class="alert alert-danger mt-3" role="alert" v-if="error">
                {{ this.error }}
            </div>
        </Modal>
    </body>
</template>

<script>
import { ref, computed, watch } from 'vue';
import Modal from './Modal.vue';
import meinBankAPI from '../axios-auth';
import { userAuthStore } from '../stores/auth-store';
import '../assets/accountPage.css';
import roles from '../js/roles.js';
import accountType from '../js/accountType';

export default {
    name: "AccountPage",
    components: {
        Modal,
    },

    data() {
        return {
            accounts: [],
            tableData: [],
            foundAccounts: [],
            selectedAccount: {},
            accountUser: {},
            currentUser: {},
            newAccount: {},
            newTransaction: {
                amount: null,
                accountFromIban: '',
                accountToIban: '',
                description: ''
            },
            transactionFilters: {
                timestampMin: '',
                timestampMax: '',
                ibanFrom: '',
                ibanTo: '',
                amount: null,
                amountOperator: ':'
            },
            atmRequest: {
                accountIban: '',
                amount: null
            },
            error: null,
            success: null,
            roles,
            accountType,
            currentAccountPage: 1,
            currentTransactionsPage: 1
        }
    },
    watch: {
        'currentAccountPage'(newVal) {
            if (!newVal || newVal < 1) {
                this.currentAccountPage = 1;
            }
            this.getAccounts();
        },
        'currentTransactionsPage'(newVal) {
            if (!newVal || newVal < 1) {
                this.currentTransactionsPage = 1;
            }

            if (!this.selectedAccount || !this.selectedAccount.iban) {
                this.getTransactions(this.transactionFilter)
            } else {
                this.getTransactionsOfAccount(this.transactionFilter);
            }
        },
        'selectedAccount'(newVal) {
            if (newVal && newVal.iban) {
                this.newTransaction.accountFromIban = newVal.iban;
                this.atmRequest.accountIban = newVal.iban;
            } else {
                this.newTransaction.accountFromIban = null;
                this.atmRequest.accountIban = null;
            }
        },
        'newTransaction.amount'(val) {
            if (val < 0) {
                this.newTransaction.amount = 0;
            }
        },
        'newAccount.customerId'(val) {
            if (val < 0) {
                this.newAccount.customerId = 0;
            }
        },
    },
    setup() {
        const store = userAuthStore();
        const userRoles = computed(() => store.roles);
        const userId = computed(() => store.id);
        const userUsername = computed(() => store.username);
        return {
            store,
            userRoles,
            userId,
            userUsername
        }
    },

    async created() {
        await this.getAccounts();
        this.getTransactions();
        this.getCurrentUser();
    },

    computed: {
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
        filteredTableData() {
            return this.tableData;
        },
        transactionFilter() {
            return (this.transactionFilters.timestampMin ? ("timestamp>:\'" + this.transactionFilters.timestampMin + "\',") : "") +
                (this.transactionFilters.timestampMax ? ("timestamp<:\'" + this.transactionFilters.timestampMax + "\',") : "") +
                (this.transactionFilters.ibanFrom ? ("accountFrom.iban:\'" + this.transactionFilters.ibanFrom + "\',") : "") +
                (this.transactionFilters.ibanTo ? ("accountTo.iban>:\'" + this.transactionFilters.ibanTo + "\',") : "") +
                (this.transactionFilters.amount && this.transactionFilters.amountOperator ? ("amount" + this.transactionFilters.amountOperator + "\'" + this.transactionFilters.amount + "\'") : "");
        }
    },

    methods: {

        openAccountModal() {
            this.$refs.createAccountModal.open();
        },
        openTransactionModal() {
            this.$refs.transactionModal.open();
        },
        openATMModal() {
            this.$refs.atmModal.open();
        },

        async getAccounts() {
            let url = "";
            if (this.userRoles.includes(roles.EMPLOYEE)) {
                url = ('accounts?page=' + (this.currentAccountPage - 1));
            } else if (this.userRoles.includes(roles.CUSTOMER)) {
                url = ('users/' + this.userId + '/accounts');
            } else {
                this.error = "Please contact your server administrator about your account!";
                return;
            }

            try {
                const response = await meinBankAPI.get(url);

                this.accounts = response.data.map(account => ({
                    id: account.id,
                    iban: account.iban,
                    accountType: account.accountType,
                    balance: account.balance,
                    username: account.username,
                    absoluteLimit: account.absoluteLimit,
                }));
            } catch (error) {
                this.error = (error.response.data.message ?? "Something unexpected happened while trying to load the accounts! Please refresh...");
            }
        },
        getCurrentUser() {
            meinBankAPI.get('users/' + this.userId)
            .then(response => {
                // console.log(response.data)
                const user = response.data;
                this.currentUser = {
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
                };
            })
            .catch(error => {
                this.error = (error.response.data.message ?? "Something unexpected happened while trying to load the current user! Please refresh...");
            });
        },
        createAccount() {
            this.error = null;
            const newAccount = this.newAccount;
            
            if (newAccount.accountType == null) {
                this.error = "Please fill all required fields!";
                return;
            }
            
            newAccount.customerId = (newAccount.customerId == null ? parseInt(this.store.id) : newAccount.customerId);

            meinBankAPI.post('accounts', newAccount)
                .then(response => {
                    // console.log(response.data)
                    this.accounts.push(response.data);
                    this.$refs.createAccountModal.close();
                })
                .catch(error => {
                    this.error = (error.response.data.message ?? "Something unexpected happened while trying to create an account! Please refresh...");
                });
            this.getAccounts();
        },
        deleteAccount() {
            this.error = null;
            const account = this.selectedAccount;

            meinBankAPI.delete('accounts/' + account.iban)
                .then(response => {
                    // console.log(response.data)
                    this.getAccounts();
                    this.$refs.deleteAccountModal.close();
                })
                .catch(error => {
                    this.error = (error.response.data.message ?? "Something unexpected happened while trying to delete an account! Please refresh...");
                });
        },
        performTransactionFilter() {
            if (!this.selectedAccount || !this.selectedAccount.iban) {
                this.getTransactions(this.transactionFilter)
            } else {
                this.getTransactionsOfAccount(this.transactionFilter);
            }
        },
        async getTransactions(filter = "") {
            if (this.userRoles.includes(roles.EMPLOYEE)) {
                meinBankAPI.get(('transactions?filter=' + filter + '&page=' + (this.currentTransactionsPage - 1)))
                .then(response => {
                    // console.log(response.data)
                    this.tableData = response.data.map(transaction => ({
                        id: transaction.id,
                        description: transaction.description,
                        amount: transaction.amount,
                        transactionDate: new Date(transaction.timestamp).toLocaleString(),
                        accountFromUsername: transaction.accountFromUsername,
                        accountFromIban: transaction.accountFromIban,
                        accountToUsername: transaction.accountToUsername,
                        accountToIban: transaction.accountToIban,
                    }));
                })
                .catch(error => {
                    this.error = (error.response.data.message ?? "Something went wrong while trying to load the transactions! Please refresh...");
                });
            } else if (this.userRoles.includes(roles.CUSTOMER)) {
                for (const account of this.accounts) {
                    try {
                        const response = await meinBankAPI.get('accounts/' + account.iban + '/transactions?filter=' + filter + '&page=' + (this.currentTransactionsPage - 1));
                        
                        const transactions = response.data.map(transaction => ({
                            id: transaction.id,
                            description: transaction.description,
                            amount: transaction.amount,
                            transactionDate: new Date(transaction.timestamp).toLocaleString(),
                            accountFromUsername: transaction.accountFromUsername,
                            accountFromIban: transaction.accountFromIban,
                            accountToUsername: transaction.accountToUsername,
                            accountToIban: transaction.accountToIban,
                        }));
                        
                        this.tableData.push(...transactions);
                    } catch (error) {
                        this.error = (error.response.data.message ?? "Something went wrong while trying to load the transactions! Please refresh...");
                        break;
                    }
                }
            } else {
                this.error = "Please contact your server administrator about your account!";
                return;
            }
        },
        getTransactionsOfAccount(filter = "") {
            meinBankAPI.get(('accounts/' + this.selectedAccount.iban + '/transactions?filter=' + filter + '&page=' + (this.currentTransactionsPage - 1)))
                .then(response => {
                    // console.log(response.data)
                    this.tableData = response.data.map(transaction => ({
                        id: transaction.id,
                        description: transaction.description,
                        amount: transaction.amount,
                        transactionDate: new Date(transaction.timestamp).toLocaleString(),
                        accountFromUsername: transaction.accountFromUsername,
                        accountFromIban: transaction.accountFromIban,
                        accountToUsername: transaction.accountToUsername,
                        accountToIban: transaction.accountToIban,
                    }));
                })
                .catch(error => {
                    this.error = (error.response.data.message ?? "Something went wrong while trying to load the transactions of an account! Please refresh...");
                });
        },
        createTransaction() {
            this.error = null;

            if (!this.newTransaction.amount || !this.newTransaction.accountFromIban || !this.newTransaction.accountFromIban.trim() || !this.newTransaction.accountToIban || !this.newTransaction.accountToIban.trim()) {
                this.error = "Please fill all fields!";
            } else if (this.newTransaction.amount <= 0) {
                this.error = "Amount cannot be lower or equal to zero!";
            }

            meinBankAPI.post('transactions', this.newTransaction)
                .then(response => {
                    // console.log(response);
                    this.tableData.push(response.data);
                    this.getCurrentUser();
                    this.getAccounts();
                    this.getTransactionsOfAccount();
                    this.$refs.transactionModal.close();
                })
                .catch(error => {
                    this.error = (error.response.data.message ?? "Something unexpected happened while trying to create a transaction! Please refresh...");
                });
        },
        handleCardClick(account) {
            if (this.selectedAccount.iban == account.iban) {
                this.selectedAccount = {
                    id: 0,
                    accountType: null,
                    balance: 0,
                    iban: '',
                    username: '',
                    absoluteLimit: 0,
                };
                this.newAccount.customerId = null;
                this.getTransactions();
            } else {
                this.selectedAccount = account;
                this.getTransactionsOfAccount();
                this.getCurrentUser();
            }
            if (this.selectedAccount.username == this.userUsername) {
                this.newAccount.customerId = this.userId;
            }

        },
        createDeposit() {
            this.success = null;
            this.error = null;

            if (!this.atmRequest.accountIban || !this.atmRequest.accountIban.trim() || !this.atmRequest.amount || this.atmRequest.amount <= 0) {
                this.error = "Please fill all fields with the appropriate values";
                return;
            }

            meinBankAPI.post('atm/deposit', this.atmRequest)
                .then(response => {
                    // console.log(response);
                    this.success = `Successfully deposited €${response.data.amount}!`;
                    this.getAccounts();
                    this.getTransactionsOfAccount();
                })
                .catch(error => {
                    this.error = (error.response.data.message ?? "Something unexpected happened while trying to make a deposit! Please refresh...");
                });
        },
        createWithdrawal() {
            this.success = null;
            this.error = null;

            if (!this.atmRequest.accountIban || !this.atmRequest.accountIban.trim() || !this.atmRequest.amount || this.atmRequest.amount <= 0) {
                this.error = "Please fill all fields with the appropriate values";
                return;
            }

            meinBankAPI.post('atm/withdraw', this.atmRequest)
                .then(response => {
                    this.success = `Successfully withdrawn €${response.data.amount}!`;
                    this.getAccounts();
                    this.getTransactionsOfAccount();
                })
                .catch(error => {
                    this.error = (error.response.data.message ?? "Something unexpected happened while trying to make a withdrawal! Please refresh...");
                });
        }
    },
};
</script>

<style>
.form-group {
    margin-bottom: 12px;
}

.atm {
    height: 500px;
}

.atm-screen {
    height: 400px;
    width: 800px;
}
</style>