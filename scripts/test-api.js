/**
 * Script de test automatisé pour les API de StoryVerse
 * Usage: node scripts/test-api.js
 */

const BASE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';

// Couleurs pour la console
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

// Helper pour afficher les résultats
function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logTest(name, passed, details = '') {
  totalTests++;
  if (passed) {
    passedTests++;
    log(`✅ ${name}`, colors.green);
  } else {
    failedTests++;
    log(`❌ ${name}`, colors.red);
    if (details) log(`   ${details}`, colors.yellow);
  }
}

// Helper pour faire des requêtes
async function request(endpoint, options = {}) {
  try {
    const url = `${BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json().catch(() => ({}));
    return { response, data };
  } catch (error) {
    return { error: error.message };
  }
}

// Tests des API de statistiques
async function testStatsAPI() {
  log('\n📊 Tests des API de Statistiques', colors.cyan);
  log('─'.repeat(50), colors.cyan);

  // Test 1: GET /api/stories/[id]/view
  const { response: viewGetRes, data: viewGetData } = await request('/api/stories/test-id/view');
  logTest(
    'GET /api/stories/[id]/view',
    viewGetRes.ok && typeof viewGetData.views === 'number',
    viewGetRes.ok ? '' : `Status: ${viewGetRes.status}`
  );

  // Test 2: POST /api/stories/[id]/view (devrait échouer car l'histoire n'existe pas)
  const { response: viewPostRes } = await request('/api/stories/test-id/view', {
    method: 'POST',
  });
  logTest(
    'POST /api/stories/[id]/view (histoire inexistante)',
    viewPostRes.status === 404,
    viewPostRes.status === 404 ? '' : `Status attendu: 404, reçu: ${viewPostRes.status}`
  );

  // Test 3: GET /api/stories/[id]/like
  const { response: likeGetRes, data: likeGetData } = await request('/api/stories/test-id/like');
  logTest(
    'GET /api/stories/[id]/like',
    likeGetRes.ok && typeof likeGetData.likes === 'number',
    likeGetRes.ok ? '' : `Status: ${likeGetRes.status}`
  );

  // Test 4: GET /api/stories/[id]/bookmark
  const { response: bookmarkGetRes, data: bookmarkGetData } = await request(
    '/api/stories/test-id/bookmark'
  );
  logTest(
    'GET /api/stories/[id]/bookmark',
    bookmarkGetRes.ok && typeof bookmarkGetData.bookmarks === 'number',
    bookmarkGetRes.ok ? '' : `Status: ${bookmarkGetRes.status}`
  );
}

// Tests des API d'histoires
async function testStoriesAPI() {
  log('\n📚 Tests des API d\'Histoires', colors.cyan);
  log('─'.repeat(50), colors.cyan);

  // Test 1: GET /api/stories
  const { response: storiesRes, data: storiesData } = await request('/api/stories');
  logTest(
    'GET /api/stories',
    storiesRes.ok && Array.isArray(storiesData),
    storiesRes.ok ? `${storiesData.length} histoires trouvées` : `Status: ${storiesRes.status}`
  );

  // Test 2: GET /api/stories/[id] (avec un ID invalide)
  const { response: storyRes } = await request('/api/stories/invalid-id');
  logTest(
    'GET /api/stories/[id] (ID invalide)',
    storyRes.status === 404,
    storyRes.status === 404 ? '' : `Status attendu: 404, reçu: ${storyRes.status}`
  );
}

// Tests des API d'auteurs
async function testAuthorsAPI() {
  log('\n✍️ Tests des API d\'Auteurs', colors.cyan);
  log('─'.repeat(50), colors.cyan);

  // Test 1: GET /api/authors
  const { response: authorsRes, data: authorsData } = await request('/api/authors');
  logTest(
    'GET /api/authors',
    authorsRes.ok && Array.isArray(authorsData),
    authorsRes.ok ? `${authorsData.length} auteurs trouvés` : `Status: ${authorsRes.status}`
  );

  // Test 2: POST /api/author/apply (sans authentification)
  const { response: applyRes } = await request('/api/author/apply', {
    method: 'POST',
    body: JSON.stringify({
      bio: 'Test bio',
      motivation: 'Test motivation',
    }),
  });
  logTest(
    'POST /api/author/apply (sans auth)',
    applyRes.status === 401,
    applyRes.status === 401 ? '' : `Status attendu: 401, reçu: ${applyRes.status}`
  );
}

// Tests des API admin (doivent échouer sans authentification)
async function testAdminAPI() {
  log('\n👑 Tests des API Admin (sans auth)', colors.cyan);
  log('─'.repeat(50), colors.cyan);

  // Test 1: GET /api/admin/stats
  const { response: statsRes } = await request('/api/admin/stats');
  logTest(
    'GET /api/admin/stats (sans auth)',
    statsRes.status === 401,
    statsRes.status === 401 ? '' : `Status attendu: 401, reçu: ${statsRes.status}`
  );

  // Test 2: GET /api/admin/applications
  const { response: appsRes } = await request('/api/admin/applications');
  logTest(
    'GET /api/admin/applications (sans auth)',
    appsRes.status === 401,
    appsRes.status === 401 ? '' : `Status attendu: 401, reçu: ${appsRes.status}`
  );

  // Test 3: GET /api/admin/stories
  const { response: storiesRes } = await request('/api/admin/stories');
  logTest(
    'GET /api/admin/stories (sans auth)',
    storiesRes.status === 401,
    storiesRes.status === 401 ? '' : `Status attendu: 401, reçu: ${storiesRes.status}`
  );

  // Test 4: GET /api/admin/users
  const { response: usersRes } = await request('/api/admin/users');
  logTest(
    'GET /api/admin/users (sans auth)',
    usersRes.status === 401,
    usersRes.status === 401 ? '' : `Status attendu: 401, reçu: ${usersRes.status}`
  );
}

// Tests de validation
async function testValidation() {
  log('\n🔍 Tests de Validation', colors.cyan);
  log('─'.repeat(50), colors.cyan);

  // Test 1: POST /api/stories/submit avec données invalides (sans auth)
  const { response: submitRes } = await request('/api/stories/submit', {
    method: 'POST',
    body: JSON.stringify({
      title: '', // Titre vide
      description: 'Test',
    }),
  });
  logTest(
    'POST /api/stories/submit (données invalides)',
    submitRes.status === 401 || submitRes.status === 400,
    `Status: ${submitRes.status}`
  );
}

// Fonction principale
async function runTests() {
  log('\n🧪 TESTS AUTOMATISÉS - StoryVerse API', colors.blue);
  log('═'.repeat(50), colors.blue);
  log(`Base URL: ${BASE_URL}`, colors.yellow);
  log('═'.repeat(50), colors.blue);

  await testStatsAPI();
  await testStoriesAPI();
  await testAuthorsAPI();
  await testAdminAPI();
  await testValidation();

  // Résumé
  log('\n📊 RÉSUMÉ DES TESTS', colors.blue);
  log('═'.repeat(50), colors.blue);
  log(`Total: ${totalTests} tests`, colors.cyan);
  log(`✅ Réussis: ${passedTests}`, colors.green);
  log(`❌ Échoués: ${failedTests}`, colors.red);
  log(`📈 Taux de réussite: ${((passedTests / totalTests) * 100).toFixed(1)}%`, colors.yellow);
  log('═'.repeat(50), colors.blue);

  if (failedTests === 0) {
    log('\n🎉 Tous les tests sont passés!', colors.green);
  } else {
    log('\n⚠️ Certains tests ont échoué. Vérifiez les détails ci-dessus.', colors.yellow);
  }

  // Code de sortie
  process.exit(failedTests > 0 ? 1 : 0);
}

// Exécuter les tests
runTests().catch((error) => {
  log(`\n❌ Erreur lors de l'exécution des tests: ${error.message}`, colors.red);
  process.exit(1);
});
