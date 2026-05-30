import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { writeFile } from 'fs/promises';
import path from 'path';

/**
 * POST /api/upload/cover
 * Upload d'une image de couverture pour une histoire
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('cover') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier fourni' },
        { status: 400 }
      );
    }

    // Vérifier le type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Format non supporté. Utilisez JPG, PNG ou WebP.' },
        { status: 400 }
      );
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Le fichier est trop volumineux. Maximum 5 Mo.' },
        { status: 400 }
      );
    }

    // Générer un nom unique
    const ext = file.name.split('.').pop() || 'jpg';
    const fileName = `cover-${session.user.id}-${Date.now()}.${ext}`;
    const filePath = path.join(process.cwd(), 'public', 'uploads', 'covers', fileName);

    // Créer le dossier si nécessaire
    const { mkdir } = await import('fs/promises');
    await mkdir(path.dirname(filePath), { recursive: true });

    // Écrire le fichier
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    const url = `/uploads/covers/${fileName}`;

    return NextResponse.json({ success: true, url });
  } catch (error) {
    console.error('Erreur lors de l\'upload de couverture:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de l\'upload' },
      { status: 500 }
    );
  }
}
