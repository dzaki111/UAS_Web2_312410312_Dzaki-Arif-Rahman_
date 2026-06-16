export default {
    template: `
        <div class="w-full text-left">
            <header class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b border-gray-800 gap-4">
                <div>
                    <h2 class="text-xl font-bold text-white tracking-wide text-left">Manajemen Inventaris</h2>
                    <p class="text-xs text-gray-400 mt-0.5 text-left">Kelola master data barang, stok, dan supplier</p>
                </div>
                <button @click="openModal('add')" class="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2.5 px-4 rounded-xl transition shadow-md">
                    + Tambah Barang Baru
                </button>
            </header>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div class="bg-gray-900 border border-gray-800 p-5 rounded-xl">
                    <span class="text-[10px] uppercase font-bold text-gray-400 tracking-wider block text-left">Kapasitas Gudang Terpakai</span>
                    <div class="text-2xl font-black text-white font-mono mt-1 text-left">{{ totalAdminStock }} <span class="text-xs text-gray-500 font-sans font-normal">Buah</span></div>
                    <div class="w-full bg-gray-800 h-1.5 rounded-full mt-3 overflow-hidden">
                        <div class="bg-blue-500 h-full rounded-full" :style="{ width: Math.min((totalAdminStock/1000)*100, 100) + '%' }"></div>
                    </div>
                </div>
                <div class="bg-gray-900 border border-gray-800 p-5 rounded-xl">
                    <span class="text-[10px] uppercase font-bold text-gray-400 tracking-wider block text-left">Estimasi Nilai Aset</span>
                    <div class="text-2xl font-black text-emerald-400 font-mono mt-1 text-left">Rp {{ totalAdminAsset.toLocaleString('id-ID') }}</div>
                    <span class="text-[10px] text-gray-500 block mt-2 text-left">Kalkulasi akumulatif (Stok &times; Harga Jual Satuan)</span>
                </div>
                <div class="bg-gray-900 border border-gray-800 p-5 rounded-xl">
                    <span class="text-[10px] uppercase font-bold text-gray-400 tracking-wider block text-left">Total Kategori Sektor</span>
                    <div class="text-2xl font-black text-purple-400 font-mono mt-1 text-left">{{ categories.length }} <span class="text-xs text-gray-500 font-sans font-normal">Sektor</span></div>
                    <span class="text-[10px] text-gray-400 block mt-2 text-left">Terintegrasi dalam database lokal</span>
                </div>
            </div>

            <div class="bg-gray-900 p-4 rounded-xl border border-gray-800 flex flex-col md:flex-row justify-between gap-4 mb-6 text-xs">
                <div class="flex-1 relative">
                    <input v-model="searchQuery" type="text" placeholder="Cari berdasarkan nama produk atau SKU barang..." class="w-full bg-gray-950 border border-gray-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500">
                </div>
                <div class="flex gap-2">
                    <select v-model="filterCategory" class="bg-gray-950 border border-gray-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500">
                        <option value="">-- Semua Kategori --</option>
                        <option v-for="cat in categories" :key="cat.id" :value="cat.category_name">{{ cat.category_name }}</option>
                    </select>
                    <select v-model="filterStockStatus" class="bg-gray-950 border border-gray-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500">
                        <option value="">-- Semua Status Stok --</option>
                        <option value="aman">Stok Aman (> 20 Buah)</option>
                        <option value="kritis">Stok Kritis (<= 20 Buah)</option>
                    </select>
                    <button @click="resetFilters" class="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2.5 rounded-lg font-semibold transition">Reset</button>
                </div>
            </div>

            <div class="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden shadow-xl text-xs flex flex-col justify-between">
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead class="bg-gray-800 text-gray-400 uppercase font-semibold border-b border-gray-800">
                            <tr>
                                <th class="p-4">SKU</th>
                                <th class="p-4">Nama Produk</th>
                                <th class="p-4">Kategori</th>
                                <th class="p-4">Stok</th>
                                <th class="p-4">Harga</th>
                                <th class="p-4">Pemasok</th>
                                <th class="p-4 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-800 text-gray-300">
                            <tr v-for="product in paginatedProducts" :key="product.id" class="hover:bg-gray-800/30 transition">
                                <td class="p-4 font-mono text-blue-400 font-bold">{{ product.sku }}</td>
                                <td class="p-4 font-bold text-white text-sm">{{ product.product_name }}</td>
                                <td class="p-4">
                                    <span class="bg-gray-950 border border-gray-800 px-2 py-1 rounded text-[10px] text-gray-400 uppercase font-mono">{{ product.category_name }}</span>
                                </td>
                                <td class="p-4">
                                    <div class="flex items-center gap-2">
                                        <span class="font-bold font-mono" :class="Number(product.stock) <= 20 ? 'text-amber-400' : 'text-white'">{{ product.stock }} buah</span>
                                        <span v-if="Number(product.stock) <= 20" class="bg-amber-950/50 text-amber-400 text-[9px] px-1.5 py-0.5 rounded border border-amber-900 font-sans font-normal">Kritis</span>
                                    </div>
                                </td>
                                <td class="p-4 font-mono text-emerald-400 font-semibold">Rp {{ Number(product.price).toLocaleString('id-ID') }}</td>
                                <td class="p-4 text-gray-400">{{ product.supplier_name }}</td>
                                <td class="p-4 text-center space-x-1.5 whitespace-nowrap">
                                    <button @click="openModal('edit', product)" class="bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-white px-2.5 py-1.5 rounded-md transition font-semibold">Edit</button>
                                    <button @click="deleteProduct(product.id)" class="bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white px-2.5 py-1.5 rounded-md transition font-semibold">Hapus</button>
                                </td>
                            </tr>
                            <tr v-if="filteredProducts.length === 0">
                                <td colspan="7" class="p-8 text-center text-gray-500 italic">Tidak ada data entitas barang yang cocok.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="bg-gray-950/40 px-4 py-3 border-t border-gray-800 text-gray-500 flex justify-between items-center text-[11px]">
                    <span>Menampilkan {{ paginatedProducts.length }} dari {{ filteredProducts.length }} data</span>
                    <div class="flex gap-1">
                        <button @click="currentPage--" :disabled="currentPage === 1" class="px-2 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded disabled:opacity-30 transition">Prev</button>
                        <span class="px-2.5 py-1 bg-gray-950 rounded text-blue-400 font-mono font-bold">{{ currentPage }} / {{ totalPages || 1 }}</span>
                        <button @click="currentPage++" :disabled="currentPage >= totalPages" class="px-2 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded disabled:opacity-30 transition">Next</button>
                    </div>
                </div>
            </div>

            <div v-if="showModal" class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 text-xs">
                <div class="bg-gray-900 border border-gray-800 rounded-xl max-w-md w-full p-6 shadow-2xl text-left">
                    <h3 class="text-sm font-bold uppercase tracking-wider mb-4 text-blue-400">
                        {{ modalMode === 'add' ? 'Tambah Barang Baru' : 'Perbarui Spesifikasi Komoditas' }}
                    </h3>
                    <form @submit.prevent="submitForm" class="space-y-4">
                        <div>
                            <label class="block text-[10px] font-bold uppercase text-gray-400 mb-1 tracking-wider">Kategori</label>
                            <select v-model="form.category_id" required class="w-full bg-gray-950 border border-gray-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500">
                                <option value="" disabled>-- Pilih Kategori --</option>
                                <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.category_name }}</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-[10px] font-bold uppercase text-gray-400 mb-1 tracking-wider">Nama Produk</label>
                            <input v-model="form.product_name" type="text" required class="w-full bg-gray-950 border border-gray-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500">
                        </div>
                        <div>
                            <label class="block text-[10px] font-bold uppercase text-gray-400 mb-1 tracking-wider">SKU Barang</label>
                            <input v-model="form.sku" type="text" required class="w-full bg-gray-950 border border-gray-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500 font-mono">
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-[10px] font-bold uppercase text-gray-400 mb-1 tracking-wider">Jumlah Stok</label>
                                <input v-model="form.stock" type="number" required class="w-full bg-gray-950 border border-gray-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500 font-mono">
                            </div>
                            <div>
                                <label class="block text-[10px] font-bold uppercase text-gray-400 mb-1 tracking-wider">Harga Satuan (Rp)</label>
                                <input v-model="form.price" type="number" required class="w-full bg-gray-950 border border-gray-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500 font-mono">
                            </div>
                        </div>
                        <div>
                            <label class="block text-[10px] font-bold uppercase text-gray-400 mb-1 tracking-wider">Nama Pemasok</label>
                            <input v-model="form.supplier_name" type="text" required class="w-full bg-gray-950 border border-gray-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500">
                        </div>
                        <div class="flex justify-end space-x-3 pt-4 border-t border-gray-800">
                            <button type="button" @click="showModal = false" class="bg-gray-800 hover:bg-gray-700 text-gray-200 px-4 py-2 rounded-lg font-medium transition">Batal</button>
                            <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold transition shadow-md">Simpan</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `,
    data() {
        return { 
            products: [], 
            categories: [
                { id: 1, category_name: 'ELEKTRONIK' },
                { id: 2, category_name: 'OFFICE' },
                { id: 3, category_name: 'PERKAKAS' }
            ],
            searchQuery: '',
            filterCategory: '',
            filterStockStatus: '',
            showModal: false,
            modalMode: 'add',
            currentId: null,
            form: { category_id: '', product_name: '', sku: '', stock: '', price: '', supplier_name: '' },
            currentPage: 1,
            itemsPerPage: 5
        }
    },
    computed: {
        totalAdminStock() { return this.products.reduce((sum, item) => sum + Number(item.stock || 0), 0); },
        totalAdminAsset() { return this.products.reduce((sum, item) => sum + (Number(item.price || 0) * Number(item.stock || 0)), 0); },
        filteredProducts() {
            return this.products.filter(product => {
                const search = this.searchQuery.toLowerCase();
                const matchesSearch = product.product_name.toLowerCase().includes(search) || product.sku.toLowerCase().includes(search);
                const matchesCategory = this.filterCategory === '' || product.category_name === this.filterCategory;
                let matchesStock = true;
                if (this.filterStockStatus === 'aman') matchesStock = Number(product.stock) > 20;
                if (this.filterStockStatus === 'kritis') matchesStock = Number(product.stock) <= 20;
                return matchesSearch && matchesCategory && matchesStock;
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
        filterCategory() { this.currentPage = 1; },
        filterStockStatus() { this.currentPage = 1; }
    },
    created() {
        this.fetchProducts();
    },
    methods: {
        fetchProducts() {
            const saved = localStorage.getItem('inventory_data');
            if (saved) {
                this.products = JSON.parse(saved);
            } else {
                // Inisialisasi 10 data awal jika belum ada
                this.products = [
                    { id: 1, category_id: 1, category_name: 'ELEKTRONIK', product_name: 'Laptop Asus ExpertBook B1', sku: 'BRG-001', stock: 12, price: 12500000, supplier_name: 'PT. Asus Indo' },
                    { id: 2, category_id: 1, category_name: 'ELEKTRONIK', product_name: 'Mouse Wireless Logi M220', sku: 'BRG-002', stock: 45, price: 195000, supplier_name: 'Logitech Distro' },
                    { id: 3, category_id: 2, category_name: 'OFFICE', product_name: 'Kursi Kantor Ergo', sku: 'BRG-003', stock: 5, price: 1200000, supplier_name: 'Furniture Jaya' },
                    { id: 4, category_id: 2, category_name: 'OFFICE', product_name: 'Meja Kerja Minimalis', sku: 'BRG-004', stock: 8, price: 2500000, supplier_name: 'Interior Kreasi' },
                    { id: 5, category_id: 1, category_name: 'ELEKTRONIK', product_name: 'iPhone 15 Pro', sku: 'BRG-005', stock: 100, price: 15000000, supplier_name: 'Apple Official' },
                    { id: 6, category_id: 3, category_name: 'PERKAKAS', product_name: 'Bor Listrik Makita', sku: 'BRG-006', stock: 15, price: 850000, supplier_name: 'Makita Power' },
                    { id: 7, category_id: 3, category_name: 'PERKAKAS', product_name: 'Obeng Set Presisi', sku: 'BRG-007', stock: 60, price: 150000, supplier_name: 'Hardware Store' },
                    { id: 8, category_id: 1, category_name: 'ELEKTRONIK', product_name: 'Monitor 24 Inch IPS', sku: 'BRG-008', stock: 25, price: 2100000, supplier_name: 'LG Indonesia' },
                    { id: 9, category_id: 2, category_name: 'OFFICE', product_name: 'Kertas A4 80gr', sku: 'BRG-009', stock: 200, price: 55000, supplier_name: 'Paper Corp' },
                    { id: 10, category_id: 3, category_name: 'PERKAKAS', product_name: 'Tang Kombinasi', sku: 'BRG-010', stock: 30, price: 75000, supplier_name: 'Handtools Indo' }
                ];
                this.saveToLocalStorage();
            }
        },
        saveToLocalStorage() {
            localStorage.setItem('inventory_data', JSON.stringify(this.products));
        },
        submitForm() {
            const categoryObj = this.categories.find(c => c.id == this.form.category_id);
            if (this.modalMode === 'add') {
                const newProduct = {
                    ...this.form,
                    id: Date.now(),
                    category_name: categoryObj.category_name
                };
                this.products.push(newProduct);
            } else {
                const index = this.products.findIndex(p => p.id === this.currentId);
                this.products.splice(index, 1, {
                    ...this.form,
                    id: this.currentId,
                    category_name: categoryObj.category_name
                });
            }
            this.saveToLocalStorage();
            this.showModal = false;
        },
        deleteProduct(id) {
            if (confirm('Apakah Anda yakin ingin menghapus data komoditas barang ini?')) {
                this.products = this.products.filter(p => p.id !== id);
                this.saveToLocalStorage();
            }
        },
        openModal(mode, product = null) {
            this.modalMode = mode;
            this.showModal = true;
            if (mode === 'edit' && product) {
                this.currentId = product.id;
                this.form = { ...product };
            } else {
                this.currentId = null;
                this.form = { category_id: '', product_name: '', sku: '', stock: '', price: '', supplier_name: '' };
            }
        },
        resetFilters() {
            this.searchQuery = '';
            this.filterCategory = '';
            this.filterStockStatus = '';
        }
    }
};
