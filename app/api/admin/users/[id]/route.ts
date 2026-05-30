import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Modifier un utilisateur (rôle ou statut)
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

    const { action, role, status } = await req.json();
    const userId = params.id;

    // Vérifier que l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Empêcher de modifier son propre compte
    if (userId === session.user.id) {
      return NextResponse.json(
        { error: 'Vous ne pouvez pas modifier votre propre compte' },
        { status: 400 }
      );
    }

    // Effectuer l'action
    if (action === 'change_role') {
      // Changer le rôle
      if (!role || !['VISITOR', 'AUTHOR', 'ADMIN'].includes(role)) {
        return NextResponse.json(
          { error: 'Rôle invalide' },
          { status: 400 }
        );
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { role },
      });

      return NextResponse.json({
        message: `Rôle changé en ${role}`,
        user: updatedUser,
      });
    } else if (action === 'change_status') {
      // Changer le statut
      if (!status || !['ACTIVE', 'SUSPENDED', 'BANNED'].includes(status)) {
        return NextResponse.json(
          { error: 'Statut invalide' },
          { status: 400 }
        );
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { status },
      });

      return NextResponse.json({
        message: `Statut changé en ${status}`,
        user: updatedUser,
      });
    } else {
      return NextResponse.json(
        { error: 'Action invalide' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Erreur lors de la modification de l\'utilisateur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// Supprimer un utilisateur
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

    const userId = params.id;

    // Vérifier que l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        stories: true,
        authorApplication: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Empêcher de supprimer son propre compte
    if (userId === session.user.id) {
      return NextResponse.json(
        { error: 'Vous ne pouvez pas supprimer votre propre compte' },
        { status: 400 }
      );
    }

    // Supprimer en cascade
    // 1. Supprimer les chapitres des histoires
    for (const story of user.stories) {
      await prisma.chapter.deleteMany({
        where: { storyId: story.id },
      });
    }

    // 2. Supprimer les histoires
    await prisma.story.deleteMany({
      where: { authorId: userId },
    });

    // 3. Supprimer la candidature auteur si elle existe
    if (user.authorApplication) {
      await prisma.authorApplication.delete({
        where: { userId },
      });
    }

    // 4. Supprimer les sessions
    await prisma.session.deleteMany({
      where: { userId },
    });

    // 5. Supprimer les comptes liés
    await prisma.account.deleteMany({
      where: { userId },
    });

    // 6. Supprimer l'utilisateur
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({
      message: 'Utilisateur supprimé avec succès',
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
