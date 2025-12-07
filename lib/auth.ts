import { db } from './firebase';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, UserRole } from '@/types';

const JWT_SECRET = process.env.JWT_SECRET || 'scraper-secret-key-change-in-production';
const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(userId: string, email: string, rol: UserRole): string {
  return jwt.sign({ userId, email, rol }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): { userId: string; email: string; rol: UserRole } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string; rol: UserRole };
    return decoded;
  } catch {
    return null;
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const snapshot = await db.collection('users').where('email', '==', email).limit(1).get();
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as User;
}

export async function getUserById(userId: string): Promise<User | null> {
  const doc = await db.collection('users').doc(userId).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as User;
}

export async function createUser(
  email: string,
  password: string,
  nombre: string,
  rol: UserRole
): Promise<User> {
  const hashedPassword = await hashPassword(password);
  const userData = {
    email,
    password: hashedPassword,
    nombre,
    rol,
    activo: true,
    fechaCreacion: new Date().toISOString(),
  };

  const docRef = await db.collection('users').add(userData);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...userWithoutPassword } = userData;
  return { id: docRef.id, ...userWithoutPassword } as User;
}

export async function updateLastAccess(userId: string): Promise<void> {
  await db.collection('users').doc(userId).update({
    ultimoAcceso: new Date().toISOString(),
  });
}

export function checkPermission(userRole: UserRole, requiredRole: UserRole): boolean {
  const roleHierarchy: Record<UserRole, number> = {
    desarrollador: 3,
    administrador: 2,
    consultante: 1,
  };

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}
