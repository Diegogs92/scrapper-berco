'use client';

import { useEffect, useState } from 'react';
import { ProviderStats as ProviderStatsType } from '@/types';
import { Package, TrendingUp, Percent } from 'lucide-react';

export default function ProviderStats() {
  const [stats, setStats] = useState<ProviderStatsType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stats?type=provider-stats')
      .then((res) => res.json())
      .then((data) => {
        setStats(data.stats || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Estadísticas por Proveedor
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.length === 0 ? (
          <p className="col-span-full text-center text-gray-500 dark:text-gray-400 py-8">
            No hay datos disponibles
          </p>
        ) : (
          stats.map((provider) => (
            <div
              key={provider.proveedor}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                {provider.proveedor}
              </h3>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Package className="w-4 h-4" />
                    <span>Productos</span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {provider.cantidadProductos}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <TrendingUp className="w-4 h-4" />
                    <span>Precio promedio</span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {formatPrice(provider.precioPromedio)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Percent className="w-4 h-4" />
                    <span>Con descuento</span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {provider.productosConDescuento} ({((provider.productosConDescuento / provider.cantidadProductos) * 100).toFixed(0)}%)
                  </span>
                </div>

                {provider.descuentoPromedio > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Descuento promedio
                    </div>
                    <div className="text-lg font-bold text-green-600 dark:text-green-400">
                      {provider.descuentoPromedio.toFixed(1)}%
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
