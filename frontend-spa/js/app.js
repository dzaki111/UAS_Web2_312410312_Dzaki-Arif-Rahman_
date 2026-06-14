import Home from './components/Home.js';
import Login from './components/Login.js';
import Dashboard from './components/Dashboard.js';

axios.defaults.baseURL = 'http://localhost/UAS_Web2_312410312_DzakiArifRahman/backend-api/public/index.php/';

const routes = [
    { path: '/', component: Home },
    { path: '/login', component: Login },
    { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } }
];

const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    const isAuthenticated = localStorage.getItem('isLoggedIn') === 'true';
    if (to.meta.requiresAuth && !isAuthenticated) {
        next('/login');
    } else {
        next();
    }
});

axios.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            alert('Sesi Anda telah habis! Silakan login kembali.');
            localStorage.clear();
            router.push('/login');
        }
        return Promise.reject(error);
    }
);

const app = Vue.createApp({});
app.use(router);
app.mount('#app');