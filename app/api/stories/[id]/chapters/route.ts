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
 * POST - Ajouter un nouveau chapitre à une histoire
 */
export async function POST(
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
      include: {
        chapters: {
          orderBy: { number: 'desc' },
          take: 1,
        },
      },
    });

    if (!story) {
      return NextResponse.json(
        { error: 'Histoire non trouvée' },
        { status: 404 }
      );
    }

    // Vérifier que l'utilisateur est l'auteur
    if (story.authorId !== session.user.id) {
      return NextResponse.json(
        { error: 'Vous n\'êtes pas l\'auteur de cette histoire' },
        { status: 403 }
      );
    }

    // Parser et valider les données
    const body = await req.json();
    const data = chapterSchema.parse(body);

    // Calculer le numéro du nouveau chapitre
    const lastChapterNumber = story.chapters[0]?.number || 0;
    const newChapterNumber = lastChapterNumber + 1;

    // Calculer le temps de lecture (environ 200 mots par minute)
    const wordCount = data.content.split(/\s+/).length;
    const readTime = `${Math.ceil(wordCount / 200)} min`;

    // Créer le chapitre
    const chapter = await prisma.chapter.create({
      data: {
        storyId: params.id,
        number: newChapterNumber,
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
        id: chapter.id,
        number: chapter.number,
        title: chapter.title,
        readTime: chapter.readTime,
      },
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout du chapitre:', error);

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
 * GET - Récupérer tous les chapitres d'une histoire
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const chapters = await prisma.chapter.findMany({
      where: { storyId: params.id },
      orderBy: { number: 'asc' },
      select: {
        id: true,
        number: true,
        title: true,
        readTime: true,
        mood: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ chapters });
  } catch (error) {
    console.error('Erreur lors de la récupération des chapitres:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    );
  }
}
