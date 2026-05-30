import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const story = await prisma.story.findUnique({
      where: { id: params.id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        chapters: {
          orderBy: { number: 'asc' },
        },
        contentWarnings: true,
        stats: true,
      },
    });

    if (!story) {
      return NextResponse.json(
        { error: 'Histoire non trouvée' },
        { status: 404 }
      );
    }

    // Vérifier les permissions pour les histoires non publiées
    if (story.status !== 'PUBLISHED') {
      const session = await getServerSession(authOptions);
      if (!session?.user || (session.user.id !== story.authorId && session.user.role !== 'ADMIN' && session.user.role !== 'MODERATOR')) {
        return NextResponse.json(
          { error: 'Accès non autorisé' },
          { status: 403 }
        );
      }
    }

    return NextResponse.json({ story });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'histoire:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    // Vérifier que l'histoire existe et appartient à l'utilisateur
    const story = await prisma.story.findUnique({
      where: { id: params.id },
    });

    if (!story) {
      return NextResponse.json(
        { error: 'Histoire non trouvée' },
        { status: 404 }
      );
    }

    if (story.authorId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    const body = await req.json();

    // Mettre à jour l'histoire
    const updatedStory = await prisma.story.update({
      where: { id: params.id },
      data: {
        title: body.title,
        subtitle: body.subtitle,
        description: body.description,
        genre: JSON.stringify(body.genre), // Convert array to JSON string
        accentColor: body.accentColor,
        updatedAt: new Date(),
      },
      include: {
        chapters: true,
        contentWarnings: true,
        stats: true,
      },
    });

    return NextResponse.json({ story: updatedStory });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'histoire:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    // Vérifier que l'histoire existe et appartient à l'utilisateur
    const story = await prisma.story.findUnique({
      where: { id: params.id },
    });

    if (!story) {
      return NextResponse.json(
        { error: 'Histoire non trouvée' },
        { status: 404 }
      );
    }

    if (story.authorId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    // Supprimer l'histoire (cascade supprimera chapitres, warnings, stats)
    await prisma.story.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'histoire:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    );
  }
}
