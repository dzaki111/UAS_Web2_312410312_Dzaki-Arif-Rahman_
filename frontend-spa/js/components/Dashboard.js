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
                    <button 
                        @click="logout" 
                        class="w-full bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white py-2 px-4 rounded-lg transition font-medium text-sm flex items-center justify-center gap-2"
                    >
                        🚪 Log Out
                    </button>
                </div>
            </aside>

            <main class="flex-1 p-8 overflow-y-auto bg-gray-950">
                <div class="max-w-7xl mx-auto">
                    <div class="mb-8">
                        <h2 class="text-2xl font-bold text-white">Dashboard Inventaris</h2>
                        <p class="text-gray-400 text-sm">Kelola dan pantau stok barang melalui antarmuka admin.</p>
                    </div>

                    <barang-component></barang-component>
                </div>
            </main>
        </div>
    `,
    methods: {
        logout() {
            // Hapus semua data sesi otorisasi
            localStorage.removeItem('token');
            localStorage.removeItem('isLoggedIn');
            
            // Opsional: Jika ingin menghapus data inventaris saat logout, 
            // uncomment baris di bawah ini:
            // localStorage.removeItem('inventory_app_data');
            
            // Arahkan kembali ke halaman login
            this.$router.push('/login');
        }
    }
};
