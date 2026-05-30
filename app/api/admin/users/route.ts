import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Vérifier l'authentification et le rôle admin
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      );
    }

    // Récupérer tous les utilisateurs avec leurs statistiques
    const users = await prisma.user.findMany({
      include: {
        _count: {
          select: {
            stories: true,
          },
        },
        stories: {
          select: {
            stats: {
              select: {
                views: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Formater les données
    const formattedUsers = users.map((user) => ({
      id: user.id,
      name: user.name || 'Anonyme',
      email: user.email,
      image: user.image,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt.toISOString(),
      _count: {
        stories: user._count.stories,
      },
      totalViews: user.stories.reduce((sum, story) => sum + (story.stats?.views || 0), 0),
    }));

    return NextResponse.json({
      users: formattedUsers,
      total: formattedUsers.length,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
