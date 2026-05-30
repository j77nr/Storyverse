import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('📚 Vérification des histoires dans la base de données...\n');

  // Récupérer toutes les histoires
  const stories = await prisma.story.findMany({
    include: {
      author: {
        select: {
          name: true,
          email: true,
        },
      },
      chapters: {
        select: {
          id: true,
          number: true,
          title: true,
        },
        orderBy: {
          number: 'asc',
        },
      },
      _count: {
        select: {
          chapters: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  console.log(`📊 Total: ${stories.length} histoire(s) trouvée(s)\n`);

  if (stories.length === 0) {
    console.log('❌ Aucune histoire trouvée dans la base de données.');
    console.log('💡 Assurez-vous d\'avoir soumis une histoire via /author/submit\n');
    return;
  }

  stories.forEach((story, index) => {
    console.log(`${'='.repeat(80)}`);
    console.log(`📖 Histoire #${index + 1}`);
    console.log(`${'='.repeat(80)}`);
    console.log(`🆔 ID: ${story.id}`);
    console.log(`📝 Titre: ${story.title}`);
    console.log(`✍️  Auteur: ${story.author.name} (${story.author.email})`);
    console.log(`📊 Statut: ${story.status}`);
    console.log(`🎨 Genres: ${story.genre}`);
    console.log(`📅 Créé le: ${story.createdAt.toLocaleString()}`);
    console.log(`📚 Chapitres: ${story._count.chapters}`);
    
    if (story.chapters.length > 0) {
      console.log(`\n   Chapitres:`);
      story.chapters.forEach(chapter => {
        console.log(`   ${chapter.number}. ${chapter.title}`);
      });
    }
    
    console.log(`\n📊 Modération:`);
    console.log(`   Score: ${story.moderationScore}/100`);
    console.log(`   Flags: ${story.moderationFlags || 'Aucun'}`);
    
    if (story.status === 'PUBLISHED') {
      console.log(`\n✅ Cette histoire devrait apparaître dans la bibliothèque`);
    } else if (story.status === 'PENDING') {
      console.log(`\n⏳ Cette histoire est en révision (pas encore visible publiquement)`);
    } else if (story.status === 'REJECTED') {
      console.log(`\n❌ Cette histoire a été rejetée`);
    }
    
    console.log('');
  });

  // Compter les auteurs
  const authors = await prisma.user.findMany({
    where: {
      role: 'AUTHOR',
    },
    include: {
      stories: {
        where: {
          status: 'PUBLISHED',
        },
      },
    },
  });

  console.log(`\n${'='.repeat(80)}`);
  console.log(`👥 AUTEURS`);
  console.log(`${'='.repeat(80)}`);
  console.log(`Total: ${authors.length} auteur(s)\n`);

  authors.forEach(author => {
    console.log(`✍️  ${author.name} (${author.email})`);
    console.log(`   Histoires publiées: ${author.stories.length}`);
    console.log('');
  });
}

main()
  .catch((error) => {
    console.error('❌ Erreur:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
