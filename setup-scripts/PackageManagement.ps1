# Package management functions for CI/CD setup

# Function to create or update package.json files
function Set-PackageJsonContent {
  param (
    [Parameter(Mandatory = $true)]
    [string]$FilePath,
    [Parameter(Mandatory = $true)]
    [string]$DefaultName,
    [string]$DefaultVersion = "1.0.0",
    [string]$DefaultDescription = "Project Component",
    [string]$DefaultMain,
    [string]$DefaultType,
    [hashtable]$ScriptsToAdd = @{},
    [hashtable]$DevDependenciesToAdd = @{},
    [hashtable]$DependenciesToAdd = @{},
    [array]$Workspaces,
    [string]$DefaultLicense = "UNLICENSED",
    [bool]$IsPrivate = $false
  )
  
  try {
    # Create or load package.json
    if (Test-Path -Path $FilePath) {
      $packageJsonContent = Get-Content -Path $FilePath -Raw
      $packageJsonObject = $packageJsonContent | ConvertFrom-Json
      Write-Host "    Updating existing $FilePath" -ForegroundColor Cyan
    }
    else {
      Write-Host "    Creating new $FilePath" -ForegroundColor Cyan
      $packageJsonObject = [PSCustomObject]@{
        name        = $DefaultName
        version     = $DefaultVersion
        description = $DefaultDescription
      }
      if ($DefaultMain) { $packageJsonObject | Add-Member -MemberType NoteProperty -Name "main" -Value $DefaultMain }
      if ($DefaultType) { $packageJsonObject | Add-Member -MemberType NoteProperty -Name "type" -Value $DefaultType }
      if ($IsPrivate) { $packageJsonObject | Add-Member -MemberType NoteProperty -Name "private" -Value $true }
      if ($DefaultLicense) { $packageJsonObject | Add-Member -MemberType NoteProperty -Name "license" -Value $DefaultLicense }
    }
    
    # Add scripts if provided
    if ($ScriptsToAdd.Count -gt 0) {
      if (-not $packageJsonObject.PSObject.Properties.Name.Contains("scripts")) {
        $packageJsonObject | Add-Member -MemberType NoteProperty -Name "scripts" -Value ([PSCustomObject]@{})
      }
      
      foreach ($script in $ScriptsToAdd.GetEnumerator()) {
        $packageJsonObject.scripts | Add-Member -MemberType NoteProperty -Name $script.Key -Value $script.Value -Force
      }
    }
    
    # Add dependencies if provided
    if ($DependenciesToAdd.Count -gt 0) {
      if (-not $packageJsonObject.PSObject.Properties.Name.Contains("dependencies")) {
        $packageJsonObject | Add-Member -MemberType NoteProperty -Name "dependencies" -Value ([PSCustomObject]@{})
      }
      
      foreach ($dep in $DependenciesToAdd.GetEnumerator()) {
        $packageJsonObject.dependencies | Add-Member -MemberType NoteProperty -Name $dep.Key -Value $dep.Value -Force
      }
    }
    
    # Add devDependencies if provided
    if ($DevDependenciesToAdd.Count -gt 0) {
      if (-not $packageJsonObject.PSObject.Properties.Name.Contains("devDependencies")) {
        $packageJsonObject | Add-Member -MemberType NoteProperty -Name "devDependencies" -Value ([PSCustomObject]@{})
      }
      
      foreach ($devDep in $DevDependenciesToAdd.GetEnumerator()) {
        $packageJsonObject.devDependencies | Add-Member -MemberType NoteProperty -Name $devDep.Key -Value $devDep.Value -Force
      }
    }
    
    # Add workspaces if provided
    if ($PSBoundParameters.ContainsKey('Workspaces') -and $Workspaces) {
      $packageJsonObject | Add-Member -MemberType NoteProperty -Name "workspaces" -Value $Workspaces -Force -ErrorAction Stop
    }
    
    # Write updated content
    $jsonContent = $packageJsonObject | ConvertTo-Json -Depth 10
    # Ensure no BOM is added to the file
    [System.IO.File]::WriteAllText($FilePath, $jsonContent, [System.Text.UTF8Encoding]::new($false))
  }
  catch {
    Write-ErrorLog "Failed to update package.json at $FilePath`: $($_.Exception.Message)" "Package Setup"
  }
}

# Function to initialize all package.json files
function Initialize-PackageFiles {
  try {
    Write-Host "Setting up package.json files..." -ForegroundColor Green
    
    # Root package.json
    Set-PackageJsonContent -FilePath "package.json" -DefaultName "project-root" -DefaultType "module" -IsPrivate $true -Workspaces @("Server", "client") -ScriptsToAdd @{
      "lint"          = "eslint ."
      "format"        = "prettier --write ."
      "format:check"  = "prettier --check ."
      "start"         = "npm start -w Server"
      "test"          = "npm run test --workspaces --if-present"
      "test:coverage" = "npm run test:coverage --workspaces --if-present"
    } -DevDependenciesToAdd @{
      "eslint"       = "^9.26.0"
      "globals"      = "^16.0.0"
      "jest"         = "^29.7.0"
      "prettier"     = "^3.5.3"
      "concurrently" = "^9.1.0"
    }
    
    # Server package.json
    Set-PackageJsonContent -FilePath "Server/package.json" -DefaultName "server" -DefaultMain "server.js" -ScriptsToAdd @{
      "test"          = "jest"
      "test:coverage" = "jest --coverage"
    } -DependenciesToAdd @{
      "express"               = "^5.1.0"
      "http-proxy-middleware" = "^3.0.3"
    } -DevDependenciesToAdd @{
      "connect-livereload" = "^0.6.1"
      "dotenv"             = "^16.5.0"
      "livereload"         = "^0.9.3"
    }
    
    # Client package.json
    Set-PackageJsonContent -FilePath "client/package.json" -DefaultName "client" -ScriptsToAdd @{
      "test"          = "jest"
      "test:coverage" = "jest --coverage"
    }
  }
  catch {
    Write-ErrorLog "Failed to initialize package files: $($_.Exception.Message)" "Package Setup"
  }
}


