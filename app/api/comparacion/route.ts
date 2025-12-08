import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';

type ProductItem = {
  id: string;
  nombre: string;
  precio: number;
  descuento: string;
  proveedor: string;
  url: string;
  fechaScraping: string;
};

// Normalize product name for better matching
function normalizeProductName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    // Remove common words that don't help in matching
    .replace(/\b(producto|pack|unidad|unidades|u\.|pack|x|cm|mm|m|kg|gr|g|ml|l|lts)\b/gi, '')
    // Remove extra spaces
    .replace(/\s+/g, ' ')
    .trim();
}

// Calculate similarity between two strings using Levenshtein distance
function calculateSimilarity(str1: string, str2: string): number {
  const s1 = normalizeProductName(str1);
  const s2 = normalizeProductName(str2);

  // Exact match
  if (s1 === s2) return 1.0;

  // One contains the other
  if (s1.includes(s2) || s2.includes(s1)) {
    const longer = Math.max(s1.length, s2.length);
    const shorter = Math.min(s1.length, s2.length);
    return shorter / longer * 0.95; // Slightly less than exact match
  }

  // Levenshtein distance
  const matrix: number[][] = [];
  const len1 = s1.length;
  const len2 = s2.length;

  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  const distance = matrix[len1][len2];
  const maxLength = Math.max(len1, len2);
  return maxLength === 0 ? 1.0 : 1 - distance / maxLength;
}

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const limit = Math.min(parseInt(params.get('limit') || '50', 10), 100);

    // Get all successful results
    const snapshot = await db
      .collection('resultados')
      .where('status', '==', 'success')
      .orderBy('fechaScraping', 'desc')
      .limit(500)
      .get();

    // Convert to array of products
    const allProducts: ProductItem[] = snapshot.docs
      .map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          nombre: data.nombre || '',
          precio: Number(data.precio) || 0,
          descuento: data.descuento || '',
          proveedor: data.proveedor || '',
          url: data.url || '',
          fechaScraping: data.fechaScraping || '',
        };
      })
      .filter((p) => p.nombre && p.precio > 0);

    // Group similar products using similarity threshold
    const SIMILARITY_THRESHOLD = 0.85; // 85% similarity required
    const productGroups: ProductItem[][] = [];
    const processed = new Set<string>();

    for (const product of allProducts) {
      if (processed.has(product.id)) continue;

      const group: ProductItem[] = [product];
      processed.add(product.id);

      // Find similar products from different providers
      for (const otherProduct of allProducts) {
        if (
          processed.has(otherProduct.id) ||
          product.proveedor === otherProduct.proveedor // Skip same provider
        ) {
          continue;
        }

        const similarity = calculateSimilarity(product.nombre, otherProduct.nombre);
        if (similarity >= SIMILARITY_THRESHOLD) {
          group.push(otherProduct);
          processed.add(otherProduct.id);
        }
      }

      // Only add groups with multiple providers
      if (group.length > 1) {
        productGroups.push(group);
      }
    }

    // Calculate stats for each group
    const comparisons = productGroups
      .map((items) => {
        const precios = items.map(item => item.precio);
        const minPrecio = Math.min(...precios);
        const maxPrecio = Math.max(...precios);
        const diferencia = maxPrecio - minPrecio;
        const diferenciaPorcentaje = ((diferencia / maxPrecio) * 100).toFixed(1);

        const proveedorMasBarato = items.find(item => item.precio === minPrecio)?.proveedor || '';
        const proveedorMasCaro = items.find(item => item.precio === maxPrecio)?.proveedor || '';

        // Use the most recent product name as the group name
        const sortedByDate = [...items].sort((a, b) =>
          new Date(b.fechaScraping).getTime() - new Date(a.fechaScraping).getTime()
        );

        return {
          nombre: sortedByDate[0].nombre, // Use most recent product name
          cantidadProveedores: items.length,
          precioMinimo: minPrecio,
          precioMaximo: maxPrecio,
          diferencia,
          diferenciaPorcentaje: Number(diferenciaPorcentaje),
          proveedorMasBarato,
          proveedorMasCaro,
          items: items.sort((a, b) => a.precio - b.precio), // Sort by price
        };
      })
      .sort((a, b) => b.diferencia - a.diferencia) // Sort by price difference descending
      .slice(0, limit);

    return NextResponse.json({ comparisons, total: comparisons.length });
  } catch (error) {
    console.error('GET /api/comparacion error', error);
    return NextResponse.json({ error: 'No se pudieron obtener las comparaciones' }, { status: 500 });
  }
}
