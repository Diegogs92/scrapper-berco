import { NextRequest, NextResponse } from 'next/server';
import { createUser, getUserByEmail } from '@/lib/auth';
import { db } from '@/lib/firebase';

/**
 * Endpoint especial para crear el primer usuario desarrollador
 * Solo funciona si no hay usuarios en el sistema
 */
export async function POST(req: NextRequest) {
  try {
    // Verificar que no existan usuarios
    const usersSnapshot = await db.collection('users').limit(1).get();
    if (!usersSnapshot.empty) {
      return NextResponse.json(
        { error: 'Ya existen usuarios en el sistema. Use /api/auth/register para crear más usuarios.' },
        { status: 403 }
      );
    }

    const { email, password, nombre } = await req.json();

    if (!email || !password || !nombre) {
      return NextResponse.json(
        { error: 'Email, contraseña y nombre son requeridos' },
        { status: 400 }
      );
    }

    // Verificar que el email no exista (por si acaso)
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json({ error: 'El email ya está registrado' }, { status: 409 });
    }

    // Crear el primer usuario como desarrollador
    const user = await createUser(email, password, nombre, 'desarrollador');

    return NextResponse.json({
      message: 'Usuario desarrollador creado exitosamente',
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        rol: user.rol,
      },
    });
  } catch (error) {
    console.error('POST /api/auth/init error', error);
    return NextResponse.json({ error: 'Error al crear usuario desarrollador' }, { status: 500 });
  }
}
