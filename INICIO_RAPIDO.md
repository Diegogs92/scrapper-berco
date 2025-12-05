# 🚀 Inicio Rápido

## 1. Instalar y ejecutar

```bash
# Instalar dependencias (ya hecho)
npm install

# Ejecutar servidor
npm run dev
```

## 2. Acceder al dashboard

Abre tu navegador en: **http://localhost:3002** (o el puerto que te indique)

## 3. Cargar datos de prueba

```bash
curl -X POST http://localhost:3002/api/import \
  -H "Content-Type: application/json" \
  -d @scripts/seed-data.json
```

O desde PowerShell (Windows):

```powershell
$body = Get-Content scripts/seed-data.json -Raw
Invoke-RestMethod -Uri "http://localhost:3002/api/import" -Method POST -ContentType "application/json" -Body $body
```

## 4. Importar desde Google Sheets

### Paso 1: Copiar el script
1. Abre `scripts/google-apps-script.js`
2. Copia todo el contenido

### Paso 2: Configurar en Google Sheets
1. Abre tu Google Sheet con los datos
2. **Extensiones** → **Apps Script**
3. Pega el código
4. Modifica la línea 20 con tu URL:
   ```javascript
   const URL_API = 'http://localhost:3002/api/import';
   ```
5. Guarda (Ctrl+S)

### Paso 3: Ejecutar
1. Selecciona la función `exportarAAPI` en el dropdown
2. Haz clic en **Ejecutar** (▶️)
3. Autoriza los permisos la primera vez
4. ¡Listo! Los datos se importarán automáticamente

## 5. Explorar el dashboard

### Pestaña "Productos"
- Ver todos los productos importados
- Filtrar por proveedor, categoría, precio
- Buscar productos específicos
- Ver enlaces a productos originales

### Pestaña "Análisis de Precios"
- Comparar precios entre proveedores
- Ver quién tiene el mejor precio
- Identificar productos con mayor diferencia de precio

### Pestaña "Estadísticas"
- Métricas por proveedor
- Precios promedio
- Productos con descuento
- Descuentos promedio

## 6. Próximos pasos

- 📖 Lee [README.md](README.md) para más detalles
- 📚 Consulta [INSTRUCCIONES.md](INSTRUCCIONES.md) para guía completa
- 🚀 Cuando estés listo para producción, sigue las instrucciones de Vercel en el README

## Estructura de archivos importante

```
scrapper-berco/
├── scripts/
│   ├── seed-data.json          # Datos de prueba
│   └── google-apps-script.js   # Script para Google Sheets
├── README.md                    # Documentación general
├── INSTRUCCIONES.md            # Guía completa paso a paso
└── INICIO_RAPIDO.md            # Este archivo
```

## Comandos útiles

```bash
# Desarrollo
npm run dev              # Iniciar servidor de desarrollo

# Producción
npm run build            # Compilar para producción
npm start                # Ejecutar en modo producción

# Linting
npm run lint             # Verificar código
```

## Endpoints principales

- `GET /api/products` - Obtener productos con filtros
- `GET /api/products?action=providers` - Lista de proveedores
- `GET /api/stats?type=price-analysis` - Análisis de precios
- `GET /api/stats?type=provider-stats` - Estadísticas por proveedor
- `POST /api/import` - Importar productos

## Solución rápida de problemas

### No aparece nada en el dashboard
```bash
# Cargar datos de prueba
curl -X POST http://localhost:3002/api/import \
  -H "Content-Type: application/json" \
  -d @scripts/seed-data.json
```

### Error en Google Apps Script
1. Verifica que el servidor esté corriendo (`npm run dev`)
2. Verifica la URL en el script (debe incluir `http://`)
3. Para desarrollo local, usa `http://localhost:3002/api/import`

### Base de datos no persiste en Vercel
- SQLite no funciona en Vercel (filesystem efímero)
- Migra a Vercel Postgres (ver README.md)

## ¿Necesitas ayuda?

1. Revisa los logs: `npm run dev` te mostrará errores en consola
2. Abre la consola del navegador (F12) para ver errores del frontend
3. Consulta [INSTRUCCIONES.md](INSTRUCCIONES.md) para más detalles
