import Home from './components/Home.js';
import Login from './components/Login.js';
import Dashboard from './components/Dashboard.js';

// Catatan: Karena Anda beralih ke Local Storage, 
// axios.defaults.baseURL tidak lagi diperlukan untuk autentikasi.

const routes = [
    { path: '/', component: Home },
    { path: '/login', component: Login },
    { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } }
];

const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes
});

// Navigation Guard: Memeriksa apakah user sudah login di Local Storage
router.beforeEach((to, from, next) => {
    const isAuthenticated = localStorage.getItem('isLoggedIn') === 'true';
    
    if (to.meta.requiresAuth && !isAuthenticated) {
        // Jika belum login dan ingin ke dashboard, arahkan ke login
        next('/login');
    } else if (to.path === '/login' && isAuthenticated) {
        // Jika sudah login dan ingin ke halaman login, arahkan ke dashboard
        next('/dashboard');
    } else {
        next();
    }
});

// Interceptor dihapus karena Anda tidak lagi menggunakan token berbasis API.
// Jika di masa depan Anda tetap butuh axios untuk fetch data, 
// cukup gunakan instansi axios biasa tanpa interceptor autentikasi.

const app = Vue.createApp({});
app.use(router);
app.mount('#app');
