export default {
    template: `
        <div class="min-h-screen flex items-center justify-center px-4 bg-gray-900 text-gray-100 font-sans antialiased">
            <div class="max-w-md w-full bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
                <h2 class="text-3xl font-bold text-center text-blue-500 mb-2">E-Inventory</h2>
                <p class="text-sm text-gray-400 text-center mb-6">Silakan login sebagai Administrator</p>
                
                <div v-if="error" class="bg-red-900/50 border border-red-500 text-red-200 text-sm p-3 rounded-lg mb-4 text-center">
                    {{ error }}
                </div>

                <form @submit.prevent="handleLogin" class="space-y-4">
                    <div>
                        <label class="block text-xs font-semibold uppercase text-gray-400 mb-1">Username</label>
                        <input v-model="username" type="text" required class="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500 transition">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold uppercase text-gray-400 mb-1">Password</label>
                        <input v-model="password" type="password" required class="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500 transition">
                    </div>
                    <button type="submit" :disabled="loading" class="w-full bg-blue-600 hover:bg-blue-700 font-bold p-2.5 rounded-lg text-white transition mt-6 disabled:opacity-50">
                        {{ loading ? 'Memproses...' : 'Sign In' }}
                    </button>
                </form>
            </div>
        </div>
    `,
    data() {
        return { 
            username: '', 
            password: '', 
            error: null, 
            loading: false 
        }
    },
    methods: {
        async handleLogin() {
            this.loading = true;
            this.error = null;

            // Simulasi delay network
            await new Promise(resolve => setTimeout(resolve, 800));

            // Logika validasi statis dengan localStorage
            if (this.username === 'admin' && this.password === 'admin123') {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('user', 'admin');
                
                this.$router.push('/dashboard');
            } else {
                this.error = 'Username atau password salah.';
                this.loading = false;
            }
        }
    }
};
