import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seed...');

  // Créer un utilisateur auteur de test
  const author = await prisma.user.upsert({
    where: { email: 'author@test.com' },
    update: {},
    create: {
      email: 'author@test.com',
      name: 'Sophie Laurent',
      role: 'AUTHOR',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie',
    },
  });

  console.log('✅ Auteur créé:', author.name);

  // Créer une histoire featured
  const story1 = await prisma.story.upsert({
    where: { id: 'echoes-of-tomorrow' },
    update: {},
    create: {
      id: 'echoes-of-tomorrow',
      authorId: author.id,
      title: 'Échos du Futur',
      subtitle: 'Une odyssée temporelle',
      description:
        "Dans un futur où le voyage temporel est devenu réalité, une scientifique découvre que chaque modification du passé crée des échos dans le présent. Une course contre la montre commence pour préserver la réalité telle que nous la connaissons.",
      genre: JSON.stringify(['Science-Fiction', 'Thriller', 'Philosophique']),
      coverImage: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&q=80',
      accentColor: 'bg-blue-500',
      featured: true,
      status: 'PUBLISHED',
      publishedAt: new Date(),
    },
  });

  console.log('✅ Histoire créée:', story1.title);

  // Créer les chapitres
  const chapter1 = await prisma.chapter.upsert({
    where: { id: 'ch1-echoes' },
    update: {},
    create: {
      id: 'ch1-echoes',
      storyId: story1.id,
      number: 1,
      title: 'Le Premier Saut',
      readTime: '6 min',
      mood: 'mysterious',
      content: `Le laboratoire était plongé dans une semi-obscurité, éclairé uniquement par la lueur bleutée des écrans holographiques. Dr. Elena Voss ajustait les derniers paramètres de la machine temporelle, ses mains tremblant légèrement d'anticipation.

"Tous les systèmes sont opérationnels," annonça son assistant, Marcus, depuis la salle de contrôle. "Êtes-vous certaine de vouloir faire ça ?"

Elena sourit, un mélange d'excitation et d'appréhension dans les yeux. "Nous avons passé dix ans à construire cette machine. Il est temps de voir si nos théories tiennent la route."

Elle s'installa dans la capsule, sentant le métal froid contre sa peau. Les parois transparentes se refermèrent autour d'elle avec un sifflement pneumatique. À travers le verre, elle pouvait voir Marcus qui lui faisait un signe d'encouragement.

"Initialisation dans 10... 9... 8..."

Le compte à rebours résonnait dans ses oreilles. Elena ferma les yeux, se concentrant sur sa destination : Paris, 1889, l'année de l'Exposition Universelle.

"3... 2... 1... Activation !"

Un flash aveuglant. Une sensation de chute infinie. Puis... le silence.

Quand Elena ouvrit les yeux, elle n'était plus dans le laboratoire. Devant elle se dressait la Tour Eiffel, fraîchement construite, brillant sous le soleil de l'après-midi. Des hommes en haut-de-forme et des femmes en robes victoriennes déambulaient dans les rues pavées.

"Ça a marché," murmura-t-elle, incrédule. "Ça a vraiment marché."

Mais quelque chose n'allait pas. Dans le ciel, elle aperçut une anomalie : une déchirure dans le tissu même de la réalité, pulsant d'une lumière étrange. Un écho. Le premier de nombreux à venir.`,
    },
  });

  const chapter2 = await prisma.chapter.upsert({
    where: { id: 'ch2-echoes' },
    update: {},
    create: {
      id: 'ch2-echoes',
      storyId: story1.id,
      number: 2,
      title: 'Les Déchirures',
      readTime: '7 min',
      mood: 'dark',
      content: `Elena observait la déchirure avec fascination et terreur. Ce n'était pas prévu dans les calculs. Personne n'avait anticipé que le voyage temporel pourrait littéralement déchirer le continuum espace-temps.

Elle sortit son dispositif de communication quantique, espérant pouvoir contacter Marcus dans le présent. L'appareil grésilla, puis la voix de son assistant résonna, déformée par les interférences temporelles.

"Elena ? Vous... là ? Les... anormales... partout !"

"Marcus, je te reçois mal. Qu'est-ce qui se passe ?"

"Les échos... se multiplient... retour... immédiat..."

La communication coupa. Elena sentit son cœur s'accélérer. Si les échos se multipliaient dans le présent, cela signifiait que sa simple présence dans le passé créait des perturbations catastrophiques.

Elle devait rentrer. Maintenant.

Mais alors qu'elle s'apprêtait à activer le dispositif de retour, une main se posa sur son épaule. Elena se retourna brusquement pour découvrir un homme vêtu d'un costume anachronique - moderne, comme le sien.

"Vous ne devriez pas être ici," dit l'homme avec un accent qu'elle ne parvenait pas à identifier. "Aucun de nous ne devrait."

"Qui êtes-vous ?"

"Quelqu'un qui a fait la même erreur que vous. Il y a longtemps." Il désigna la déchirure dans le ciel. "Chaque voyage crée un écho. Chaque écho affaiblit la réalité. Et quand suffisamment d'échos s'accumulent..."

Il n'eut pas besoin de finir sa phrase. Elena comprit. La réalité elle-même pourrait s'effondrer.

"Comment arrêter ça ?"

L'homme sourit tristement. "C'est la question à un million de dollars, n'est-ce pas ? Suivez-moi. Il y a quelqu'un que vous devez rencontrer."`,
    },
  });

  const chapter3 = await prisma.chapter.upsert({
    where: { id: 'ch3-echoes' },
    update: {},
    create: {
      id: 'ch3-echoes',
      storyId: story1.id,
      number: 3,
      title: 'Le Gardien du Temps',
      readTime: '8 min',
      mood: 'mysterious',
      content: `L'homme mystérieux guida Elena à travers les rues de Paris, évitant soigneusement les zones où les déchirures temporelles étaient les plus visibles. Ils arrivèrent devant un petit café, apparemment ordinaire, mais Elena remarqua quelque chose d'étrange : les gens à l'intérieur semblaient figés dans le temps.

"Bienvenue dans un point d'ancrage," expliqua l'homme. "Un endroit où le temps est... stabilisé. Nous pouvons parler ici sans créer d'autres échos."

À l'intérieur, une femme âgée les attendait, sirotant un café qui ne refroidissait jamais. Ses yeux brillaient d'une sagesse qui semblait transcender les âges.

"Docteur Voss," dit-elle avec un sourire chaleureux. "Je vous attendais. Ou plutôt, je savais que vous viendriez. Le temps est drôle comme ça."

"Qui êtes-vous ?"

"Je suis ce que certains appellent une Gardienne du Temps. Mon rôle est de réparer les dégâts causés par les voyageurs temporels... comme vous."

Elena sentit la culpabilité l'envahir. "Je ne savais pas. Nous pensions avoir tout calculé."

"Personne ne sait jamais," répondit la Gardienne avec douceur. "C'est la nature humaine d'explorer, de repousser les limites. Mais le temps n'est pas fait pour être manipulé. Chaque voyage crée des paradoxes, des échos qui résonnent à travers les âges."

"Comment puis-je réparer ce que j'ai fait ?"

La Gardienne posa sa tasse et se leva. "Il n'y a qu'une seule façon. Vous devez retourner au moment exact où vous êtes arrivée et annuler votre présence. Mais attention : si vous échouez, les échos se multiplieront jusqu'à ce que la réalité elle-même se fragmente."

Elena déglutit. "Et si je réussis ?"

"Alors vous n'aurez jamais fait ce voyage. Vous ne vous souviendrez de rien. Mais le monde sera sauvé."

C'était un choix impossible. Sacrifier sa découverte, ses souvenirs, tout ce pour quoi elle avait travaillé... ou condamner la réalité à l'effondrement.

Elena regarda par la fenêtre les déchirures qui se multipliaient dans le ciel. Elle savait ce qu'elle devait faire.

"Montrez-moi comment."`,
    },
  });

  console.log('✅ Chapitres créés: 3');

  // Créer les statistiques
  const stats1 = await prisma.storyStats.upsert({
    where: { storyId: story1.id },
    update: {},
    create: {
      storyId: story1.id,
      views: 1247,
      likes: 89,
      bookmarks: 34,
    },
  });

  console.log('✅ Statistiques créées');

  // Créer une deuxième histoire (non featured)
  const story2 = await prisma.story.upsert({
    where: { id: 'whispers-in-the-dark' },
    update: {},
    create: {
      id: 'whispers-in-the-dark',
      authorId: author.id,
      title: "Murmures dans l'Ombre",
      subtitle: 'Un mystère gothique',
      description:
        "Un manoir isolé. Des murmures dans les murs. Une famille maudite. Quand Clara hérite du domaine de Blackwood, elle découvre que certains secrets sont enterrés pour de bonnes raisons.",
      genre: JSON.stringify(['Mystère', 'Gothique', 'Horreur']),
      coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80',
      accentColor: 'bg-purple-600',
      featured: false,
      status: 'PUBLISHED',
      publishedAt: new Date(),
    },
  });

  console.log('✅ Histoire 2 créée:', story2.title);

  // Créer un chapitre pour la deuxième histoire
  await prisma.chapter.create({
    data: {
      storyId: story2.id,
      number: 1,
      title: "L'Héritage",
      readTime: '6 min',
      mood: 'dark',
      content: `La pluie martelait les vitres du taxi alors que Clara Blackwood approchait du manoir pour la première fois. À travers le rideau de pluie, la silhouette imposante de la demeure ancestrale se découpait contre le ciel d'orage, telle une bête endormie.

"Vous êtes sûre de vouloir rester ici ?" demanda le chauffeur, son accent écossais épais trahissant son inquiétude. "Ce n'est pas un endroit pour une jeune femme seule."

Clara serra sa valise contre elle. "C'est mon héritage. Je n'ai nulle part ailleurs où aller."

Le testament de son grand-oncle Édouard avait été clair : le manoir de Blackwood lui revenait, à condition qu'elle y vive pendant au moins un an. Après des années de galère à Londres, c'était une opportunité qu'elle ne pouvait refuser, malgré les avertissements de l'avocat.

Le taxi s'arrêta devant le perron. Clara paya le chauffeur et sortit sous la pluie battante. La porte d'entrée massive s'ouvrit avant même qu'elle ne frappe, révélant une femme âgée au visage sévère.

"Mademoiselle Blackwood, je présume. Je suis Mme Thornton, la gouvernante. Entrez, vous allez attraper la mort."

L'intérieur du manoir était aussi imposant que l'extérieur : hauts plafonds, boiseries sombres, portraits de famille aux regards sévères. Une odeur de renfermé et de vieux livres imprégnait l'air.

"Votre chambre est prête," dit Mme Thornton en montant l'escalier. "Je vous conseille de ne pas vous aventurer dans l'aile ouest après la tombée de la nuit."

"Pourquoi ?"

La gouvernante s'arrêta, se retournant lentement. "Parce que c'est là qu'ils murmurent."

"Qui ça, 'ils' ?"

Mais Mme Thornton était déjà repartie, laissant Clara seule dans le couloir sombre, avec pour seule compagnie le bruit de la pluie et, si elle tendait bien l'oreille, quelque chose qui ressemblait étrangement à des murmures lointains.`,
    },
  });

  // Créer les statistiques pour la deuxième histoire
  await prisma.storyStats.create({
    data: {
      storyId: story2.id,
      views: 543,
      likes: 32,
      bookmarks: 15,
    },
  });

  console.log('✅ Chapitre et statistiques créés pour histoire 2');

  console.log('🎉 Seed terminé avec succès!');
  console.log('\n📊 Résumé:');
  console.log('- 1 auteur créé');
  console.log('- 2 histoires créées (1 featured, 1 normale)');
  console.log('- 4 chapitres créés');
  console.log('- 2 statistiques créées');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
