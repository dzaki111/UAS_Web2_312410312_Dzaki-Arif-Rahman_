export default {
    data() {
        return {
            products: [],
            categories: ['ELEKTRONIK', 'OFFICE', 'PERKAKAS'],
            searchQuery: '',
            selectedCategory: '',
            statusFilter: '',
            currentPage: 1,
            itemsPerPage: 5,
            logs: []
        }
    },
    computed: {
        totalProducts() { return this.filteredProducts.length; },
        totalStock() { return this.filteredProducts.reduce((sum, item) => sum + Number(item.stock || 0), 0); },
        totalAsset() { return this.filteredProducts.reduce((sum, item) => sum + (Number(item.stock || 0) * Number(item.price || 0)), 0); },
        totalCategoriesCount() { return this.categories.length; },
        filteredProducts() {
            return this.products.filter(product => {
                const search = this.searchQuery.toLowerCase();
                const matchesSearch = (product.product_name || '').toLowerCase().includes(search) || (product.sku || '').toLowerCase().includes(search);
                const matchesCategory = this.selectedCategory === '' || product.category_name === this.selectedCategory;
                const matchesStatus = this.statusFilter === '' || (this.statusFilter === 'kritis' && Number(product.stock) <= 20);
                return matchesSearch && matchesCategory && matchesStatus;
            });
        },
        totalPages() { return Math.ceil(this.filteredProducts.length / this.itemsPerPage) || 1; },
        paginatedProducts() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            return this.filteredProducts.slice(start, start + this.itemsPerPage);
        }
    },
    watch: {
        searchQuery() { this.currentPage = 1; },
        selectedCategory() { this.currentPage = 1; },
        statusFilter() { this.currentPage = 1; }
    },
    mounted() {
        this.loadData();
    },
    methods: {
        addLog(message) {
            const now = new Date();
            const timeString = now.toLocaleTimeString('id-ID', { hour12: false });
            this.logs.unshift({ id: Date.now(), time: timeString, msg: message });
        },
        loadData() {
            const savedData = localStorage.getItem('inventory_data');
            if (savedData) {
                this.products = JSON.parse(savedData);
            } else {
                this.products = [
                    { id: 1, sku: 'BRG-001', product_name: 'Laptop Asus ExpertBook B1', category_name: 'ELEKTRONIK', stock: 12, price: 12500000 },
                    { id: 2, sku: 'BRG-002', product_name: 'Mouse Wireless Logi M220', category_name: 'ELEKTRONIK', stock: 45, price: 195000 },
                    { id: 3, sku: 'BRG-003', product_name: 'Kursi Kantor Ergo', category_name: 'OFFICE', stock: 5, price: 1200000 },
                    { id: 4, sku: 'BRG-004', product_name: 'Meja Kerja Minimalis', category_name: 'OFFICE', stock: 8, price: 2500000 },
                    { id: 5, sku: 'BRG-005', product_name: 'iPhone 15 Pro', category_name: 'ELEKTRONIK', stock: 100, price: 15000000 },
                    { id: 6, sku: 'BRG-006', product_name: 'Bor Listrik Makita', category_name: 'PERKAKAS', stock: 15, price: 850000 },
                    { id: 7, sku: 'BRG-007', product_name: 'Obeng Set Presisi', category_name: 'PERKAKAS', stock: 60, price: 150000 },
                    { id: 8, sku: 'BRG-008', product_name: 'Monitor 24 Inch IPS', category_name: 'ELEKTRONIK', stock: 25, price: 2100000 },
                    { id: 9, sku: 'BRG-009', product_name: 'Kertas A4 80gr', category_name: 'OFFICE', stock: 200, price: 55000 },
                    { id: 10, sku: 'BRG-010', product_name: 'Tang Kombinasi', category_name: 'PERKAKAS', stock: 30, price: 75000 }
                ];
                localStorage.setItem('inventory_data', JSON.stringify(this.products));
            }
            this.addLog('Sinkronisasi database berhasil dimuat.');
            this.addLog('Sistem terhubung ke penyimpanan lokal.');
        }
    },
    template: `
        <div class="min-h-screen bg-gray-950 text-gray-100 font-sans antialiased p-6 flex flex-col w-full">
            <header class="w-full max-w-7xl mx-auto flex justify-between items-center pb-6 border-b border-gray-850">
                <div>
                    <h1 class="text-xl font-bold tracking-wider text-blue-500">SISTEM INVENTARIS ELEKTRONIK</h1>
                    <p class="text-[11px] text-gray-400 uppercase tracking-widest mt-0.5">Portal Informasi Publik & Monitoring</p>
                </div>
                <router-link to="/login" class="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-5 py-2 rounded-lg shadow-md transition">
                    Administrator Otorisasi &rarr;
                </router-link>
            </header>
            <main class="w-full max-w-7xl mx-auto py-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div class="lg:col-span-3 space-y-6">
                    <div class="bg-gray-900 border border-gray-800 p-4 rounded-xl flex gap-4">
                        <input v-model="searchQuery" type="text" placeholder="Cari barang atau kode SKU..." class="flex-1 bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-xs focus:outline-none focus:border-blue-500" />
                        <select v-model="selectedCategory" class="bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-xs">
                            <option value="">Semua Kategori</option>
                            <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
                        </select>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div class="bg-gray-900 border border-gray-800 p-5 rounded-xl"><span class="block text-[10px] text-gray-400 uppercase">Variasi</span><span class="text-2xl font-bold text-blue-400">{{ totalProducts }}</span></div>
                        <div class="bg-gray-900 border border-gray-800 p-5 rounded-xl"><span class="block text-[10px] text-gray-400 uppercase">Stok Global</span><span class="text-2xl font-bold text-emerald-400">{{ totalStock }}</span></div>
                        <div class="bg-gray-900 border border-gray-800 p-5 rounded-xl"><span class="block text-[10px] text-gray-400 uppercase">Aset</span><span class="text-2xl font-bold text-amber-400">Rp {{ totalAsset.toLocaleString('id-ID') }}</span></div>
                        <div class="bg-gray-900 border border-gray-800 p-5 rounded-xl"><span class="block text-[10px] text-gray-400 uppercase">Kategori</span><span class="text-2xl font-bold text-purple-400">{{ totalCategoriesCount }}</span></div>
                    </div>

                    <div class="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                        <div class="p-4 bg-gray-850/50 border-b border-gray-800 flex justify-between">
                            <h3 class="text-xs font-bold uppercase text-gray-300">Daftar Inventaris</h3>
                            <button @click="statusFilter = (statusFilter === 'kritis' ? '' : 'kritis')" :class="statusFilter === 'kritis' ? 'bg-amber-600' : 'bg-gray-800'" class="text-[10px] px-2 py-1 rounded">Stok Kritis</button>
                        </div>
                        <table class="w-full text-left text-xs">
                            <thead class="bg-gray-800/40 text-gray-400 uppercase"><tr><th class="p-4">SKU</th><th class="p-4">Nama</th><th class="p-4">Stok</th><th class="p-4">Harga</th></tr></thead>
                            <tbody class="divide-y divide-gray-800">
                                <tr v-for="p in paginatedProducts" :key="p.id">
                                    <td class="p-4 text-blue-400 font-mono">{{ p.sku }}</td>
                                    <td class="p-4">{{ p.product_name }}</td>
                                    <td class="p-4 font-bold" :class="p.stock <= 20 ? 'text-amber-400' : ''">{{ p.stock }}</td>
                                    <td class="p-4 text-emerald-400">Rp {{ p.price.toLocaleString('id-ID') }}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="p-4 flex justify-between items-center border-t border-gray-800">
                            <button @click="currentPage--" :disabled="currentPage === 1" class="px-3 py-1 bg-gray-800 rounded text-[10px]">Prev</button>
                            <span class="text-[10px]">{{ currentPage }} / {{ totalPages }}</span>
                            <button @click="currentPage++" :disabled="currentPage === totalPages" class="px-3 py-1 bg-gray-800 rounded text-[10px]">Next</button>
                        </div>
                    </div>
                </div>

                <div class="bg-gray-900 border border-gray-800 rounded-xl p-4">
                    <h3 class="text-xs font-bold uppercase text-gray-400 mb-4">Log Sistem</h3>
                    <div class="space-y-3">
                        <div v-for="log in logs" :key="log.id" class="border-l-2 border-gray-700 pl-3">
                            <div class="text-[10px] text-gray-500 font-mono">{{ log.time }}</div>
                            <div class="text-[10px] text-gray-300">{{ log.msg }}</div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    `
};
