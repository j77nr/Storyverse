import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    // Vérifier l'authentification et le rôle ADMIN
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Accès refusé. Rôle ADMIN requis.' },
        { status: 403 }
      );
    }

    // Récupérer le filtre de statut
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    // Récupérer les candidatures
    const applications = await prisma.authorApplication.findMany({
      where: status ? { status: status as any } : undefined,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
            status: true,
          },
        },
      },
      orderBy: {
        submittedAt: 'desc',
      },
    });

    return NextResponse.json({ applications });
  } catch (error) {
    console.error('Erreur lors de la récupération des candidatures:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    );
  }
}
