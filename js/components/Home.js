export default {
    data() {
        return {
            products: [],
            categories: ['ELEKTRONIK', 'OFFICE', 'PERKAKAS'],
            searchQuery: '',
            selectedCategory: '',
            statusFilter: '',
            currentPage: 1,
            itemsPerPage: 5
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
        loadData() {
            const savedData = localStorage.getItem('inventory_data');
            if (savedData) {
                this.products = JSON.parse(savedData);
            } else {
                // Inisialisasi 10 data default
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
        }
    },
    template: `
        <div class="min-h-screen bg-gray-950 text-gray-100 font-sans antialiased p-6 flex flex-col justify-between w-full">
            <header class="w-full max-w-7xl mx-auto flex justify-between items-center pb-6 border-b border-gray-850">
                <div>
                    <h1 class="text-xl font-bold tracking-wider text-blue-500">SISTEM INVENTARIS ELEKTRONIK</h1>
                    <p class="text-[11px] text-gray-400 uppercase tracking-widest mt-0.5">Portal Informasi Publik & Monitoring</p>
                </div>
                <router-link to="/login" class="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-5 py-2 rounded-lg shadow-md transition">
                    Administrator Otorisasi &rarr;
                </router-link>
            </header>
            <main class="w-full max-w-7xl mx-auto flex-1 py-8 space-y-6">
                <div class="bg-gray-900 border border-gray-800 p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center justify-between shadow-lg">
                    <div class="relative w-full md:flex-1">
                        <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 text-sm">🔍</span>
                        <input v-model="searchQuery" type="text" placeholder="Cari komoditas berdasarkan nama barang atau kode SKU..." class="w-full bg-gray-950 border border-gray-800 rounded-lg pl-9 pr-4 py-2 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500 font-medium transition" />
                    </div>
                    <div class="flex w-full md:w-auto gap-3 items-center">
                        <span class="text-xs text-gray-400 whitespace-nowrap hidden sm:inline">Filter Sektor:</span>
                        <select v-model="selectedCategory" class="w-full md:w-48 bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-blue-500 font-mono transition">
                            <option value="">Semua Kategori</option>
                            <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
                        </select>
                    </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div class="bg-gray-900 border border-gray-800 p-5 rounded-xl">
                        <span class="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Total Variasi Produk</span>
                        <span class="text-2xl font-bold text-blue-400 font-mono">{{ totalProducts }} <span class="text-xs text-gray-500 font-sans font-normal">Barang</span></span>
                    </div>
                    <div class="bg-gray-900 border border-gray-800 p-5 rounded-xl">
                        <span class="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Total Stok Global</span>
                        <span class="text-2xl font-bold text-emerald-400 font-mono">{{ totalStock }} <span class="text-xs text-gray-500 font-sans font-normal">buah</span></span>
                    </div>
                    <div class="bg-gray-900 border border-gray-800 p-5 rounded-xl">
                        <span class="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Estimasi Nilai Aset</span>
                        <span class="text-2xl font-bold text-amber-400 font-mono">Rp {{ totalAsset.toLocaleString('id-ID') }}</span>
                    </div>
                    <div class="bg-gray-900 border border-gray-800 p-5 rounded-xl">
                        <span class="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Kategori Aktif</span>
                        <span class="text-2xl font-bold text-purple-400 font-mono">{{ totalCategoriesCount }} <span class="text-xs text-gray-500 font-sans font-normal">Sektor</span></span>
                    </div>
                </div>
                <div class="lg:col-span-3 bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-xl">
                    <div class="p-4 bg-gray-850/50 border-b border-gray-800 flex justify-between items-center">
                        <h3 class="text-xs font-bold uppercase tracking-wider text-gray-300">Daftar Inventaris Terdaftar (Read-Only)</h3>
                        <div class="flex gap-2">
                            <button @click="statusFilter = ''" :class="statusFilter === '' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'" class="text-[10px] px-2.5 py-1 rounded transition">Semua</button>
                            <button @click="statusFilter = 'kritis'" :class="statusFilter === 'kritis' ? 'bg-amber-600 text-white' : 'bg-gray-800 text-amber-400'" class="text-[10px] px-2.5 py-1 rounded transition">Stok Kritis</button>
                        </div>
                    </div>
                    <div class="overflow-x-auto text-xs">
                        <table class="w-full text-left border-collapse">
                            <thead class="bg-gray-800/40 uppercase font-semibold text-gray-400 border-b border-gray-800">
                                <tr>
                                    <th class="p-4">Kode SKU</th>
                                    <th class="p-4">Nama Komoditas</th>
                                    <th class="p-4">Kategori Sektor</th>
                                    <th class="p-4">Stok Gudang</th>
                                    <th class="p-4">Harga Satuan</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-800 text-gray-300">
                                <tr v-for="product in paginatedProducts" :key="product.id" class="hover:bg-gray-800/30 transition">
                                    <td class="p-4 font-mono text-blue-400 font-bold">{{ product.sku }}</td>
                                    <td class="p-4 font-bold text-white text-sm">{{ product.product_name }}</td>
                                    <td class="p-4"><span class="bg-gray-950 border border-gray-800 px-2.5 py-1 rounded text-[10px] text-gray-400 uppercase font-mono">{{ product.category_name }}</span></td>
                                    <td class="p-4">
                                        <div class="flex items-center gap-2">
                                            <span class="font-bold font-mono" :class="Number(product.stock) <= 20 ? 'text-amber-400' : 'text-white'">{{ product.stock }} Buah</span>
                                            <span v-if="Number(product.stock) <= 20" class="bg-amber-950/50 text-amber-400 text-[9px] px-1.5 py-0.5 rounded border border-amber-900 font-sans font-normal">Kritis</span>
                                        </div>
                                    </td>
                                    <td class="p-4 font-mono text-emerald-400 font-semibold">Rp {{ Number(product.price).toLocaleString('id-ID') }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    `
};
