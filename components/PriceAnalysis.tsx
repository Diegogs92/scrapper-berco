'use client';

import { useEffect, useState } from 'react';
import { PriceStats } from '@/types';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function PriceAnalysis() {
  const [analysis, setAnalysis] = useState<PriceStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stats?type=price-analysis')
      .then((res) => res.json())
      .then((data) => {
        setAnalysis(data.analysis || []);
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
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Análisis de Precios por Producto
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Productos con mayor diferencia de precio entre proveedores
      </p>

      <div className="space-y-4">
        {analysis.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            No hay datos suficientes para el análisis
          </p>
        ) : (
          analysis.slice(0, 10).map((item, index) => (
            <div
              key={index}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-gray-900 dark:text-gray-100 flex-1">
                  {item.producto}
                </h3>
                <span
                  className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${
                    item.diferenciaPorcentaje > 20
                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      : item.diferenciaPorcentaje > 10
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  }`}
                >
                  {item.diferenciaPorcentaje.toFixed(1)}% diferencia
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <div>
                    <div className="text-gray-600 dark:text-gray-400 text-xs">Más barato</div>
                    <div className="font-semibold text-green-600 dark:text-green-400">
                      {formatPrice(item.precioMinimo)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {item.proveedorMasBarato}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-red-600 dark:text-red-400" />
                  <div>
                    <div className="text-gray-600 dark:text-gray-400 text-xs">Más caro</div>
                    <div className="font-semibold text-red-600 dark:text-red-400">
                      {formatPrice(item.precioMaximo)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {item.proveedorMasCaro}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                Precio promedio: {formatPrice(item.precioPromedio)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
