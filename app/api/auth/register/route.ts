import { NextRequest, NextResponse } from 'next/server';
import { createUser, getUserByEmail, verifyToken } from '@/lib/auth';
import { UserRole } from '@/types';

export async function POST(req: NextRequest) {
  try {
    // Verificar autenticación y permisos
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    // Solo desarrollador y administrador pueden registrar usuarios
    if (decoded.rol !== 'desarrollador' && decoded.rol !== 'administrador') {
      return NextResponse.json({ error: 'Sin permisos para registrar usuarios' }, { status: 403 });
    }

    const { email, password, nombre, rol } = await req.json();

    if (!email || !password || !nombre || !rol) {
      return NextResponse.json(
        { error: 'Email, contraseña, nombre y rol son requeridos' },
        { status: 400 }
      );
    }

    // Validar rol
    const validRoles: UserRole[] = ['desarrollador', 'administrador', 'consultante'];
    if (!validRoles.includes(rol)) {
      return NextResponse.json({ error: 'Rol inválido' }, { status: 400 });
    }

    // Solo desarrollador puede crear otros desarrolladores
    if (rol === 'desarrollador' && decoded.rol !== 'desarrollador') {
      return NextResponse.json(
        { error: 'Solo el desarrollador puede crear otros desarrolladores' },
        { status: 403 }
      );
    }

    // Verificar que el email no exista
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json({ error: 'El email ya está registrado' }, { status: 409 });
    }

    const user = await createUser(email, password, nombre, rol);

    return NextResponse.json({
      message: 'Usuario creado exitosamente',
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        rol: user.rol,
      },
    });
  } catch (error) {
    console.error('POST /api/auth/register error', error);
    return NextResponse.json({ error: 'Error al registrar usuario' }, { status: 500 });
  }
}
