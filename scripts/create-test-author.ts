import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Création d\'un utilisateur auteur de test...\n');

  // Vérifier si l'utilisateur existe déjà
  const existingUser = await prisma.user.findUnique({
    where: { email: 'author@test.com' },
  });

  if (existingUser) {
    console.log('ℹ️  L\'utilisateur existe déjà !');
    console.log('📧 Email:', existingUser.email);
    console.log('👤 Nom:', existingUser.name);
    console.log('🎭 Rôle:', existingUser.role);
    console.log('🆔 ID:', existingUser.id);
    console.log('\n💡 Vous pouvez utiliser cet utilisateur pour tester le système.');
    
    // Proposer de mettre à jour le rôle si nécessaire
    if (existingUser.role !== 'AUTHOR') {
      console.log('\n⚠️  Attention: Le rôle actuel est', existingUser.role);
      console.log('   Pour le changer en AUTHOR, ouvrez Prisma Studio:');
      console.log('   npx prisma studio\n');
    }
    return;
  }

  // Créer un utilisateur avec le rôle AUTHOR
  const author = await prisma.user.create({
    data: {
      email: 'author@test.com',
      name: 'Test Author',
      role: 'AUTHOR',
      status: 'ACTIVE',
    },
  });

  console.log('✅ Utilisateur auteur créé avec succès !');
  console.log('📧 Email:', author.email);
  console.log('👤 Nom:', author.name);
  console.log('🎭 Rôle:', author.role);
  console.log('🆔 ID:', author.id);
  console.log('\n💡 Vous pouvez maintenant utiliser cet utilisateur pour tester le système.');
  console.log('   Pour vous connecter, vous devrez configurer OAuth ou créer une session manuellement.\n');
}

main()
  .catch((error) => {
    console.error('❌ Erreur lors de la création de l\'utilisateur:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
