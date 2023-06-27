<template>
    <nav class="navbar navbar-expand-md navbar-dark bg-dark text-white mb-4">
        <div class="container-fluid">
            <h1>MeinBank</h1>
            <ul class="navbar-nav me-auto mb-2 mb-md-0 nav-container">
                <li class="nav-item">
                    <router-link to="/" class="nav-link" active-class="active">Home</router-link>
                </li>
                <li class="nav-item">
                    <router-link to="#" class="nav-link" active-class="active">Accounts</router-link>
                </li>
                <li class="nav-item">
                    <router-link to="#" class="nav-link" active-class="active">Our packages</router-link>
                </li>
                <li class="nav-item">
                    <router-link to="#" class="nav-link" active-class="active">Our story</router-link>
                </li>
                <li class="nav-item">
                    <router-link to="#" class="nav-link" active-class="active">Contact us</router-link>
                </li>
                <li class="nav-item">
                    <LoginModal v-if="!isAuthenticated" ref="loginModalRef" />
                    <button type="button" class="btn btn-success" v-if="!isAuthenticated" @click="openLoginModal">Login</button>
                    <router-link to="/" type="button" class="btn btn-danger" v-if="isAuthenticated"
                            @click="handleLogout">Logout</router-link>
                </li>
            </ul>
        </div>
    </nav>
    <div class="row" id="footerDetails">
        <div class="col">
            <p>© Copyright 2023 - MeinBank • All Rights Reserved</p>
        </div>
        <div class="col">
            <p>Terms of Service</p>
        </div>
        <div class="col">
            <p>Privacy Policy</p>
        </div>
    </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import LoginModal from '../Login.vue';
import { userAuthStore } from '../../stores/auth-store';

export default {
    components: {
        LoginModal,
    },
    setup() {
        const loginModalRef = ref(null);
        const store = userAuthStore();
        const router = useRouter();
        store.autoLogin();

        const isAuthenticated = computed(() => store.isAuthenticated);

        function openLoginModal() {
            loginModalRef.value.openModal();
        }

        function handleLogout() {
            store.logout(); // Modify this according to your logout implementation in the store
            router.push('/');
        }

        return {
            loginModalRef,
            openLoginModal,
            isAuthenticated,
            handleLogout,
        }
    },
};
</script>

<style>
.nav-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.nav-container .nav-item:last-child {
  margin-left: auto;
}
</style>