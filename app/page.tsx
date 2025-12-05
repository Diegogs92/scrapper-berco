'use client';

import { useState, useEffect, useCallback } from 'react';
import ProductTable from '@/components/ProductTable';
import FilterPanel from '@/components/FilterPanel';
import PriceAnalysis from '@/components/PriceAnalysis';
import ProviderStats from '@/components/ProviderStats';
import ThemeToggle from '@/components/ThemeToggle';
import { Product, ProductFilter } from '@/types';
import { Upload, BarChart3, Package } from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState<ProductFilter>({});
  const [activeTab, setActiveTab] = useState<'products' | 'analysis' | 'stats'>('products');

  const fetchProducts = useCallback(async (page = 1, newFilters: ProductFilter = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        ...Object.fromEntries(
          Object.entries(newFilters).filter(([, v]) => v !== '' && v !== false && v !== undefined)
        ),
      });

      const response = await fetch(`/api/products?${params}`);
      const data = await response.json();

      setProducts(data.products || []);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination.limit]);

  useEffect(() => {
    fetchProducts(1, filters);
  }, [filters, fetchProducts]);

  const handleFilterChange = (newFilters: ProductFilter) => {
    setFilters(newFilters);
  };

  const handlePageChange = (newPage: number) => {
    fetchProducts(newPage, filters);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Análisis de Precios
              </h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Sistema de monitoreo de precios de la competencia
              </p>
            </div>
            <div className="flex gap-2">
              <ThemeToggle />
              <a
                href="/api/import"
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Upload className="w-4 h-4" />
                Importar datos
              </a>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-6 border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('products')}
                className={`${
                  activeTab === 'products'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
              >
                <Package className="w-4 h-4" />
                Productos ({pagination.total})
              </button>
              <button
                onClick={() => setActiveTab('analysis')}
                className={`${
                  activeTab === 'analysis'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
              >
                <BarChart3 className="w-4 h-4" />
                Análisis de Precios
              </button>
              <button
                onClick={() => setActiveTab('stats')}
                className={`${
                  activeTab === 'stats'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
              >
                <BarChart3 className="w-4 h-4" />
                Estadísticas
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'products' && (
          <>
            <FilterPanel onFilterChange={handleFilterChange} />

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <>
                <ProductTable products={products} />

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="mt-6 flex items-center justify-between">
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      Mostrando {products.length} de {pagination.total} productos
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Anterior
                      </button>
                      <span className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                        Página {pagination.page} de {pagination.totalPages}
                      </span>
                      <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page === pagination.totalPages}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Siguiente
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {activeTab === 'analysis' && <PriceAnalysis />}

        {activeTab === 'stats' && <ProviderStats />}
      </main>
    </div>
  );
}
