import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, comparePassword, generateToken, updateLastAccess } from '@/lib/auth';
import { db } from '@/lib/firebase';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email y contraseña requeridos' }, { status: 400 });
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    // Obtener password hash
    const userDoc = await db.collection('users').doc(user.id).get();
    const userData = userDoc.data();
    if (!userData?.password) {
      return NextResponse.json({ error: 'Usuario sin contraseña configurada' }, { status: 500 });
    }

    const isValid = await comparePassword(password, userData.password);
    if (!isValid) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    if (!user.activo) {
      return NextResponse.json({ error: 'Usuario inactivo' }, { status: 403 });
    }

    // Actualizar último acceso
    await updateLastAccess(user.id);

    // Generar token
    const token = generateToken(user.id, user.email, user.rol);

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        rol: user.rol,
      },
    });
  } catch (error) {
    console.error('POST /api/auth/login error', error);
    return NextResponse.json({ error: 'Error al iniciar sesión' }, { status: 500 });
  }
}
