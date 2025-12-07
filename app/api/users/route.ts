import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { db } from '@/lib/firebase';
import { User } from '@/types';

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

    // Solo desarrollador y administrador pueden ver usuarios
    if (decoded.rol !== 'desarrollador' && decoded.rol !== 'administrador') {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 });
    }

    const snapshot = await db.collection('users').orderBy('fechaCreacion', 'desc').get();
    const users: User[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = data;
      return { id: doc.id, ...userWithoutPassword } as User;
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error('GET /api/users error', error);
    return NextResponse.json({ error: 'Error al obtener usuarios' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
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

    // Solo desarrollador y administrador pueden modificar usuarios
    if (decoded.rol !== 'desarrollador' && decoded.rol !== 'administrador') {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 });
    }

    const { userId, activo } = await req.json();
    if (!userId || activo === undefined) {
      return NextResponse.json({ error: 'userId y activo son requeridos' }, { status: 400 });
    }

    // No permitir desactivar al desarrollador
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const userData = userDoc.data();
    if (userData?.rol === 'desarrollador' && decoded.rol !== 'desarrollador') {
      return NextResponse.json(
        { error: 'Solo el desarrollador puede modificar otros desarrolladores' },
        { status: 403 }
      );
    }

    await db.collection('users').doc(userId).update({ activo });

    return NextResponse.json({ message: 'Usuario actualizado' });
  } catch (error) {
    console.error('PATCH /api/users error', error);
    return NextResponse.json({ error: 'Error al actualizar usuario' }, { status: 500 });
  }
}
