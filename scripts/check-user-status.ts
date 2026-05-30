import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Vérification des utilisateurs et candidatures...\n');

  // Récupérer tous les utilisateurs
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true,
    },
  });

  console.log('👥 UTILISATEURS:');
  console.log('─'.repeat(80));
  users.forEach((user) => {
    console.log(`📧 Email: ${user.email}`);
    console.log(`👤 Nom: ${user.name}`);
    console.log(`🎭 Rôle: ${user.role}`);
    console.log(`📊 Statut: ${user.status}`);
    console.log(`🆔 ID: ${user.id}`);
    console.log('─'.repeat(80));
  });

  // Récupérer toutes les candidatures
  const applications = await prisma.authorApplication.findMany({
    include: {
      user: {
        select: {
          email: true,
          name: true,
        },
      },
    },
  });

  console.log('\n📝 CANDIDATURES:');
  console.log('─'.repeat(80));
  if (applications.length === 0) {
    console.log('Aucune candidature trouvée.');
  } else {
    applications.forEach((app) => {
      console.log(`👤 Utilisateur: ${app.user.name} (${app.user.email})`);
      console.log(`📊 Statut: ${app.status}`);
      console.log(`📅 Soumis le: ${app.submittedAt.toLocaleString()}`);
      if (app.reviewedAt) {
        console.log(`✅ Révisé le: ${app.reviewedAt.toLocaleString()}`);
      }
      if (app.reviewNote) {
        console.log(`📝 Note: ${app.reviewNote}`);
      }
      console.log('─'.repeat(80));
    });
  }

  console.log('\n💡 ACTIONS SUGGÉRÉES:');
  const pendingApps = applications.filter(app => app.status === 'PENDING');
  const visitorsWithApprovedApps = applications.filter(
    app => app.status === 'APPROVED' && 
    users.find(u => u.id === app.userId && u.role === 'VISITOR')
  );

  if (pendingApps.length > 0) {
    console.log(`⚠️  ${pendingApps.length} candidature(s) en attente d'approbation`);
    console.log('   → Ouvrez Prisma Studio: npx prisma studio');
    console.log('   → Table AuthorApplication → Changez status à APPROVED');
  }

  if (visitorsWithApprovedApps.length > 0) {
    console.log(`⚠️  ${visitorsWithApprovedApps.length} utilisateur(s) avec candidature approuvée mais rôle VISITOR`);
    console.log('   → Ouvrez Prisma Studio: npx prisma studio');
    console.log('   → Table User → Changez role à AUTHOR');
  }

  if (pendingApps.length === 0 && visitorsWithApprovedApps.length === 0) {
    console.log('✅ Tout est en ordre !');
  }
}

main()
  .catch((error) => {
    console.error('❌ Erreur:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
