# GitHub workflow files creation for CI/CD setup

# Define YAML files to create
$YamlFiles = @{
  ".github/workflows/workflow.yml"     = $null
  ".github/workflows/testing.yml"      = $null
  ".github/workflows/docker-build.yml" = $null
  ".github/workflows/notify.yml"       = $null
  ".github/dependabot.yml"             = $null
}

# Function to initialize workflow files
function Initialize-WorkflowFiles {
  try {
    Write-Host "Setting up workflow files..." -ForegroundColor Green
        
    $YamlFiles[".github/workflows/workflow.yml"] = @'
name: CI/CD Pipeline

on:
  pull_request:
    branches: [main]
  push:
    branches: [main, testing, staging]
    paths:
      - "Server/**"
      - "client/**"
      - "Dockerfile"
      - ".github/workflows/**"
      - "**/package.json"
      - "**/package-lock.json"

jobs:
  testing:
    name: Testing
    uses: ./.github/workflows/testing.yml
    permissions:
      contents: read

  build_push:
    name: Build & Push Docker Image
    needs: testing
    if: github.event_name == 'push' && github.ref == 'refs/heads/main' && needs.testing.outputs.has_failures != 'true'
    uses: ./.github/workflows/docker-build.yml
    permissions:
      contents: read
    secrets: inherit

  notify:
    name: Notify Status
    needs: [testing, build_push]
    if: always() && github.event_name != 'pull_request'
    uses: ./.github/workflows/notify.yml
    with:
      success: ${{ needs.testing.outputs.has_failures != 'true' && (needs.build_push.result == 'success' || needs.build_push.result == 'skipped') }}
    secrets: inherit
'@

    $YamlFiles[".github/workflows/testing.yml"] = @'
name: Testing

on:
  workflow_call:
    outputs:
      has_failures:
        description: "Boolean flag for failures"
        value: ${{ jobs.testing.outputs.has_failures }}

jobs:
  testing:
    name: testing
    runs-on: ubuntu-latest
    permissions:
      contents: read
    outputs:
      has_failures: ${{ steps.failures.outputs.has_failures }}
    strategy:
      matrix:
        node-version: [22.x]
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: npm
          cache-dependency-path: "**/package-lock.json"

      - name: Install Dependencies
        run: npm ci

      - name: Run ESLint
        id: lint
        run: npm run lint

      - name: Run Prettier Check
        id: format_check
        run: npm run format:check

      - name: Run Server Tests with Coverage
        id: server_tests
        run: npm run test:coverage -w Server

      - name: Run Client Tests with Coverage
        id: client_tests
        run: npm run test:coverage -w client

      - name: Upload Coverage Report
        uses: actions/upload-artifact@v4
        id: coverage
        if: always()
        with:
          name: coverage-report-${{ matrix.node-version }}
          path: |
            Server/coverage/
            client/coverage/
          retention-days: 7
          if-no-files-found: warn
      - name: Detect Failures
        id: failures
        if: always()
        run: |
          has_failures=false
          if [ "${{ steps.lint.outcome }}" != "success" ]; then has_failures=true; fi
          if [ "${{ steps.format_check.outcome }}" != "success" ]; then has_failures=true; fi
          if [ "${{ steps.server_tests.outcome }}" != "success" ]; then has_failures=true; fi
          if [ "${{ steps.client_tests.outcome }}" != "success" ]; then has_failures=true; fi
          echo "has_failures=$has_failures" >> $GITHUB_OUTPUT
'@

    $YamlFiles[".github/workflows/docker-build.yml"] = @'
name: Docker Build & Push

on:
  workflow_call:
    outputs:
      build_status:
        description: "Status of the Docker build"
        value: ${{ jobs.build_push.outputs.build_status }}

jobs:
  build_push:
    name: Build & Push Docker Image
    runs-on: ubuntu-latest
    permissions:
      contents: read
    outputs:
      build_status: ${{ steps.failures.outputs.has_failures }}

    steps:
      - name: Checkout code
        id: checkout
        uses: actions/checkout@v4

      - name: Read version from root package.json
        id: version
        run: |
          echo "VERSION=$(jq -r .version package.json)" >> $GITHUB_ENV

      - name: Login to Docker Hub
        id: docker_login
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Set up Docker Buildx
        id: buildx
        uses: docker/setup-buildx-action@v3

      - name: Build and Push
        id: docker_build
        uses: docker/build-push-action@v6
        with:
          context: .
          file: Dockerfile
          push: true
          tags: |
            ${{ vars.DOCKER_REPO }}:latest
            ${{ vars.DOCKER_REPO }}:${{ env.VERSION }}
          cache-from: type=registry,ref=${{ vars.DOCKER_REPO }}:buildcache
          cache-to: type=registry,ref=${{ vars.DOCKER_REPO }}:buildcache,mode=max

      - name: Detect Failures
        id: failures
        if: always()
        run: |
          has_failures=false
          if [ "${{ steps.checkout.outcome }}" != "success" ]; then has_failures=true; fi
          if [ "${{ steps.version.outcome }}" != "success" ]; then has_failures=true; fi
          if [ "${{ steps.docker_login.outcome }}" != "success" ]; then has_failures=true; fi
          if [ "${{ steps.buildx.outcome }}" != "success" ]; then has_failures=true; fi
          if [ "${{ steps.docker_build.outcome }}" != "success" ]; then has_failures=true; fi
          echo "has_failures=$has_failures" >> $GITHUB_OUTPUT
'@

    $YamlFiles[".github/workflows/notify.yml"] = @'
name: Notify Status

on:
  workflow_call:
    inputs:
      success:
        required: true
        type: boolean
        description: "Whether the overall calling pipeline succeeded"
jobs:
  notify:
    name: Send Notifications
    runs-on: ubuntu-latest
    permissions:
      contents: none

    steps:
      - name: Discord Notification
        uses: appleboy/discord-action@v1.2.0
        with:
          webhook_url: ${{ secrets.DISCORD_WEBHOOK_URL }}
          username: CI/CD Bot
          color: ${{ inputs.success == true && '#00FF00' || '#FF0000' }}
          message: |
            ${{ inputs.success == true && '**Pipeline Succeeded**' || '**Pipeline Failed**' }} on `${{ github.repository }}` `${{ github.ref_name }}`
            **Commit:** [${{ github.sha }}](https://github.com/${{ github.repository }}/commit/${{ github.sha }}) by **${{ github.actor }}**
      
      - name: Email Notification
        uses: dawidd6/action-send-mail@v5
        with:
          server_address: smtp.gmail.com
          server_port: 587
          username: ${{secrets.EMAIL_SENDER }}
          password: ${{secrets.EMAIL_PASSWORD}}
          subject: "${{ inputs.success == true && 'Pipeline succeeded' || 'Pipeline Failed' }} on ${{ github.repository }}"
          to: ${{ vars.EMAIL_RECIPIENTS }}
          from: ${{ secrets.EMAIL_SENDER }}
          body: |
            ${{ inputs.success == true && 'Pipeline Succeeded' || 'Pipeline Failed' }} on ${{ github.repository }} ${{ github.ref_name }}
            Commit: https://github.com/${{ github.repository }}/commit/${{ github.sha }} 
            Author: ${{ github.actor }}
'@

    $YamlFiles[".github/dependabot.yml"] = @'
version: 2
updates:
  # Enable version updates for npm
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "daily"
  # Enable version updates for Docker
  - package-ecosystem: "docker"
    directory: "/"
    schedule:
      interval: "weekly"
  # Enable version updates for GitHub Actions
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
'@
    # Write all workflow files
    foreach ($file in $YamlFiles.Keys) {
      if ($YamlFiles[$file]) {
        Write-FileWithContent -Path $file -Content $YamlFiles[$file] -Description "workflow file"
      }
    }
  }
  catch {
    Write-ErrorLog "Failed to initialize workflow files: $($_.Exception.Message)" "Workflow Setup"
  }
}