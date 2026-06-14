export default {
    data() {
        return {
            products: [],
            categories: [],
            searchQuery: '',
            selectedCategory: '',
            statusFilter: '',
            currentPage: 1,
            itemsPerPage: 5,
            logs: [
                { time: new Date().toLocaleTimeString('id-ID'), type: 'info', message: 'Sistem dimuat dari Local Storage...' }
            ]
        }
    },
    computed: {
        totalProducts() { return this.filteredProducts.length; },
        totalStock() { return this.filteredProducts.reduce((sum, item) => sum + Number(item.stock || 0), 0); },
        totalAsset() { return this.filteredProducts.reduce((sum, item) => sum + (Number(item.stock || 0) * Number(item.price || 0)), 0); },
        totalCategoriesCount() { return this.categories.length || 1; },
        filteredProducts() {
            return this.products.filter(product => {
                const name = product.product_name ? product.product_name.toLowerCase() : '';
                const sku = product.sku ? product.sku.toLowerCase() : '';
                const cat = product.category_name || 'ELEKTRONIK';
                const matchSearch = name.includes(this.searchQuery.toLowerCase()) || sku.includes(this.searchQuery.toLowerCase());
                const matchCat = this.selectedCategory === '' || cat === this.selectedCategory;
                const matchStatus = this.statusFilter === '' || (this.statusFilter === 'kritis' && Number(product.stock) <= 20);
                return matchSearch && matchCat && matchStatus;
            });
        },
        totalPages() { return Math.ceil(this.filteredProducts.length / this.itemsPerPage); },
        paginatedProducts() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            return this.filteredProducts.slice(start, start + this.itemsPerPage);
        }
    },
    mounted() {
        const saved = localStorage.getItem('inventory_app_data');
        if (saved) {
            const parsed = JSON.parse(saved);
            this.products = parsed.products;
            this.categories = parsed.categories;
        } else {
            this.products = [
                { id: 1, sku: 'BRG-001', product_name: 'Laptop Asus ExpertBook', category_name: 'ELEKTRONIK', stock: 12, price: 12500000 },
                { id: 2, sku: 'BRG-002', product_name: 'Mouse Wireless Logi', category_name: 'ELEKTRONIK', stock: 45, price: 195000 }
            ];
            this.categories = ['ELEKTRONIK'];
            localStorage.setItem('inventory_app_data', JSON.stringify({ products: this.products, categories: this.categories }));
        }
    },
    template: `
        <div class="min-h-screen bg-gray-950 text-gray-100 p-6">
            <header class="max-w-7xl mx-auto flex justify-between items-center pb-6 border-b border-gray-800">
                <div>
                    <h1 class="text-xl font-bold text-blue-500">SISTEM INVENTARIS</h1>
                </div>
                <router-link to="/login" class="bg-blue-600 text-white px-4 py-2 rounded text-sm font-bold">Admin</router-link>
            </header>
            
            <main class="max-w-7xl mx-auto py-8">
                <input v-model="searchQuery" placeholder="Cari barang..." class="w-full bg-gray-900 border border-gray-700 p-3 rounded text-sm text-white mb-6">
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div class="bg-gray-900 p-4 rounded border border-gray-800">
                        <p class="text-gray-400 text-xs uppercase">Total Barang</p>
                        <p class="text-xl font-bold">{{ totalProducts }}</p>
                    </div>
                </div>

                <div class="bg-gray-900 border border-gray-800 rounded overflow-hidden">
                    <table class="w-full text-left text-sm">
                        <thead class="bg-gray-800 text-gray-400">
                            <tr>
                                <th class="p-3">SKU</th>
                                <th class="p-3">Nama</th>
                                <th class="p-3">Stok</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-800">
                            <tr v-for="p in paginatedProducts" :key="p.id">
                                <td class="p-3">{{ p.sku }}</td>
                                <td class="p-3">{{ p.product_name }}</td>
                                <td class="p-3">{{ p.stock }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    `
};
