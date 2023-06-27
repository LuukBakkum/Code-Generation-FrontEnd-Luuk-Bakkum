// import { reactive } from 'vue';
// import axios from 'axios';
// // import { storeJWT } from '@/stores/auth-store.js'

// const userStatus = reactive({
//   isLoggedIn: false,
//   role: null,
//   name: null,
//   token: null,
// });

// async function handleLogin(formData) {
//   try {
//     const response = await axios.post('http://localhost:8080/authenticate/login', formData);
    
//     // Basic response checks
//     if (!response || response.status !== 200 || !response.data) {
//       throw new Error('Invalid response from server.');
//     }

//     const jwtToken = response.data;
    
//     if (!jwtToken) {
//       throw new Error('No token received.');
//     }

//     userStatus.isLoggedIn = true;
//     userStatus.role = 'customer'; // This is just an example, you'll need to get the actual role
//     userStatus.name = formData.username;
//     userStatus.token = jwtToken;

//     // storeJWT.handleLogin(userStatus.isLoggedIn,userStatus.role,userStatus.name ,jwtToken);
//   } catch (error) {
//     console.error(error);
//   }
// }

// function handleLogout() {
//   userStatus.isLoggedIn = false;
//   userStatus.role = null;
//   userStatus.name = null;
//   userStatus.token = null;
// }

// export function useUserStatus() {
//   return { userStatus, handleLogin, handleLogout };
// }