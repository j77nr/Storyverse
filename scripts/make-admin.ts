import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2];

  if (!email) {
    console.log('❌ Usage: npx tsx scripts/make-admin.ts <email>');
    console.log('   Exemple: npx tsx scripts/make-admin.ts hatejulyy77@gmail.com');
    process.exit(1);
  }

  console.log(`🔍 Recherche de l'utilisateur: ${email}\n`);

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    console.log(`❌ Utilisateur non trouvé: ${email}`);
    process.exit(1);
  }

  console.log('👤 Utilisateur trouvé:');
  console.log(`   Nom: ${user.name}`);
  console.log(`   Email: ${user.email}`);
  console.log(`   Rôle actuel: ${user.role}\n`);

  if (user.role === 'ADMIN') {
    console.log('✅ Cet utilisateur est déjà ADMIN !');
    process.exit(0);
  }

  // Changer le rôle en ADMIN
  const updatedUser = await prisma.user.update({
    where: { email },
    data: { role: 'ADMIN' },
  });

  console.log('✅ Rôle changé avec succès !');
  console.log(`   Nouveau rôle: ${updatedUser.role}`);
  console.log('\n🎉 Vous pouvez maintenant accéder à:');
  console.log('   → http://localhost:3000/admin/applications');
  console.log('\n⚠️  Note: Déconnectez-vous et reconnectez-vous pour que le changement prenne effet.');
}

main()
  .catch((error) => {
    console.error('❌ Erreur:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
