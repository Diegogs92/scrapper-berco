export interface Product {
  id: number;
  url: string;
  nombre: string;
  precio: number;
  descuento: string;
  categoria: string;
  proveedor: string;
  status: string;
  fecha_scraping: string;
  precioLista?: number;
}

export interface ProductFilter {
  proveedor?: string;
  categoria?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  hasDiscount?: boolean;
}

export interface PriceStats {
  producto: string;
  precioMinimo: number;
  precioMaximo: number;
  precioPromedio: number;
  proveedorMasBarato: string;
  proveedorMasCaro: string;
  diferenciaPorcentaje: number;
}

export interface ProviderStats {
  proveedor: string;
  cantidadProductos: number;
  precioPromedio: number;
  productosConDescuento: number;
  descuentoPromedio: number;
}
