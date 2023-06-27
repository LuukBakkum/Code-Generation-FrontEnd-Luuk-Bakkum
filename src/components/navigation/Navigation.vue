<template>
    <div id="navbars-container">
        <nav class="navbar navbar-expand-md navbar-dark bg-orange mb-0">
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
                        <button type="button" class="btn btn-success" v-if="!isAuthenticated"
                            @click="openLoginModal">Login</button>
                        <router-link to="/" type="button" class="btn btn-danger" v-if="isAuthenticated"
                            @click="handleLogout">Logout</router-link>
                    </li>
                </ul>
            </div>
        </nav>
        <nav id="loggedInNav" class="navbar navbar-expand-md navbar-dark bg-dark text-white mb-4" v-if="isAuthenticated">
            <div class="container-fluid">
                <h2 id="welcome">Welcome <span style="font-size: 0.7em;">{{ this.store.username }}</span></h2>
                <ul class="navbar-nav me-auto mb-2 mb-md-0">
                    <li class="nav-item"><!--v-if="userRole === 'customer'"-->
                        <router-link to="/accounts" class="nav-link" active-class="active">Dashboard</router-link>
                    </li>
                    <li v-if="this.userRoles.includes('0')" class="nav-item">
                        <router-link to="/users" class="nav-link" active-class="active">Users</router-link>
                    </li>
                    <li class="nav-item"><!--v-if="userRole === 'employee'"-->
                        <router-link to="#" class="nav-link" active-class="active">Transactions</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="#" class="nav-link" active-class="active">Upgrades</router-link>
                    </li>
                </ul>
            </div>
        </nav>
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
        const userName = computed(() => store.username);
        const userRoles = computed(() => store.roles);

        function openLoginModal() {
            loginModalRef.value.openModal();
        }

        function handleLogout() {
            // console.log(isAuthenticated.value, userName.value, userRoles.value);
            store.logout();
            router.push('/');
        }

        return {
            store,
            loginModalRef,
            openLoginModal,
            isAuthenticated,
            userName,
            userRoles,
            handleLogout,
        }
    }
};
</script>

<style>
#navbars-container {
    width: 100%;
}

.bg-orange {
    background-color: orange !important;
    margin-bottom: 0 !important;
}

#loggedInNav {
    margin-top: 0 !important;
    padding-top: 0 !important;
    padding-bottom: 0 !important;
}

#welcome {
    margin-left: 10px;
    margin-right: 100px;
}

.nav-container {
    display: flex;
    justify-content: space-between;
    width: 100%;
}

.nav-container .nav-item:last-child {
    margin-left: auto;
}
</style>