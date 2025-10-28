<#
PowerShell helper script to:
- remove local git history (after confirmation)
- create a new single-clean commit
- create a new GitHub repo (requires gh CLI and gh auth login)
- build Angular app into docs/ for GitHub Pages
- push and publish
- deploy to Vercel (requires vercel CLI and vercel login)

Usage: run in an elevated PowerShell prompt from the repo root:
  cd C:\FMRTest
  .\scripts\create_and_deploy.ps1

The script is interactive and will ask for confirmation before destructive steps.
#>

param()

Set-StrictMode -Version Latest
Push-Location (Split-Path -Path $MyInvocation.MyCommand.Path -Parent) | Out-Null
Set-Location ..

$repoName = "FMRTEST"
$visibility = "public"  # public or private
$baseHref = "/$repoName/"

Write-Host "Repository name: $repoName" -ForegroundColor Cyan
Write-Host "Visibility: $visibility" -ForegroundColor Cyan

$confirm = Read-Host "This will REMOVE local git history by deleting the .git folder. Type YES to proceed (or anything else to abort)"
if ($confirm -ne 'YES') {
    Write-Host "Aborted by user. No changes made." -ForegroundColor Yellow
    Exit 1
}

if (Test-Path .git) {
    Write-Host "Removing existing .git directory..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force .git
}

Write-Host "Initializing new git repository..." -ForegroundColor Green
git init
git add -A
git commit -m "Initial commit"
git branch -M main

# Ensure gh available
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    Write-Host "GitHub CLI 'gh' not found. Please install and run 'gh auth login' before running this script." -ForegroundColor Red
    Exit 1
}

if ($visibility -eq 'public') { $visFlag = '--public' } else { $visFlag = '--private' }

Write-Host "Creating GitHub repo '$repoName' (this will push the current branch)..." -ForegroundColor Green
gh repo create $repoName $visFlag --source=. --remote=origin --push --confirm

# Build Angular into docs/ for GitHub Pages
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "npm is not available. Please install Node.js and npm." -ForegroundColor Red
    Exit 1
}

Write-Host "Installing npm dependencies (this may take a while)..." -ForegroundColor Green
npm install

Write-Host "Building Angular app into docs/ ..." -ForegroundColor Green
# Use npx to avoid global ng requirement
npx ng build --configuration production --output-path docs --base-href $baseHref

if (Test-Path docs) {
    git add docs -A
    # commit only if there are changes
    $status = git status --porcelain
    if ($status) {
        git commit -m "Add GitHub Pages build output"
        git push origin main
    } else {
        Write-Host "No changes to docs/ to commit." -ForegroundColor Yellow
    }
} else {
    Write-Host "Build failed: docs/ not found." -ForegroundColor Red
}

Write-Host "GitHub Pages setup: go to your repository's Settings → Pages and set 'main' branch and '/docs' folder as the source if it's not already set." -ForegroundColor Cyan

# Deploy to Vercel (optional)
if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
    Write-Host "Vercel CLI not found. Skipping Vercel deployment. To install: npm i -g vercel" -ForegroundColor Yellow
    Write-Host "If you want to deploy to Vercel, install the CLI and run this script again or run 'vercel' interactively." -ForegroundColor Yellow
} else {
    Write-Host "Deploying to Vercel (you will be prompted to login if needed)..." -ForegroundColor Green
    vercel login
    vercel --prod --confirm
}

Write-Host "Done. If you used a private repo earlier, verify repository visibility on GitHub." -ForegroundColor Green

Pop-Location | Out-Null
