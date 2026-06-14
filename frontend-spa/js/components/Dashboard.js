import Barang from './Barang.js';

export default {
    components: {
        'barang-component': Barang
    },
    template: `
        <div class="min-h-screen flex bg-gray-900 text-gray-100 font-sans antialiased">
            <aside class="w-64 bg-gray-800 border-r border-gray-700 flex flex-col justify-between">
                <div class="p-6">
                    <h1 class="text-xl font-bold text-blue-500 mb-8 tracking-wider">E-INVENTORY</h1>
                    <nav class="space-y-2">
                        <router-link to="/dashboard" class="block py-2.5 px-4 rounded-lg bg-gray-900 font-medium border-l-4 border-blue-500 text-white">
                            📦 Data Barang
                        </router-link>
                    </nav>
                </div>
                <div class="p-4 border-t border-gray-700">
                    <button @click="logout" class="w-full bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white py-2 px-4 rounded-lg transition font-medium">
                        🚪 Log Out
                    </button>
                </div>
            </aside>

            <main class="flex-1 p-8 overflow-y-auto">
                <barang-component></barang-component>
            </main>
        </div>
    `,
    methods: {
        logout() {
            localStorage.removeItem('token');
            localStorage.removeItem('isLoggedIn');
            this.$router.push('/login');
        }
    }
};