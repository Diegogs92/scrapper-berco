# Scraper Berco - Sistema de Análisis de Precios

Sistema web para analizar y comparar precios de productos de la competencia.

## Características

- **Dashboard interactivo** con filtros avanzados
- **Análisis de precios** por producto (comparación entre proveedores)
- **Estadísticas por proveedor** (cantidad de productos, precios promedio, descuentos)
- **Importación de datos** desde Google Sheets
- **Base de datos SQLite** para desarrollo local
- **Diseño responsive** con modo oscuro

## Tecnologías

- **Next.js 15** con App Router
- **TypeScript**
- **Tailwind CSS**
- **Better-SQLite3** (base de datos)
- **Lucide React** (iconos)

## Instalación Local

1. Instalar dependencias:
```bash
npm install
```

2. Ejecutar en modo desarrollo:
```bash
npm run dev
```

3. Abrir navegador en [http://localhost:3000](http://localhost:3000)

## Importar Datos desde Google Sheets

### Opción 1: API Manual

Hacer una petición POST a `/api/import` con el siguiente formato:

```json
{
  "products": [
    {
      "url": "https://ejemplo.com/producto",
      "nombre": "Producto Ejemplo",
      "precio": 1000,
      "descuento": "10%",
      "categoria": "Categoría > Subcategoría",
      "proveedor": "Proveedor",
      "status": "OK",
      "precioLista": 1100
    }
  ],
  "clearBefore": false
}
```

### Opción 2: Script de Google Apps Script

Agregar esta función a tu proyecto de Google Apps Script:

```javascript
function exportarAAPI() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Scraper');
  const data = sheet.getDataRange().getValues();

  const products = [];
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row[0]) continue; // Saltar filas vacías

    products.push({
      url: row[0],
      nombre: row[1],
      precio: row[2],
      descuento: row[3],
      categoria: row[4],
      proveedor: row[5],
      status: row[6],
      fecha_scraping: new Date().toISOString(),
      precioLista: row[10] || null
    });
  }

  // Para desarrollo local
  const url = 'http://localhost:3000/api/import';

  // Para producción en Vercel
  // const url = 'https://tu-proyecto.vercel.app/api/import';

  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({
      products: products,
      clearBefore: true // Limpiar DB antes de importar
    }),
    muteHttpExceptions: true
  };

  try {
    const response = UrlFetchApp.fetch(url, options);
    const result = JSON.parse(response.getContentText());
    Logger.log('Importación exitosa: ' + result.message);
    SpreadsheetApp.getUi().alert('Importación exitosa: ' + result.imported + ' productos');
  } catch (error) {
    Logger.log('Error: ' + error);
    SpreadsheetApp.getUi().alert('Error en la importación: ' + error);
  }
}
```

## Estructura del Proyecto

```
scrapper-berco/
├── app/
│   ├── api/
│   │   ├── products/      # API de productos
│   │   ├── stats/         # API de estadísticas
│   │   └── import/        # API de importación
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Página principal
│   └── globals.css        # Estilos globales
├── components/
│   ├── ProductTable.tsx   # Tabla de productos
│   ├── FilterPanel.tsx    # Panel de filtros
│   ├── PriceAnalysis.tsx  # Análisis de precios
│   └── ProviderStats.tsx  # Estadísticas de proveedores
├── lib/
│   └── db.ts              # Capa de base de datos
├── types/
│   └── index.ts           # Definiciones TypeScript
└── products.db            # Base de datos SQLite (auto-generada)
```

## Deployment en Vercel

### 1. Preparar el proyecto

```bash
# Instalar Vercel CLI (opcional)
npm i -g vercel

# Iniciar sesión
vercel login
```

### 2. Configurar proyecto en Vercel

1. Ir a [vercel.com](https://vercel.com)
2. Hacer clic en "New Project"
3. Importar el repositorio
4. Vercel detectará automáticamente Next.js

### 3. Configurar variables de entorno (opcional)

Si necesitas configurar variables, agregar en Vercel Dashboard:
- Settings → Environment Variables

### 4. Deploy

```bash
# Deploy a producción
vercel --prod
```

### Nota sobre la base de datos en Vercel

**SQLite no persiste en Vercel** (sistema de archivos efímero). Para producción, considera:

1. **Vercel Postgres** (recomendado)
2. **Supabase**
3. **PlanetScale**
4. **MongoDB Atlas**

Para migrar de SQLite a Postgres, modificar `lib/db.ts` usando `pg` o `@vercel/postgres`.

## Filtros Disponibles

- **Búsqueda** por nombre o categoría
- **Proveedor** (dropdown)
- **Categoría** (dropdown)
- **Rango de precios** (mínimo y máximo)
- **Solo con descuento** (checkbox)

## Análisis

### Análisis de Precios
- Muestra productos con mayor diferencia de precio entre proveedores
- Indica proveedor más barato y más caro
- Calcula porcentaje de diferencia

### Estadísticas por Proveedor
- Cantidad de productos
- Precio promedio
- Productos con descuento
- Descuento promedio

## Licencia

MIT
