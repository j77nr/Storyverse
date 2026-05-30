import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Schema de validation pour un chapitre
const chapterSchema = z.object({
  title: z.string().min(1, 'Le titre est requis').max(200),
  content: z.string().min(100, 'Le contenu doit faire au moins 100 caractères'),
  mood: z.string().optional(),
});

/**
 * GET - Récupérer un chapitre spécifique
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string; number: string } }
) {
  try {
    const chapterNumber = parseInt(params.number);

    if (isNaN(chapterNumber)) {
      return NextResponse.json(
        { error: 'Numéro de chapitre invalide' },
        { status: 400 }
      );
    }

    const chapter = await prisma.chapter.findFirst({
      where: {
        storyId: params.id,
        number: chapterNumber,
      },
      include: {
        story: {
          select: {
            title: true,
            authorId: true,
          },
        },
      },
    });

    if (!chapter) {
      return NextResponse.json(
        { error: 'Chapitre non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({ chapter });
  } catch (error) {
    console.error('Erreur lors de la récupération du chapitre:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    );
  }
}

/**
 * PUT - Modifier un chapitre
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string; number: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const chapterNumber = parseInt(params.number);

    if (isNaN(chapterNumber)) {
      return NextResponse.json(
        { error: 'Numéro de chapitre invalide' },
        { status: 400 }
      );
    }

    // Vérifier que le chapitre existe et que l'utilisateur est l'auteur
    const chapter = await prisma.chapter.findFirst({
      where: {
        storyId: params.id,
        number: chapterNumber,
      },
      include: {
        story: {
          select: {
            authorId: true,
          },
        },
      },
    });

    if (!chapter) {
      return NextResponse.json(
        { error: 'Chapitre non trouvé' },
        { status: 404 }
      );
    }

    if (chapter.story.authorId !== session.user.id) {
      return NextResponse.json(
        { error: 'Vous n\'êtes pas l\'auteur de cette histoire' },
        { status: 403 }
      );
    }

    // Parser et valider les données
    const body = await req.json();
    const data = chapterSchema.parse(body);

    // Calculer le temps de lecture
    const wordCount = data.content.split(/\s+/).length;
    const readTime = `${Math.ceil(wordCount / 200)} min`;

    // Mettre à jour le chapitre
    const updatedChapter = await prisma.chapter.update({
      where: { id: chapter.id },
      data: {
        title: data.title,
        content: data.content,
        readTime,
        mood: data.mood,
      },
    });

    // Mettre à jour la date de modification de l'histoire
    await prisma.story.update({
      where: { id: params.id },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({
      success: true,
      chapter: {
        id: updatedChapter.id,
        number: updatedChapter.number,
        title: updatedChapter.title,
        readTime: updatedChapter.readTime,
      },
    });
  } catch (error) {
    console.error('Erreur lors de la modification du chapitre:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Supprimer un chapitre
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string; number: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const chapterNumber = parseInt(params.number);

    if (isNaN(chapterNumber)) {
      return NextResponse.json(
        { error: 'Numéro de chapitre invalide' },
        { status: 400 }
      );
    }

    // Vérifier que le chapitre existe et que l'utilisateur est l'auteur
    const chapter = await prisma.chapter.findFirst({
      where: {
        storyId: params.id,
        number: chapterNumber,
      },
      include: {
        story: {
          select: {
            authorId: true,
          },
        },
      },
    });

    if (!chapter) {
      return NextResponse.json(
        { error: 'Chapitre non trouvé' },
        { status: 404 }
      );
    }

    if (chapter.story.authorId !== session.user.id) {
      return NextResponse.json(
        { error: 'Vous n\'êtes pas l\'auteur de cette histoire' },
        { status: 403 }
      );
    }

    // Supprimer le chapitre
    await prisma.chapter.delete({
      where: { id: chapter.id },
    });

    // Réorganiser les numéros des chapitres suivants
    await prisma.$executeRaw`
      UPDATE chapters 
      SET number = number - 1 
      WHERE storyId = ${params.id} 
      AND number > ${chapterNumber}
    `;

    // Mettre à jour la date de modification de l'histoire
    await prisma.story.update({
      where: { id: params.id },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({
      success: true,
      message: 'Chapitre supprimé avec succès',
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du chapitre:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    );
  }
}
