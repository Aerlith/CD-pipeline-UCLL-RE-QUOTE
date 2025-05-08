# Error handling and utility functions for CI/CD setup

# Function to handle errors with detailed context
function Write-ErrorLog {
  param (
    [Parameter(Mandatory = $true)]
    [string]$ErrorMessage,
    [string]$Component = "General"
  )
    
  Write-Host "[$Component ERROR]: $ErrorMessage" -ForegroundColor Red
  Write-Host "Call Stack: $(Get-PSCallStack | Select-Object -First 3 | ForEach-Object { $_.Command })" -ForegroundColor Yellow
  exit 1
}

# Function to create directories in batch
function New-Directory {
  param (
    [Parameter(Mandatory = $true)]
    [string[]]$Path
  )
    
  try {
    Write-Host "Creating required directories..." -ForegroundColor Green
        
    foreach ($dir in $Path) {
      if (-not (Test-Path -Path $dir -PathType Container)) {
        Write-Host "  Creating $dir" -ForegroundColor Cyan
        New-Item -Path $dir -ItemType Directory -Force | Out-Null
                
        if (-not (Test-Path -Path $dir -PathType Container)) {
          throw "Failed to create directory '$dir'"
        }
      }
      else {
        Write-Host "  $dir already exists" -ForegroundColor DarkGray
      }
    }
  }
  catch {
    Write-ErrorLog "Failed to create directories: $($_.Exception.Message)" "Directory Setup"
  }
}

# Function to write files with content validation
function Write-FileWithContent {
  param (
    [Parameter(Mandatory = $true)]
    [string]$Path,
    [Parameter(Mandatory = $true)]
    [string]$Content,
    [string]$Description = "file"
  )
    
  try {
    # Check if file already exists
    if (Test-Path -Path $Path -PathType Leaf) {
      Write-Host "  $Description at $Path already exists (skipping)" -ForegroundColor DarkGray
      return
    }
    
    Write-Host "  Creating $Description at $Path" -ForegroundColor Cyan
    
    # Create directory if it doesn't exist
    $directory = Split-Path -Path $Path -Parent
    if ($directory -and -not (Test-Path -Path $directory -PathType Container)) {
      New-Item -Path $directory -ItemType Directory -Force | Out-Null
    }
    
    # Write content without BOM
    [System.IO.File]::WriteAllText($Path, $Content, [System.Text.UTF8Encoding]::new($false))
        
    # Validate file was created and has content
    if (-not (Test-Path -Path $Path -PathType Leaf) -or ([string]::IsNullOrWhiteSpace((Get-Content -Path $Path -Raw)))) {
      throw "File was not created properly or is empty"
    }
  }
  catch {
    Write-ErrorLog "Failed to create $Description at $Path`: $($_.Exception.Message)" "File Creation"
  }
}

