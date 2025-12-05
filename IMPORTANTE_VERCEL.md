# ⚠️ IMPORTANTE: Base de Datos en Vercel

## El proyecto está configurado con SQLite para desarrollo local

**SQLite NO FUNCIONARÁ en Vercel** porque el filesystem es efímero (los datos se borran en cada deploy).

## Opciones para producción en Vercel:

### Opción 1: Vercel Postgres (Recomendado)

1. **Crear base de datos en Vercel:**
   - Ve a tu proyecto en [vercel.com](https://vercel.com)
   - Storage → Create Database → Postgres
   - Copia las variables de entorno automáticamente

2. **Instalar dependencia:**
```bash
npm install @vercel/postgres
```

3. **Modificar `lib/db.ts`:**
```typescript
import { sql } from '@vercel/postgres';

export async function getProducts(filters: ProductFilter = {}) {
  const { rows } = await sql`SELECT * FROM products WHERE ...`;
  return rows;
}

// Repetir para todas las funciones
```

### Opción 2: Desplegar solo para prueba (datos temporales)

Si solo quieres ver cómo se ve en producción y no te importa que los datos se pierdan:

1. Deploy normalmente con `vercel --prod`
2. Los datos se perderán en cada nuevo deploy
3. Tendrás que re-importar después de cada deploy

### Opción 3: Usar otro servicio de base de datos

- **Supabase** (Postgres gratuito)
- **PlanetScale** (MySQL serverless)
- **MongoDB Atlas** (NoSQL)
- **Railway** (Postgres/MySQL)

## Estado actual del deploy

El proyecto se puede desplegar a Vercel AHORA para ver el frontend, pero:
- ✅ La interfaz funcionará perfectamente
- ✅ Podrás importar datos vía API
- ❌ Los datos se perderán en cada deploy
- ❌ No hay persistencia entre reinicios

## Recomendación

**Para desarrollo/pruebas:** Usa local con SQLite (ya configurado)

**Para producción:** Migra a Vercel Postgres siguiendo la Opción 1
