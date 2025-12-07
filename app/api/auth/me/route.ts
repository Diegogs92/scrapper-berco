import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, getUserById } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const user = await getUserById(decoded.userId);
    if (!user || !user.activo) {
      return NextResponse.json({ error: 'Usuario no encontrado o inactivo' }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        rol: user.rol,
      },
    });
  } catch (error) {
    console.error('GET /api/auth/me error', error);
    return NextResponse.json({ error: 'Error al obtener información del usuario' }, { status: 500 });
  }
}
