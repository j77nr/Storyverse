import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Approuver une histoire
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    // Vérifier l'authentification et le rôle admin
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      );
    }

    const { action, rejectionReason } = await req.json();
    const storyId = params.id;

    // Vérifier que l'histoire existe
    const story = await prisma.story.findUnique({
      where: { id: storyId },
    });

    if (!story) {
      return NextResponse.json(
        { error: 'Histoire non trouvée' },
        { status: 404 }
      );
    }

    // Effectuer l'action
    if (action === 'approve') {
      // Approuver l'histoire
      const updatedStory = await prisma.story.update({
        where: { id: storyId },
        data: {
          status: 'PUBLISHED',
          rejectionReason: null,
        },
      });

      return NextResponse.json({
        message: 'Histoire approuvée avec succès',
        story: updatedStory,
      });
    } else if (action === 'reject') {
      // Rejeter l'histoire
      if (!rejectionReason || rejectionReason.trim().length < 10) {
        return NextResponse.json(
          { error: 'Une raison de rejet est requise (minimum 10 caractères)' },
          { status: 400 }
        );
      }

      const updatedStory = await prisma.story.update({
        where: { id: storyId },
        data: {
          status: 'REJECTED',
          rejectionReason: rejectionReason.trim(),
        },
      });

      return NextResponse.json({
        message: 'Histoire rejetée',
        story: updatedStory,
      });
    } else {
      return NextResponse.json(
        { error: 'Action invalide' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Erreur lors de la modération de l\'histoire:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// Supprimer une histoire
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    // Vérifier l'authentification et le rôle admin
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      );
    }

    const storyId = params.id;

    // Vérifier que l'histoire existe
    const story = await prisma.story.findUnique({
      where: { id: storyId },
      include: {
        chapters: true,
      },
    });

    if (!story) {
      return NextResponse.json(
        { error: 'Histoire non trouvée' },
        { status: 404 }
      );
    }

    // Supprimer d'abord les chapitres
    await prisma.chapter.deleteMany({
      where: { storyId },
    });

    // Puis supprimer l'histoire
    await prisma.story.delete({
      where: { id: storyId },
    });

    return NextResponse.json({
      message: 'Histoire supprimée avec succès',
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'histoire:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
