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
                    <span class="text-[10px] text-gray-400 block mt-2 text-left">Terintegrasi dalam database relasional</span>
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
                        <option value="kritis">Stok Kritis (&le; 20 Buah)</option>
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
                    <span>Menampilkan {{ paginatedProducts.length }} dari {{ filteredProducts.length }} data (Total: {{ products.length }})</span>
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
            categories: [],
            searchQuery: '',
            filterCategory: '',
            filterStockStatus: '',
            showModal: false,
            modalMode: 'add',
            currentId: null,
            form: { category_id: '', product_name: '', sku: '', stock: '', price: '', supplier_name: '' },
            totalAdminStock: 0,
            totalAdminAsset: 0,
            currentPage: 1,
            itemsPerPage: 5
        }
    },
    computed: {
        filteredProducts() {
            return this.products.filter(product => {
                const productName = product.product_name ? product.product_name.toLowerCase() : '';
                const productSku = product.sku ? product.sku.toLowerCase() : '';
                
                const matchesSearch = productName.includes(this.searchQuery.toLowerCase()) || 
                                      productSku.includes(this.searchQuery.toLowerCase());
                                      
                const matchesCategory = this.filterCategory === '' || product.category_name === this.filterCategory;
                
                let matchesStock = true;
                if (this.filterStockStatus === 'aman') matchesStock = Number(product.stock) > 20;
                if (this.filterStockStatus === 'kritis') matchesStock = Number(product.stock) <= 20;

                return matchesSearch && matchesCategory && matchesStock;
            });
        },
        totalPages() {
            return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
        },
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
        this.fetchCategories();
    },
    methods: {
        async fetchProducts() {
            try {
                const response = await axios.get('api/products');
                let rawData = response.data;
                if (rawData && rawData.data && Array.isArray(rawData.data)) {
                    rawData = rawData.data;
                }
                this.products = Array.isArray(rawData) ? rawData : [];
                this.calculateAdminStats();
            } catch (err) {
                console.error('Gagal memuat data produk:', err);
            }
        },
        async fetchCategories() {
            try {
                const response = await axios.get('api/categories');
                let rawData = response.data;
                if (rawData && rawData.data && Array.isArray(rawData.data)) {
                    rawData = rawData.data;
                }
                this.categories = Array.isArray(rawData) ? rawData : [];
            } catch (err) {
                console.error('Gagal memuat data kategori:', err);
            }
        },
        calculateAdminStats() {
            this.totalAdminStock = this.products.reduce((sum, item) => sum + Number(item.stock || 0), 0);
            this.totalAdminAsset = this.products.reduce((sum, item) => sum + (Number(item.price || 0) * Number(item.stock || 0)), 0);
        },
        resetFilters() {
            this.searchQuery = '';
            this.filterCategory = '';
            this.filterStockStatus = '';
        },
        openModal(mode, product = null) {
            this.modalMode = mode;
            this.showModal = true;
            if (mode === 'edit' && product) {
                this.currentId = product.id;
                this.form = { 
                    category_id: product.category_id,
                    product_name: product.product_name,
                    sku: product.sku,
                    stock: product.stock,
                    price: product.price,
                    supplier_name: product.supplier_name
                };
            } else {
                this.currentId = null;
                this.form = { category_id: '', product_name: '', sku: '', stock: '', price: '', supplier_name: '' };
            }
        },
        async submitForm() {
            try {
                const payload = {
                    category_id: this.form.category_id,
                    product_name: this.form.product_name,
                    sku: this.form.sku,
                    stock: this.form.stock,
                    price: this.form.price,
                    supplier_name: this.form.supplier_name
                };

                if (this.modalMode === 'add') {
                    // Murni JSON post biasa
                    await axios.post('api/products', payload);
                    alert('Barang berhasil ditambahkan!');
                } else {
                    // Murni JSON put biasa untuk proses edit
                    await axios.put(`api/products/${this.currentId}`, payload);
                    alert('Data barang berhasil diperbarui!');
                }
                this.showModal = false;
                this.fetchProducts();
            } catch (err) {
                alert('Gagal mengeksekusi operasi data master.');
            }
        },
        async deleteProduct(id) {
            if (confirm('Apakah Anda yakin ingin menghapus data komoditas barang ini?')) {
                try {
                    await axios.delete(`api/products/${id}`);
                    this.fetchProducts();
                } catch (err) {
                    alert('Gagal menghapus barang.');
                }
            }
        }
    }
};