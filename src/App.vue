<script>
import Navigation from './components/navigation/Navigation.vue'
import Footer from './components/navigation/Footer.vue'
import { userAuthStore } from './stores/auth-store';

export default {
  name: "App",
  setup() {
    const store = userAuthStore();
    store.autoLogin();
    return {
      store: userAuthStore()
    }
  },
  components: {
    Navigation,
    Footer
  },
  mounted() {
    this.store.autoLogin();
    // console.log(this.store);
  },
};
</script>

<template>
  <main>
    <Navigation />
    <router-view></router-view>"
    <Footer />"
  </main>
</template>

<style scoped>
/* Add your scoped styles here */
</style>
