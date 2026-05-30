# Script PowerShell pour copier l'image dans le projet

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  StoryVerse - Copie d'Image" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Chemin de destination
$destinationFolder = "D:\Mes Projets\Hero_Project\public\images"
$destinationFile = "$destinationFolder\reading-person.jpg"

# Créer le dossier si nécessaire
if (-not (Test-Path $destinationFolder)) {
    New-Item -ItemType Directory -Path $destinationFolder -Force | Out-Null
    Write-Host "✓ Dossier créé : $destinationFolder" -ForegroundColor Green
}

Write-Host "Instructions :" -ForegroundColor Yellow
Write-Host "1. Localisez votre image (la personne lisant un livre)"
Write-Host "2. Copiez le chemin complet de l'image"
Write-Host "3. Collez-le ci-dessous quand demandé"
Write-Host ""

# Demander le chemin de l'image source
$sourcePath = Read-Host "Entrez le chemin complet de votre image"

# Vérifier si le fichier existe
if (Test-Path $sourcePath) {
    try {
        # Copier l'image
        Copy-Item -Path $sourcePath -Destination $destinationFile -Force
        Write-Host ""
        Write-Host "✓ Image copiée avec succès !" -ForegroundColor Green
        Write-Host "  Destination : $destinationFile" -ForegroundColor Gray
        Write-Host ""
        Write-Host "Prochaines étapes :" -ForegroundColor Yellow
        Write-Host "1. Lancez : npm run dev" -ForegroundColor White
        Write-Host "2. Ouvrez : http://localhost:3000" -ForegroundColor White
        Write-Host "3. Admirez votre nouvelle page d'accueil !" -ForegroundColor White
        Write-Host ""
    }
    catch {
        Write-Host ""
        Write-Host "✗ Erreur lors de la copie : $_" -ForegroundColor Red
        Write-Host ""
        Write-Host "Solution alternative :" -ForegroundColor Yellow
        Write-Host "1. Ouvrez l'Explorateur Windows"
        Write-Host "2. Naviguez vers : $destinationFolder"
        Write-Host "3. Copiez-collez votre image manuellement"
        Write-Host "4. Renommez-la en : reading-person.jpg"
        Write-Host ""
    }
}
else {
    Write-Host ""
    Write-Host "✗ Fichier introuvable : $sourcePath" -ForegroundColor Red
    Write-Host ""
    Write-Host "Vérifiez que :" -ForegroundColor Yellow
    Write-Host "- Le chemin est correct"
    Write-Host "- Le fichier existe"
    Write-Host "- Vous avez les permissions de lecture"
    Write-Host ""
}

Write-Host "Appuyez sur une touche pour fermer..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
