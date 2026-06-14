export default {
    data() {
        return {
            products: [],          // Menampung 4 data produk dari database CI4
            categories: [],        // Menampung daftar kategori unik dari API
            searchQuery: '',       // State pencarian text (Nama/SKU)
            selectedCategory: '',  // State dropdown filter kategori
            statusFilter: '',      // Filter status stok ('', 'kritis')
            currentPage: 1,
            itemsPerPage: 5,
            logs: [
                { time: new Date().toLocaleTimeString('id-ID'), type: 'info', message: 'Menginisialisasi handshake REST API...' }
            ]
        }
    },
    computed: {
        // Menghitung Total Ragam Jenis Barang yang lolos filter pencarian
        totalProducts() {
            return this.filteredProducts.length;
        },
        // Menghitung Total Stok Global dari barang yang ditampilkan
        totalStock() {
            return this.filteredProducts.reduce((sum, item) => sum + Number(item.stock || 0), 0);
        },
        // Menghitung Nilai Kumulatif Aset dari barang yang difilter (Stok * Harga)
        totalAsset() {
            return this.filteredProducts.reduce((sum, item) => sum + (Number(item.stock || 0) * Number(item.price || 0)), 0);
        },
        // Menghitung jumlah kategori unik yang tersedia
        totalCategoriesCount() {
            return this.categories.length || 1;
        },
        // LOGIKA FILTER: Pencarian teks + Dropdown Kategori + Tombol Kritis
        filteredProducts() {
            return this.products.filter(product => {
                // Pastikan variabel string aman dari nilai null/undefined sebelum di-lowercase
                const productName = product.product_name ? product.product_name.toLowerCase() : '';
                const productSku = product.sku ? product.sku.toLowerCase() : '';
                const categoryName = product.category_name ? product.category_name : 'ELEKTRONIK';

                // 1. Filter Berdasarkan Kolom Pencarian
                const matchesSearch = productName.includes(this.searchQuery.toLowerCase()) ||
                                      productSku.includes(this.searchQuery.toLowerCase());
                
                // 2. Filter Berdasarkan Dropdown Kategori
                const matchesCategory = this.selectedCategory === '' || 
                                        categoryName === this.selectedCategory;
                
                // 3. Filter Berdasarkan Tombol Status Kritis (Stok <= 20)
                const matchesStatus = this.statusFilter === '' || 
                                      (this.statusFilter === 'kritis' && Number(product.stock) <= 20);

                return matchesSearch && matchesCategory && matchesStatus;
            });
        },
        // Logika Pagination halaman tabel publik
        totalPages() {
            return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
        },
        paginatedProducts() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.filteredProducts.slice(start, end);
        }
    },
    watch: {
        // Jika parameter pencarian berubah, kembalikan navigasi halaman ke nomor 1
        searchQuery() { this.currentPage = 1; },
        selectedCategory() { this.currentPage = 1; },
        statusFilter() { this.currentPage = 1; }
    },
    mounted() {
        this.fetchData();
    },
    methods: {
        // METHOD FETCH DATA YANG SUDAH TERINTEGRASI DENGAN ARRAY API UTAMA
        async fetchData() {
            try {
                const response = await fetch(
                    'http://localhost/UAS_Web2_312410312_DzakiArifRahman/backend-api/public/api/products'
                );

                if (!response.ok) {
                    throw new Error(`HTTP Error ${response.status}`);
                }

                const data = await response.json();
                console.log('Response API:', data);

                // Karena backend langsung mengirim data array, atau dibungkus objek data.products
                if (Array.isArray(data)) {
                    this.products = data;
                } else if (data && Array.isArray(data.products)) {
                    this.products = data.products;
                } else {
                    this.products = [];
                }

                // Map data kategori unik dari hasil produk yang diterima
                if (data && Array.isArray(data.categories)) {
                    this.categories = data.categories;
                } else {
                    this.categories = ['ELEKTRONIK'];
                }

                this.logs.unshift({
                    time: new Date().toLocaleTimeString('id-ID'),
                    type: 'info',
                    message: `Berhasil sinkronisasi ${this.products.length} entitas produk dari REST API.`
                });

            } catch (error) {
                console.warn('Koneksi API backend bermasalah, mengaktifkan data lokal:', error);

                this.logs.unshift({
                    time: new Date().toLocaleTimeString('id-ID'),
                    type: 'warn',
                    message: 'Backend API tidak merespon normal. Menggunakan failover lokal.'
                });

                // Failover local fallback jika server mati tiba-tiba
                this.products = [
                    { id: 2, sku: 'BRG-002', product_name: 'Mouse Wireless Logi M220', category_name: 'ELEKTRONIK', stock: 45, price: 195000 },
                    { id: 5, sku: 'BRG-005', product_name: 'iPhone', category_name: 'ELEKTRONIK', stock: 100, price: 15000000 },
                    { id: 6, sku: 'BRG-006', product_name: 'HP 15 - 7530U - RX Vega 7 15W', category_name: 'ELEKTRONIK', stock: 50, price: 9000000 },
                    { id: 1, sku: 'BRG-001', product_name: 'Laptop Asus ExpertBook B1', category_name: 'ELEKTRONIK', stock: 12, price: 12500000 }
                ];
                this.categories = ['ELEKTRONIK'];
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
                        <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 text-sm">
                            🔍
                        </span>
                        <input 
                            v-model="searchQuery"
                            type="text" 
                            placeholder="Cari komoditas berdasarkan nama barang atau kode SKU..." 
                            class="w-full bg-gray-950 border border-gray-800 rounded-lg pl-9 pr-4 py-2 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500 font-medium transition"
                        />
                    </div>
                    
                    <div class="flex w-full md:w-auto gap-3 items-center">
                        <span class="text-xs text-gray-400 whitespace-nowrap hidden sm:inline">Filter Sektor:</span>
                        <select 
                            v-model="selectedCategory"
                            class="w-full md:w-48 bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-blue-500 font-mono transition"
                        >
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

                <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    
                    <div class="lg:col-span-3 bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-xl flex flex-col justify-between">
                        <div>
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
                                            <td class="p-4">
                                                <span class="bg-gray-950 border border-gray-800 px-2.5 py-1 rounded text-[10px] text-gray-400 uppercase font-mono">{{ product.category_name || 'ELEKTRONIK' }}</span>
                                            </td>
                                            <td class="p-4">
                                                <div class="flex items-center gap-2">
                                                    <span class="font-bold font-mono" :class="Number(product.stock) <= 20 ? 'text-amber-400' : 'text-white'">{{ product.stock }} Buah</span>
                                                    <span v-if="Number(product.stock) <= 20" class="bg-amber-950/50 text-amber-400 text-[9px] px-1.5 py-0.5 rounded border border-amber-900 font-sans font-normal">Kritis</span>
                                                </div>
                                            </td>
                                            <td class="p-4 font-mono text-emerald-400 font-semibold">Rp {{ Number(product.price).toLocaleString('id-ID') }}</td>
                                        </tr>
                                        <tr v-if="filteredProducts.length === 0">
                                            <td colspan="5" class="p-8 text-center text-gray-500 italic">Tidak ada komoditas logistik yang cocok dengan kriteria pencarian.</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div class="p-4 bg-gray-950/20 border-t border-gray-800 flex justify-between items-center text-[11px] text-gray-400">
                            <span>Menampilkan {{ paginatedProducts.length }} dari {{ filteredProducts.length }} entitas hasil filter</span>
                            <div class="flex gap-1.5">
                                <button @click="currentPage--" :disabled="currentPage === 1" class="px-2.5 py-1 bg-gray-800 hover:bg-gray-700 rounded disabled:opacity-40 transition">Sebelumnya</button>
                                <span class="px-3 py-1 bg-gray-950 border border-gray-800 rounded font-mono font-bold text-blue-400">{{ currentPage }} / {{ totalPages || 1 }}</span>
                                <button @click="currentPage++" :disabled="currentPage >= totalPages" class="px-2.5 py-1 bg-gray-800 hover:bg-gray-700 rounded disabled:opacity-40 transition">Berikutnya</button>
                            </div>
                        </div>
                    </div>

                    <div class="bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col justify-between">
                        <div>
                            <h3 class="text-xs font-bold uppercase tracking-wider text-gray-300 pb-3 border-b border-gray-800 mb-4">Log Sistem Langsung</h3>
                            <div class="space-y-3 font-mono text-[10px] text-gray-400">
                                <div v-for="(log, idx) in logs" :key="idx" class="p-2 bg-gray-950/40 border-l-2 rounded-r" :class="log.type === 'error' ? 'border-red-500 bg-red-950/10' : log.type === 'warn' ? 'border-amber-500 bg-amber-950/10' : 'border-blue-500'">
                                    <span class="text-gray-500 block text-[9px]">{{ log.time }}</span>
                                    <span :class="log.type === 'error' ? 'text-red-400' : log.type === 'warn' ? 'text-amber-400' : 'text-gray-300'">{{ log.message }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="pt-4 border-t border-gray-800 mt-4 text-[10px] text-gray-500">
                            Status Gateway: <span class="text-emerald-400 font-bold font-mono">TERHUBUNG</span>
                        </div>
                    </div>

                </div>
            </main>

            <footer class="w-full max-w-7xl mx-auto border-t border-gray-850 pt-4 text-center md:flex md:justify-between text-[10px] text-gray-500 mt-6">
                <span>Sistem Informasi Manajemen Logistik Arsitektur Terpisah</span>
                <span>&copy; 2026 Sistem Inventaris Gudang. Semua Hak Dilindungi Undang-undang.</span>
            </footer>
        </div>
    `
};