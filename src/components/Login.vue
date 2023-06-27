<template>
    <Modal ref="modalRef" v-if="showModal">
        <div v-if="!isRegister">
            <h1>Login</h1>
            <div class="mb-3">
                <label for="username" class="form-label">Username</label><!--OF GEWOON USERNAME MAKEN?-->
                <input v-model="formData.username" type="text" class="form-control" id="username" placeholder="johndoe123">
                <label for="password" class="form-label">Password</label>
                <input v-model="formData.password" type="password" id="inputPassword" class="form-control"
                    aria-labelledby="passwordHelpBlock">
                <div id="passwordHelpBlock" class="form-text">
                    Your password must be 8-20 characters long, contain letters and numbers, and must not contain
                    spaces, special characters, or emoji.
                </div>
                <button type="button" class="btn btn-success btn-md btn-wide"
                    @click="() => handleLogin()">Login</button>
                Dont have an account? <a href="#" @click.prevent="isRegister = true; errorMessage = ''">Register</a>
                <div class="alert alert-danger mt-3" role="alert" v-if="errorMessage">
                    {{ this.errorMessage }}
                </div>
            </div>
        </div>
        <div v-else>
            <h1>Register</h1>
            <div class="row g-3" id="registerRow">
                <div class="col-md-6">
                    <label for="inputFirstName" class="form-label">First name</label>
                    <input v-model="registerData.firstName" type="text" class="form-control" id="inputFirstName"
                        placeholder="First name">
                </div>
                <div class="col-md-6">
                    <label for="inputLastName" class="form-label">Last name</label>
                    <input v-model="registerData.lastName" type="text" class="form-control" id="inputLastName"
                        placeholder="Last name">
                </div>
                <div class="col-12">
                    <label for="inputEmail" class="form-label">Email</label>
                    <input v-model="registerData.email" type="text" class="form-control" id="inputEmail"
                        placeholder="example@email.com">
                </div>
                <div class="col-md-6">
                    <label for="inputPhoneNumber" class="form-label">Phonenumber</label>
                    <input v-model="registerData.phoneNumber" type="number" class="form-control" id="inputPhoneNumber"
                        placeholder="06 12345678">
                </div>
                <div class="col-md-6">
                    <label for="inputBirthDate" class="form-label">Birthdate</label>
                    <input v-model="registerData.birthdate" type="date" :max="maxDate" class="form-control"
                        id="inputBirthDate">
                </div>
                <div class="col-12">
                    <label for="inputUsername" class="form-label">Username</label><!--OF GEWOON USERNAME MAKEN?-->
                    <input v-model="registerData.username" type="text" class="form-control" id="inputUsername"
                        placeholder="johndoe123">
                </div>
                <div class="col-12">
                    <label for="inputPassword" class="form-label">Password</label>
                    <input v-model="registerData.password" type="password" id="inputPassword" class="form-control"
                        aria-labelledby="passwordHelpBlock">
                    <div id="passwordHelpBlock" class="form-text">
                        Your password must be 8-20 characters long, contain letters and numbers, and must not contain
                        spaces, special characters, or emoji.
                    </div>
                </div>

            </div>
            <button type="button" class="btn btn-success btn-md btn-wide"
                @click="() => handleRegister()">Register</button>
            <div class="alert alert-danger mt-3" role="alert" v-if="errorMessage">
                {{ this.errorMessage }}
            </div>
            Already have an account? <a href="#" @click.prevent="isRegister = false; errorMessage = ''">Login</a>
        </div>
    </Modal>
</template>

<script>
import Modal from './Modal.vue';
import { ref, reactive } from 'vue';
import { userAuthStore } from '../stores/auth-store';

export default {
    name: 'Login',
    components: {
        Modal,
    },
    setup() {
        const modalRef = ref(null);
        // const formData = reactive({ username: '', password: '' });
        // const registerData = reactive({ firstName: '', lastName: '', email: '', phoneNumber: '', birthdate: '', username: '', password: '' })
        let isRegister = ref(false);
        

        function openModal() {
            modalRef.value.open();
        }

        return {
            store: userAuthStore(),
            modalRef,
            openModal,
            isRegister,
        }
    },
    data() {
        return {
            registerData: {
                username: '',
                password: '',
                firstName: '',
                lastName: '',
                email: '',
                phoneNumber: '',
                birthdate: '',
            },
            formData: {
                username: '',
                password: ''
            },
            errorMessage: '',
            maxDate: null,
            showModal: true
        }
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
        
        async handleRegister() {
            try {
                if (!this.registerData.username.trim() || !this.registerData.password.trim() || !this.registerData.firstName.trim() || !this.registerData.lastName.trim() || !this.registerData.email.trim() || !this.registerData.phoneNumber || !this.registerData.birthdate.trim()) {
                    this.errorMessage = "Please fill all fields!";
                    return;
                }
                else if (this.registerData.birthdate > this.maxDate) {
                    this.errorMessage = "You must at least 18 years of age to make a profile!";
                    return;
                }
                await this.store.register(this.registerData);
                this.showModal = false;
                this.$router.push('/');
            } catch (error) {
                this.errorMessage = (error ?? "Something unexpected happened while trying to log in! Please refresh...");
            }
        },
        async handleLogin() {
            try {
                if (!this.formData.username.trim() || !this.formData.password.trim()) {
                    this.errorMessage = "Please fill all fields!";
                    return;
                }
                await this.store.login(this.formData);
                this.showModal = false;
                this.$router.push('/');
            } catch (error) {
                this.errorMessage = (error ?? "Something unexpected happened while trying to log in! Please refresh...");
            }
        }
    }
};
</script>

<style>
#registerRow {
    margin: auto;
}
</style>