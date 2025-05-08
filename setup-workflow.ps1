# Main script to set up CI/CD workflow in a new repository.

#Requires -Version 5.0

# Set strict error handling and optimize web operations
$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

# Import modules
. "$PSScriptRoot\setup-scripts\ErrorHandling.ps1"
. "$PSScriptRoot\setup-scripts\WorkflowFiles.ps1"
. "$PSScriptRoot\setup-scripts\PackageManagement.ps1"
. "$PSScriptRoot\setup-scripts\ProjectFiles.ps1"

# Script variables
$Directories = @(
  ".github/workflows",
  "Server",
  "Server/__tests__",
  "client",
  "client/__tests__"
)

# Main execution block
try {
  Write-Host "Starting CI/CD workflow setup..." -ForegroundColor Green
    
  # Check PowerShell version
  if ($PSVersionTable.PSVersion.Major -lt 5) {
    Write-ErrorLog "This script requires PowerShell 5.0 or later."
  }
    
  # Create all required directories
  New-Directory -Path $Directories
    
  # Initialize workflow files
  Initialize-WorkflowFiles
    
  # Set up package.json files
  Initialize-PackageFiles
    
  # Set up ESLint config, test files, Docker files, and .gitignore
  Initialize-ProjectFiles
    
  # Success message with detailed next steps
  Write-Host "`nCI/CD Setup Complete!" -ForegroundColor Green
  Write-Host "`nNext steps:" -ForegroundColor Yellow
  Write-Host "1. Run 'npm install' in the root directory to install dependencies for all workspaces." -ForegroundColor Cyan
  Write-Host "2. Set up the following GitHub secrets in your repository settings:" -ForegroundColor Cyan
  Write-Host "   - DOCKER_USERNAME: Your Docker Hub username" -ForegroundColor Cyan
  Write-Host "   - DOCKER_PASSWORD: Your Docker Hub password or access token" -ForegroundColor Cyan
  Write-Host "   - DISCORD_WEBHOOK_URL: Discord webhook URL for notifications" -ForegroundColor Cyan
  Write-Host "   - EMAIL_SENDER: Email address for sending notifications" -ForegroundColor Cyan
  Write-Host "   - EMAIL_PASSWORD: Password/app password for the email account" -ForegroundColor Cyan
  Write-Host "3. Set up the following GitHub variables in your repository settings:" -ForegroundColor Cyan
  Write-Host "   - DOCKER_REPO: Your Docker repository (e.g., yourdockerusername/your-repo-name)" -ForegroundColor Cyan
  Write-Host "   - EMAIL_RECIPIENTS: Comma-separated list of email recipients" -ForegroundColor Cyan
  Write-Host "4. Run 'npm run format' to ensure all files are properly formatted before committing." -ForegroundColor Cyan
  Write-Host "5. Review generated files (e.g., package.json, Dockerfile,...) and customize as needed for your project." -ForegroundColor Cyan
  Write-Host "6. Commit all generated files to your Git repository and push to GitHub to trigger the CI/CD pipeline." -ForegroundColor Cyan
  
}
catch {
  Write-ErrorLog "An unexpected error occurred in the main execution block: $($_.Exception.Message)" "Main"
}
